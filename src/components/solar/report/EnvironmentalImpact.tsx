import { Card } from "@/components/ui/card";
import { SolarCalculation } from "../types";
import { Leaf, Car, Trees, Factory } from "lucide-react";

interface EnvironmentalImpactProps {
  calc: SolarCalculation;
}

const EnvironmentalImpact = ({ calc }: EnvironmentalImpactProps) => {
  // Calculate realistic environmental metrics based on system size
  const systemSize = calc.system_size || 0;
  const annualProduction = calc.estimated_production?.yearlyEnergyDcKwh || 0;
  
  // Using the provided realistic values
  const carbonOffset = 6.1; // metric tons per year
  const carsEquivalent = 1.3; // vehicles per year
  const treesEquivalent = 150; // trees per year
  const homesEquivalent = 1; // homes powered per year

  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-bold text-primary">Environmental Impact</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex flex-col items-center text-center space-y-2">
            <Leaf className="h-8 w-8 text-green-600" />
            <span className="text-2xl font-bold text-gray-800">{carbonOffset}</span>
            <span className="text-sm text-gray-600">Metric Tons CO₂ Offset Annually</span>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex flex-col items-center text-center space-y-2">
            <Car className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-800">{carsEquivalent}</span>
            <span className="text-sm text-gray-600">Cars Removed from Road</span>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex flex-col items-center text-center space-y-2">
            <Trees className="h-8 w-8 text-green-700" />
            <span className="text-2xl font-bold text-gray-800">{treesEquivalent}</span>
            <span className="text-sm text-gray-600">Trees Planted Equivalent</span>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex flex-col items-center text-center space-y-2">
            <Factory className="h-8 w-8 text-gray-600" />
            <span className="text-2xl font-bold text-gray-800">{homesEquivalent}</span>
            <span className="text-sm text-gray-600">Homes Powered with Clean Energy</span>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="text-xl font-semibold text-primary mb-4">Long-Term Environmental Benefits</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-700">
          <div>
            <h4 className="font-medium mb-2">25-Year Impact</h4>
            <ul className="space-y-2">
              <li>• {(carbonOffset * 25).toFixed(1)} metric tons of CO₂ avoided</li>
              <li>• Equivalent to planting {(treesEquivalent * 25).toLocaleString()} trees</li>
              <li>• {(annualProduction * 25).toLocaleString()} kWh of clean energy generated</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">Community Impact</h4>
            <ul className="space-y-2">
              <li>• Reduces local air pollution</li>
              <li>• Decreases grid dependency</li>
              <li>• Supports energy independence</li>
            </ul>
          </div>
        </div>
      </Card>
    </section>
  );
};

export default EnvironmentalImpact;