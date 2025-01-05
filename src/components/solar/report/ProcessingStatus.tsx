import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Loader2 } from "lucide-react";

interface ProcessingStatusProps {
  status: 'pending' | 'processing' | 'completed' | 'failed';
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
        <AlertCircle className="h-4 w-4" />
      )}
      <AlertDescription>
        {error ? error : 
          status === 'processing' ? 
            'Processing solar analysis...' : 
            'Waiting to start processing...'}
      </AlertDescription>
    </Alert>
  );
};

export default ProcessingStatus;