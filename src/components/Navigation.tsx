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
    <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md z-50 border-b border-muted">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <svg
            className="w-8 h-8 text-primary"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 2L2 8l10 6 10-6-10-6zM2 16l10 6 10-6-10-6-10 6z" />
          </svg>
          <span className="text-xl font-bold text-primary">SolarFlow</span>
        </div>
        
        <div className="hidden md:flex items-center space-x-8">
          <a href="#features" className="text-gray-600 hover:text-primary transition-colors">
            Features
          </a>
          <a href="#about" className="text-gray-600 hover:text-primary transition-colors">
            About
          </a>
          <a href="#contact" className="text-gray-600 hover:text-primary transition-colors">
            Contact
          </a>
          <Button 
            variant="default" 
            className="bg-primary hover:bg-primary/90"
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