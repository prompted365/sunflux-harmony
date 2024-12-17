export function transformCalculationToReportData(calculation: any, propertyAddress: string) {
  console.log('Transforming calculation data:', JSON.stringify(calculation, null, 2));
  
  const solarPotential = calculation.panel_layout || {};
  const irradianceData = calculation.irradiance_data || {};
  const estimatedProduction = calculation.estimated_production || {};
  const financialAnalysis = calculation.financial_analysis || {};
  const buildingSpecs = calculation.building_specs || {};

  // Calculate financial metrics
  const systemCost = financialAnalysis.systemCost || 0;
  const federalTaxCredit = systemCost * 0.3; // 30% tax credit
  const netCost = systemCost - federalTaxCredit;
  const annualSavings = estimatedProduction.yearlyEnergyDcKwh ? (estimatedProduction.yearlyEnergyDcKwh * 0.12) : 0; // Assuming $0.12 per kWh
  const paybackPeriod = netCost > 0 ? (netCost / annualSavings) : 0;

  // Calculate environmental impact
  const annualProduction = estimatedProduction.yearlyEnergyDcKwh || 0;
  const carbonOffset = irradianceData.carbonOffset || 0;
  const treesEquivalent = Math.round((carbonOffset * 20) / 21.7); // 20 years impact

  // Format date
  const generatedDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return {
    property: {
      address: propertyAddress,
      generatedDate,
      satelliteImage: buildingSpecs.imagery?.rgb || '/placeholder.svg',
      solarAnalysisImage: buildingSpecs.imagery?.annualFlux || '/placeholder.svg',
    },
    systemMetrics: {
      panelCount: solarPotential.maxPanels || 0,
      annualProduction,
      carbonOffset,
      roofSuitability: 95, // Default value if not available
      availableArea: solarPotential.maxArea || 0,
      orientation: 'South-West', // Default value if not available
    },
    financial: {
      systemCost,
      federalTaxCredit,
      netCost,
      paybackPeriod,
      annualSavings,
      roi20Year: (annualSavings * 20) - netCost,
    },
    specifications: {
      panelCapacity: solarPotential.panelCapacityWatts || 0,
      systemSize: calculation.system_size || 0,
      panelDimensions: {
        height: solarPotential.panelHeightMeters || 0,
        width: solarPotential.panelWidthMeters || 0,
      },
      annualSunHours: irradianceData.maxSunshineHours || 0,
      energyOffset: 95.4, // Default value if not available
      dailyProduction: annualProduction / 365,
      monthlyProduction: annualProduction / 12,
      systemEfficiency: 96.3, // Default value if not available
    },
    summary: {
      totalEnergySavings: annualSavings * 20, // 20 year projection
      monthlySavings: annualSavings / 12,
      returnOnInvestment: netCost > 0 ? ((annualSavings * 20 - netCost) / netCost) * 100 : 0,
      lifetimeProduction: annualProduction * 20,
      totalCarbonOffset: carbonOffset * 20,
      treesEquivalent,
    },
  };
}