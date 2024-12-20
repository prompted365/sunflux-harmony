import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import AddressFields from "./property-form/AddressFields";
import ContactFields from "./property-form/ContactFields";
import SubmitButton from "./property-form/SubmitButton";

const PropertyForm = () => {
  const [loading, setLoading] = useState(false);
  const [calculating, setCalculating] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    address: "",
    city: "",
    state: "",
    zipCode: "",
    email: "",
    consentToContact: false,
  });

  const handleChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError) {
        toast({
          title: "Authentication Error",
          description: "Please sign in again to continue",
          variant: "destructive",
        });
        navigate("/login");
        return;
      }

      if (!user) {
        toast({
          title: "Error",
          description: "You must be logged in to submit a property",
          variant: "destructive",
        });
        navigate("/login");
        return;
      }

      const { data: property, error } = await supabase.from("properties").insert({
        user_id: user.id,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zip_code: formData.zipCode,
        email: formData.email,
        consent_to_contact: formData.consentToContact,
      }).select().single();

      if (error) {
        throw error;
      }

      toast({
        title: "Success",
        description: "Property submitted successfully",
      });

      await calculateSolar(property.id);

      setFormData({
        address: "",
        city: "",
        state: "",
        zipCode: "",
        email: "",
        consentToContact: false,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to submit property",
        variant: "destructive",
      });
      
      if (error.message?.includes('JWT')) {
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  const calculateSolar = async (propertyId: string) => {
    setCalculating(true);
    try {
      const { error } = await supabase.functions.invoke('calculate-solar', {
        body: { propertyId }
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Solar calculation initiated",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to initiate solar calculation",
        variant: "destructive",
      });
    } finally {
      setCalculating(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-xl p-8 animate-roll-down origin-top">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Submit Property</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <AddressFields formData={formData} onChange={handleChange} />
        <ContactFields formData={formData} onChange={handleChange} />
        <SubmitButton loading={loading} calculating={calculating} />
      </form>
    </div>
  );
};

export default PropertyForm;