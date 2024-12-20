import { Card } from "@/components/ui/card";
import { SolarCalculation } from "../types";

interface SystemSpecificationsProps {
  calc: SolarCalculation;
}

const SystemSpecifications = ({ calc }: SystemSpecificationsProps) => {
  return (
    <Card className="p-6 border-2">
      <h3 className="text-2xl font-semibold text-primary mb-6">System Specifications</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {calc.system_size && (
          <div className="space-y-2 p-4 rounded-lg bg-secondary/50">
            <p className="text-sm text-muted-foreground">System Size</p>
            <p className="text-2xl font-semibold text-primary">{calc.system_size.toFixed(2)} kW</p>
            <p className="text-xs text-muted-foreground">Premium Tier-1 Solar Panels</p>
          </div>
        )}
        {calc.panel_layout?.maxPanels && (
          <div className="space-y-2 p-4 rounded-lg bg-secondary/50">
            <p className="text-sm text-muted-foreground">Solar Array</p>
            <p className="text-2xl font-semibold text-primary">{calc.panel_layout.maxPanels} Panels</p>
            <p className="text-xs text-muted-foreground">High-Efficiency Configuration</p>
          </div>
        )}
        {calc.estimated_production?.yearlyEnergyDcKwh && (
          <div className="space-y-2 p-4 rounded-lg bg-secondary/50">
            <p className="text-sm text-muted-foreground">Annual Production</p>
            <p className="text-2xl font-semibold text-primary">
              {Math.round(calc.estimated_production.yearlyEnergyDcKwh).toLocaleString()} kWh
            </p>
            <p className="text-xs text-muted-foreground">Clean Energy Generated</p>
          </div>
        )}
      </div>
    </Card>
  );
};

export default SystemSpecifications;