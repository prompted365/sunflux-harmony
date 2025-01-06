import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { QueryClient } from "@tanstack/react-query";

export const useImageryUpdates = (propertyId: string, queryClient: QueryClient) => {
  const { toast } = useToast();

  useEffect(() => {
    if (!propertyId) return;

    const channel = supabase
      .channel('imagery-updates')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'properties',
          filter: `id=eq.${propertyId}`,
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['property-imagery', propertyId] });
          toast({
            title: "New imagery available",
            description: "Solar analysis images have been updated.",
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [propertyId, queryClient, toast]);
};