import { useToast } from "@/components/ui/use-toast"
import { initializeSolarAPI } from "@/lib/solar-sdk"
import { AddressInput } from "./property/AddressInput"
import { PropertyFormSubmit } from "./property/PropertyFormSubmit"
import { usePropertyFormState } from "./property/PropertyFormState"
import { FinancialInputs } from "./property/FinancialInputs"
import { AccountSignupInputs } from "./property/AccountSignupInputs"
import { Card } from "./ui/card"
import { useEffect, useState } from "react"
import { calculateSolar } from "./property/PropertyCalculation"
import { submitProperty } from "./property/PropertySubmission"
import { supabase } from "@/integrations/supabase/client"
import { useNavigate } from "react-router-dom"
import { Auth } from "@supabase/auth-ui-react"
import { ThemeSupa } from "@supabase/auth-ui-shared"
import { handleSignup } from "./property/PropertySignup"

const PropertyForm = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [showAuth, setShowAuth] = useState(false);
  const {
    loading,
    setLoading,
    calculating,
    setCalculating,
    formData,
    updateField,
    setFormData,
    financialData,
    updateFinancialField,
    signupData,
    updateSignupField,
  } = usePropertyFormState();

  useEffect(() => {
    initializeSolarAPI().catch(console.error);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Check if user is authenticated
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        // If not authenticated, try to sign up and create profiles
        const data = await handleSignup(signupData, toast, setLoading);

        if (!data) {
          setShowAuth(true);
          setLoading(false);
          return;
        }
      }

      // Get the vendor ID (user ID) from the session
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      const vendorId = currentSession?.user.id;

      // Submit the property with vendor ID
      const property = await submitProperty(formData, vendorId, toast);
      
      if (property) {
        // Get coordinates from the saved property
        const coordinates = {
          latitude: property.latitude,
          longitude: property.longitude
        };

        // Trigger solar calculation with coordinates
        await calculateSolar(property.id, coordinates, financialData, toast);

        setFormData({
          address: "",
          city: "",
          state: "",
          zipCode: "",
        });

        // Redirect to vendor portal
        navigate("/vendor");
      }
    } catch (error: any) {
      console.error("Submission error:", error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (showAuth) {
    return (
      <div className="max-w-2xl mx-auto bg-gradient-to-br from-white via-white to-muted/10 backdrop-blur-lg rounded-xl shadow-xl p-8 mb-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-muted">Create Your Account</h2>
          <p className="text-xl text-gray-600 mt-4">
            Sign up to save your property information and access your solar analysis.
          </p>
        </div>
        <Auth
          supabaseClient={supabase}
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: '#C84B31',
                  brandAccent: '#FFAA5A',
                },
              },
            },
          }}
          providers={[]}
        />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto bg-gradient-to-br from-white via-white to-muted/10 backdrop-blur-lg rounded-xl shadow-xl p-8 mb-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-muted">Experience Our AI Workflow</h2>
        <p className="text-xl text-gray-600 mt-4">
          Try out our automated solar analysis process firsthand. While our AI agents typically handle 
          this data collection automatically, this demo lets you see exactly how we gather and process 
          property information.
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Property Location</h3>
          <AddressInput
            id="address"
            label="Street Address"
            value={formData.address}
            onChange={(value) => updateField('address', value)}
            placeholder="123 Solar Street"
          />
          
          <AddressInput
            id="city"
            label="City"
            value={formData.city}
            onChange={(value) => updateField('city', value)}
            placeholder="Sunnyville"
          />
          
          <AddressInput
            id="state"
            label="State"
            value={formData.state}
            onChange={(value) => updateField('state', value)}
            placeholder="CA"
          />
          
          <AddressInput
            id="zipCode"
            label="ZIP Code"
            value={formData.zipCode}
            onChange={(value) => updateField('zipCode', value)}
            placeholder="12345"
          />
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Financial Information</h3>
          <FinancialInputs
            monthlyBill={financialData.monthlyBill}
            energyCostPerKwh={financialData.energyCostPerKwh}
            onMonthlyBillChange={(value) => updateFinancialField('monthlyBill', value)}
            onEnergyCostChange={(value) => updateFinancialField('energyCostPerKwh', value)}
            isUsingDefaults={!financialData.monthlyBill}
          />
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Account Information</h3>
          <AccountSignupInputs
            signupData={signupData}
            updateSignupField={updateSignupField}
          />
        </Card>

        <PropertyFormSubmit loading={loading} calculating={calculating} />
      </form>
    </div>
  );
};

export default PropertyForm;
