import { Button } from "@/components/ui/button";
import { Loader2, FileText } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface GenerateHtmlButtonProps {
  calculationId: string;
  filename?: string;
}

const GenerateHtmlButton = ({ calculationId, filename = "solar-report" }: GenerateHtmlButtonProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const handleGenerateHtml = async () => {
    try {
      setIsGenerating(true);
      
      console.log('Generating HTML for calculation:', calculationId);
      
      const { data, error } = await supabase.functions.invoke('generate-html', {
        body: { 
          calculationId,
          filename 
        }
      });

      if (error) {
        console.error('Edge function error:', error);
        throw error;
      }

      if (!data?.html) {
        throw new Error('No HTML content returned');
      }

      // Create a Blob from the HTML content
      const blob = new Blob([data.html], { type: 'text/html' });
      const url = window.URL.createObjectURL(blob);
      
      // Create a link and trigger download
      const link = document.createElement('a');
      link.href = url;
      link.download = `${filename}.html`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast({
        title: "Success",
        description: "HTML file generated successfully",
      });
    } catch (error) {
      console.error('HTML generation error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to generate HTML file",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Button
      onClick={handleGenerateHtml}
      disabled={isGenerating}
      className="w-full"
    >
      {isGenerating ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Generating HTML...
        </>
      ) : (
        <>
          <FileText className="mr-2 h-4 w-4" />
          Generate HTML File
        </>
      )}
    </Button>
  );
};

export default GenerateHtmlButton;