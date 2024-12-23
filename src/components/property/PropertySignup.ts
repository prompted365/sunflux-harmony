import { supabase } from "@/integrations/supabase/client";
import { SignupFormData } from "./PropertyFormState";
import { Toast } from "@/components/ui/use-toast";

export const handleSignup = async (
  signupData: SignupFormData,
  toast: any,
  setLoading: (loading: boolean) => void
) => {
  // Try to sign up with provided credentials
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
    return null;
  }

  if (!data.session) {
    return null;
  }

  // First create profile
  const { error: profileError } = await supabase
    .from('profiles')
    .insert([{ 
      id: data.user?.id,
    }]);

  if (profileError) {
    toast({
      title: "Error",
      description: profileError.message,
      variant: "destructive",
    });
    setLoading(false);
    return null;
  }

  // Then create vendor profile
  const { error: vendorProfileError } = await supabase
    .from('vendor_profiles')
    .insert([{ 
      id: data.user?.id,
      communication_opt_in: signupData.communicationOptIn
    }]);

  if (vendorProfileError) {
    toast({
      title: "Error",
      description: vendorProfileError.message,
      variant: "destructive",
    });
    setLoading(false);
    return null;
  }

  return data;
};