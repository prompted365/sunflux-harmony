import { useEffect } from "react";
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import PropertyForm from "@/components/PropertyForm";
import SolarResults from "@/components/SolarResults";

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
        <PropertyForm />
        <SolarResults />
        
        {/* Features Section */}
        <section id="features" className="py-16">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Powerful Features for Solar Success</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-semibold mb-4">Smart Solar Analysis</h3>
                <p className="text-muted-foreground">
                  Advanced algorithms analyze roof orientation, shading, and local weather patterns to provide accurate solar potential calculations.
                </p>
              </div>
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-semibold mb-4">Real-time Monitoring</h3>
                <p className="text-muted-foreground">
                  Track system performance, energy production, and savings in real-time with our intuitive dashboard.
                </p>
              </div>
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-semibold mb-4">Custom Reports</h3>
                <p className="text-muted-foreground">
                  Generate professional, branded reports with detailed financial analysis and environmental impact metrics.
                </p>
              </div>
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-semibold mb-4">Lead Management</h3>
                <p className="text-muted-foreground">
                  Streamline your sales process with integrated lead tracking and automated follow-ups.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-16 bg-secondary/10 rounded-xl">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-8">Get in Touch</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Ready to transform your solar business? Our team is here to help you succeed.
            </p>
            <div className="space-y-4">
              <div className="flex items-center justify-center space-x-2">
                <Mail className="w-5 h-5 text-primary" />
                <a href="mailto:contact@sunlink.ai" className="text-primary hover:underline">
                  contact@sunlink.ai
                </a>
              </div>
              <Button 
                className="bg-primary hover:bg-primary/90 text-white"
                onClick={() => window.location.href = 'mailto:contact@sunlink.ai'}
              >
                Contact Us
              </Button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Index;