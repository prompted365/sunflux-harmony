import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, FileText, Download, Sun, Wind, Ruler, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Property } from "../types";
import { Badge } from "@/components/ui/badge";
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
  property: Property | undefined;
}

const ReportViewer = ({ property }: ReportViewerProps) => {
  // Fetch property images with signed URLs
  const { data: images } = useQuery({
    queryKey: ['property-images', property?.id],
    enabled: !!property?.id,
    queryFn: async () => {
      const timestamp = Date.now();
      const folderPath = `${property?.id}_${timestamp}`;
      
      // List all files in the property's folder
      const { data: files, error } = await supabase
        .storage
        .from('property-images')
        .list(folderPath);

      if (error) {
        console.error('Error listing files:', error);
        throw error;
      }

      // Get signed URLs for each file
      const signedUrls = await Promise.all(
        (files || []).map(async (file) => {
          const { data: { signedUrl } } = await supabase
            .storage
            .from('property-images')
            .createSignedUrl(`${folderPath}/${file.name}`, 3600);

          return {
            name: file.name,
            url: signedUrl
          };
        })
      );

      console.log('Signed URLs:', signedUrls);
      return signedUrls;
    },
  });

  const buildingInsights = property?.building_insights_jsonb;

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
        <div className="text-sm text-muted-foreground">
          <Calendar className="inline-block w-4 h-4 mr-1" />
          Imagery Date: {new Date(buildingInsights.imageryDate).toLocaleDateString()}
        </div>
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

        <TabsContent value="imagery" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {images?.map((image, index) => (
              <Card key={index} className="overflow-hidden">
                <div className="aspect-video relative">
                  <img
                    src={image.url}
                    alt={`Solar analysis visualization - ${image.name}`}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <p className="text-sm font-medium">{image.name.replace(/_/g, ' ').replace('.png', '')}</p>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analysis" className="space-y-6">
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

export default ReportViewer;