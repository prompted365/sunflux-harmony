import { useQuery } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, FileText, Sun, Wind, Ruler, DollarSign } from "lucide-react";
import { Property } from "../types";
import { Badge } from "@/components/ui/badge";
import ImageryTab from "./ImageryTab";
import { supabase } from "@/integrations/supabase/client";
import { calculateOptimalPanelCount } from "./utils/optimalPanelCalculations";
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
  
  // Calculate optimal panel configuration
  const optimalConfig = calculateOptimalPanelCount(buildingInsights);
  
  // Calculate roof segment summaries
  const roofSegments = solarPotential?.roofSegmentStats || [];
  const segmentCount = roofSegments.length;
  
  const averagePitch = roofSegments.reduce((acc, segment) => 
    acc + segment.pitchDegrees, 0) / segmentCount;
    
  const averageHeight = roofSegments.reduce((acc, segment) => 
    acc + segment.planeHeightAtCenterMeters, 0) / segmentCount;
    
  const pitchVariance = roofSegments.reduce((acc, segment) => 
    acc + Math.pow(segment.pitchDegrees - averagePitch, 2), 0) / segmentCount;
  
  const pitchConsistencyRating = pitchVariance < 5 ? "High" : 
    pitchVariance < 15 ? "Medium" : "Low";

  // Determine orientation distribution
  const orientations = roofSegments.reduce((acc, segment) => {
    const azimuth = segment.azimuthDegrees;
    if (azimuth > 315 || azimuth <= 45) acc.north++;
    else if (azimuth > 45 && azimuth <= 135) acc.east++;
    else if (azimuth > 135 && azimuth <= 225) acc.south++;
    else acc.west++;
    return acc;
  }, { north: 0, east: 0, south: 0, west: 0 });

  const optimalOrientation = Object.entries(orientations)
    .reduce((a, b) => a[1] > b[1] ? a : b)[0];

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
              <h3 className="font-semibold">Optimal System</h3>
              <p className="text-2xl font-bold">{optimalConfig.panelCount} Panels</p>
              <p className="text-sm text-muted-foreground">
                {optimalConfig.systemSizeKw.toFixed(1)} kW System
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                ({solarPotential.maxArrayPanelsCount - optimalConfig.panelCount} additional possible)
              </p>
            </Card>
            
            <Card className="p-6">
              <DollarSign className="h-8 w-8 text-green-500 mb-2" />
              <h3 className="font-semibold">Financial Impact</h3>
              <p className="text-2xl font-bold">
                ${optimalConfig.installationCost.toLocaleString('en-US', { maximumFractionDigits: 0 })}
              </p>
              <p className="text-sm text-muted-foreground">
                {optimalConfig.paybackPeriod.toFixed(1)} Year Payback
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {optimalConfig.monthlyBillOffset.toFixed(0)}% Bill Offset
              </p>
            </Card>
            
            <Card className="p-6">
              <Wind className="h-8 w-8 text-blue-500 mb-2" />
              <h3 className="font-semibold">Annual Production</h3>
              <p className="text-2xl font-bold">
                {optimalConfig.annualProduction.toLocaleString()} kWh
              </p>
              <p className="text-sm text-muted-foreground">
                Optimal Energy Generation
              </p>
            </Card>
          </div>

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
        </TabsContent>

        <TabsContent value="imagery">
          <ImageryTab propertyId={propertyId} />
        </TabsContent>

        <TabsContent value="analysis">
          <Card className="p-6 mb-6">
            <h3 className="font-semibold mb-4">Building Analysis Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">Roof Complexity</p>
                <p className="font-medium">{segmentCount} Segments</p>
                <p className="text-xs text-gray-500 mt-1">
                  Pitch Consistency: {pitchConsistencyRating}
                </p>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">Average Measurements</p>
                <p className="font-medium">{averagePitch.toFixed(1)}° Pitch</p>
                <p className="text-xs text-gray-500 mt-1">
                  {averageHeight.toFixed(1)}m Height
                </p>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">Optimal Orientation</p>
                <p className="font-medium capitalize">{optimalOrientation}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {orientations.south} South-facing segments
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold mb-4">Roof Segment Analysis</h3>
            <div className="space-y-4">
              {solarPotential.roofSegmentStats.slice(0, 6).map((segment: any, index: number) => (
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
              {solarPotential.roofSegmentStats.length > 6 && (
                <p className="text-sm text-muted-foreground text-center">
                  +{solarPotential.roofSegmentStats.length - 6} more segments
                </p>
              )}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
