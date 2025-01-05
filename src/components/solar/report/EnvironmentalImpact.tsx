import { Card } from "@/components/ui/card";
import { SolarCalculation } from "../types";
import { Leaf, Car, Trees, Home } from "lucide-react";

interface EnvironmentalImpactProps {
  calc: SolarCalculation;
  roiResults?: {
    co2_offset: number;
    lifetime_production: number;
  } | null;
}

const EnvironmentalImpact = ({ calc, roiResults }: EnvironmentalImpactProps) => {
  const systemSize = calc.system_size || 0;
  const annualProduction = calc.estimated_production?.yearlyEnergyDcKwh || 0;
  
  // Use ROI results if available, otherwise fallback to default calculations
  const carbonOffset = roiResults?.co2_offset || 6.1;
  const carsEquivalent = carbonOffset / 4.6; // Average car emits 4.6 metric tons per year
  const treesEquivalent = carbonOffset * 24.6; // Each tree absorbs ~0.041 metric tons per year
  const homesEquivalent = (roiResults?.lifetime_production || annualProduction) / 10400; // Average home uses 10,400 kWh per year

  return (
    <Card className="p-6 bg-gradient-to-br from-primary/5 via-background to-background">
      <h3 className="text-2xl font-semibold text-primary mb-6">Environmental Impact</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex items-center space-x-2">
          <Leaf className="h-5 w-5 text-green-600" />
          <div>
            <p className="text-lg font-semibold">{carbonOffset.toFixed(1)} tons</p>
            <p className="text-sm text-muted-foreground">CO₂ Offset Annually</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Car className="h-5 w-5 text-blue-600" />
          <div>
            <p className="text-lg font-semibold">{carsEquivalent.toFixed(1)} cars</p>
            <p className="text-sm text-muted-foreground">Equivalent to CO₂ from cars</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Trees className="h-5 w-5 text-green-600" />
          <div>
            <p className="text-lg font-semibold">{treesEquivalent.toFixed(1)} trees</p>
            <p className="text-sm text-muted-foreground">Equivalent to trees planted</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Home className="h-5 w-5 text-yellow-600" />
          <div>
            <p className="text-lg font-semibold">{homesEquivalent.toFixed(1)} homes</p>
            <p className="text-sm text-muted-foreground">Power for homes annually</p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default EnvironmentalImpact;