import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Json } from "@/integrations/supabase/types";

interface SolarCalculation {
  id: string;
  status: string;
  system_size: number | null;
  irradiance_data: {
    maxSunshineHours: number;
    carbonOffset: number;
  } | null;
  panel_layout: {
    maxPanels: number;
    maxArea: number;
    panelDimensions: {
      height: number;
      width: number;
    };
  } | null;
  estimated_production: {
    yearlyEnergyDcKwh: number;
  } | null;
}

interface DatabaseSolarCalculation {
  id: string;
  status: string;
  system_size: number | null;
  irradiance_data: Json;
  panel_layout: Json;
  estimated_production: Json;
}

const SolarResults = () => {
  const [calculations, setCalculations] = useState<SolarCalculation[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchCalculations();

    // Subscribe to real-time updates
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

  const transformDatabaseCalculation = (calc: DatabaseSolarCalculation): SolarCalculation => {
    return {
      id: calc.id,
      status: calc.status,
      system_size: calc.system_size,
      irradiance_data: calc.irradiance_data as SolarCalculation['irradiance_data'],
      panel_layout: calc.panel_layout as SolarCalculation['panel_layout'],
      estimated_production: calc.estimated_production as SolarCalculation['estimated_production']
    };
  };

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
      
      const transformedData = (data || []).map(transformDatabaseCalculation);
      setCalculations(transformedData);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch solar calculations",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 mt-8">
        <h2 className="text-2xl font-bold text-gray-900">Solar Calculations</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="p-6">
              <div className="space-y-4">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
                <Skeleton className="h-4 w-[150px]" />
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

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
                        {calc.estimated_production.yearlyEnergyDcKwh.toFixed(2)} kWh
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
                          {calc.irradiance_data.maxSunshineHours.toFixed(0)} hours
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Carbon Offset</p>
                        <p className="text-lg font-medium">
                          {calc.irradiance_data.carbonOffset.toFixed(2)} kg/MWh
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
        ))}
      </div>
    </div>
  );
};

export default SolarResults;