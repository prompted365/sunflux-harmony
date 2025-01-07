import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { calculateSolar } from "./PropertyCalculation";
import { submitProperty } from "./PropertySubmission";
import { PropertyFormData, FinancialFormData, SignupFormData } from "./PropertyFormState";
import { useNavigate } from "react-router-dom";

export const usePropertySubmission = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmission = async (
    signupData: SignupFormData,
    formData: PropertyFormData,
    financialData: FinancialFormData,
    setLoading: (loading: boolean) => void,
    onSuccess?: () => void
  ) => {
    try {
      // First check if user already exists
      const { data: existingUser, error: checkError } = await supabase.auth.signInWithPassword({
        email: signupData.email,
        password: signupData.password,
      });

      if (existingUser?.user) {
        toast({
          title: "Account already exists",
          description: "Please use the login form instead.",
          variant: "destructive",
        });
        return false;
      }

      // Create the user account
      const { data: authData, error: signupError } = await supabase.auth.signUp({
        email: signupData.email,
        password: signupData.password,
        options: {
          data: {
            is_vendor: true,
            communication_opt_in: signupData.communicationOptIn,
          },
          emailRedirectTo: `${window.location.origin}/vendor`
        }
      });

      if (signupError) {
        throw signupError;
      }

      if (!authData.user) {
        throw new Error("Failed to create account");
      }

      // Show confirmation message if email verification is required
      if (!authData.session) {
        toast({
          title: "Check your email",
          description: "We've sent you a confirmation link. Please check your email to verify your account.",
        });
        return true;
      }

      // Wait a moment for the user record to be fully created
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Get the session to confirm user creation
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session) {
        throw new Error("Failed to get user session");
      }

      // Now submit the property with the confirmed user
      const property = await submitProperty(formData, toast);
      
      if (property) {
        const coordinates = {
          latitude: property.latitude,
          longitude: property.longitude
        };

        // Call the Python processing endpoint
        const { data: processingData, error: processingError } = await supabase.functions.invoke(
          'process-solar-data',
          {
            body: {
              propertyId: property.id,
              coordinates,
              financialData,
              address: formData
            }
          }
        );

        if (processingError) {
          console.error('Processing error:', processingError);
          throw new Error('Failed to process solar data');
        }

        console.log('Processing results:', processingData);

        // Trigger solar calculation
        await calculateSolar(property.id, coordinates, financialData, toast);

        if (onSuccess) {
          onSuccess();
        } else {
          navigate("/vendor");
        }
        
        return true;
      }
      
      return false;
    } catch (error: any) {
      console.error("Submission error:", error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { handleSubmission };
};