import { Card } from "@/components/ui/card";
import { Sun, DollarSign, Wind } from "lucide-react";

interface OverviewMetricsProps {
  solarPotential: any;
  optimalConfig: any;
}

const OverviewMetrics = ({ solarPotential, optimalConfig }: OverviewMetricsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="p-6">
        <Sun className="h-8 w-8 text-yellow-500 mb-2" />
        <h3 className="font-semibold">Optimal System</h3>
        <p className="text-2xl font-bold">{optimalConfig.panelCount} Panels</p>
        <p className="text-sm text-muted-foreground">
          {optimalConfig.systemSizeKw.toFixed(1)} kW System
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          ({solarPotential.maxArrayPanelsCount - optimalConfig.panelCount} additional possible)
        </p>
      </Card>
      
      <Card className="p-6">
        <DollarSign className="h-8 w-8 text-green-500 mb-2" />
        <h3 className="font-semibold">Financial Impact</h3>
        <p className="text-2xl font-bold">
          ${optimalConfig.installationCost.toLocaleString()}
        </p>
        <p className="text-sm text-muted-foreground">
          {optimalConfig.paybackPeriod.toFixed(1)} Year Payback
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          {optimalConfig.monthlyBillOffset.toFixed(0)}% Bill Offset
        </p>
      </Card>
      
      <Card className="p-6">
        <Wind className="h-8 w-8 text-blue-500 mb-2" />
        <h3 className="font-semibold">Annual Production</h3>
        <p className="text-2xl font-bold">
          {optimalConfig.annualProduction.toLocaleString()} kWh
        </p>
        <p className="text-sm text-muted-foreground">
          Optimal Energy Generation
        </p>
      </Card>
    </div>
  );
};

export default OverviewMetrics;