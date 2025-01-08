import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AgentFlowAnimation from "@/components/AgentFlowAnimation";

const Login = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Automatically redirect to vendor portal for demo
    navigate("/vendor");
  }, [navigate]);

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
              Redirecting to demo...
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;