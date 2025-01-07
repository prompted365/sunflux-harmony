import { useToast } from "@/components/ui/use-toast"
import { initializeSolarAPI } from "@/lib/solar-sdk"
import { AddressInput } from "./property/AddressInput"
import { PropertyFormSubmit } from "./property/PropertyFormSubmit"
import { usePropertyFormState } from "./property/PropertyFormState"
import { FinancialInputs } from "./property/FinancialInputs"
import { AccountSignupInputs } from "./property/AccountSignupInputs"
import { Card } from "./ui/card"
import { useEffect } from "react"
import { usePropertySubmission } from "./property/usePropertySubmission"

interface PropertyFormProps {
  onSuccess?: () => void;
}

const PropertyForm = ({ onSuccess }: PropertyFormProps) => {
  const { toast } = useToast();
  const {
    loading,
    setLoading,
    calculating,
    formData,
    updateField,
    setFormData,
    financialData,
    updateFinancialField,
    signupData,
    updateSignupField,
  } = usePropertyFormState();

  const { handleSubmission } = usePropertySubmission();

  useEffect(() => {
    initializeSolarAPI().catch(console.error);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const success = await handleSubmission(
      signupData,
      formData,
      financialData,
      setLoading,
      onSuccess
    );

    if (success) {
      setFormData({
        address: "",
        city: "",
        state: "",
        zipCode: "",
      });
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white/95 backdrop-blur-lg rounded-xl shadow-xl p-8 mb-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-muted">Experience Our AI Workflow</h2>
        <p className="text-xl text-gray-600 mt-4">
          Try out our automated solar analysis process firsthand. While our AI agents typically handle 
          this data collection automatically, this demo lets you see exactly how we gather and process 
          property information.
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <AccountSignupInputs 
          signupData={signupData}
          updateSignupField={updateSignupField}
        />

        <Card className="p-6 bg-white/90">
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

        <Card className="p-6 bg-white/90">
          <h3 className="text-lg font-semibold mb-4">Financial Information</h3>
          <FinancialInputs
            monthlyBill={financialData.monthlyBill}
            energyCostPerKwh={financialData.energyCostPerKwh}
            onMonthlyBillChange={(value) => updateFinancialField('monthlyBill', value)}
            onEnergyCostChange={(value) => updateFinancialField('energyCostPerKwh', value)}
            isUsingDefaults={!financialData.monthlyBill}
          />
        </Card>

        <PropertyFormSubmit loading={loading} calculating={calculating} />
      </form>
    </div>
  );
};

export default PropertyForm;