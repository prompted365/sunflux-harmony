import { generateHeaderSection } from './sections/header.ts';
import { generateMetricsSection } from './sections/metrics.ts';
import { generateFinancialSection } from './sections/financial.ts';
import { generateChartSection, generateChartScript } from './sections/charts.ts';
import { generateStyles } from './styles.ts';

export function generateReportHtml(data: any): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Solar Installation Analysis - SunLink.ai</title>
        <script src="https://cdn.jsdelivr.net/npm/chart.js@3.7.0/dist/chart.min.js"></script>
        <style>
          ${generateStyles()}
        </style>
    </head>
    <body>
        ${generateHeaderSection(data)}
        ${generateMetricsSection(data)}
        ${generateFinancialSection(data)}
        ${generateChartSection(data)}
        <script>
          ${generateChartScript(data)}
        </script>
    </body>
    </html>
  `;
}