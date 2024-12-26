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
    <div className="text-center py-16 md:py-24">
      <h1 className="text-4xl md:text-6xl font-bold text-primary mb-6">
        Solar Analysis Made Simple
      </h1>
      <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
        Experience our AI-powered solar analysis platform. Get detailed insights about your property's 
        solar potential and make informed decisions about solar installation.
      </p>
      <button
        onClick={handleGetStarted}
        className="bg-solar-gradient text-white px-8 py-3 rounded-lg text-lg font-semibold 
                 hover:opacity-90 transition-opacity"
      >
        Get Started
      </button>
    </div>
  );
};

export default Hero;