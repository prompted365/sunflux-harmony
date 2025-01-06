import { useQuery } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, FileText, Sun, Wind, Ruler } from "lucide-react";
import { Property } from "../types";
import { Badge } from "@/components/ui/badge";
import ImageryTab from "./ImageryTab";
import { supabase } from "@/integrations/supabase/client";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

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
        <AlertDescription>
          Loading property data...
        </AlertDescription>
      </Alert>
    );
  }

  if (error || !property) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Failed to load property data.
        </AlertDescription>
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
  
  // Generate monthly production data for the chart
  const monthlyProductionData = solarPotential?.solarPanelConfigs?.[0]?.roofSegmentSummaries.map((segment: any, index: number) => ({
    month: new Date(2024, index).toLocaleString('default', { month: 'short' }),
    production: segment.yearlyEnergyDcKwh / 12
  })) || [];

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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-6">
              <Sun className="h-8 w-8 text-yellow-500 mb-2" />
              <h3 className="font-semibold">Maximum Panel Count</h3>
              <p className="text-2xl font-bold">{solarPotential.maxArrayPanelsCount}</p>
            </Card>
            
            <Card className="p-6">
              <Ruler className="h-8 w-8 text-blue-500 mb-2" />
              <h3 className="font-semibold">Array Area</h3>
              <p className="text-2xl font-bold">{solarPotential.maxArrayAreaMeters2.toFixed(1)} m²</p>
            </Card>
            
            <Card className="p-6">
              <Wind className="h-8 w-8 text-green-500 mb-2" />
              <h3 className="font-semibold">Annual Sunshine</h3>
              <p className="text-2xl font-bold">{solarPotential.maxSunshineHoursPerYear.toFixed(0)} hours</p>
            </Card>
          </div>

          <Card className="p-6">
            <h3 className="font-semibold mb-4">Estimated Monthly Production</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyProductionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="production" 
                    stroke="#2563eb" 
                    name="kWh"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="imagery">
          <ImageryTab propertyId={propertyId} />
        </TabsContent>

        <TabsContent value="analysis">
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Roof Segment Analysis</h3>
            <div className="space-y-4">
              {solarPotential.roofSegmentStats.map((segment: any, index: number) => (
                <div key={index} className="border-b pb-4">
                  <h4 className="font-medium">Segment {index + 1}</h4>
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    <div>
                      <p className="text-sm text-muted-foreground">Area</p>
                      <p className="font-medium">{segment.stats.areaMeters2.toFixed(1)} m²</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Pitch</p>
                      <p className="font-medium">{segment.pitchDegrees.toFixed(1)}°</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Azimuth</p>
                      <p className="font-medium">{segment.azimuthDegrees.toFixed(1)}°</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Height</p>
                      <p className="font-medium">{segment.planeHeightAtCenterMeters.toFixed(1)} m</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};