import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const TestPropertyButton = () => {
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

      // Trigger solar calculation using functions.invoke()
      const { error: calcError } = await supabase.functions.invoke('calculate-solar', {
        body: {
          propertyId: property.id,
          latitude: property.latitude,
          longitude: property.longitude,
        },
      });

      if (calcError) {
        throw calcError;
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
    <Button 
      onClick={createTestProperty}
      className="bg-orange-600 hover:bg-orange-700"
    >
      Create Test Property
    </Button>
  );
};