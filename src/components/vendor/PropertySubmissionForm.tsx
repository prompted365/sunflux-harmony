import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import PlaceAutocomplete from "../property/PlaceAutocomplete";

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
    latitude: null as number | null,
    longitude: null as number | null,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
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
          latitude: formData.latitude,
          longitude: formData.longitude,
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
        latitude: null,
        longitude: null,
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

  const handlePlaceSelect = (place: {
    address: string;
    city: string;
    state: string;
    zipCode: string;
    latitude?: number;
    longitude?: number;
  }) => {
    setFormData({
      ...formData,
      address: place.address,
      city: place.city,
      state: place.state,
      zipCode: place.zipCode,
      latitude: place.latitude || null,
      longitude: place.longitude || null,
    });
  };

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="address">Property Address</Label>
          <PlaceAutocomplete
            onPlaceSelect={handlePlaceSelect}
            placeholder="Enter the property address"
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