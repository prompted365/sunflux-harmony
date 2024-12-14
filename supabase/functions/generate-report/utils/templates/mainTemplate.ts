import { generateHeaderSection } from './sections/header';
import { generatePropertySection } from './sections/property';
import { generateMetricsSection } from './sections/metrics';
import { generateFinancialSection } from './sections/financial';
import { generateSystemSection } from './sections/system';
import { generateStyles } from './styles';
import { generateChartScript } from './charts';

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