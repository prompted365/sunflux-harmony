import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface PropertySubmissionData {
  address: string;
  city: string;
  state: string;
  zipCode: string;
  vendor_id: string;
  lead_email?: string;
}

export const submitProperty = async (
  formData: PropertySubmissionData,
  toast: (props: { title: string; description: string; variant?: "default" | "destructive" }) => void
) => {
  try {
    // Get coordinates
    const coordinates = await geocodeAddress(formData);
    console.log("Geocoded coordinates:", coordinates);

    const { data: property, error } = await supabase.from("properties").insert({
      vendor_id: formData.vendor_id,
      address: formData.address,
      city: formData.city,
      state: formData.state,
      zip_code: formData.zipCode,
      latitude: coordinates.latitude,
      longitude: coordinates.longitude,
    }).select().single();

    if (error) throw error;

    toast({
      title: "Success",
      description: "Property submitted successfully",
    });

    return property;
  } catch (error) {
    console.error("Error submitting property:", error);
    toast({
      title: "Error",
      description: error instanceof Error ? error.message : "Failed to submit property",
      variant: "destructive",
    });
    return null;
  }
};

export const geocodeAddress = async (formData: PropertySubmissionData) => {
  const response = await supabase.functions.invoke('geocode-address', {
    body: formData
  });

  if (response.error) {
    throw new Error(response.error.message || 'Failed to geocode address');
  }

  return response.data;
};