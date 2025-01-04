import { useEffect } from "react";
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import PropertyForm from "@/components/PropertyForm";
import SunsetAnimation from "@/components/SunsetAnimation";
import AgentFlowAnimation from "@/components/AgentFlowAnimation";

const Index = () => {
  useEffect(() => {
    // Handle direct navigation to sections via URL hash
    const hash = window.location.hash;
    if (hash) {
      const element = document.getElementById(hash.slice(1));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, []);

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