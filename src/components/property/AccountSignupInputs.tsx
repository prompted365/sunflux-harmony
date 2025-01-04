import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface AccountSignupInputsProps {
  signupData: {
    email: string;
    password: string;
    communicationOptIn: boolean;
    termsAccepted: boolean;
  };
  updateSignupField: (field: string, value: any) => void;
}

export const AccountSignupInputs = ({ signupData, updateSignupField }: AccountSignupInputsProps) => {
  return (
    <Card className="p-6">
      <div className="space-y-4">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            This demo allows you to experience firsthand how our AI agents gather and process property information. 
            In regular operation, our AI handles this entire workflow automatically - you'll manage everything through 
            the vendor portal.
          </AlertDescription>
        </Alert>
        
        <h3 className="text-lg font-semibold mb-4">Create Your Vendor Account</h3>
        <div className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              required
              value={signupData.email}
              onChange={(e) => updateSignupField('email', e.target.value)}
              className="w-full bg-white/80"
              placeholder="your@email.com"
            />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              required
              value={signupData.password}
              onChange={(e) => updateSignupField('password', e.target.value)}
              className="w-full bg-white/80"
              placeholder="Choose a secure password"
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
              I'd like to receive product updates and feature announcements
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="termsAccepted"
              required
              checked={signupData.termsAccepted}
              onCheckedChange={(checked) => 
                updateSignupField('termsAccepted', checked)
              }
            />
            <Label htmlFor="termsAccepted">
              I understand this will create a trial vendor account with one free report per month
            </Label>
          </div>
        </div>
      </div>
    </Card>
  );
};