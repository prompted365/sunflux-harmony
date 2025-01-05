import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, FileText, Building2, Zap } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import ReportViewer from "./reports/ReportViewer";

const VendorDashboard = () => {
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);

  const { data: properties, isLoading } = useQuery({
    queryKey: ['vendor-properties'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('properties')
        .select(`
          id,
          address,
          city,
          state,
          solar_calculations (
            id,
            status,
            system_size,
            panel_layout,
            estimated_production,
            building_specs
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-4">Vendor Dashboard</h2>
        <p className="text-muted-foreground">
          Overview of your solar projects and reports.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{properties?.length || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {properties?.filter(p => 
                p.solar_calculations?.some(c => c.status === 'processing')
              ).length || 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Reports</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {properties?.filter(p => 
                p.solar_calculations?.some(c => c.status === 'completed')
              ).length || 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Capacity</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {properties?.reduce((acc, p) => {
                const systemSize = p.solar_calculations?.[0]?.system_size || 0;
                return acc + systemSize;
              }, 0).toFixed(1)} kW
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Project List</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[600px] pr-4">
              <div className="space-y-2">
                {properties?.map((property) => (
                  <Button
                    key={property.id}
                    variant={selectedPropertyId === property.id ? "default" : "outline"}
                    className="w-full justify-start"
                    onClick={() => setSelectedPropertyId(property.id)}
                  >
                    <div className="text-left">
                      <p className="font-medium">{property.address}</p>
                      <p className="text-sm text-muted-foreground">
                        {property.city}, {property.state}
                      </p>
                    </div>
                  </Button>
                ))}
              </div>
            </ScrollArea>
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