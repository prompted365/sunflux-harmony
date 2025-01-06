import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import ReportViewer from "./reports/ReportViewer";
import { DashboardMetrics } from "./dashboard/DashboardMetrics";
import { PropertyList } from "./dashboard/PropertyList";
import { Property } from "./types";

const VendorDashboard = () => {
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);

  const { data: properties, isLoading } = useQuery({
    queryKey: ['vendor-properties'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { data, error } = await supabase
        .from('properties')
        .select(`
          id,
          address,
          city,
          state,
          status,
          building_insights_jsonb,
          solar_calculations (
            id,
            status,
            system_size,
            panel_layout,
            estimated_production,
            building_specs
          )
        `)
        .or(`user_id.eq.${user?.id},vendor_id.eq.${user?.id}`)
        .order('created_at', { ascending: false });

      if (error) throw error;
      console.log('Fetched properties:', data);
      return data as Property[];
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-4">Vendor Dashboard</h2>
        <p className="text-muted-foreground">
          Overview of your solar projects and reports.
        </p>
      </div>

      <DashboardMetrics properties={properties} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-1">
          <CardContent className="p-6">
            <PropertyList
              properties={properties}
              selectedPropertyId={selectedPropertyId}
              onSelectProperty={setSelectedPropertyId}
            />
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardContent className="p-6">
            {selectedPropertyId ? (
              <ReportViewer 
                property={properties?.find(p => p.id === selectedPropertyId)} 
              />
            ) : (
              <div className="text-center text-muted-foreground py-8">
                Select a project to view its report
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VendorDashboard;