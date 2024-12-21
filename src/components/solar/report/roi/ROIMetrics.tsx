import { Card } from "@/components/ui/card";

interface ROIMetricsProps {
  netCost: number;
  breakEvenYear: number;
  lifetimeSavings: number;
}

const ROIMetrics = ({ netCost, breakEvenYear, lifetimeSavings }: ROIMetricsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
      <div className="p-4 rounded-lg bg-primary/10">
        <p className="text-sm text-muted-foreground">Initial Investment</p>
        <p className="text-2xl font-semibold text-primary">
          ${netCost.toLocaleString()}
        </p>
        <p className="text-xs text-muted-foreground">After federal incentive</p>
      </div>
      <div className="p-4 rounded-lg bg-green-100">
        <p className="text-sm text-green-700">Break Even Point</p>
        <p className="text-2xl font-semibold text-green-600">
          {breakEvenYear.toFixed(1)} Years
        </p>
        <p className="text-xs text-green-600">Return on investment</p>
      </div>
      <div className="p-4 rounded-lg bg-primary/10">
        <p className="text-sm text-muted-foreground">25-Year Savings</p>
        <p className="text-2xl font-semibold text-primary">
          ${Math.abs(lifetimeSavings).toLocaleString()}
        </p>
        <p className="text-xs text-muted-foreground">Total financial benefit</p>
      </div>
    </div>
  );
};

export default ROIMetrics;