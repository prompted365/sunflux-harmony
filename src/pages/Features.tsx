import { List, Zap, Clock, FileText, Sun, Users, ChartBar, Rocket } from "lucide-react";
import { Card } from "@/components/ui/card";
import NetworkAnimation from "@/components/NetworkAnimation";
import Navigation from "@/components/Navigation";

const Features = () => {
  return (
    <div className="min-h-screen bg-background relative">
      <Navigation />
      <NetworkAnimation />
      
      {/* Hero Section with Animated Image */}
      <div className="relative z-30 mb-16 pt-24">
        <div className="container mx-auto px-4">
          <div className="animate-roll-down animation-delay-500 origin-top">
            <div className="flex flex-col items-center justify-center max-w-5xl mx-auto">
              <img 
                src="/lovable-uploads/da9ca488-640a-4b34-a841-e110e22aeb36.png"
                alt="Putting power back into your hands"
                className="w-full max-w-4xl mx-auto animate-fade-in drop-shadow-[0px_10px_50px_rgba(255,255,255,0.5)] filter"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Features Grid */}
      <div className="container mx-auto px-4 py-16 relative">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Smart Solar Analysis */}
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-primary/10">
                <Sun className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Smart Solar Analysis</h3>
            </div>
            <p className="text-gray-600">
              Advanced algorithms analyze roof orientation, shading, and local weather patterns 
              to provide accurate solar potential calculations and optimal panel placement recommendations.
            </p>
          </Card>

          {/* Real-time Monitoring */}
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-primary/10">
                <Clock className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Real-time Monitoring</h3>
            </div>
            <p className="text-gray-600">
              Track system performance, energy production, and savings in real-time with our 
              intuitive dashboard. Make data-driven decisions with comprehensive analytics.
            </p>
          </Card>

          {/* Custom Reports */}
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-primary/10">
                <FileText className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Custom Reports</h3>
            </div>
            <p className="text-gray-600">
              Generate professional, branded reports with detailed financial analysis and 
              environmental impact metrics. Easily share with clients via email or download.
            </p>
          </Card>

          {/* Lead Management */}
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-primary/10">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Lead Management</h3>
            </div>
            <p className="text-gray-600">
              Streamline your sales process with integrated lead tracking and automated 
              follow-ups. Never miss an opportunity to convert a potential customer.
            </p>
          </Card>

          {/* Performance Analytics */}
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-primary/10">
                <ChartBar className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Performance Analytics</h3>
            </div>
            <p className="text-gray-600">
              Gain valuable insights with detailed analytics on system performance, sales 
              metrics, and customer engagement. Make informed decisions based on real data.
            </p>
          </Card>

          {/* Quick Integration */}
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-primary/10">
                <Rocket className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Quick Integration</h3>
            </div>
            <p className="text-gray-600">
              Seamlessly integrate with your existing CRM and marketing tools. Get up and 
              running quickly with our easy-to-use API and comprehensive documentation.
            </p>
          </Card>
        </div>

        {/* Bottom CTA Section */}
        <div className="mt-16 text-center">
          <div className="max-w-2xl mx-auto bg-white/80 backdrop-blur-sm rounded-lg p-8">
            <h2 className="text-2xl font-semibold mb-4">
              Ready to Transform Your Solar Business?
            </h2>
            <p className="text-gray-600 mb-6">
              Join leading solar providers who are already using our AI-driven platform to grow their business 
              and deliver better results for their customers.
            </p>
            <button className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors">
              Get Started Today
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Features;