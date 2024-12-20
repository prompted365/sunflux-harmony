import { Card } from "@/components/ui/card";
import { SolarCalculation } from "../types";

interface EnvironmentalImpactProps {
  calc: SolarCalculation;
}

const EnvironmentalImpact = ({ calc }: EnvironmentalImpactProps) => {
  // Calculate additional environmental metrics with more realistic values
  const annualCO2Offset = (calc.irradiance_data?.carbonOffset || 0) * 0.907185; // Convert to metric tons
  const treesEquivalent = Math.round(annualCO2Offset * 16.5); // EPA estimate: 1 tree absorbs ~0.06 metric tons CO2 per year
  const homesEquivalent = calc.estimated_production?.yearlyEnergyDcKwh 
    ? Math.round((calc.estimated_production.yearlyEnergyDcKwh / 10950)) // Average US home uses 10,950 kWh annually
    : 0;
  
  // Local impact comparisons
  const localAverageCO2 = 5.2; // Average US household emissions in metric tons
  const communityImpact = Math.round(annualCO2Offset / localAverageCO2 * 100);

  return (
    <Card className="p-6 bg-gradient-to-br from-green-50 via-background to-background border-2">
      <h3 className="text-2xl font-semibold text-primary mb-6">Environmental Impact</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2 p-4 rounded-lg bg-white/50">
          <p className="text-sm text-gray-600">Carbon Offset</p>
          <p className="text-2xl font-semibold text-green-600">
            {annualCO2Offset.toFixed(1)} tons
          </p>
          <p className="text-xs text-gray-500">Annual CO₂ Reduction</p>
        </div>
        <div className="space-y-2 p-4 rounded-lg bg-white/50">
          <p className="text-sm text-gray-600">Trees Equivalent</p>
          <p className="text-2xl font-semibold text-green-600">
            {treesEquivalent} trees
          </p>
          <p className="text-xs text-gray-500">Annual Impact</p>
        </div>
        <div className="space-y-2 p-4 rounded-lg bg-white/50">
          <p className="text-sm text-gray-600">Clean Energy</p>
          <p className="text-2xl font-semibold text-green-600">
            {homesEquivalent} homes
          </p>
          <p className="text-xs text-gray-500">Equivalent Power</p>
        </div>
      </div>

      <div className="mt-6 p-4 rounded-lg bg-green-50">
        <h4 className="font-semibold text-gray-700 mb-2">Local Impact</h4>
        <p className="text-sm text-gray-600">
          Your solar installation will offset the equivalent of {communityImpact}% of your neighborhood's average carbon footprint.
          This makes you a leader in sustainable energy adoption in your community!
        </p>
      </div>
    </Card>
  );
};

export default EnvironmentalImpact;