import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ValidationError } from "@/lib/errors"

interface FinancialInputsProps {
  monthlyBill: number | null
  energyCostPerKwh: number
  onMonthlyBillChange: (value: number | null) => void
  onEnergyCostChange: (value: number) => void
  isUsingDefaults: boolean
}

export const FinancialInputs = ({
  monthlyBill,
  energyCostPerKwh,
  onMonthlyBillChange,
  onEnergyCostChange,
  isUsingDefaults
}: FinancialInputsProps) => {
  const validateMonthlyBill = (value: string) => {
    const numValue = value ? Number(value) : null;
    
    if (value && (isNaN(numValue!) || numValue! < 0)) {
      throw new ValidationError("Monthly bill must be a positive number");
    }
    
    return numValue;
  };

  const validateEnergyCost = (value: string) => {
    const numValue = Number(value);
    
    if (isNaN(numValue) || numValue <= 0) {
      throw new ValidationError("Energy cost must be greater than 0");
    }
    
    return numValue;
  };

  const handleMonthlyBillChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const value = validateMonthlyBill(e.target.value);
      onMonthlyBillChange(value);
    } catch (error) {
      if (error instanceof ValidationError) {
        // Reset to previous valid value
        e.target.value = monthlyBill?.toString() || '';
      }
    }
  };

  const handleEnergyCostChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const value = validateEnergyCost(e.target.value);
      onEnergyCostChange(value);
    } catch (error) {
      if (error instanceof ValidationError) {
        // Reset to previous valid value
        e.target.value = energyCostPerKwh.toString();
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="monthlyBill">Average Monthly Electric Bill ($)</Label>
        <Input
          id="monthlyBill"
          type="number"
          min="0"
          step="0.01"
          value={monthlyBill || ''}
          onChange={handleMonthlyBillChange}
          placeholder="Enter your client's average monthly bill"
          className="bg-white/80"
        />
        {isUsingDefaults && (
          <Alert variant="default" className="mt-2">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Using default value. Please enter your client's actual monthly bill for more accurate calculations.
            </AlertDescription>
          </Alert>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="energyCost">Energy Cost per kWh ($)</Label>
        <Input
          id="energyCost"
          type="number"
          min="0.01"
          step="0.01"
          value={energyCostPerKwh}
          onChange={handleEnergyCostChange}
          placeholder="Energy cost per kWh"
          className="bg-white/80"
        />
        {isUsingDefaults && (
          <Alert variant="default" className="mt-2">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Using national average ($0.15/kWh). Update with your client's local rate for accurate savings.
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  )
}