import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export const LoadingAlert = () => (
  <Alert>
    <AlertCircle className="h-4 w-4" />
    <AlertDescription>
      Loading property data...
    </AlertDescription>
  </Alert>
);