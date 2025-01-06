import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import PropertyForm from "@/components/PropertyForm";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import AgentFlowAnimation from "@/components/AgentFlowAnimation";

const Login = () => {
  const navigate = useNavigate();
  const [isNewVendor, setIsNewVendor] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is already logged in
    supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        navigate("/vendor");
      }
    });
  }, [navigate]);

  const handleToggle = () => {
    setIsNewVendor(!isNewVendor);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-secondary to-accent relative">
      {/* Background Animation */}
      <div className="absolute inset-0 z-0">
        <AgentFlowAnimation />
      </div>

      {/* Content */}
      <div className="relative z-10 flex items-center justify-center px-4 min-h-screen">
        <div className="w-full max-w-4xl bg-white/95 backdrop-blur-lg rounded-lg shadow-lg p-8">
          <div className="mb-8 text-center">
            <img
              src="/lovable-uploads/c68a4f1c-772a-463b-8bd1-46be8cd8588e.png"
              alt="SunLink.ai Logo"
              className="w-24 h-auto mx-auto mb-4"
            />
            <h1 className="text-2xl font-bold text-gray-900">SunLink.ai Solar Portal</h1>
            <p className="text-gray-600 mt-2">
              {isNewVendor 
                ? "Create your vendor account and analyze your first property" 
                : "Sign in to your vendor account"}
            </p>
          </div>

          <div className="flex justify-center mb-6">
            <Button
              variant="ghost"
              className={!isNewVendor ? "bg-muted" : ""}
              onClick={handleToggle}
            >
              {isNewVendor ? "Already have an account?" : "Need to create an account?"}
            </Button>
          </div>
          
          {isNewVendor ? (
            <PropertyForm onSuccess={() => navigate("/vendor")} />
          ) : (
            <div className="max-w-md mx-auto">
              <Auth
                supabaseClient={supabase}
                appearance={{
                  theme: ThemeSupa,
                  variables: {
                    default: {
                      colors: {
                        brand: '#0ea5e9',
                        brandAccent: '#0284c7',
                      },
                    },
                  },
                }}
                providers={[]}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;