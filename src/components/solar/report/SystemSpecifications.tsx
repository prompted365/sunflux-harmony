import { Card } from "@/components/ui/card";
import { SolarCalculation } from "../types";
import { Sun, Zap, Grid, Ruler } from "lucide-react";

interface SystemSpecificationsProps {
  calc: SolarCalculation;
}

const SystemSpecifications = ({ calc }: SystemSpecificationsProps) => {
  return (
    <Card className="p-6">
      <h3 className="text-2xl font-semibold text-primary mb-6">System Specifications</h3>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {calc.system_size && (
          <div className="space-y-2">
            <div className="flex items-center text-primary">
              <Sun className="w-5 h-5 mr-2" />
              <span className="font-medium">System Size</span>
            </div>
            <p className="text-2xl font-bold">{calc.system_size.toFixed(1)} kW</p>
          </div>
        )}
        
        {calc.estimated_production?.yearlyEnergyDcKwh && (
          <div className="space-y-2">
            <div className="flex items-center text-primary">
              <Zap className="w-5 h-5 mr-2" />
              <span className="font-medium">Annual Production</span>
            </div>
            <p className="text-2xl font-bold">
              {Math.round(calc.estimated_production.yearlyEnergyDcKwh).toLocaleString()} kWh
            </p>
          </div>
        )}
        
        {calc.panel_layout?.maxPanels && (
          <div className="space-y-2">
            <div className="flex items-center text-primary">
              <Grid className="w-5 h-5 mr-2" />
              <span className="font-medium">Panel Count</span>
            </div>
            <p className="text-2xl font-bold">{calc.panel_layout.maxPanels}</p>
          </div>
        )}
        
        {calc.panel_layout?.maxArea && (
          <div className="space-y-2">
            <div className="flex items-center text-primary">
              <Ruler className="w-5 h-5 mr-2" />
              <span className="font-medium">Array Area</span>
            </div>
            <p className="text-2xl font-bold">{calc.panel_layout.maxArea.toFixed(1)} m²</p>
          </div>
        )}
      </div>
    </Card>
  );
};

export default SystemSpecifications;