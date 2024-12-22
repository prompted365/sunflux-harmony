import { DatabaseSolarCalculation, TransformedCalculation } from "../types/database";

export const transformDatabaseCalculation = (calc: DatabaseSolarCalculation): TransformedCalculation => {
  return {
    id: calc.id,
    status: calc.status,
    system_size: calc.system_size,
    irradiance_data: {
      maxSunshineHours: (calc.irradiance_data as any)?.maxSunshineHours || 0,
      carbonOffset: (calc.irradiance_data as any)?.carbonOffset || 0,
      annualSunlight: (calc.irradiance_data as any)?.annualSunlight
    },
    panel_layout: {
      maxPanels: (calc.panel_layout as any)?.maxPanels || 0,
      maxArea: (calc.panel_layout as any)?.maxArea || 0,
      panelDimensions: {
        height: (calc.panel_layout as any)?.panelDimensions?.height || 0,
        width: (calc.panel_layout as any)?.panelDimensions?.width || 0
      },
      optimalConfiguration: (calc.panel_layout as any)?.optimalConfiguration
    },
    estimated_production: {
      yearlyEnergyDcKwh: (calc.estimated_production as any)?.yearlyEnergyDcKwh || null,
      monthlyBill: (calc.estimated_production as any)?.monthlyBill || null,
      financialDetails: (calc.estimated_production as any)?.financialDetails,
      environmentalImpact: (calc.estimated_production as any)?.environmentalImpact
    },
    financial_analysis: {
      initialCost: (calc.financial_analysis as any)?.initialCost || 0,
      federalIncentive: (calc.financial_analysis as any)?.federalIncentive || 0,
      monthlyBillSavings: (calc.financial_analysis as any)?.monthlyBillSavings || 0,
      paybackYears: (calc.financial_analysis as any)?.paybackYears || 0
    },
    building_specs: {
      address: (calc.building_specs as any)?.address,
      imagery: {
        rgb: (calc.building_specs as any)?.imagery?.rgb,
        dsm: (calc.building_specs as any)?.imagery?.dsm,
        mask: (calc.building_specs as any)?.imagery?.mask || null,
        annualFlux: (calc.building_specs as any)?.imagery?.annualFlux,
        monthlyFlux: (calc.building_specs as any)?.imagery?.monthlyFlux || null
      }
    },
    properties: calc.properties
  };
};