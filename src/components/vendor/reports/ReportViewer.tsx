import { useQuery } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Property } from "../types";
import { Badge } from "@/components/ui/badge";
import ImageryTab from "./ImageryTab";
import { supabase } from "@/integrations/supabase/client";
import { calculateOptimalPanelCount } from "./utils/optimalPanelCalculations";
import OverviewMetrics from "./sections/OverviewMetrics";
import ProductionChart from "./sections/ProductionChart";
import MonthlyFluxVisualization from "./sections/MonthlyFluxVisualization";
import BuildingAnalysis from "./sections/BuildingAnalysis";

interface ReportViewerProps {
  propertyId: string;
}

export const ReportViewer = ({ propertyId }: ReportViewerProps) => {
  const { data: property, isLoading, error } = useQuery({
    queryKey: ['property', propertyId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("properties")
        .select("*")
        .eq("id", propertyId)
        .single();

      if (error) throw error;
      return data as Property;
    }
  });

  if (isLoading) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>Loading property data...</AlertDescription>
      </Alert>
    );
  }

  if (error || !property) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>Failed to load property data.</AlertDescription>
      </Alert>
    );
  }

  const buildingInsights = property.building_insights_jsonb;
  if (!buildingInsights) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          No building insights data available for this property.
        </AlertDescription>
      </Alert>
    );
  }

  const solarPotential = buildingInsights.solarPotential;
  const optimalConfig = calculateOptimalPanelCount(buildingInsights);

  // Generate monthly production data with regional averages
  const monthlyProductionData = Array.from({ length: 12 }, (_, index) => {
    const month = new Date(2024, index).toLocaleString('default', { month: 'short' });
    const baseProduction = optimalConfig.annualProduction / 12;
    
    // Apply seasonal variations
    const seasonalFactor = Math.cos((index - 6) * Math.PI / 6);
    const production = baseProduction * (1 + seasonalFactor * 0.3);
    
    // Generate comparative data (regional average)
    const average = baseProduction * (1 + seasonalFactor * 0.25);

    return {
      month,
      production,
      average,
    };
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">
          Solar Analysis Report
          <Badge variant="outline" className="ml-2">
            {buildingInsights.imageryQuality}
          </Badge>
        </h2>
      </div>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="imagery">Solar Imagery</TabsTrigger>
          <TabsTrigger value="analysis">Detailed Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <OverviewMetrics 
            solarPotential={solarPotential}
            optimalConfig={optimalConfig}
          />
          <ProductionChart monthlyProduction={monthlyProductionData} />
          <MonthlyFluxVisualization propertyId={propertyId} />
        </TabsContent>

        <TabsContent value="imagery">
          <ImageryTab propertyId={propertyId} />
        </TabsContent>

        <TabsContent value="analysis">
          <BuildingAnalysis solarPotential={solarPotential} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReportViewer;