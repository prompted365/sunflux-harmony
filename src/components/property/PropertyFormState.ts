import { useState } from "react"

export interface PropertyFormData {
  address: string
  city: string
  state: string
  zipCode: string
}

export interface FinancialFormData {
  monthlyBill: number | null
  energyCostPerKwh: number
}

export const usePropertyFormState = () => {
  const [loading, setLoading] = useState(false)
  const [calculating, setCalculating] = useState(false)
  const [formData, setFormData] = useState<PropertyFormData>({
    address: "",
    city: "",
    state: "",
    zipCode: "",
  })
  const [financialData, setFinancialData] = useState<FinancialFormData>({
    monthlyBill: null,
    energyCostPerKwh: 0.15, // National average default
  })

  const updateField = (field: keyof PropertyFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const updateFinancialField = (field: keyof FinancialFormData, value: number | null) => {
    setFinancialData(prev => ({ ...prev, [field]: value }))
  }

  return {
    loading,
    setLoading,
    calculating,
    setCalculating,
    formData,
    updateField,
    setFormData,
    financialData,
    updateFinancialField,
  }
}