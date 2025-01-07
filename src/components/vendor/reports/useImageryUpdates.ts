import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { QueryClient } from "@tanstack/react-query";

export const useImageryUpdates = (propertyId: string, queryClient: QueryClient) => {
  const { toast } = useToast();

  useEffect(() => {
    if (!propertyId) return;

    // Listen to storage changes in the property-images bucket
    const channel = supabase
      .channel('storage-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'storage',
          table: 'objects',
          filter: `path=like.${propertyId}/%`,
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