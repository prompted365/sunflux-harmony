import { supabase } from "@/integrations/supabase/client";
import { PropertyFormData } from "./PropertyFormState";
import { toast } from "@/components/ui/use-toast"; // Fixed import

export interface PropertySubmissionData extends PropertyFormData {
  vendor_id: string;
  latitude?: number;
  longitude?: number;
}

export const submitProperty = async (
  formData: PropertyFormData,
  vendor_id: string,
  toast: any
) => {
  try {
    // Get coordinates from address
    const coordinates = await geocodeAddress({
      ...formData,
      vendor_id
    });

    // Insert property with vendor_id
    const { data: property, error } = await supabase
      .from("properties")
      .insert({
        vendor_id,
        user_id: vendor_id, // Set user_id to vendor_id for now
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zip_code: formData.zipCode,
        latitude: coordinates?.latitude,
        longitude: coordinates?.longitude,
      })
      .select()
      .single();

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