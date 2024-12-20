import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, FileText, Mail } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface GenerateReportButtonProps {
  calculationId: string;
}

const GenerateReportButton = ({ calculationId }: GenerateReportButtonProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [email, setEmail] = useState("");
  const { toast } = useToast();

  const handleGenerateReport = async () => {
    try {
      setIsGenerating(true);
      
      const { data, error } = await supabase.functions.invoke('generate-report', {
        body: { calculationId }
      });

      if (error) throw error;

      if (data?.reportUrl) {
        const newWindow = window.open('', '_blank');
        if (newWindow) {
          newWindow.location.href = data.reportUrl;
        }
      } else {
        throw new Error('No report URL returned');
      }

      toast({
        title: "Success",
        description: "PDF Report generated successfully",
      });
    } catch (error) {
      console.error('Report generation error:', error);
      toast({
        title: "Error",
        description: "Failed to generate PDF report",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSendEmail = async () => {
    if (!email) {
      toast({
        title: "Error",
        description: "Please enter an email address",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSending(true);
      
      const { data, error } = await supabase.functions.invoke('send-report', {
        body: { 
          calculationId,
          email 
        }
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Report sent to your email successfully",
      });
      
      setEmail(""); // Clear email after successful send
    } catch (error) {
      console.error('Email sending error:', error);
      toast({
        title: "Error",
        description: "Failed to send report email",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="space-y-4">
      <Button
        onClick={handleGenerateReport}
        disabled={isGenerating}
        className="w-full"
      >
        {isGenerating ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Generating PDF...
          </>
        ) : (
          <>
            <FileText className="mr-2 h-4 w-4" />
            Generate PDF Report
          </>
        )}
      </Button>

      <div className="flex gap-2">
        <Input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1"
        />
        <Button
          onClick={handleSendEmail}
          disabled={isSending || !email}
          variant="secondary"
        >
          {isSending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sending...
            </>
          ) : (
            <>
              <Mail className="mr-2 h-4 w-4" />
              Email Report
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default GenerateReportButton;