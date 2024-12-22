import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useVendorProfile } from "@/hooks/useVendorProfile";

export const VendorIntegrations = () => {
  const [locationId, setLocationId] = useState("");
  const [privateToken, setPrivateToken] = useState("");
  const { toast } = useToast();
  const { vendorProfile } = useVendorProfile();

  const handleSaveIntegration = async () => {
    try {
      const { error } = await supabase
        .from('vendor_integrations')
        .upsert({
          platform: 'gohighlevel',
          location_id: locationId,
          private_token: privateToken,
          vendor_id: vendorProfile?.id
        });

      if (error) throw error;

      toast({
        title: "Integration saved",
        description: "Your GoHighLevel integration has been updated successfully."
      });
    } catch (error) {
      toast({
        title: "Error saving integration",
        description: "There was a problem saving your integration settings.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-4">Integrations</h2>
        <p className="text-muted-foreground">
          Connect your GoHighLevel account and help us prioritize new features.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>GoHighLevel Integration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="locationId" className="text-sm font-medium">
              Location ID
            </label>
            <Input
              id="locationId"
              value={locationId}
              onChange={(e) => setLocationId(e.target.value)}
              placeholder="Enter your GoHighLevel Location ID"
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="privateToken" className="text-sm font-medium">
              Private Integration Token
            </label>
            <Input
              id="privateToken"
              type="password"
              value={privateToken}
              onChange={(e) => setPrivateToken(e.target.value)}
              placeholder="Enter your Private Integration Token"
            />
          </div>

          <Button onClick={handleSaveIntegration}>
            Save Integration Settings
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default VendorIntegrations;