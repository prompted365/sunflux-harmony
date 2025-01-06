import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, FileText, Building2, Zap, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ReportViewer from "./reports/ReportViewer";
import { toast } from "sonner";

const VendorDashboard = () => {
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
  const queryClient = useQueryClient();

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
          status,
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

  const deleteProperty = useMutation({
    mutationFn: async (propertyId: string) => {
      const { error } = await supabase
        .from('properties')
        .delete()
        .eq('id', propertyId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendor-properties'] });
      toast.success("Property deleted successfully");
      if (selectedPropertyId === propertyId) {
        setSelectedPropertyId(null);
      }
    },
    onError: (error) => {
      toast.error("Failed to delete property");
      console.error("Delete error:", error);
    }
  });

  const getStatusColor = (status: string | null) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500 hover:bg-green-600';
      case 'processing':
        return 'bg-yellow-500 hover:bg-yellow-600';
      case 'error':
        return 'bg-red-500 hover:bg-red-600';
      default:
        return 'bg-gray-500 hover:bg-gray-600';
    }
  };

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
                  <div
                    key={property.id}
                    className="flex items-center space-x-2"
                  >
                    <Button
                      variant={selectedPropertyId === property.id ? "default" : "outline"}
                      className="w-full justify-start"
                      onClick={() => setSelectedPropertyId(property.id)}
                    >
                      <div className="flex flex-col items-start gap-1">
                        <p className="font-medium">{property.address}</p>
                        <div className="flex items-center gap-2">
                          <p className="text-sm text-muted-foreground">
                            {property.city}, {property.state}
                          </p>
                          <Badge 
                            variant="outline"
                            className={getStatusColor(property.status)}
                          >
                            {property.status || 'pending'}
                          </Badge>
                        </div>
                      </div>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="flex-shrink-0 text-destructive hover:text-destructive/90"
                      onClick={() => {
                        if (window.confirm('Are you sure you want to delete this property?')) {
                          deleteProperty.mutate(property.id);
                        }
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
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
