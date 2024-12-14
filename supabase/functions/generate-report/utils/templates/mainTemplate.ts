import { generateHeaderSection } from './sections/header.ts';
import { generatePropertySection } from './sections/property.ts';
import { generateMetricsSection } from './sections/metrics.ts';
import { generateFinancialSection } from './sections/financial.ts';
import { generateSystemSection } from './sections/system.ts';
import { generateStyles } from './styles.ts';
import { generateChartScript } from './charts.ts';

export function generateReportHtml(data: any): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Solar Installation Proposal</title>
        <script src="https://cdn.jsdelivr.net/npm/chart.js@3.7.0/dist/chart.min.js"></script>
        <style>
          ${generateStyles()}
        </style>
    </head>
    <body>
        ${generateHeaderSection(data)}
        ${generatePropertySection(data)}
        ${generateMetricsSection(data)}
        ${generateFinancialSection(data)}
        ${generateSystemSection(data)}
        <script>
          ${generateChartScript(data)}
        </script>
    </body>
    </html>
  `;
}