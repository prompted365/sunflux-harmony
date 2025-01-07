import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ProcessingJob } from "@/types/database";
import ProcessingStatus from "./report/ProcessingStatus";
import { Alert, AlertDescription } from "../ui/alert";
import { AlertCircle } from "lucide-react";

interface ReportPreviewProps {
  calculationId: string;
}

const ReportPreview = ({ calculationId }: ReportPreviewProps) => {
  const [processingJob, setProcessingJob] = useState<ProcessingJob | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProcessingStatus = async () => {
      try {
        const { data, error } = await supabase
          .from('processing_jobs')
          .select('*')
          .eq('calculation_id', calculationId)
          .single();

        if (error) throw error;
        setProcessingJob(data);
      } catch (err) {
        console.error('Error fetching processing status:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch processing status');
      }
    };

    const subscription = supabase
      .channel('processing_status')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public',
        table: 'processing_jobs',
        filter: `calculation_id=eq.${calculationId}`
      }, payload => {
        setProcessingJob(payload.new as ProcessingJob);
      })
      .subscribe();

    fetchProcessingStatus();

    return () => {
      subscription.unsubscribe();
    };
  }, [calculationId]);

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <ProcessingStatus 
      status={processingJob?.status || 'pending'} 
      error={processingJob?.error_message} 
    />
  );
};

export default ReportPreview;