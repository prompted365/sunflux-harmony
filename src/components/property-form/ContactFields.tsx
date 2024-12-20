import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface ContactFieldsProps {
  formData: {
    email: string;
    consentToContact: boolean;
  };
  onChange: (field: string, value: string | boolean) => void;
}

const ContactFields = ({ formData, onChange }: ContactFieldsProps) => {
  return (
    <>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email
        </label>
        <Input
          id="email"
          type="email"
          required
          value={formData.email}
          onChange={(e) => onChange('email', e.target.value)}
          className="mt-1"
          placeholder="you@example.com"
        />
      </div>

      <div className="flex items-center space-x-2 pt-2">
        <Switch
          id="consent"
          checked={formData.consentToContact}
          onCheckedChange={(checked) => onChange('consentToContact', checked)}
        />
        <Label htmlFor="consent" className="text-sm text-gray-600">
          I consent to being contacted about dominating in solar sales
        </Label>
      </div>
    </>
  );
};

export default ContactFields;