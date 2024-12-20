import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, Link } from "react-router-dom";
import { List, Mail } from "lucide-react"; // Import icons

const Navigation = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
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
          <button 
            onClick={() => scrollToSection('features')} 
            className="flex items-center space-x-2 text-muted hover:text-primary transition-colors"
          >
            <List className="w-4 h-4" />
            <span>Features</span>
          </button>
          <Link to="/about" className="text-muted hover:text-primary transition-colors">
            About
          </Link>
          <button 
            onClick={() => scrollToSection('contact')} 
            className="flex items-center space-x-2 text-muted hover:text-primary transition-colors"
          >
            <Mail className="w-4 h-4" />
            <span>Contact</span>
          </button>
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