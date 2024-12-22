import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useVendorProfile } from "@/hooks/useVendorProfile";

const FEATURE_OPTIONS = [
  { id: 'contacts', label: 'Contacts' },
  { id: 'conversations', label: 'Conversations' },
  { id: 'calendars', label: 'Calendars' },
  { id: 'opportunities', label: 'Opportunities' }
] as const;

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

  const handleVoteFeature = async (featureType: string) => {
    try {
      const { error } = await supabase
        .from('integration_feature_votes')
        .insert({ 
          feature_type: featureType,
          vendor_id: vendorProfile?.id // Add vendor_id to satisfy RLS policy
        });

      if (error) throw error;

      toast({
        title: "Vote recorded",
        description: "Thanks for helping us prioritize our integration roadmap!"
      });
    } catch (error) {
      toast({
        title: "Error recording vote",
        description: "There was a problem recording your vote.",
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

      <Card>
        <CardHeader>
          <CardTitle>Feature Voting</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Which integration features would you like to see first? Your vote helps us prioritize our development roadmap.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {FEATURE_OPTIONS.map((feature) => (
              <Button
                key={feature.id}
                variant="outline"
                onClick={() => handleVoteFeature(feature.id)}
                className="w-full"
              >
                {feature.label}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VendorIntegrations;