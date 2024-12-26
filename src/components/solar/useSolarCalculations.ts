import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { SolarCalculation } from "./types/calculations";
import { Json } from "@/integrations/supabase/types";

export const useSolarCalculations = () => {
  const [calculations, setCalculations] = useState<SolarCalculation[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const transformDatabaseCalculation = (calc: any): SolarCalculation => {
    return {
      id: calc.id,
      status: calc.status,
      system_size: calc.system_size,
      irradiance_data: calc.irradiance_data as SolarCalculation['irradiance_data'],
      panel_layout: calc.panel_layout as SolarCalculation['panel_layout'],
      estimated_production: calc.estimated_production as SolarCalculation['estimated_production'],
      financial_analysis: calc.financial_analysis as SolarCalculation['financial_analysis'],
      building_specs: calc.building_specs as SolarCalculation['building_specs'],
      property: calc.properties ? {
        address: calc.properties.address,
        city: calc.properties.city,
        state: calc.properties.state,
        zip_code: calc.properties.zip_code
      } : null
    };
  };

  const fetchCalculations = async () => {
    try {
      const { data, error } = await supabase
        .from('solar_calculations')
        .select(`
          id,
          status,
          system_size,
          irradiance_data,
          panel_layout,
          estimated_production,
          financial_analysis,
          building_specs,
          properties (
            address,
            city,
            state,
            zip_code
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const transformedData = (data || []).map(transformDatabaseCalculation);
      setCalculations(transformedData);
    } catch (error) {
      console.error('Error fetching calculations:', error);
      toast({
        title: "Error",
        description: "Failed to fetch solar calculations",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCalculations();

    // Subscribe to real-time updates
    const channel = supabase
      .channel('solar_calculations_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'solar_calculations'
        },
        async (payload) => {
          console.log('Change received!', payload);
          if (payload.eventType === 'DELETE') {
            setCalculations(prev => prev.filter(calc => calc.id !== payload.old.id));
          } else {
            // For INSERT and UPDATE, fetch the complete record with property data
            const { data, error } = await supabase
              .from('solar_calculations')
              .select(`
                id,
                status,
                system_size,
                irradiance_data,
                panel_layout,
                estimated_production,
                financial_analysis,
                building_specs,
                properties (
                  address,
                  city,
                  state,
                  zip_code
                )
              `)
              .eq('id', payload.new.id)
              .single();

            if (!error && data) {
              const transformedCalc = transformDatabaseCalculation(data);
              setCalculations(prev => {
                const index = prev.findIndex(calc => calc.id === transformedCalc.id);
                if (index >= 0) {
                  const newCalcs = [...prev];
                  newCalcs[index] = transformedCalc;
                  return newCalcs;
                }
                return [transformedCalc, ...prev];
              });
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { calculations, loading };
};