import { useToast } from "@/components/ui/use-toast"
import { initializeSolarAPI } from "@/lib/solar-sdk"
import { AddressInput } from "./property/AddressInput"
import { PropertyFormSubmit } from "./property/PropertyFormSubmit"
import { usePropertyFormState } from "./property/PropertyFormState"
import { FinancialInputs } from "./property/FinancialInputs"
import { Card } from "./ui/card"
import { useEffect } from "react"
import { calculateSolar } from "./property/PropertyCalculation"
import { submitProperty } from "./property/PropertySubmission"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Checkbox } from "./ui/checkbox"
import { supabase } from "@/integrations/supabase/client"
import { useNavigate } from "react-router-dom"

const PropertyForm = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
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

  // Initialize Solar API when component mounts
  useEffect(() => {
    initializeSolarAPI().catch(console.error);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // First create the user account
      const { data: authData, error: signupError } = await supabase.auth.signUp({
        email: signupData.email,
        password: signupData.password,
      });

      if (signupError) throw signupError;

      if (!authData.user) {
        throw new Error("Failed to create account");
      }

      // Create vendor profile
      const { error: vendorError } = await supabase
        .from('vendor_profiles')
        .insert([{
          id: authData.user.id,
          communication_opt_in: signupData.communicationOptIn,
          account_tier: 'trial',
          trial_reports_remaining: 1,
          trial_reports_reset_date: new Date().toISOString(),
        }]);

      if (vendorError) throw vendorError;

      // Submit the property
      const property = await submitProperty(formData, toast);
      
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

  return (
    <div className="max-w-2xl mx-auto bg-gradient-to-br from-white via-white to-muted/10 backdrop-blur-lg rounded-xl shadow-xl p-8 mb-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-muted">Get Started</h2>
        <p className="text-xl text-gray-600 mt-4">
          Enter your details below to create your trial account and analyze your first property
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Account Details</h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                required
                value={signupData.email}
                onChange={(e) => updateSignupField('email', e.target.value)}
                className="w-full bg-white/80"
                placeholder="your@email.com"
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                required
                value={signupData.password}
                onChange={(e) => updateSignupField('password', e.target.value)}
                className="w-full bg-white/80"
                placeholder="Choose a secure password"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="communicationOptIn"
                checked={signupData.communicationOptIn}
                onCheckedChange={(checked) => 
                  updateSignupField('communicationOptIn', checked)
                }
              />
              <Label htmlFor="communicationOptIn">
                I agree to receive communications about product updates and features
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="termsAccepted"
                required
                checked={signupData.termsAccepted}
                onCheckedChange={(checked) => 
                  updateSignupField('termsAccepted', checked)
                }
              />
              <Label htmlFor="termsAccepted">
                I understand this will create a trial vendor account with limited features
              </Label>
            </div>
          </div>
        </Card>

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

        <PropertyFormSubmit loading={loading} calculating={calculating} />
      </form>
    </div>
  );
};

export default PropertyForm;