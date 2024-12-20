import { Card } from "@/components/ui/card";
import { SolarCalculation } from "../types";
import { MapPin, Sun, Battery, Zap } from "lucide-react";

interface SystemSpecificationsProps {
  calc: SolarCalculation;
}

const SystemSpecifications = ({ calc }: SystemSpecificationsProps) => {
  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-bold text-primary">System Specifications</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6 bg-gradient-to-br from-secondary/10 via-background to-background">
          <h3 className="text-xl font-semibold text-primary mb-4">Core System Details</h3>
          <div className="space-y-3 text-gray-700">
            <div className="flex items-center gap-2">
              <Sun className="h-5 w-5 text-primary" />
              <span>System Size: {calc.system_size?.toFixed(2) || 'N/A'} kW</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              <span>Annual Production: {calc.estimated_production?.yearlyEnergyDcKwh?.toFixed(0).toLocaleString() || 'N/A'} kWh</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              <span>Panel Count: {calc.panel_layout?.maxPanels || 'N/A'} panels</span>
            </div>
            <div className="flex items-center gap-2">
              <Battery className="h-5 w-5 text-primary" />
              <span>Array Area: {calc.panel_layout?.maxArea?.toFixed(1) || 'N/A'} m²</span>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="aspect-video rounded-lg overflow-hidden bg-muted mb-2">
            <img 
              src="/lovable-uploads/72267891-30ba-449d-a6f0-6882b77dc9e4.png"
              alt="Annual Shading Analysis"
              className="w-full h-full object-cover"
            />
          </div>
          <p className="text-sm text-gray-600 text-center">Annual Solar Exposure Analysis</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <Card className="p-6">
          <div className="aspect-video rounded-lg overflow-hidden bg-muted mb-2">
            <img 
              src="/lovable-uploads/ae3c564a-a724-4eca-bb62-031fd079d353.png"
              alt="3D Property Model"
              className="w-full h-full object-cover"
            />
          </div>
          <p className="text-sm text-gray-600 text-center">3D Property Visualization</p>
        </Card>

        <Card className="p-6">
          <div className="aspect-video rounded-lg overflow-hidden bg-muted mb-2">
            <img 
              src="/lovable-uploads/1657e7e5-1612-44b4-9342-713be6b5b206.png"
              alt="Panel Layout Optimization"
              className="w-full h-full object-cover"
            />
          </div>
          <p className="text-sm text-gray-600 text-center">Panel Layout Optimization</p>
        </Card>
      </div>

      <Card className="p-6 mt-6">
        <h3 className="text-xl font-semibold text-primary mb-4">Technical Specifications</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-gray-700">
          <div>
            <h4 className="font-medium mb-2">Panel Specifications</h4>
            <ul className="space-y-2">
              <li>• Premium Tier-1 Solar Panels</li>
              <li>• 25-Year Performance Warranty</li>
              <li>• High-Efficiency Monocrystalline Technology</li>
              <li>• Advanced Low-Light Performance</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">Inverter System</h4>
            <ul className="space-y-2">
              <li>• Microinverter Technology</li>
              <li>• Panel-Level Monitoring</li>
              <li>• 97.5% Conversion Efficiency</li>
              <li>• Smart Grid Integration Ready</li>
            </ul>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-xl font-semibold text-primary mb-4">System Expansion Options</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-gray-700">
          <div>
            <h4 className="font-medium mb-2">Energy Storage</h4>
            <ul className="space-y-2">
              <li>• Battery Backup Ready</li>
              <li>• Smart Power Management</li>
              <li>• Emergency Power Supply</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">EV Integration</h4>
            <ul className="space-y-2">
              <li>• EV Charger Compatible</li>
              <li>• Smart Charging Controls</li>
              <li>• Power Output Optimization</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">Smart Home</h4>
            <ul className="space-y-2">
              <li>• IoT Device Integration</li>
              <li>• Energy Usage Monitoring</li>
              <li>• Mobile App Control</li>
            </ul>
          </div>
        </div>
      </Card>
    </section>
  );
};

export default SystemSpecifications;
