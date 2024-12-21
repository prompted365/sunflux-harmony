import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

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
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="monthlyBill">Average Monthly Electric Bill ($)</Label>
        <Input
          id="monthlyBill"
          type="number"
          value={monthlyBill || ''}
          onChange={(e) => onMonthlyBillChange(e.target.value ? Number(e.target.value) : null)}
          placeholder="Enter your average monthly bill"
        />
        {isUsingDefaults && (
          <Alert variant="default" className="mt-2">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Using default value. Please enter your actual monthly bill for more accurate calculations.
            </AlertDescription>
          </Alert>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="energyCost">Energy Cost per kWh ($)</Label>
        <Input
          id="energyCost"
          type="number"
          step="0.01"
          value={energyCostPerKwh}
          onChange={(e) => onEnergyCostChange(Number(e.target.value))}
          placeholder="Energy cost per kWh"
        />
        {isUsingDefaults && (
          <Alert variant="default" className="mt-2">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Using national average ($0.15/kWh). Update with your local rate for accurate savings.
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  )
}