import { generateReportHtml } from "./templates/mainTemplate.ts";
import { transformCalculationToReportData } from "./dataTransformer.ts";

export async function generateEnhancedReport(calculation: any, propertyAddress: string) {
  try {
    // Transform raw calculation data into report-ready format
    const reportData = transformCalculationToReportData(calculation, propertyAddress);
    
    // Generate HTML using the transformed data
    return generateReportHtml(reportData);
  } catch (error) {
    console.error('Report generation error:', error);
    throw error;
  }
}