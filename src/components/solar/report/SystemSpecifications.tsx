import { Card } from "@/components/ui/card";
import { SolarCalculation } from "../types";
import { MapPin, Sun, Battery, Zap } from "lucide-react";

interface SystemSpecificationsProps {
  calc: SolarCalculation;
}

const SystemSpecifications = ({ calc }: SystemSpecificationsProps) => {
  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-bold text-primary">System Specifications</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6 bg-gradient-to-br from-secondary/10 via-background to-background">
          <h3 className="text-xl font-semibold text-primary mb-4">Core System Details</h3>
          <div className="space-y-3 text-gray-700">
            <div className="flex items-center gap-2">
              <Sun className="h-5 w-5 text-primary" />
              <span>System Size: {calc.system_size?.toFixed(2) || 'N/A'} kW</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              <span>Annual Production: {calc.estimated_production?.yearlyEnergyDcKwh?.toFixed(0).toLocaleString() || 'N/A'} kWh</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              <span>Panel Count: {calc.panel_layout?.maxPanels || 'N/A'} panels</span>
            </div>
            <div className="flex items-center gap-2">
              <Battery className="h-5 w-5 text-primary" />
              <span>Array Area: {calc.panel_layout?.maxArea?.toFixed(1) || 'N/A'} m²</span>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="aspect-video rounded-lg overflow-hidden bg-muted mb-2">
            <img 
              src="/lovable-uploads/72267891-30ba-449d-a6f0-6882b77dc9e4.png"
              alt="Annual Shading Analysis"
              className="w-full h-full object-cover"
            />
          </div>
          <p className="text-sm text-gray-600 text-center">Annual Solar Exposure Analysis</p>
        </Card>
      </div>
    </section>
  );
};

export default SystemSpecifications;