import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";

interface ProcessingStatusProps {
  status: string;
  error?: string | null;
}

const ProcessingStatus = ({ status, error }: ProcessingStatusProps) => {
  if (status === 'completed') return null;

  return (
    <Alert variant={error ? "destructive" : "default"}>
      {error ? (
        <AlertCircle className="h-4 w-4" />
      ) : status === 'processing' ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <CheckCircle2 className="h-4 w-4" />
      )}
      <AlertTitle>
        {error ? 'Processing Error' : 
         status === 'processing' ? 'Processing Solar Analysis' : 
         'Analysis Pending'}
      </AlertTitle>
      <AlertDescription>
        {error || 
         status === 'processing' ? 'Your solar analysis is being processed. This may take a few minutes.' :
         'Your analysis is queued for processing.'}
      </AlertDescription>
    </Alert>
  );
};

export default ProcessingStatus;