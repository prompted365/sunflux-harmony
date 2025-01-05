import { Card } from "@/components/ui/card";

interface ROIMetricsProps {
  netCost: number;
  breakEvenYear: number;
  lifetimeSavings: number;
  irr?: number;
  lifetimeProduction?: number;
  co2Offset?: number;
}

const ROIMetrics = ({ 
  netCost, 
  breakEvenYear, 
  lifetimeSavings,
  irr,
  lifetimeProduction,
  co2Offset
}: ROIMetricsProps) => {
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

      {irr && (
        <div className="p-4 rounded-lg bg-blue-100">
          <p className="text-sm text-blue-700">Internal Rate of Return</p>
          <p className="text-2xl font-semibold text-blue-600">
            {(irr * 100).toFixed(1)}%
          </p>
          <p className="text-xs text-blue-600">Annual return rate</p>
        </div>
      )}

      {lifetimeProduction && (
        <div className="p-4 rounded-lg bg-amber-100">
          <p className="text-sm text-amber-700">Lifetime Production</p>
          <p className="text-2xl font-semibold text-amber-600">
            {(lifetimeProduction / 1000).toFixed(1)}k kWh
          </p>
          <p className="text-xs text-amber-600">Total energy generated</p>
        </div>
      )}

      {co2Offset && (
        <div className="p-4 rounded-lg bg-emerald-100">
          <p className="text-sm text-emerald-700">Carbon Offset</p>
          <p className="text-2xl font-semibold text-emerald-600">
            {co2Offset.toFixed(1)} tons
          </p>
          <p className="text-xs text-emerald-600">CO₂ emissions avoided</p>
        </div>
      )}
    </div>
  );
};

export default ROIMetrics;