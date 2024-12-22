import { useToast } from "@/components/ui/use-toast"
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
        toast({
          title: "Error",
          description: "Please log in as a vendor to submit properties",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      // Submit the property with vendor ID
      const property = await submitProperty({
        ...formData,
        vendor_id: session.user.id,
        lead_email: signupData.email
      }, toast);
      
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