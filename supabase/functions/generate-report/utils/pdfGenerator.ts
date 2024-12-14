import { jsPDF } from 'https://esm.sh/jspdf@2.5.1';

export function generatePDF(
  propertyAddress: string,
  systemSpecs: {
    systemSize: number;
    annualProduction: number;
    panelCount: number;
    arrayArea: number;
    sunshineHours: number;
    efficiency: number;
  },
  financials: {
    totalSystemCost: number;
    federalTaxCredit: number;
    netSystemCost: number;
    annualSavings: number;
    paybackPeriod: number;
    monthlyBillSavings: number;
    twentyYearSavings: number;
    inflationAdjustedSavings: number;
  },
  environmental: {
    carbonOffset: number;
    treesEquivalent: number;
    homesEquivalent: number;
    gasSaved: number;
  },
): ArrayBuffer {
  const doc = new jsPDF();
  
  // Title
  doc.setFontSize(24);
  doc.text('Solar Installation Report', 105, 20, { align: 'center' });
  
  // Property Information
  doc.setFontSize(12);
  doc.text(`Property Address: ${propertyAddress}`, 20, 40);

  // System Specifications
  doc.setFontSize(18);
  doc.text('System Specifications', 20, 60);
  
  doc.setFontSize(12);
  doc.text([
    `System Size: ${systemSpecs.systemSize.toFixed(2)} kW`,
    `Annual Production: ${systemSpecs.annualProduction.toFixed(2)} kWh`,
    `Number of Panels: ${systemSpecs.panelCount}`,
    `Array Area: ${systemSpecs.arrayArea.toFixed(1)} m²`,
    `Annual Sunshine Hours: ${systemSpecs.sunshineHours.toFixed(0)} hours`,
    `System Efficiency: ${systemSpecs.efficiency.toFixed(1)}%`
  ], 20, 75);

  // Financial Analysis
  doc.setFontSize(18);
  doc.text('Financial Analysis', 20, 120);
  
  doc.setFontSize(12);
  doc.text('Initial Investment:', 20, 135);
  doc.text([
    `  • Total System Cost: $${financials.totalSystemCost.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`,
    `  • Federal Tax Credit (30%): $${financials.federalTaxCredit.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`,
    `  • Net System Cost: $${financials.netSystemCost.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`
  ], 20, 145);

  doc.text('Savings Projections:', 20, 170);
  doc.text([
    `  • Monthly Bill Savings: $${financials.monthlyBillSavings.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`,
    `  • Annual Energy Savings: $${financials.annualSavings.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`,
    `  • 20-Year Total Savings: $${financials.twentyYearSavings.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`,
    `  • Present Value of Savings: $${financials.inflationAdjustedSavings.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`,
    `  • Estimated Payback Period: ${financials.paybackPeriod.toFixed(1)} years`
  ], 20, 180);

  // Environmental Impact
  doc.setFontSize(18);
  doc.text('Environmental Impact', 20, 220);
  
  doc.setFontSize(12);
  doc.text('Annual Environmental Benefits:', 20, 235);
  doc.text([
    `  • CO₂ Reduction: ${environmental.carbonOffset.toFixed(2)} metric tons`,
    `  • Equivalent to Planting: ${environmental.treesEquivalent.toLocaleString()} trees`,
    `  • Powers Equivalent of: ${environmental.homesEquivalent} average homes`,
    `  • Gasoline Saved: ${environmental.gasSaved.toLocaleString()} gallons`
  ], 20, 245);

  return doc.output('arraybuffer');
}