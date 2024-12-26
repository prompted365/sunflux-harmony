import { useToast } from "@/hooks/use-toast";
import { AppError } from "@/lib/errors";

const Hero = () => {
  const { toast } = useToast();

  const handleGetStarted = () => {
    try {
      const propertyFormSection = document.getElementById('property-form');
      if (propertyFormSection) {
        propertyFormSection.scrollIntoView({ behavior: 'smooth' });
      } else {
        throw new AppError("Property form section not found");
      }
    } catch (error) {
      console.error("Navigation error:", error);
      if (error instanceof AppError) {
        toast({
          title: "Navigation Error",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to scroll to property form",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div className="relative text-center py-16 md:py-24 overflow-hidden">
      <div className="absolute inset-0 bg-energy-pattern opacity-10 animate-solar-pulse" />
      
      <div className="relative z-10 space-y-6">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          <span className="text-primary block animate-roll-down">
            Put Power Back
          </span>
          <span className="text-primary block animate-roll-down animation-delay-500">
            In Your Hands
          </span>
        </h1>
        
        <h2 className="text-4xl md:text-6xl font-bold text-primary mb-6">
          Solar Analysis Made Simple
        </h2>
        
        <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto animate-fade-in">
          Experience our AI-powered solar analysis platform. Get detailed insights about your property's 
          solar potential and make informed decisions about solar installation.
        </p>
        
        <button
          onClick={handleGetStarted}
          className="bg-solar-gradient text-white px-8 py-3 rounded-lg text-lg font-semibold 
                   hover:opacity-90 transition-opacity animate-fade-in"
        >
          Get Started
        </button>
      </div>
    </div>
  );
};

export default Hero;