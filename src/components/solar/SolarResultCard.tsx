import { Card } from "@/components/ui/card";
import { SolarCalculation } from "./types";
import { Icons } from "@/components/ui/icons";

interface SolarResultCardProps {
  calc: SolarCalculation;
}

const SolarResultCard = ({ calc }: SolarResultCardProps) => {
  return (
    <Card key={calc.id} className="overflow-hidden">
      <div className="relative h-48 bg-secondary">
        <img
          src="/placeholder.svg"
          alt="Solar panel visualization"
          className="w-full h-full object-cover"
        />
        <span className={`absolute top-4 right-4 px-3 py-1 rounded-full text-sm font-medium ${
          calc.status === 'completed' ? 'bg-green-100 text-green-800' : 
          'bg-yellow-100 text-yellow-800'
        }`}>
          {calc.status}
        </span>
      </div>
      
      <div className="p-6 space-y-6">
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-gray-900">Solar Potential Analysis</h3>
          <p className="text-sm text-gray-500">Detailed metrics for your property</p>
        </div>

        {calc.status === 'completed' && (
          <div className="grid grid-cols-2 gap-4">
            {calc.system_size != null && (
              <div className="space-y-1">
                <div className="flex items-center text-gray-500">
                  <Icons.sun className="w-4 h-4 mr-2" />
                  <span className="text-sm">System Size</span>
                </div>
                <p className="text-lg font-semibold">{calc.system_size.toFixed(2)} kW</p>
              </div>
            )}
            
            {calc.estimated_production?.yearlyEnergyDcKwh && (
              <div className="space-y-1">
                <div className="flex items-center text-gray-500">
                  <Icons.zap className="w-4 h-4 mr-2" />
                  <span className="text-sm">Annual Production</span>
                </div>
                <p className="text-lg font-semibold">
                  {calc.estimated_production.yearlyEnergyDcKwh.toFixed(2)} kWh
                </p>
              </div>
            )}
            
            {calc.panel_layout?.maxPanels && (
              <div className="space-y-1">
                <div className="flex items-center text-gray-500">
                  <Icons.grid className="w-4 h-4 mr-2" />
                  <span className="text-sm">Panel Count</span>
                </div>
                <p className="text-lg font-semibold">{calc.panel_layout.maxPanels}</p>
              </div>
            )}
            
            {calc.panel_layout?.maxArea && (
              <div className="space-y-1">
                <div className="flex items-center text-gray-500">
                  <Icons.ruler className="w-4 h-4 mr-2" />
                  <span className="text-sm">Array Area</span>
                </div>
                <p className="text-lg font-semibold">
                  {calc.panel_layout.maxArea.toFixed(1)} m²
                </p>
              </div>
            )}
            
            {calc.irradiance_data?.maxSunshineHours && (
              <div className="space-y-1">
                <div className="flex items-center text-gray-500">
                  <Icons.clock className="w-4 h-4 mr-2" />
                  <span className="text-sm">Annual Sunshine</span>
                </div>
                <p className="text-lg font-semibold">
                  {calc.irradiance_data.maxSunshineHours.toFixed(0)} hours
                </p>
              </div>
            )}
            
            {calc.irradiance_data?.carbonOffset && (
              <div className="space-y-1">
                <div className="flex items-center text-gray-500">
                  <Icons.leaf className="w-4 h-4 mr-2" />
                  <span className="text-sm">Carbon Offset</span>
                </div>
                <p className="text-lg font-semibold">
                  {calc.irradiance_data.carbonOffset.toFixed(2)} kg/MWh
                </p>
              </div>
            )}
          </div>
        )}

        {calc.status === 'pending' && (
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="h-12 bg-gray-200 rounded"></div>
              <div className="h-12 bg-gray-200 rounded"></div>
              <div className="h-12 bg-gray-200 rounded"></div>
              <div className="h-12 bg-gray-200 rounded"></div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default SolarResultCard;