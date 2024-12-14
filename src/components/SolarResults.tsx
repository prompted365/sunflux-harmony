import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

interface SolarCalculation {
  id: string;
  status: string;
  system_size: number;
  irradiance_data: {
    maxSunshineHours: number;
    carbonOffset: number;
  };
  panel_layout: {
    maxPanels: number;
    maxArea: number;
    panelDimensions: {
      height: number;
      width: number;
    };
  };
  estimated_production: {
    yearlyEnergyDcKwh: number;
  };
}

const SolarResults = () => {
  const [calculations, setCalculations] = useState<SolarCalculation[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    // Fetch initial calculations
    fetchCalculations();

    // Subscribe to new calculations
    const channel = supabase
      .channel('solar_calculations')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'solar_calculations'
        },
        (payload) => {
          console.log('Change received!', payload);
          fetchCalculations();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchCalculations = async () => {
    try {
      const { data, error } = await supabase
        .from('solar_calculations')
        .select(`
          id,
          status,
          system_size,
          irradiance_data,
          panel_layout,
          estimated_production
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCalculations(data || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch solar calculations",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6 mt-8">
      <h2 className="text-2xl font-bold text-gray-900">Solar Calculations</h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {calculations.map((calc) => (
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
                  <div>
                    <p className="text-sm text-gray-500">System Size</p>
                    <p className="text-lg font-medium">{calc.system_size.toFixed(2)} kW</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500">Annual Production</p>
                    <p className="text-lg font-medium">
                      {calc.estimated_production.yearlyEnergyDcKwh.toFixed(2)} kWh
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500">Maximum Panels</p>
                    <p className="text-lg font-medium">{calc.panel_layout.maxPanels}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500">Sunshine Hours (Annual)</p>
                    <p className="text-lg font-medium">
                      {calc.irradiance_data.maxSunshineHours.toFixed(0)} hours
                    </p>
                  </div>
                </>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SolarResults;