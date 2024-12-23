import { supabase } from "@/integrations/supabase/client";
import { SignupFormData } from "./PropertyFormState";
import { ToastActionElement } from "@/components/ui/toast";

export const handleSignup = async (
  signupData: SignupFormData,
  toast: {
    (props: {
      title?: string;
      description?: string;
      variant?: "default" | "destructive";
      action?: ToastActionElement;
    }): void;
  },
  setLoading: (loading: boolean) => void
) => {
  try {
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
      toast({
        title: "Please verify your email",
        description: "Check your email for a verification link before continuing.",
      });
      setLoading(false);
      return null;
    }

    try {
      // First create profile and wait for it to complete
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([{ 
          id: data.user?.id,
        }]);

      if (profileError) {
        throw new Error(profileError.message);
      }

      // Verify profile was created
      const { data: profileData, error: profileCheckError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user?.id)
        .single();

      if (profileCheckError || !profileData) {
        throw new Error('Profile creation verification failed');
      }

      // Small delay to ensure profile is committed
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Then create vendor profile
      const { error: vendorProfileError } = await supabase
        .from('vendor_profiles')
        .insert([{ 
          id: data.user?.id,
          communication_opt_in: signupData.communicationOptIn
        }]);

      if (vendorProfileError) {
        throw new Error(vendorProfileError.message);
      }

      return data;
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      setLoading(false);
      return null;
    }
  } catch (error: any) {
    toast({
      title: "Error",
      description: error.message,
      variant: "destructive",
    });
    setLoading(false);
    return null;
  }
};