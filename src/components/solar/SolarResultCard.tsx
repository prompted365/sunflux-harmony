import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SolarCalculation } from "./types";
import { Icons } from "@/components/ui/icons";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface SolarResultCardProps {
  calc: SolarCalculation;
}

const SolarResultCard = ({ calc }: SolarResultCardProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const handleGenerateReport = async () => {
    try {
      setIsGenerating(true);
      
      const { data, error } = await supabase.functions.invoke('generate-report', {
        body: { calculationId: calc.id }
      });

      if (error) throw error;

      // Open the PDF in a new tab
      window.open(data.downloadUrl, '_blank');

      toast({
        title: "Success",
        description: "Report generated successfully",
      });
    } catch (error) {
      console.error('Report generation error:', error);
      toast({
        title: "Error",
        description: "Failed to generate report",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

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
          <>
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

            <Button
              onClick={handleGenerateReport}
              disabled={isGenerating}
              className="w-full"
            >
              {isGenerating ? (
                <>
                  <Icons.loader className="mr-2 h-4 w-4 animate-spin" />
                  Generating Report...
                </>
              ) : (
                <>
                  <Icons.fileText className="mr-2 h-4 w-4" />
                  Generate PDF Report
                </>
              )}
            </Button>
          </>
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