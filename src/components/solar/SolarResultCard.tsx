import { Card } from "@/components/ui/card";
import { SolarCalculation } from "./types";

interface SolarResultCardProps {
  calc: SolarCalculation;
}

const SolarResultCard = ({ calc }: SolarResultCardProps) => {
  return (
    <Card key={calc.id} className="p-6">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Solar Potential</h3>
          <span className={`px-2 py-1 rounded-full text-sm ${
            calc.status === 'completed' ? 'bg-green-100 text-green-800' : 
            'bg-yellow-100 text-yellow-800'
          }`}>
            {calc.status}
          </span>
        </div>
        
        {calc.status === 'completed' && (
          <>
            {calc.system_size != null && (
              <div>
                <p className="text-sm text-gray-500">System Size</p>
                <p className="text-lg font-medium">{calc.system_size.toFixed(2)} kW</p>
              </div>
            )}
            
            {calc.estimated_production && (
              <div>
                <p className="text-sm text-gray-500">Annual Production</p>
                <p className="text-lg font-medium">
                  {calc.estimated_production.yearlyEnergyDcKwh?.toFixed(2) ?? 'N/A'} kWh
                </p>
              </div>
            )}
            
            {calc.panel_layout && (
              <div>
                <p className="text-sm text-gray-500">Maximum Panels</p>
                <p className="text-lg font-medium">{calc.panel_layout.maxPanels}</p>
              </div>
            )}
            
            {calc.irradiance_data && (
              <>
                <div>
                  <p className="text-sm text-gray-500">Sunshine Hours (Annual)</p>
                  <p className="text-lg font-medium">
                    {calc.irradiance_data.maxSunshineHours?.toFixed(0) ?? 'N/A'} hours
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Carbon Offset</p>
                  <p className="text-lg font-medium">
                    {calc.irradiance_data.carbonOffset?.toFixed(2) ?? 'N/A'} kg/MWh
                  </p>
                </div>
              </>
            )}
          </>
        )}

        {calc.status === 'pending' && (
          <div className="animate-pulse space-y-2">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default SolarResultCard;