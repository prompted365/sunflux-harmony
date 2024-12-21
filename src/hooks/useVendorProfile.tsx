import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const useVendorProfile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [vendorProfile, setVendorProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVendorProfile = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          navigate("/login");
          return;
        }

        const { data, error } = await supabase
          .from("vendor_profiles")
          .select("*")
          .eq("id", session.user.id)
          .maybeSingle();

        if (error) {
          toast({
            title: "Error fetching vendor profile",
            description: error.message,
            variant: "destructive",
          });
          return;
        }

        // If no profile exists, create one
        if (!data) {
          const { data: newProfile, error: createError } = await supabase
            .from("vendor_profiles")
            .insert([{ id: session.user.id }])
            .select()
            .single();

          if (createError) {
            toast({
              title: "Error creating vendor profile",
              description: createError.message,
              variant: "destructive",
            });
            return;
          }

          setVendorProfile(newProfile);
        } else {
          setVendorProfile(data);
        }
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchVendorProfile();
  }, [navigate, toast]);

  return { vendorProfile, loading };
};