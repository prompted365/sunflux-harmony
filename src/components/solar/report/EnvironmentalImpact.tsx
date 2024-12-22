import { Card } from "@/components/ui/card";
import { SolarCalculation } from "../types";
import { Leaf, Trees, Home, Car } from "lucide-react";

interface EnvironmentalImpactProps {
  calc: SolarCalculation;
}

const EnvironmentalImpact = ({ calc }: EnvironmentalImpactProps) => {
  if (!calc.irradiance_data?.carbonOffset) return null;

  const annualCarbonOffset = calc.irradiance_data.carbonOffset;
  const treesEquivalent = Math.round((annualCarbonOffset * 20) / 0.06); // Average tree absorbs 60kg CO2 per year
  const homesEquivalent = Math.round((calc.estimated_production?.yearlyEnergyDcKwh || 0) / 10700); // Average US home uses 10,700 kWh/year
  const carMilesEquivalent = Math.round(annualCarbonOffset * 2481.75); // EPA: 404.2 grams CO2 per mile

  return (
    <Card className="p-6 bg-gradient-to-br from-green-50 via-background to-background">
      <h3 className="text-2xl font-semibold text-green-700 mb-6">Environmental Impact</h3>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="space-y-2">
          <div className="flex items-center text-green-600">
            <Leaf className="w-5 h-5 mr-2" />
            <span className="font-medium">Carbon Offset</span>
          </div>
          <p className="text-2xl font-bold text-green-700">
            {annualCarbonOffset.toFixed(1)} tons/year
          </p>
          <p className="text-sm text-green-600">CO₂ emissions reduced</p>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center text-green-600">
            <Trees className="w-5 h-5 mr-2" />
            <span className="font-medium">Trees Equivalent</span>
          </div>
          <p className="text-2xl font-bold text-green-700">
            {treesEquivalent.toLocaleString()}
          </p>
          <p className="text-sm text-green-600">Trees planted</p>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center text-green-600">
            <Home className="w-5 h-5 mr-2" />
            <span className="font-medium">Homes Powered</span>
          </div>
          <p className="text-2xl font-bold text-green-700">
            {homesEquivalent}
          </p>
          <p className="text-sm text-green-600">Annual home energy use</p>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center text-green-600">
            <Car className="w-5 h-5 mr-2" />
            <span className="font-medium">Car Miles</span>
          </div>
          <p className="text-2xl font-bold text-green-700">
            {carMilesEquivalent.toLocaleString()}
          </p>
          <p className="text-sm text-green-600">Miles not driven</p>
        </div>
      </div>
    </Card>
  );
};

export default EnvironmentalImpact;