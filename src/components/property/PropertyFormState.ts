import { useState } from "react"

export interface PropertyFormData {
  address: string
  city: string
  state: string
  zipCode: string
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

  const updateField = (field: keyof PropertyFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return {
    loading,
    setLoading,
    calculating,
    setCalculating,
    formData,
    updateField,
    setFormData,
  }
}