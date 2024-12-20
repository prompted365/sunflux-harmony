import { Input } from "@/components/ui/input";

interface AddressFieldsProps {
  formData: {
    address: string;
    city: string;
    state: string;
    zipCode: string;
  };
  onChange: (field: string, value: string) => void;
}

const AddressFields = ({ formData, onChange }: AddressFieldsProps) => {
  return (
    <>
      <div>
        <label htmlFor="address" className="block text-sm font-medium text-gray-700">
          Street Address
        </label>
        <Input
          id="address"
          type="text"
          required
          value={formData.address}
          onChange={(e) => onChange('address', e.target.value)}
          className="mt-1"
          placeholder="123 Solar Street"
        />
      </div>
      
      <div>
        <label htmlFor="city" className="block text-sm font-medium text-gray-700">
          City
        </label>
        <Input
          id="city"
          type="text"
          required
          value={formData.city}
          onChange={(e) => onChange('city', e.target.value)}
          className="mt-1"
          placeholder="Sunnyville"
        />
      </div>
      
      <div>
        <label htmlFor="state" className="block text-sm font-medium text-gray-700">
          State
        </label>
        <Input
          id="state"
          type="text"
          required
          value={formData.state}
          onChange={(e) => onChange('state', e.target.value)}
          className="mt-1"
          placeholder="CA"
        />
      </div>
      
      <div>
        <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700">
          ZIP Code
        </label>
        <Input
          id="zipCode"
          type="text"
          required
          value={formData.zipCode}
          onChange={(e) => onChange('zipCode', e.target.value)}
          className="mt-1"
          placeholder="12345"
        />
      </div>
    </>
  );
};

export default AddressFields;