import { Link } from "react-router-dom";
import { List, Building2 } from "lucide-react";

const Navigation = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md z-50 border-b border-muted/20">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-3">
          <img
            src="/lovable-uploads/c68a4f1c-772a-463b-8bd1-46be8cd8588e.png"
            alt="SunLink.ai Logo"
            className="w-24 h-auto"
          />
          <span className="text-xl font-bold text-muted">
            SunLink.ai
          </span>
        </Link>
        
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
            to="/vendor" 
            className="flex items-center space-x-2 text-muted hover:text-primary transition-colors"
          >
            <Building2 className="w-4 h-4" />
            <span>Vendor Portal</span>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;