import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { SignupFormData } from "./PropertyFormState";

interface LeadContactInputsProps {
  signupData: SignupFormData;
  updateSignupField: (field: keyof SignupFormData, value: any) => void;
}

export const LeadContactInputs = ({ signupData, updateSignupField }: LeadContactInputsProps) => {
  return (
    <div className="space-y-4">
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          This demo allows you to experience firsthand how our AI agents gather and process property information. 
          In regular operation, our AI handles this entire workflow automatically - you'll manage everything through 
          the vendor portal.
        </AlertDescription>
      </Alert>
      
      <div>
        <Label htmlFor="email">Lead Email</Label>
        <Input
          id="email"
          type="email"
          required
          value={signupData.email}
          onChange={(e) => updateSignupField('email', e.target.value)}
          className="w-full bg-white/80"
          placeholder="lead@email.com"
        />
      </div>
      
      <div className="flex items-center space-x-2">
        <Checkbox
          id="communicationOptIn"
          checked={signupData.communicationOptIn}
          onCheckedChange={(checked) => 
            updateSignupField('communicationOptIn', checked)
          }
        />
        <Label htmlFor="communicationOptIn">
          Lead has agreed to receive communications about their solar analysis
        </Label>
      </div>
    </div>
  );
};