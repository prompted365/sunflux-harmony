import { Card } from "../ui/card"
import { AddressInput } from "./AddressInput"
import { FinancialInputs } from "./FinancialInputs"
import { LeadContactInputs } from "./LeadContactInputs"
import { PropertyFormSubmit } from "./PropertyFormSubmit"
import { PropertyFormData, FinancialFormData, SignupFormData } from "./PropertyFormState"

interface PropertyFormContentProps {
  loading: boolean;
  calculating: boolean;
  formData: PropertyFormData;
  updateField: (field: keyof PropertyFormData, value: string) => void;
  financialData: FinancialFormData;
  updateFinancialField: (field: keyof FinancialFormData, value: number | null) => void;
  signupData: SignupFormData;
  updateSignupField: (field: keyof SignupFormData, value: any) => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
}

const PropertyFormContent = ({
  loading,
  calculating,
  formData,
  updateField,
  financialData,
  updateFinancialField,
  signupData,
  updateSignupField,
  onSubmit
}: PropertyFormContentProps) => {
  return (
    <div className="max-w-2xl mx-auto bg-gradient-to-br from-white via-white to-muted/10 backdrop-blur-lg rounded-xl shadow-xl p-8 mb-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-muted">Experience Our AI Workflow</h2>
        <p className="text-xl text-gray-600 mt-4">
          Try out our automated solar analysis process firsthand. While our AI agents typically handle 
          this data collection automatically, this demo lets you see exactly how we gather and process 
          property information.
        </p>
      </div>
      
      <form onSubmit={onSubmit} className="space-y-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Property Location</h3>
          <AddressInput
            id="address"
            label="Street Address"
            value={formData.address}
            onChange={(value) => updateField('address', value)}
            placeholder="123 Solar Street"
          />
          
          <AddressInput
            id="city"
            label="City"
            value={formData.city}
            onChange={(value) => updateField('city', value)}
            placeholder="Sunnyville"
          />
          
          <AddressInput
            id="state"
            label="State"
            value={formData.state}
            onChange={(value) => updateField('state', value)}
            placeholder="CA"
          />
          
          <AddressInput
            id="zipCode"
            label="ZIP Code"
            value={formData.zipCode}
            onChange={(value) => updateField('zipCode', value)}
            placeholder="12345"
          />
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Financial Information</h3>
          <FinancialInputs
            monthlyBill={financialData.monthlyBill}
            energyCostPerKwh={financialData.energyCostPerKwh}
            onMonthlyBillChange={(value) => updateFinancialField('monthlyBill', value)}
            onEnergyCostChange={(value) => updateFinancialField('energyCostPerKwh', value)}
            isUsingDefaults={!financialData.monthlyBill}
          />
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Lead Contact Information</h3>
          <LeadContactInputs
            signupData={signupData}
            updateSignupField={updateSignupField}
          />
        </Card>

        <PropertyFormSubmit loading={loading} calculating={calculating} />
      </form>
    </div>
  );
};

export default PropertyFormContent;