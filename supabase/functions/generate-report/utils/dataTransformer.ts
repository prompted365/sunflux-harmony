import { ReportData } from './reportTemplate.ts'

export function transformCalculationToReportData(
  calculation: any,
  propertyAddress: string
): ReportData {
  console.log('Transforming calculation data:', calculation);
  
  // Extract the necessary data with null checks
  const systemSize = calculation.system_size || 0;
  const irradianceData = calculation.irradiance_data || {};
  const panelLayout = calculation.panel_layout || {};
  const estimatedProduction = calculation.estimated_production || {};
  const buildingSpecs = calculation.building_specs || {};
  const financialAnalysis = calculation.financial_analysis || {};

  // Calculate financial metrics
  const systemCost = financialAnalysis.systemCost || 0;
  const federalTaxCredit = systemCost * 0.3; // 30% tax credit
  const netCost = systemCost - federalTaxCredit;
  const annualSavings = estimatedProduction.annualSavings || 0;
  const paybackPeriod = netCost / (annualSavings || 1);

  return {
    property: {
      address: propertyAddress,
      generatedDate: new Date().toLocaleDateString(),
      satelliteImage: buildingSpecs.imagery?.rgb || '',
      solarAnalysisImage: buildingSpecs.imagery?.annualFlux || '',
    },
    systemMetrics: {
      panelCount: panelLayout.maxPanels || 0,
      annualProduction: estimatedProduction.yearlyEnergyDcKwh || 0,
      carbonOffset: (irradianceData.carbonOffset || 0),
      roofSuitability: 95, // Default value if not available
      availableArea: panelLayout.maxArea || 0,
      orientation: 'South-West', // Default value if not available
    },
    financial: {
      systemCost: systemCost,
      federalTaxCredit: federalTaxCredit,
      netCost: netCost,
      paybackPeriod: paybackPeriod,
      annualSavings: annualSavings,
      roi20Year: (annualSavings * 20) - netCost,
    },
    specifications: {
      panelCapacity: panelLayout.panelCapacityWatts || 0,
      systemSize: systemSize,
      panelDimensions: {
        height: panelLayout.panelHeightMeters || 0,
        width: panelLayout.panelWidthMeters || 0,
      },
      annualSunHours: irradianceData.maxSunshineHours || 0,
      energyOffset: 95.4, // Default value if not available
      dailyProduction: (estimatedProduction.yearlyEnergyDcKwh || 0) / 365,
      monthlyProduction: (estimatedProduction.yearlyEnergyDcKwh || 0) / 12,
      systemEfficiency: 96.3, // Default value if not available
    },
    summary: {
      totalEnergySavings: annualSavings * 20, // 20 year projection
      monthlySavings: annualSavings / 12,
      returnOnInvestment: ((annualSavings * 20) / netCost) * 100,
      lifetimeProduction: (estimatedProduction.yearlyEnergyDcKwh || 0) * 20,
      totalCarbonOffset: (irradianceData.carbonOffset || 0) * 20,
      treesEquivalent: Math.round(((irradianceData.carbonOffset || 0) * 20) / 21.7),
    },
  }
}