import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import SolarResultCard from "../solar/SolarResultCard";
import { SolarCalculation } from "../solar/types/calculations";
import { Json } from "@/integrations/supabase/types";

interface DatabaseSolarCalculation {
  id: string;
  status: string;
  system_size: number | null;
  irradiance_data: Json;
  panel_layout: Json;
  estimated_production: Json;
  financial_analysis: Json;
  panel_config: Json;
  building_specs: Json;
  properties: {
    address: string;
    city: string;
    state: string;
    zip_code: string;
  };
}

const transformDatabaseCalculation = (calc: DatabaseSolarCalculation): SolarCalculation => {
  return {
    id: calc.id,
    status: calc.status,
    system_size: calc.system_size,
    irradiance_data: {
      maxSunshineHours: (calc.irradiance_data as any)?.maxSunshineHours || 0,
      carbonOffset: (calc.irradiance_data as any)?.carbonOffset || 0,
      annualSunlight: (calc.irradiance_data as any)?.annualSunlight
    },
    panel_layout: {
      maxPanels: (calc.panel_layout as any)?.maxPanels || 0,
      maxArea: (calc.panel_layout as any)?.maxArea || 0,
      panelDimensions: {
        height: (calc.panel_layout as any)?.panelDimensions?.height || 0,
        width: (calc.panel_layout as any)?.panelDimensions?.width || 0
      },
      optimalConfiguration: (calc.panel_layout as any)?.optimalConfiguration
    },
    estimated_production: calc.estimated_production as SolarCalculation['estimated_production'],
    financial_analysis: calc.financial_analysis as SolarCalculation['financial_analysis'],
    building_specs: calc.building_specs as SolarCalculation['building_specs']
  };
};

const SolarAnalysisReports = () => {
  const { data: calculations, isLoading } = useQuery({
    queryKey: ['solar-calculations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('solar_calculations')
        .select(`
          *,
          properties (
            address,
            city,
            state,
            zip_code
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Transform the data to match our frontend types
      return (data as DatabaseSolarCalculation[]).map(transformDatabaseCalculation);
    }
  });

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="space-y-3">
              <div className="h-20 bg-gray-200 rounded"></div>
              <div className="h-20 bg-gray-200 rounded"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Solar Analysis Reports</CardTitle>
      </CardHeader>
      <CardContent>
        {calculations?.length === 0 ? (
          <p className="text-muted-foreground text-sm">No solar analysis reports available.</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {calculations?.map((calc) => (
              <SolarResultCard key={calc.id} calc={calc} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SolarAnalysisReports;