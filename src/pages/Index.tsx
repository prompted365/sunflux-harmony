
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
    const checkUserStatus = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          navigate("/login");
          return;
        }

        // Get user profile
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          navigate("/login");
          return;
        }

        // Check if user is a vendor
        const { data: vendorProfile, error: vendorError } = await supabase
          .from('vendor_profiles')
          .select('id')
          .eq('id', user.id)
          .single();

        if (vendorError && vendorError.code !== 'PGRST116') {
          console.error("Error checking vendor status:", vendorError);
          return;
        }

        if (vendorProfile) {
          // User is a vendor, redirect to vendor portal
          navigate("/vendor");
          return;
        }

        // If not a vendor, check for properties
        const { data: properties, error: propertiesError } = await supabase
          .from('properties')
          .select('id')
          .eq('user_id', user.id)
          .limit(1);

        if (propertiesError) {
          console.error("Error checking properties:", propertiesError);
          return;
        }

        setHasProperties(properties && properties.length > 0);
      } catch (error) {
        console.error("Error in checkUserStatus:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkUserStatus();
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
