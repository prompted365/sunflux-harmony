import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

const Navigation = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md z-50 border-b border-muted/20">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <img
            src="/lovable-uploads/b72825ac-f807-4e0e-8dd7-d11fa7046731.png"
            alt="SolarFlAIre Logo"
            className="w-16"
          />
          <span className="text-xl font-bold text-muted">
            solar cell
          </span>
        </div>
        
        <div className="hidden md:flex items-center space-x-8">
          <a href="#features" className="text-muted hover:text-primary transition-colors">
            Features
          </a>
          <a href="#about" className="text-muted hover:text-primary transition-colors">
            About
          </a>
          <a href="#contact" className="text-muted hover:text-primary transition-colors">
            Contact
          </a>
          <Button 
            variant="default" 
            className="bg-solar-gradient hover:opacity-90 transition-opacity"
            onClick={handleLogout}
          >
            Sign Out
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;