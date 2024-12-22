import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import SolarResultCard from "../solar/SolarResultCard";
import { SolarCalculation } from "@/types/solar/calculations";

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
      return data as (SolarCalculation & { properties: { address: string; city: string; state: string; zip_code: string; } })[];
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