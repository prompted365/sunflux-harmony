import { useToast } from "@/components/ui/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { solarAPI } from "@/lib/solar-sdk"
import { AddressInput } from "./property/AddressInput"
import { PropertyFormSubmit } from "./property/PropertyFormSubmit"
import { usePropertyFormState } from "./property/PropertyFormState"
import { FinancialInputs } from "./property/FinancialInputs"
import { Card } from "./ui/card"

const PropertyForm = () => {
  const { toast } = useToast()
  const {
    loading,
    setLoading,
    calculating,
    setCalculating,
    formData,
    updateField,
    setFormData,
    financialData,
    updateFinancialField,
  } = usePropertyFormState()

  const geocodeAddress = async () => {
    const response = await supabase.functions.invoke('geocode-address', {
      body: formData
    })

    if (response.error) {
      throw new Error(response.error.message || 'Failed to geocode address')
    }

    return response.data
  }

  const calculateSolar = async (propertyId: string, coordinates: { latitude: number; longitude: number }) => {
    setCalculating(true)
    try {
      // Get building insights using the SDK
      const buildingInsights = await solarAPI.getBuildingInsights(
        coordinates.latitude,
        coordinates.longitude
      )

      if (buildingInsights.error) {
        throw new Error(buildingInsights.error)
      }

      // Get environmental analysis
      const environmentalAnalysis = await solarAPI.analyzeEnvironment(
        coordinates.latitude,
        coordinates.longitude
      )

      if ('error' in environmentalAnalysis) {
        throw new Error(environmentalAnalysis.error)
      }

      // Create solar calculation record
      const { error: calcError } = await supabase
        .from('solar_calculations')
        .insert({
          property_id: propertyId,
          status: 'completed',
          system_size: buildingInsights.yearlyEnergyDcKwh / 1000, // Convert to kW
          irradiance_data: {
            maxSunshineHours: buildingInsights.maxSunshineHoursPerYear,
            carbonOffset: buildingInsights.annualCarbonOffsetKg,
          },
          estimated_production: {
            yearlyEnergyDcKwh: buildingInsights.yearlyEnergyDcKwh,
            environmentalImpact: {
              carbonOffset: environmentalAnalysis.carbonOffset,
              annualProduction: environmentalAnalysis.annualProduction,
              lifetimeProduction: environmentalAnalysis.lifetimeProduction
            }
          }
        })

      if (calcError) throw calcError

      // Create solar configuration with financial inputs
      const { error: configError } = await supabase
        .from('solar_configurations')
        .insert({
          property_id: propertyId,
          monthly_bill: financialData.monthlyBill,
          energy_cost_per_kwh: financialData.energyCostPerKwh,
          is_using_defaults: !financialData.monthlyBill
        })

      if (configError) throw configError

      toast({
        title: "Success",
        description: "Solar calculation completed",
      })
    } catch (error) {
      console.error("Error calculating solar:", error)
      toast({
        title: "Error",
        description: "Failed to complete solar calculation",
        variant: "destructive",
      })
    } finally {
      setCalculating(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        toast({
          title: "Error",
          description: "You must be logged in to submit a property",
          variant: "destructive",
        })
        return
      }

      // Get coordinates
      const coordinates = await geocodeAddress()
      console.log("Geocoded coordinates:", coordinates)

      const { data: property, error } = await supabase.from("properties").insert({
        user_id: user.id,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zip_code: formData.zipCode,
        latitude: coordinates.latitude,
        longitude: coordinates.longitude,
      }).select().single()

      if (error) throw error

      toast({
        title: "Success",
        description: "Property submitted successfully",
      })

      // Trigger solar calculation with coordinates
      await calculateSolar(property.id, coordinates)

      setFormData({
        address: "",
        city: "",
        state: "",
        zipCode: "",
      })
    } catch (error) {
      console.error("Error submitting property:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to submit property",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto bg-gradient-to-br from-white via-white to-muted/10 backdrop-blur-lg rounded-xl shadow-xl p-8 mb-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-muted">Submit Property</h2>
        <p className="text-xl text-gray-600 mt-4">
          Enter the property details below to get started
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
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

        <PropertyFormSubmit loading={loading} calculating={calculating} />
      </form>
    </div>
  )
}

export default PropertyForm