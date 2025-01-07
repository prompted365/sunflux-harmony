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
    const checkExistingProperties = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          navigate("/login");
          return;
        }

        // Check if user is a vendor
        const { data: vendorProfile } = await supabase
          .from('vendor_profiles')
          .select('id')
          .eq('id', user.id)
          .single();

        if (vendorProfile) {
          navigate("/vendor");
          return;
        }

        const { data: properties } = await supabase
          .from('properties')
          .select('id')
          .eq('user_id', user.id)
          .limit(1);

        setHasProperties(properties && properties.length > 0);
      } catch (error) {
        console.error("Error checking properties:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkExistingProperties();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5">
      <Navigation />
      <div className="pt-24 px-4">
        {isLoading ? (
          <div className="flex justify-center items-center min-h-[60vh]">
            <Loader className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          !hasProperties && (
            <PropertyFormBottom onSuccess={() => navigate("/vendor")} />
          )
        )}
      </div>
    </div>
  );
};

export default Index;