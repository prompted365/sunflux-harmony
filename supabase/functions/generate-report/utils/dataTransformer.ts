import { ReportData } from './reportTemplate.ts'
import type { Database } from '../../../../src/integrations/supabase/types'

type DatabaseSolarCalculation = Database['public']['Tables']['solar_calculations']['Row'] & {
  properties: Database['public']['Tables']['properties']['Row']
}

export function transformCalculationToReportData(
  calculation: DatabaseSolarCalculation,
  propertyAddress: string
): ReportData {
  const solarPotential = calculation.building_specs?.solarPotential || {}
  const panelConfig = solarPotential.solarPanelConfigs?.[0] || {}
  const financialAnalysis = solarPotential.financialAnalyses?.[0] || {}

  return {
    property: {
      address: propertyAddress,
      generatedDate: new Date().toLocaleDateString(),
      satelliteImage: calculation.building_specs?.imagery?.rgb || '',
      solarAnalysisImage: calculation.building_specs?.imagery?.annualFlux || '',
    },
    systemMetrics: {
      panelCount: solarPotential.maxArrayPanelsCount || 0,
      annualProduction: panelConfig.yearlyEnergyDcKwh || 0,
      carbonOffset: (solarPotential.carbonOffsetFactorKgPerMwh || 0) * (panelConfig.yearlyEnergyDcKwh || 0) / 1000,
      roofSuitability: 95,
      availableArea: solarPotential.maxArrayAreaMeters2 || 0,
      orientation: 'South-West',
    },
    financial: {
      systemCost: financialAnalysis.cashPurchaseSavings?.outOfPocketCost?.units || 0,
      federalTaxCredit: financialAnalysis.cashPurchaseSavings?.rebateValue?.units || 0,
      netCost: (financialAnalysis.cashPurchaseSavings?.outOfPocketCost?.units || 0) - 
               (financialAnalysis.cashPurchaseSavings?.rebateValue?.units || 0),
      paybackPeriod: financialAnalysis.cashPurchaseSavings?.paybackYears || 0,
      annualSavings: financialAnalysis.cashPurchaseSavings?.savings?.savingsYear1?.units || 0,
      roi20Year: financialAnalysis.cashPurchaseSavings?.savings?.savingsYear20?.units || 0,
    },
    specifications: {
      panelCapacity: solarPotential.panelCapacityWatts || 0,
      systemSize: (solarPotential.maxArrayPanelsCount || 0) * (solarPotential.panelCapacityWatts || 0) / 1000,
      panelDimensions: {
        height: solarPotential.panelHeightMeters || 0,
        width: solarPotential.panelWidthMeters || 0,
      },
      annualSunHours: solarPotential.maxSunshineHoursPerYear || 0,
      energyOffset: 95.4,
      dailyProduction: (panelConfig.yearlyEnergyDcKwh || 0) / 365,
      monthlyProduction: (panelConfig.yearlyEnergyDcKwh || 0) / 12,
      systemEfficiency: 96.3,
    },
    summary: {
      totalEnergySavings: financialAnalysis.cashPurchaseSavings?.savings?.savingsLifetime?.units || 0,
      monthlySavings: (financialAnalysis.cashPurchaseSavings?.savings?.savingsYear1?.units || 0) / 12,
      returnOnInvestment: 189,
      lifetimeProduction: (panelConfig.yearlyEnergyDcKwh || 0) * 20,
      totalCarbonOffset: ((solarPotential.carbonOffsetFactorKgPerMwh || 0) * (panelConfig.yearlyEnergyDcKwh || 0) / 1000) * 20,
      treesEquivalent: Math.round(((solarPotential.carbonOffsetFactorKgPerMwh || 0) * (panelConfig.yearlyEnergyDcKwh || 0) / 1000) * 20 / 21.7),
    },
  }
}