import Navigation from "@/components/Navigation";
import SunAnimation from "@/components/SunAnimation";
import { Card } from "@/components/ui/card";
import { List, Zap, Clock, FileText, Sun, Users, ChartBar, Rocket } from "lucide-react";

const Features = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Powerful Features</h1>
            <div className="relative">
              <SunAnimation />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background pointer-events-none" />
            </div>
          </div>
          
          <Card className="bg-gradient-to-br from-primary/10 to-secondary/10">
            <div className="p-6">
              <h2 className="text-2xl font-semibold mb-4">Transform Your Solar Sales Process</h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-4">
                Our comprehensive suite of tools is designed to streamline operations and boost conversions,
                putting the power of AI-driven automation at your fingertips.
              </p>
            </div>
          </Card>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="bg-gradient-to-br from-primary/5 to-secondary/5">
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Sun className="w-6 h-6 text-primary" />
                  <h3 className="text-xl font-semibold">Smart Solar Analysis</h3>
                </div>
                <p className="text-muted-foreground">
                  Advanced algorithms analyze roof orientation, shading, and local weather patterns 
                  to provide accurate solar potential calculations.
                </p>
              </div>
            </Card>

            <Card className="bg-gradient-to-br from-primary/5 to-secondary/5">
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Clock className="w-6 h-6 text-primary" />
                  <h3 className="text-xl font-semibold">Real-time Monitoring</h3>
                </div>
                <p className="text-muted-foreground">
                  Track system performance, energy production, and savings in real-time with our 
                  intuitive dashboard.
                </p>
              </div>
            </Card>

            <Card className="bg-gradient-to-br from-primary/5 to-secondary/5">
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <FileText className="w-6 h-6 text-primary" />
                  <h3 className="text-xl font-semibold">Custom Reports</h3>
                </div>
                <p className="text-muted-foreground">
                  Generate professional, branded reports with detailed financial analysis and 
                  environmental impact metrics.
                </p>
              </div>
            </Card>

            <Card className="bg-gradient-to-br from-primary/5 to-secondary/5">
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Users className="w-6 h-6 text-primary" />
                  <h3 className="text-xl font-semibold">Lead Management</h3>
                </div>
                <p className="text-muted-foreground">
                  Streamline your sales process with integrated lead tracking and automated 
                  follow-ups.
                </p>
              </div>
            </Card>

            <Card className="bg-gradient-to-br from-primary/5 to-secondary/5">
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <ChartBar className="w-6 h-6 text-primary" />
                  <h3 className="text-xl font-semibold">Performance Analytics</h3>
                </div>
                <p className="text-muted-foreground">
                  Gain valuable insights with detailed analytics on system performance and sales 
                  metrics.
                </p>
              </div>
            </Card>

            <Card className="bg-gradient-to-br from-primary/5 to-secondary/5">
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Rocket className="w-6 h-6 text-primary" />
                  <h3 className="text-xl font-semibold">Quick Integration</h3>
                </div>
                <p className="text-muted-foreground">
                  Seamlessly integrate with your existing CRM and marketing tools for enhanced 
                  workflow efficiency.
                </p>
              </div>
            </Card>
          </div>

          <Card className="bg-muted/5">
            <div className="p-6">
              <h2 className="text-2xl font-semibold mb-4">Ready to Transform Your Solar Business?</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Join leading solar providers who are already using our platform to grow their business 
                and deliver better results for their customers.
              </p>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Features;