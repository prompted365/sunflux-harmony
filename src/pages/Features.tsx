import { List, Zap, Clock, FileText } from "lucide-react";

const Features = () => {
  return (
    <div className="min-h-screen bg-background pt-24">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-12">Powerful Features for Solar Success</h1>
        
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <Zap className="w-6 h-6 text-primary" />
                <h3 className="text-xl font-semibold">Smart Solar Analysis</h3>
              </div>
              <p className="text-muted-foreground">
                Advanced algorithms analyze roof orientation, shading, and local weather patterns to provide accurate solar potential calculations.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <Clock className="w-6 h-6 text-primary" />
                <h3 className="text-xl font-semibold">Real-time Monitoring</h3>
              </div>
              <p className="text-muted-foreground">
                Track system performance, energy production, and savings in real-time with our intuitive dashboard.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <FileText className="w-6 h-6 text-primary" />
                <h3 className="text-xl font-semibold">Custom Reports</h3>
              </div>
              <p className="text-muted-foreground">
                Generate professional, branded reports with detailed financial analysis and environmental impact metrics.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <List className="w-6 h-6 text-primary" />
                <h3 className="text-xl font-semibold">Lead Management</h3>
              </div>
              <p className="text-muted-foreground">
                Streamline your sales process with integrated lead tracking and automated follow-ups.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Features;