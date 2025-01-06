import { useEffect } from "react";
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import SunsetAnimation from "@/components/SunsetAnimation";
import AgentFlowAnimation from "@/components/AgentFlowAnimation";
import NetworkAnimation from "@/components/NetworkAnimation";

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
    <div className="min-h-screen bg-background relative">
      {/* Background Network Animation */}
      <div className="fixed inset-0 z-0">
        <NetworkAnimation />
      </div>
      
      {/* Main Content */}
      <div className="relative z-10">
        <Navigation />
        <div className="container mx-auto px-4 py-12">
          <Hero />
          <SunsetAnimation />
          <AgentFlowAnimation />
        </div>
      </div>
    </div>
  );
};

export default Index;