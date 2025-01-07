import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const SOLAR_SPECIALTIES = [
  "Residential",
  "Commercial",
  "Industrial",
  "Community Solar",
  "Solar Farms",
  "Off-Grid Systems",
];

const VendorBranding = ({ vendorProfile }: { vendorProfile: any }) => {
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [primaryColor, setPrimaryColor] = useState(vendorProfile?.primary_color || "#C84B31");
  const [secondaryColor, setSecondaryColor] = useState(vendorProfile?.secondary_color || "#FFAA5A");
  const [websiteUrl, setWebsiteUrl] = useState(vendorProfile?.website_url || "");
  const [businessAddress, setBusinessAddress] = useState(vendorProfile?.business_address || "");
  const [phone, setPhone] = useState(vendorProfile?.phone || "");
  const [solarSpecialties, setSolarSpecialties] = useState<string[]>(vendorProfile?.solar_specialties || []);
  const [businessDescription, setBusinessDescription] = useState(vendorProfile?.business_description || "");
  const [yearEstablished, setYearEstablished] = useState(vendorProfile?.year_established || "");
  const [serviceRegions, setServiceRegions] = useState<string[]>(vendorProfile?.service_regions || []);

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
          website_url: websiteUrl,
          business_address: businessAddress,
          phone: phone,
          solar_specialties: solarSpecialties,
          business_description: businessDescription,
          year_established: yearEstablished ? parseInt(yearEstablished) : null,
          service_regions: serviceRegions,
        })
        .eq("id", vendorProfile.id);

      if (error) throw error;

      toast({
        title: "Profile updated successfully",
        description: "Your company information has been updated.",
      });
    } catch (error: any) {
      toast({
        title: "Error updating profile",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleSpecialtyToggle = (specialty: string) => {
    setSolarSpecialties(current => 
      current.includes(specialty)
        ? current.filter(s => s !== specialty)
        : [...current, specialty]
    );
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-4">Branding & Company Information</h2>
        <p className="text-muted-foreground mb-6">
          Customize your brand appearance and update your company information.
        </p>
      </div>

      <div className="space-y-6">
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

        <div className="space-y-4">
          <div>
            <Label>Website URL</Label>
            <Input
              type="url"
              value={websiteUrl}
              onChange={(e) => setWebsiteUrl(e.target.value)}
              placeholder="https://example.com"
              className="mt-2"
            />
          </div>

          <div>
            <Label>Business Address</Label>
            <Input
              type="text"
              value={businessAddress}
              onChange={(e) => setBusinessAddress(e.target.value)}
              placeholder="123 Solar Street, City, State, ZIP"
              className="mt-2"
            />
          </div>

          <div>
            <Label>Phone Number</Label>
            <Input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="(555) 123-4567"
              className="mt-2"
            />
          </div>

          <div>
            <Label>Year Established</Label>
            <Input
              type="number"
              value={yearEstablished}
              onChange={(e) => setYearEstablished(e.target.value)}
              placeholder="2024"
              min="1900"
              max={new Date().getFullYear()}
              className="mt-2"
            />
          </div>

          <div>
            <Label>Business Description</Label>
            <Textarea
              value={businessDescription}
              onChange={(e) => setBusinessDescription(e.target.value)}
              placeholder="Tell us about your company..."
              className="mt-2"
              rows={4}
            />
          </div>

          <div>
            <Label>Solar Specialties</Label>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {SOLAR_SPECIALTIES.map((specialty) => (
                <Button
                  key={specialty}
                  type="button"
                  variant={solarSpecialties.includes(specialty) ? "default" : "outline"}
                  onClick={() => handleSpecialtyToggle(specialty)}
                  className="justify-start"
                >
                  {specialty}
                </Button>
              ))}
            </div>
          </div>

          <div>
            <Label>Service Regions</Label>
            <Input
              type="text"
              value={serviceRegions.join(", ")}
              onChange={(e) => setServiceRegions(e.target.value.split(",").map(r => r.trim()).filter(Boolean))}
              placeholder="Enter regions separated by commas"
              className="mt-2"
            />
          </div>
        </div>

        <Button onClick={handleColorUpdate} className="mt-6">
          Save Changes
        </Button>
      </div>
    </div>
  );
};

export default VendorBranding;