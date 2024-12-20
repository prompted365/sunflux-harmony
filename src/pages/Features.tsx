import { List, Zap, Clock, FileText, Sun, Users, ChartBar, Rocket } from "lucide-react";
import { Card } from "@/components/ui/card";

const Features = () => {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Content Container */}
      <div className="relative">
        {/* Hero Section */}
        <div className="pt-24 pb-16">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-bold text-center mb-6 text-foreground animate-fade-in">
              Powerful Features for Solar Success
            </h1>
            <p className="text-lg text-center text-muted-foreground max-w-2xl mx-auto animate-fade-in animation-delay-500">
              Transform your solar sales process with our comprehensive suite of tools designed 
              to streamline operations and boost conversions.
            </p>
          </div>
        </div>

        {/* Main Features Grid */}
        <div className="container mx-auto px-4 py-16">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Smart Solar Analysis */}
            <Card className="p-6 hover:shadow-lg transition-all duration-300 bg-card backdrop-blur-sm border-border hover:bg-accent/5">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Sun className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">Smart Solar Analysis</h3>
              </div>
              <p className="text-muted-foreground">
                Advanced algorithms analyze roof orientation, shading, and local weather patterns 
                to provide accurate solar potential calculations.
              </p>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-all duration-300 bg-card backdrop-blur-sm border-border hover:bg-accent/5">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Clock className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">Real-time Monitoring</h3>
              </div>
              <p className="text-muted-foreground">
                Track system performance, energy production, and savings in real-time with our 
                intuitive dashboard.
              </p>
            </Card>

            {/* Custom Reports */}
            <Card className="p-6 hover:shadow-lg transition-all duration-300 bg-card backdrop-blur-sm border-border hover:bg-accent/5">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-primary/10">
                  <FileText className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">Custom Reports</h3>
              </div>
              <p className="text-muted-foreground">
                Generate professional, branded reports with detailed financial analysis and 
                environmental impact metrics.
              </p>
            </Card>

            {/* Lead Management */}
            <Card className="p-6 hover:shadow-lg transition-all duration-300 bg-card backdrop-blur-sm border-border hover:bg-accent/5">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">Lead Management</h3>
              </div>
              <p className="text-muted-foreground">
                Streamline your sales process with integrated lead tracking and automated 
                follow-ups.
              </p>
            </Card>

            {/* Performance Analytics */}
            <Card className="p-6 hover:shadow-lg transition-all duration-300 bg-card backdrop-blur-sm border-border hover:bg-accent/5">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-primary/10">
                  <ChartBar className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">Performance Analytics</h3>
              </div>
              <p className="text-muted-foreground">
                Gain valuable insights with detailed analytics on system performance and sales 
                metrics.
              </p>
            </Card>

            {/* Quick Integration */}
            <Card className="p-6 hover:shadow-lg transition-all duration-300 bg-card backdrop-blur-sm border-border hover:bg-accent/5">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Rocket className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">Quick Integration</h3>
              </div>
              <p className="text-muted-foreground">
                Seamlessly integrate with your existing CRM and marketing tools.
              </p>
            </Card>
          </div>

          {/* Bottom CTA Section */}
          <div className="mt-16 text-center">
            <div className="max-w-2xl mx-auto bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 rounded-lg p-8 backdrop-blur-sm">
              <h2 className="text-2xl font-semibold mb-4 text-foreground">
                Ready to Transform Your Solar Business?
              </h2>
              <p className="text-muted-foreground mb-6">
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

      {/* Bottom Third Dusk Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-[#1A1F2C] via-[#221F26] to-transparent pointer-events-none" />
    </div>
  );
};

export default Features;