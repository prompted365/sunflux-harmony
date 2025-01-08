import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AgentFlowAnimation from "@/components/AgentFlowAnimation";

const Login = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/vendor");
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-secondary to-accent relative">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-xl overflow-hidden">
          <div className="p-8 text-center">
            <AgentFlowAnimation
              className="w-32 h-32 mx-auto mb-6"
              style={{ transform: "scale(1.5)" }}
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