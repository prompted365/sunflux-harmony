interface PanelConfiguration {
  panelCount: number;
  systemSizeKw: number;
  annualProduction: number;
  installationCost: number;
  paybackPeriod: number;
  monthlyBillOffset: number;
}

export const calculateOptimalPanelCount = (
  buildingInsights: any,
  monthlyBill: number = 200, // Default monthly bill
  costPerWatt: number = 3.5, // Default installation cost per watt
  utilityRate: number = 0.15, // Default utility rate per kWh
): PanelConfiguration => {
  const solarPotential = buildingInsights?.solarPotential;
  if (!solarPotential) return null;

  const panelCapacityWatts = solarPotential.panelCapacityWatts;
  const maxPanels = solarPotential.maxArrayPanelsCount;
  
  // Calculate annual consumption from monthly bill
  const annualConsumption = (monthlyBill / utilityRate) * 12;
  
  // Get production per panel from the first configuration
  const productionPerPanel = solarPotential.solarPanelConfigs?.[0]?.yearlyEnergyDcKwh / 
    solarPotential.solarPanelConfigs?.[0]?.panelsCount;

  // Find optimal panel count that matches consumption
  let optimalCount = Math.min(
    Math.ceil(annualConsumption / productionPerPanel),
    maxPanels
  );

  // Calculate system metrics
  const systemSizeKw = (optimalCount * panelCapacityWatts) / 1000;
  const annualProduction = optimalCount * productionPerPanel;
  const installationCost = systemSizeKw * 1000 * costPerWatt;
  
  // Calculate payback period
  const annualSavings = annualProduction * utilityRate;
  const paybackPeriod = installationCost / annualSavings;
  
  // Calculate monthly bill offset percentage
  const monthlyBillOffset = (annualProduction / annualConsumption) * 100;

  return {
    panelCount: optimalCount,
    systemSizeKw,
    annualProduction,
    installationCost,
    paybackPeriod,
    monthlyBillOffset
  };
};