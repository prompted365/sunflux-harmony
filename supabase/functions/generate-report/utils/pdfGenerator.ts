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
  rgbImageBase64?: string,
): ArrayBuffer {
  const doc = new jsPDF();
  
  // Title
  doc.setFontSize(24);
  doc.text('Solar Installation Report', 105, 20, { align: 'center' });
  
  // Property Information
  doc.setFontSize(12);
  doc.text(`Property Address: ${propertyAddress}`, 20, 40);

  // Add RGB image if available
  if (rgbImageBase64) {
    try {
      doc.addImage(
        `data:image/png;base64,${rgbImageBase64}`,
        'PNG',
        20,
        50,
        170,
        100
      );
    } catch (error) {
      console.error('Failed to add image to PDF:', error);
    }
  }

  // System Specifications
  const startY = rgbImageBase64 ? 160 : 60;
  doc.setFontSize(18);
  doc.text('System Specifications', 20, startY);
  
  doc.setFontSize(12);
  doc.text([
    `System Size: ${systemSpecs.systemSize.toFixed(2)} kW`,
    `Annual Production: ${systemSpecs.annualProduction.toFixed(2)} kWh`,
    `Number of Panels: ${systemSpecs.panelCount}`,
    `Array Area: ${systemSpecs.arrayArea.toFixed(1)} m²`,
    `Annual Sunshine Hours: ${systemSpecs.sunshineHours.toFixed(0)} hours`,
    `System Efficiency: ${systemSpecs.efficiency.toFixed(1)}%`
  ], 20, startY + 15);

  // Financial Analysis
  doc.setFontSize(18);
  doc.text('Financial Analysis', 20, startY + 60);
  
  doc.setFontSize(12);
  doc.text('Initial Investment:', 20, startY + 75);
  doc.text([
    `  • Total System Cost: $${financials.totalSystemCost.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`,
    `  • Federal Tax Credit (30%): $${financials.federalTaxCredit.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`,
    `  • Net System Cost: $${financials.netSystemCost.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`
  ], 20, startY + 85);

  doc.text('Savings Projections:', 20, startY + 110);
  doc.text([
    `  • Monthly Bill Savings: $${financials.monthlyBillSavings.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`,
    `  • Annual Energy Savings: $${financials.annualSavings.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`,
    `  • 20-Year Total Savings: $${financials.twentyYearSavings.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`,
    `  • Present Value of Savings: $${financials.inflationAdjustedSavings.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`,
    `  • Estimated Payback Period: ${financials.paybackPeriod.toFixed(1)} years`
  ], 20, startY + 120);

  // Environmental Impact
  doc.setFontSize(18);
  doc.text('Environmental Impact', 20, startY + 160);
  
  doc.setFontSize(12);
  doc.text('Annual Environmental Benefits:', 20, startY + 175);
  doc.text([
    `  • CO₂ Reduction: ${environmental.carbonOffset.toFixed(2)} metric tons`,
    `  • Equivalent to Planting: ${environmental.treesEquivalent.toLocaleString()} trees`,
    `  • Powers Equivalent of: ${environmental.homesEquivalent} average homes`,
    `  • Gasoline Saved: ${environmental.gasSaved.toLocaleString()} gallons`
  ], 20, startY + 185);

  return doc.output('arraybuffer');
}