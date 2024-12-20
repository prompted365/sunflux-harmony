import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, Link } from "react-router-dom";
import { List, Mail } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const Navigation = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      // First check if we have a session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        // If no session, just redirect to login
        navigate("/login", { replace: true });
        return;
      }

      // Attempt to sign out
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error("Logout error:", error);
        // If we get a 403 or session error, force redirect
        if (error.status === 403 || error.message.includes("session")) {
          window.location.href = "/login";
          return;
        }
        throw error;
      }

      // Successful logout
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Logout failed:", error);
      toast({
        title: "Error",
        description: "Failed to log out. Please try refreshing the page.",
        variant: "destructive",
      });
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
          <Link 
            to="/features" 
            className="flex items-center space-x-2 text-muted hover:text-primary transition-colors"
          >
            <List className="w-4 h-4" />
            <span>Features</span>
          </Link>
          <Link to="/about" className="text-muted hover:text-primary transition-colors">
            About
          </Link>
          <Link 
            to="/contact" 
            className="flex items-center space-x-2 text-muted hover:text-primary transition-colors"
          >
            <Mail className="w-4 h-4" />
            <span>Contact</span>
          </Link>
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