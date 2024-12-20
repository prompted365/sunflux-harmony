import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, Link } from "react-router-dom";

const Navigation = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md z-50 border-b border-muted/20">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <img
            src="/lovable-uploads/c68a4f1c-772a-463b-8bd1-46be8cd8588e.png"
            alt="SunLink.ai Logo"
            className="w-24 h-auto"
          />
          <span className="text-xl font-bold text-muted">
            SunLink.ai
          </span>
        </div>
        
        <div className="hidden md:flex items-center space-x-8">
          <a href="#features" className="text-muted hover:text-primary transition-colors">
            Features
          </a>
          <Link to="/about" className="text-muted hover:text-primary transition-colors">
            About
          </Link>
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