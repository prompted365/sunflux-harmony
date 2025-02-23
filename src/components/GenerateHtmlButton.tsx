import { Button } from "@/components/ui/button";
import { Loader2, FileText } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface GenerateHtmlButtonProps {
  htmlContent: string;
  filename: string;
}

const GenerateHtmlButton = ({ htmlContent, filename }: GenerateHtmlButtonProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const handleGenerateHtml = async () => {
    try {
      setIsGenerating(true);
      
      const { data, error } = await supabase.functions.invoke('generate-html', {
        body: { htmlContent, filename }
      });

      if (error) throw error;

      if (data?.downloadUrl) {
        window.open(data.downloadUrl, '_blank');
      } else {
        throw new Error('No download URL returned');
      }

      toast({
        title: "Success",
        description: "HTML file generated successfully",
      });
    } catch (error) {
      console.error('HTML generation error:', error);
      toast({
        title: "Error",
        description: "Failed to generate HTML file",
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