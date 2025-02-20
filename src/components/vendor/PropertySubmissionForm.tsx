import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

interface PropertySubmissionFormProps {
  onSuccess?: () => void;
}

export const PropertySubmissionForm = ({ onSuccess }: PropertySubmissionFormProps) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    address: "",
    city: "",
    state: "",
    zipCode: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // First geocode the address
      const { data: coordinates, error: geocodeError } = await supabase.functions.invoke(
        'geocode-address',
        {
          body: formData
        }
      );

      if (geocodeError) throw geocodeError;

      // Get the current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;

      if (!user) {
        throw new Error("You must be logged in to submit a property");
      }

      // Insert the property
      const { data: property, error: insertError } = await supabase
        .from("properties")
        .insert({
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zip_code: formData.zipCode,
          latitude: coordinates.latitude,
          longitude: coordinates.longitude,
          user_id: user.id,
          vendor_id: user.id // Since this is in the vendor portal
        })
        .select()
        .single();

      if (insertError) throw insertError;

      toast({
        title: "Success",
        description: "Property submitted successfully. ID: " + property.id,
      });

      // Reset form
      setFormData({
        address: "",
        city: "",
        state: "",
        zipCode: "",
      });

      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      console.error("Error submitting property:", error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="address">Street Address</Label>
          <Input
            id="address"
            value={formData.address}
            onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
            required
            placeholder="123 Main St"
          />
        </div>

        <div>
          <Label htmlFor="city">City</Label>
          <Input
            id="city"
            value={formData.city}
            onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
            required
            placeholder="San Francisco"
          />
        </div>

        <div>
          <Label htmlFor="state">State</Label>
          <Input
            id="state"
            value={formData.state}
            onChange={(e) => setFormData(prev => ({ ...prev, state: e.target.value }))}
            required
            placeholder="CA"
          />
        </div>

        <div>
          <Label htmlFor="zipCode">ZIP Code</Label>
          <Input
            id="zipCode"
            value={formData.zipCode}
            onChange={(e) => setFormData(prev => ({ ...prev, zipCode: e.target.value }))}
            required
            placeholder="94105"
          />
        </div>

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : (
            "Submit Property"
          )}
        </Button>
      </form>
    </Card>
  );
};