
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import PropertyFormBottom from "@/components/PropertyFormBottom";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Loader } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  const [hasProperties, setHasProperties] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkProperties = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          navigate("/login");
          return;
        }

        // First check for properties
        const { data: properties } = await supabase
          .from('properties')
          .select('id')
          .eq('user_id', user.id)
          .limit(1);

        setHasProperties(properties && properties.length > 0);

        // Then check if user is a vendor - only redirect if they have vendor profile
        const { data: vendorProfile } = await supabase
          .from('vendor_profiles')
          .select('id')
          .eq('id', user.id)
          .maybeSingle();

        if (vendorProfile) {
          navigate("/vendor");
        }
      } catch (error) {
        console.error("Error checking properties:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkProperties();
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5">
        <Navigation />
        <div className="flex justify-center items-center min-h-[60vh] pt-24">
          <Loader className="w-8 h-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5">
      <Navigation />
      <div className="pt-24 px-4">
        {!hasProperties && (
          <PropertyFormBottom onSuccess={() => navigate("/vendor")} />
        )}
      </div>
    </div>
  );
};

export default Index;
