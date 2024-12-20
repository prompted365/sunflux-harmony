import { SolarCalculation } from "./types";
import { Sun, Zap, Grid, Ruler, Clock, Leaf } from "lucide-react";

interface SolarMetricsProps {
  calc: SolarCalculation;
}

const SolarMetrics = ({ calc }: SolarMetricsProps) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      {calc.system_size != null && (
        <div className="space-y-1">
          <div className="flex items-center text-gray-600">
            <Sun className="w-4 h-4 mr-2" />
            <span className="text-sm">System Size</span>
          </div>
          <p className="text-lg font-semibold text-gray-800">{calc.system_size.toFixed(2)} kW</p>
        </div>
      )}
      
      {calc.estimated_production?.yearlyEnergyDcKwh && (
        <div className="space-y-1">
          <div className="flex items-center text-gray-600">
            <Zap className="w-4 h-4 mr-2" />
            <span className="text-sm">Annual Production</span>
          </div>
          <p className="text-lg font-semibold text-gray-800">
            {calc.estimated_production.yearlyEnergyDcKwh.toFixed(0)} kWh
          </p>
        </div>
      )}
      
      {calc.panel_layout?.maxPanels && (
        <div className="space-y-1">
          <div className="flex items-center text-gray-600">
            <Grid className="w-4 h-4 mr-2" />
            <span className="text-sm">Panel Count</span>
          </div>
          <p className="text-lg font-semibold text-gray-800">{calc.panel_layout.maxPanels}</p>
        </div>
      )}
      
      {calc.panel_layout?.maxArea && (
        <div className="space-y-1">
          <div className="flex items-center text-gray-600">
            <Ruler className="w-4 h-4 mr-2" />
            <span className="text-sm">Array Area</span>
          </div>
          <p className="text-lg font-semibold text-gray-800">
            {calc.panel_layout.maxArea.toFixed(1)} m²
          </p>
        </div>
      )}
      
      {calc.irradiance_data?.maxSunshineHours && (
        <div className="space-y-1">
          <div className="flex items-center text-gray-600">
            <Clock className="w-4 h-4 mr-2" />
            <span className="text-sm">Annual Sunshine</span>
          </div>
          <p className="text-lg font-semibold text-gray-800">
            {calc.irradiance_data.maxSunshineHours.toFixed(0)} hours
          </p>
        </div>
      )}
      
      {calc.irradiance_data?.carbonOffset && (
        <div className="space-y-1">
          <div className="flex items-center text-gray-600">
            <Leaf className="w-4 h-4 mr-2" />
            <span className="text-sm">Carbon Offset</span>
          </div>
          <p className="text-lg font-semibold text-gray-800">
            {calc.irradiance_data.carbonOffset.toFixed(1)} tons/year
          </p>
        </div>
      )}
    </div>
  );
};

export default SolarMetrics;