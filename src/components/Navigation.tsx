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
          <div className="relative w-8 h-8">
            <div className="absolute inset-0 bg-primary rounded-full animate-solar-pulse"></div>
            <svg
              className="relative z-10 w-8 h-8 text-white"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 2L2 8l10 6 10-6-10-6zM2 16l10 6 10-6-10-6-10 6z" />
            </svg>
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-solar-gradient">
            SolarFlow
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