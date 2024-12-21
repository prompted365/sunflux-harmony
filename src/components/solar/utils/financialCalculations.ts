/**
 * Calculates annual energy consumption based on monthly bill and utility rate
 */
export const calculateAnnualConsumption = (monthlyBill: number, utilityRate: number): number => {
  const monthlyConsumption = monthlyBill / utilityRate;
  return monthlyConsumption * 12;
};

/**
 * Calculates annual solar energy production with efficiency depreciation
 */
export const calculateAnnualProduction = (
  initialProduction: number,
  year: number,
  efficiencyDepreciation: number = 0.995
): number => {
  return initialProduction * Math.pow(efficiencyDepreciation, year);
};

/**
 * Calculates utility bill for a given year considering solar production
 */
export const calculateAnnualUtilityBill = (
  annualConsumption: number,
  solarProduction: number,
  utilityRate: number,
  year: number,
  rateInflation: number = 0.022,
  discountRate: number = 0.04
): number => {
  const remainingConsumption = Math.max(0, annualConsumption - solarProduction);
  const inflatedRate = utilityRate * Math.pow(1 + rateInflation, year);
  const discountedCost = (remainingConsumption * inflatedRate) / Math.pow(1 + discountRate, year);
  return discountedCost;
};

/**
 * Calculates lifetime utility costs with solar installation
 */
export const calculateLifetimeUtilityCosts = (
  annualConsumption: number,
  initialProduction: number,
  utilityRate: number,
  lifespan: number = 20,
  efficiencyDepreciation: number = 0.995,
  rateInflation: number = 0.022,
  discountRate: number = 0.04
): number => {
  let totalCost = 0;
  for (let year = 0; year < lifespan; year++) {
    const solarProduction = calculateAnnualProduction(initialProduction, year, efficiencyDepreciation);
    const yearCost = calculateAnnualUtilityBill(
      annualConsumption,
      solarProduction,
      utilityRate,
      year,
      rateInflation,
      discountRate
    );
    totalCost += yearCost;
  }
  return totalCost;
};

/**
 * Calculates lifetime utility costs without solar installation
 */
export const calculateLifetimeUtilityCostsWithoutSolar = (
  monthlyBill: number,
  lifespan: number = 20,
  rateInflation: number = 0.022,
  discountRate: number = 0.04
): number => {
  let totalCost = 0;
  const annualBill = monthlyBill * 12;
  
  for (let year = 0; year < lifespan; year++) {
    const inflatedCost = annualBill * Math.pow(1 + rateInflation, year);
    const discountedCost = inflatedCost / Math.pow(1 + discountRate, year);
    totalCost += discountedCost;
  }
  
  return totalCost;
};

/**
 * Calculates the payback period for solar installation
 */
export const calculatePaybackPeriod = (
  installationCost: number,
  monthlyBill: number,
  initialProduction: number,
  utilityRate: number,
  federalIncentive: number = 0,
  stateIncentive: number = 0,
  maxYears: number = 25
): number => {
  const annualConsumption = calculateAnnualConsumption(monthlyBill, utilityRate);
  const netCost = installationCost - federalIncentive - stateIncentive;
  let cumulativeSavings = 0;
  
  for (let year = 0; year < maxYears; year++) {
    const solarProduction = calculateAnnualProduction(initialProduction, year);
    const withSolarCost = calculateAnnualUtilityBill(annualConsumption, solarProduction, utilityRate, year);
    const withoutSolarCost = calculateAnnualUtilityBill(annualConsumption, 0, utilityRate, year);
    cumulativeSavings += (withoutSolarCost - withSolarCost);
    
    if (cumulativeSavings >= netCost) {
      // Add fractional year for more precise payback period
      const fraction = (netCost - (cumulativeSavings - (withoutSolarCost - withSolarCost))) / 
                      (withoutSolarCost - withSolarCost);
      return year + fraction;
    }
  }
  
  return -1; // Indicates payback not achieved within maxYears
};

/**
 * Calculates savings over time for solar installation
 */
export const calculateSavingsOverTime = (
  installationCost: number,
  monthlyBill: number,
  initialProduction: number,
  utilityRate: number,
  federalIncentive: number = 0,
  stateIncentive: number = 0,
  lifespan: number = 20
): {
  firstYear: number;
  twentyYear: number;
  lifetime: number;
  presentValueTwentyYear: number;
  presentValueLifetime: number;
} => {
  const annualConsumption = calculateAnnualConsumption(monthlyBill, utilityRate);
  const netCost = installationCost - federalIncentive - stateIncentive;
  
  let firstYearSavings = 0;
  let twentyYearSavings = 0;
  let lifetimeSavings = 0;
  let presentValueTwentyYear = 0;
  let presentValueLifetime = 0;
  
  for (let year = 0; year < lifespan; year++) {
    const solarProduction = calculateAnnualProduction(initialProduction, year);
    const withSolarCost = calculateAnnualUtilityBill(annualConsumption, solarProduction, utilityRate, year);
    const withoutSolarCost = calculateAnnualUtilityBill(annualConsumption, 0, utilityRate, year);
    const yearSavings = withoutSolarCost - withSolarCost;
    
    if (year === 0) firstYearSavings = yearSavings;
    if (year < 20) {
      twentyYearSavings += yearSavings;
      presentValueTwentyYear += yearSavings / Math.pow(1.04, year);
    }
    lifetimeSavings += yearSavings;
    presentValueLifetime += yearSavings / Math.pow(1.04, year);
  }
  
  return {
    firstYear: firstYearSavings - netCost,
    twentyYear: twentyYearSavings - netCost,
    lifetime: lifetimeSavings - netCost,
    presentValueTwentyYear: presentValueTwentyYear - netCost,
    presentValueLifetime: presentValueLifetime - netCost
  };
};