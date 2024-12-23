import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, FileText, Building2, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

const VendorDashboard = () => {
  const { toast } = useToast();

  const createTestProperty = async () => {
    try {
      // Get current vendor ID from session
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          title: "Error",
          description: "You must be logged in to create a test property",
          variant: "destructive",
        });
        return;
      }

      const vendorId = session.user.id;

      // First create a test property
      const { data: property, error: propertyError } = await supabase
        .from('properties')
        .insert({
          vendor_id: vendorId,
          user_id: vendorId, // Set user_id to vendor_id since we're creating a test property
          address: "123 Test Street",
          city: "Lafayette",
          state: "IN",
          zip_code: "47904",
          // Random coordinates near Lafayette, IN for testing
          latitude: 40.4167 + (Math.random() - 0.5) * 0.01,
          longitude: -86.8753 + (Math.random() - 0.5) * 0.01,
        })
        .select()
        .single();

      if (propertyError) {
        throw propertyError;
      }

      // Create test solar configuration
      const { error: configError } = await supabase
        .from('solar_configurations')
        .insert({
          property_id: property.id,
          monthly_bill: 150,
          energy_cost_per_kwh: 0.15,
          panel_capacity_watts: 400,
          installation_cost_per_watt: 4.0,
          is_using_defaults: false,
        });

      if (configError) {
        throw configError;
      }

      // Trigger solar calculation
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/calculate-solar`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          propertyId: property.id,
          latitude: property.latitude,
          longitude: property.longitude,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to trigger solar calculation');
      }

      toast({
        title: "Success",
        description: "Test property created and solar calculation initiated",
      });

    } catch (error: any) {
      console.error('Error creating test property:', error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold mb-4">Vendor Dashboard</h2>
          <p className="text-muted-foreground">
            Overview of your solar business metrics and activities.
          </p>
        </div>
        <Button 
          onClick={createTestProperty}
          className="bg-orange-600 hover:bg-orange-700"
        >
          Create Test Property
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reports Generated</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Panel Models</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VendorDashboard;