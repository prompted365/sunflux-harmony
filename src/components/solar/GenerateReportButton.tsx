import { Button } from "@/components/ui/button";
import { Loader2, FileText } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface GenerateReportButtonProps {
  calculationId: string;
}

const GenerateReportButton = ({ calculationId }: GenerateReportButtonProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const handleGenerateReport = async () => {
    try {
      setIsGenerating(true);
      
      const { data, error } = await supabase.functions.invoke('generate-report', {
        body: { calculationId }
      });

      if (error) throw error;

      window.open(data.downloadUrl, '_blank');

      toast({
        title: "Success",
        description: "Report generated successfully",
      });
    } catch (error) {
      console.error('Report generation error:', error);
      toast({
        title: "Error",
        description: "Failed to generate report",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Button
      onClick={handleGenerateReport}
      disabled={isGenerating}
      className="w-full"
    >
      {isGenerating ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Generating Report...
        </>
      ) : (
        <>
          <FileText className="mr-2 h-4 w-4" />
          Generate PDF Report
        </>
      )}
    </Button>
  );
};

export default GenerateReportButton;