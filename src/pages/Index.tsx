import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import PropertyFormBottom from "@/components/PropertyFormBottom";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();
  const [hasProperties, setHasProperties] = useState<boolean | null>(null);

  useEffect(() => {
    const checkExistingProperties = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: properties } = await supabase
        .from('properties')
        .select('id')
        .eq('user_id', user.id)
        .limit(1);

      setHasProperties(properties && properties.length > 0);
    };

    checkExistingProperties();
  }, []);

  if (hasProperties === null) {
    return null; // Loading state
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 pt-24 px-4">
      {!hasProperties && (
        <PropertyFormBottom onSuccess={() => navigate("/vendor")} />
      )}
    </div>
  );
};

export default Index;