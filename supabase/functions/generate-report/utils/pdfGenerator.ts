import { jsPDF } from 'https://esm.sh/jspdf@2.5.1';
import type { FinancialMetrics } from './financialCalculations.ts';
import type { EnvironmentalImpact } from './environmentalCalculations.ts';

interface SystemSpecs {
  systemSize: number;
  annualProduction: number;
  panelCount: number;
  arrayArea: number;
  sunshineHours: number;
  efficiency: number;
}

export function generatePDF(
  propertyAddress: string,
  systemSpecs: SystemSpecs,
  financials: FinancialMetrics,
  environmental: EnvironmentalImpact,
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
  doc.text('Financial Analysis', 20, 130);
  
  doc.setFontSize(12);
  doc.text('Initial Investment:', 20, 145);
  doc.text([
    `  • Total System Cost: $${financials.totalSystemCost.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`,
    `  • Federal Tax Credit (30%): $${financials.federalTaxCredit.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`,
    `  • Net System Cost: $${financials.netSystemCost.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`
  ], 20, 155);

  doc.text('Savings Projections:', 20, 180);
  doc.text([
    `  • Monthly Bill Savings: $${financials.monthlyBillSavings.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`,
    `  • Annual Energy Savings: $${financials.annualSavings.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`,
    `  • 20-Year Total Savings: $${financials.twentyYearSavings.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`,
    `  • Present Value of Savings: $${financials.inflationAdjustedSavings.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`,
    `  • Estimated Payback Period: ${financials.paybackPeriod.toFixed(1)} years`
  ], 20, 190);

  // Environmental Impact
  doc.setFontSize(18);
  doc.text('Environmental Impact', 20, 230);
  
  doc.setFontSize(12);
  doc.text('Annual Environmental Benefits:', 20, 245);
  doc.text([
    `  • CO₂ Reduction: ${environmental.carbonOffset.toFixed(2)} metric tons`,
    `  • Equivalent to Planting: ${environmental.treesEquivalent.toLocaleString()} trees`,
    `  • Powers Equivalent of: ${environmental.homesEquivalent} average homes`,
    `  • Gasoline Saved: ${environmental.gasSaved.toLocaleString()} gallons`
  ], 20, 255);

  return doc.output('arraybuffer');
}