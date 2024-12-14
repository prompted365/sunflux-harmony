import { jsPDF } from 'https://esm.sh/jspdf@2.5.1';
import type { FinancialMetrics } from './financialCalculations.ts';
import type { EnvironmentalImpact } from './environmentalCalculations.ts';

interface SystemSpecs {
  systemSize: number | null;
  annualProduction: number | null;
  panelCount: number | null;
  arrayArea: number | null;
  sunshineHours: number | null;
  efficiency: number | null;
}

export function generatePDF(
  propertyAddress: string,
  systemSpecs: SystemSpecs,
  financials: FinancialMetrics,
  environmental: EnvironmentalImpact
): ArrayBuffer {
  const doc = new jsPDF();
  
  // Title
  doc.setFontSize(24);
  doc.text('Solar Installation Report', 105, 20, { align: 'center' });
  
  // Property Information
  doc.setFontSize(14);
  doc.text(`Property Address: ${propertyAddress}`, 20, 40);

  // System Specifications
  doc.setFontSize(18);
  doc.text('System Specifications', 20, 60);

  doc.setFontSize(12);
  doc.text([
    `System Size: ${systemSpecs.systemSize?.toFixed(2) || 'N/A'} kW`,
    `Annual Production: ${systemSpecs.annualProduction?.toFixed(2) || 'N/A'} kWh`,
    `Number of Panels: ${systemSpecs.panelCount || 'N/A'}`,
    `Array Area: ${systemSpecs.arrayArea?.toFixed(1) || 'N/A'} m²`,
    `Annual Sunshine Hours: ${systemSpecs.sunshineHours?.toFixed(0) || 'N/A'} hours`,
    `System Efficiency: ${systemSpecs.efficiency?.toFixed(1) || 'N/A'}%`
  ], 20, 75);

  // Financial Analysis
  doc.setFontSize(18);
  doc.text('Financial Analysis', 20, 120);
  
  doc.setFontSize(12);
  doc.text([
    `Initial Investment:`,
    `  • Total System Cost: $${financials.totalSystemCost.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`,
    `  • Federal Tax Credit (30%): $${financials.federalTaxCredit.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`,
    `  • Net System Cost: $${financials.netSystemCost.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`,
    ``,
    `Savings Projections:`,
    `  • Monthly Bill Savings: $${financials.monthlyBillSavings.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`,
    `  • Annual Energy Savings: $${financials.annualSavings.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`,
    `  • 20-Year Total Savings: $${financials.twentyYearSavings.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`,
    `  • Present Value of Savings: $${financials.inflationAdjustedSavings.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`,
    `  • Estimated Payback Period: ${financials.paybackPeriod.toFixed(1)} years`
  ], 20, 135);

  // Environmental Impact
  doc.setFontSize(18);
  doc.text('Environmental Impact', 20, 200);
  
  doc.setFontSize(12);
  doc.text([
    `Annual Environmental Benefits:`,
    `  • CO₂ Reduction: ${environmental.carbonOffset.toFixed(2)} metric tons`,
    `  • Equivalent to Planting: ${environmental.treesEquivalent.toLocaleString()} trees`,
    `  • Powers Equivalent of: ${environmental.homesEquivalent} average homes`,
    `  • Gasoline Saved: ${environmental.gasSaved.toLocaleString()} gallons`
  ], 20, 215);

  return doc.output('arraybuffer');
}