import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import PropertyForm from "@/components/PropertyForm";
import SunsetAnimation from "@/components/SunsetAnimation";
import AgentFlowAnimation from "@/components/AgentFlowAnimation";
import { AppError } from "@/lib/errors";

const Index = () => {
  const { toast } = useToast();

  useEffect(() => {
    try {
      // Handle direct navigation to sections via URL hash
      const hash = window.location.hash;
      if (hash) {
        const element = document.getElementById(hash.slice(1));
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        } else {
          console.warn(`Section ${hash} not found`);
        }
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
          description: "An unexpected error occurred while navigating to the section",
          variant: "destructive",
        });
      }
    }
  }, [toast]);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-12">
        <Hero />
        <SunsetAnimation />
        <PropertyForm />
        <AgentFlowAnimation />
      </div>
    </div>
  );
};

export default Index;