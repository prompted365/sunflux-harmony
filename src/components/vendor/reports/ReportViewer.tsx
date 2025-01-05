import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, FileText, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import SolarMetrics from "@/components/solar/SolarMetrics";
import ROITimeline from "@/components/solar/report/ROITimeline";
import EnvironmentalImpact from "@/components/solar/report/EnvironmentalImpact";

interface ReportViewerProps {
  property: any;
}

const ReportViewer = ({ property }: ReportViewerProps) => {
  const { data: images } = useQuery({
    queryKey: ['property-images', property?.id],
    enabled: !!property?.id,
    queryFn: async () => {
      const { data: imageUrls, error } = await supabase
        .storage
        .from('property-images')
        .createSignedUrls([
          `${property.id}/rgb.png`,
          `${property.id}/annual_flux.png`,
          `${property.id}/monthly_analysis.gif`,
          `${property.id}/shadow_analysis.gif`
        ], 3600);

      if (error) throw error;
      return imageUrls;
    },
  });

  // Fetch HTML report URL
  const { data: report } = useQuery({
    queryKey: ['property-report', property?.id],
    enabled: !!property?.id && !!property.solar_calculations?.[0]?.id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('reports')
        .select('*')
        .eq('calculation_id', property.solar_calculations[0].id)
        .maybeSingle();

      if (error) throw error;
      
      if (data) {
        const { data: { signedUrl }, error: urlError } = await supabase
          .storage
          .from('reports')
          .createSignedUrl(data.file_path, 3600);
          
        if (urlError) throw urlError;
        return { ...data, signedUrl };
      }
      return null;
    },
  });

  const calculation = property?.solar_calculations?.[0];
  
  if (!calculation) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          No solar calculation data available for this property.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">
        Solar Analysis Report
        <span className="ml-2 text-sm font-normal text-muted-foreground">
          {property.address}
        </span>
      </h2>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="imagery">Solar Imagery</TabsTrigger>
          <TabsTrigger value="analysis">Detailed Analysis</TabsTrigger>
          {report && <TabsTrigger value="report">Full Report</TabsTrigger>}
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Card className="p-6">
            <SolarMetrics calc={calculation} />
          </Card>
          
          <ROITimeline 
            calc={calculation}
            financialConfig={{
              monthlyBill: 200,
              energyCostPerKwh: 0.15,
              isUsingDefaults: true
            }}
          />
        </TabsContent>

        <TabsContent value="imagery" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {images?.map((image, index) => (
              <Card key={index} className="overflow-hidden">
                <div className="aspect-video relative">
                  <img
                    src={image.signedUrl}
                    alt={`Solar analysis visualization ${index + 1}`}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analysis" className="space-y-6">
          <Card className="p-6">
            <EnvironmentalImpact calc={calculation} />
          </Card>
        </TabsContent>

        {report && (
          <TabsContent value="report" className="space-y-6">
            <div className="flex justify-end space-x-4 mb-4">
              <Button variant="outline" onClick={() => window.open(report.signedUrl, '_blank')}>
                <FileText className="h-4 w-4 mr-2" />
                View Full Page
              </Button>
              <Button onClick={() => window.open(report.signedUrl.replace('/html/', '/pdf/'), '_blank')}>
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
            </div>
            <Card className="overflow-hidden">
              <iframe
                src={report.signedUrl}
                className="w-full h-[800px] border-0"
                title="Solar Installation Report"
              />
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default ReportViewer;