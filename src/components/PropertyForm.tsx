import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

const PropertyForm = () => {
  const [loading, setLoading] = useState(false);
  const [calculating, setCalculating] = useState(false);
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
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Error",
          description: "You must be logged in to submit a property",
          variant: "destructive",
        });
        return;
      }

      const { data: property, error } = await supabase.from("properties").insert({
        user_id: user.id,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zip_code: formData.zipCode,
      }).select().single();

      if (error) throw error;

      toast({
        title: "Success",
        description: "Property submitted successfully",
      });

      // Trigger solar calculation
      await calculateSolar(property.id);

      setFormData({
        address: "",
        city: "",
        state: "",
        zipCode: "",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit property",
        variant: "destructive",
      });
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
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to initiate solar calculation",
        variant: "destructive",
      });
    } finally {
      setCalculating(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-xl p-8 animate-roll-down origin-top">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Submit Property</h2>
        <p className="text-gray-600 mt-2">Enter the property details below to get started</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
            Street Address
          </label>
          <Input
            id="address"
            type="text"
            required
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            className="w-full"
            placeholder="123 Solar Street"
          />
        </div>
        
        <div>
          <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
            City
          </label>
          <Input
            id="city"
            type="text"
            required
            value={formData.city}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            className="w-full"
            placeholder="Sunnyville"
          />
        </div>
        
        <div>
          <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
            State
          </label>
          <Input
            id="state"
            type="text"
            required
            value={formData.state}
            onChange={(e) => setFormData({ ...formData, state: e.target.value })}
            className="w-full"
            placeholder="CA"
          />
        </div>
        
        <div>
          <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-1">
            ZIP Code
          </label>
          <Input
            id="zipCode"
            type="text"
            required
            value={formData.zipCode}
            onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
            className="w-full"
            placeholder="12345"
          />
        </div>

        <Button 
          type="submit" 
          className="w-full bg-primary hover:bg-primary/90 py-6 text-lg"
          disabled={loading || calculating}
        >
          {loading ? "Submitting..." : calculating ? "Calculating Solar Potential..." : "Submit Property"}
        </Button>
      </form>
    </div>
  );
};

export default PropertyForm;