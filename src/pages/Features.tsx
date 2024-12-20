import { List, Zap, Clock, FileText, Sun, Users, ChartBar, Rocket } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useEffect, useRef } from "react";

const Features = () => {
  const gradientRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (gradientRef.current) {
        const scrollPosition = window.scrollY;
        const opacity = Math.min(scrollPosition / 500, 1);
        gradientRef.current.style.opacity = opacity.toString();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#1F2937] relative overflow-hidden">
      {/* Animated Gradient Overlay */}
      <div 
        ref={gradientRef}
        className="fixed inset-0 pointer-events-none bg-gradient-to-t from-primary/30 via-secondary/20 to-transparent"
        style={{ opacity: 0 }}
      />

      {/* Bottom Third Dusk Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-[#1A1F2C] via-[#221F26] to-transparent pointer-events-none" />

      {/* Content Container */}
      <div className="relative">
        {/* Hero Section */}
        <div className="pt-24 pb-16">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-bold text-center mb-6 text-white animate-fade-in">
              Powerful Features for Solar Success
            </h1>
            <p className="text-lg text-center text-gray-300 max-w-2xl mx-auto animate-fade-in animation-delay-500">
              Transform your solar sales process with our comprehensive suite of tools designed 
              to streamline operations and boost conversions.
            </p>
          </div>
        </div>

        {/* Main Features Grid */}
        <div className="container mx-auto px-4 py-16">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Smart Solar Analysis */}
            <Card className="p-6 hover:shadow-lg transition-all duration-300 bg-white/5 backdrop-blur-sm border-muted/20 hover:bg-white/10">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Sun className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-white">Smart Solar Analysis</h3>
              </div>
              <p className="text-gray-300">
                Advanced algorithms analyze roof orientation, shading, and local weather patterns 
                to provide accurate solar potential calculations.
              </p>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-all duration-300 bg-white/5 backdrop-blur-sm border-muted/20 hover:bg-white/10">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Clock className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-white">Real-time Monitoring</h3>
              </div>
              <p className="text-gray-300">
                Track system performance, energy production, and savings in real-time with our 
                intuitive dashboard.
              </p>
            </Card>

            {/* Custom Reports */}
            <Card className="p-6 hover:shadow-lg transition-all duration-300 bg-white/5 backdrop-blur-sm border-muted/20 hover:bg-white/10">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-primary/10">
                  <FileText className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-white">Custom Reports</h3>
              </div>
              <p className="text-gray-300">
                Generate professional, branded reports with detailed financial analysis and 
                environmental impact metrics.
              </p>
            </Card>

            {/* Lead Management */}
            <Card className="p-6 hover:shadow-lg transition-all duration-300 bg-white/5 backdrop-blur-sm border-muted/20 hover:bg-white/10">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-white">Lead Management</h3>
              </div>
              <p className="text-gray-300">
                Streamline your sales process with integrated lead tracking and automated 
                follow-ups.
              </p>
            </Card>

            {/* Performance Analytics */}
            <Card className="p-6 hover:shadow-lg transition-all duration-300 bg-white/5 backdrop-blur-sm border-muted/20 hover:bg-white/10">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-primary/10">
                  <ChartBar className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-white">Performance Analytics</h3>
              </div>
              <p className="text-gray-300">
                Gain valuable insights with detailed analytics on system performance and sales 
                metrics.
              </p>
            </Card>

            {/* Quick Integration */}
            <Card className="p-6 hover:shadow-lg transition-all duration-300 bg-white/5 backdrop-blur-sm border-muted/20 hover:bg-white/10">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Rocket className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-white">Quick Integration</h3>
              </div>
              <p className="text-gray-300">
                Seamlessly integrate with your existing CRM and marketing tools.
              </p>
            </Card>

          </div>

          {/* Bottom CTA Section */}
          <div className="mt-16 text-center">
            <div className="max-w-2xl mx-auto bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 rounded-lg p-8 backdrop-blur-sm">
              <h2 className="text-2xl font-semibold mb-4 text-white">
                Ready to Transform Your Solar Business?
              </h2>
              <p className="text-gray-300 mb-6">
                Join leading solar providers who are already using our platform to grow their business 
                and deliver better results for their customers.
              </p>
              <button className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors">
                Get Started Today
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Features;
