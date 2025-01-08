import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import AgentFlowAnimation from "@/components/AgentFlowAnimation";
import { useToast } from "@/hooks/use-toast";

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const signInWithDemoEmail = async () => {
      try {
        // Create a demo user session with email
        const { data, error } = await supabase.auth.signInWithPassword({
          email: 'demo@sunlink.ai',
          password: 'demo123456'
        });

        if (error) {
          // If sign in fails, try signing up
          const { error: signUpError } = await supabase.auth.signUp({
            email: 'demo@sunlink.ai',
            password: 'demo123456',
            options: {
              data: {
                is_vendor: true,
                company_name: 'Demo Company'
              }
            }
          });

          if (signUpError) {
            toast({
              title: "Error",
              description: signUpError.message,
              variant: "destructive",
            });
            return;
          }
        }

        // Redirect to vendor portal
        navigate("/vendor");
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      }
    };

    signInWithDemoEmail();
  }, [navigate, toast]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-secondary to-accent relative">
      <div className="absolute inset-0 z-0">
        <AgentFlowAnimation />
      </div>
      <div className="relative z-10 flex items-center justify-center px-4 min-h-screen">
        <div className="w-full max-w-md bg-white/95 backdrop-blur-lg rounded-lg shadow-lg p-8">
          <div className="mb-8 text-center">
            <img
              src="/lovable-uploads/c68a4f1c-772a-463b-8bd1-46be8cd8588e.png"
              alt="SunLink.ai Logo"
              className="w-24 h-auto mx-auto mb-4"
            />
            <h1 className="text-2xl font-bold text-gray-900">Welcome to SunLink.ai</h1>
            <p className="text-gray-600 mt-2">
              Signing in with demo account...
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;