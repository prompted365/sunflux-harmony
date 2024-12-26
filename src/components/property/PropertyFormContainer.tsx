import { useToast } from "@/hooks/use-toast"
import { initializeSolarAPI } from "@/lib/solar-sdk"
import { usePropertyFormState } from "./PropertyFormState"
import { calculateSolar } from "./PropertyCalculation"
import { submitProperty } from "./PropertySubmission"
import { supabase } from "@/integrations/supabase/client"
import { useNavigate } from "react-router-dom"
import PropertyFormContent from "./PropertyFormContent"
import { useEffect } from "react"

const PropertyFormContainer = () => {
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

  useEffect(() => {
    initializeSolarAPI().catch(console.error);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Check if vendor is authenticated
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        // If not authenticated, try to sign up with provided credentials
        const { data, error } = await supabase.auth.signUp({
          email: signupData.email,
          password: signupData.password,
          options: {
            data: {
              communication_opt_in: signupData.communicationOptIn
            }
          }
        });

        if (error) {
          toast({
            title: "Error",
            description: error.message,
            variant: "destructive",
          });
          setLoading(false);
          return;
        }

        if (!data.session) {
          toast({
            title: "Please verify your email",
            description: "Check your email for a verification link before continuing.",
          });
          setLoading(false);
          return;
        }

        // Create vendor profile
        const { error: profileError } = await supabase
          .from('vendor_profiles')
          .insert([{ 
            id: data.user?.id,
            communication_opt_in: signupData.communicationOptIn
          }]);

        if (profileError) {
          toast({
            title: "Error",
            description: profileError.message,
            variant: "destructive",
          });
          setLoading(false);
          return;
        }
      }

      // Get the vendor ID (user ID) from the session
      const vendorId = session?.user.id;

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

  return (
    <PropertyFormContent 
      loading={loading}
      calculating={calculating}
      formData={formData}
      updateField={updateField}
      financialData={financialData}
      updateFinancialField={updateFinancialField}
      signupData={signupData}
      updateSignupField={updateSignupField}
      onSubmit={handleSubmit}
    />
  );
};

export default PropertyFormContainer;