import { Card } from "@/components/ui/card";
import Navigation from "@/components/Navigation";
import SunAnimation from "@/components/SunAnimation";
import MissionSection from "@/components/about/MissionSection";
import IntegrationSection from "@/components/about/IntegrationSection";
import AICapabilities from "@/components/about/AICapabilities";
import NetworkAnimation from "@/components/NetworkAnimation";

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center">
            <div className="relative mb-8">
              <img
                src="/lovable-uploads/c68a4f1c-772a-463b-8bd1-46be8cd8588e.png"
                alt="SunLink.ai Logo"
                className="w-32 h-auto mx-auto opacity-10 animate-solar-pulse"
              />
            </div>
            <h1 className="text-4xl font-bold mb-4">About SunLink.ai</h1>
            <div className="relative">
              <NetworkAnimation />
              <SunAnimation />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background pointer-events-none" />
            </div>
          </div>
          
          <Card className="bg-gradient-to-br from-primary/10 to-secondary/10">
            <div className="p-6">
              <h2 className="text-2xl font-semibold mb-4">Revolutionizing Solar Sales Through AI</h2>
              <p className="text-lg leading-relaxed mb-4">
                SunLink.ai stands apart through our innovative AI-driven approach. Our platform demonstrates 
                real-time capabilities through interactive demos, showing how our AI agents can enhance your 
                solar business while seamlessly enriching your existing CRM systems.
              </p>
            </div>
          </Card>

          <MissionSection />
          <IntegrationSection />
          <AICapabilities />
        </div>
      </main>
    </div>
  );
};

export default About;