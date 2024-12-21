import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const VendorBranding = ({ vendorProfile }: { vendorProfile: any }) => {
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [primaryColor, setPrimaryColor] = useState(vendorProfile?.primary_color || "#C84B31");
  const [secondaryColor, setSecondaryColor] = useState(vendorProfile?.secondary_color || "#FFAA5A");

  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      const file = event.target.files?.[0];
      if (!file) return;

      const fileExt = file.name.split(".").pop();
      const filePath = `${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("vendor-logos")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("vendor-logos")
        .getPublicUrl(filePath);

      const { error: updateError } = await supabase
        .from("vendor_profiles")
        .update({ logo_url: publicUrl })
        .eq("id", vendorProfile.id);

      if (updateError) throw updateError;

      toast({
        title: "Logo uploaded successfully",
        description: "Your logo has been updated.",
      });
    } catch (error: any) {
      toast({
        title: "Error uploading logo",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleColorUpdate = async () => {
    try {
      const { error } = await supabase
        .from("vendor_profiles")
        .update({
          primary_color: primaryColor,
          secondary_color: secondaryColor,
        })
        .eq("id", vendorProfile.id);

      if (error) throw error;

      toast({
        title: "Colors updated successfully",
        description: "Your brand colors have been updated.",
      });
    } catch (error: any) {
      toast({
        title: "Error updating colors",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-4">Branding Settings</h2>
        <p className="text-muted-foreground mb-6">
          Customize your brand appearance with your logo and colors.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <Label>Company Logo</Label>
          <div className="mt-2">
            {vendorProfile?.logo_url && (
              <img
                src={vendorProfile.logo_url}
                alt="Company Logo"
                className="w-32 h-32 object-contain mb-4 border rounded-lg"
              />
            )}
            <Input
              type="file"
              accept="image/*"
              onChange={handleLogoUpload}
              disabled={uploading}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Primary Color</Label>
            <div className="flex gap-2 mt-2">
              <Input
                type="color"
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                className="w-16 h-10"
              />
              <Input
                type="text"
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
              />
            </div>
          </div>

          <div>
            <Label>Secondary Color</Label>
            <div className="flex gap-2 mt-2">
              <Input
                type="color"
                value={secondaryColor}
                onChange={(e) => setSecondaryColor(e.target.value)}
                className="w-16 h-10"
              />
              <Input
                type="text"
                value={secondaryColor}
                onChange={(e) => setSecondaryColor(e.target.value)}
              />
            </div>
          </div>
        </div>

        <Button onClick={handleColorUpdate} className="mt-4">
          Save Colors
        </Button>
      </div>
    </div>
  );
};

export default VendorBranding;