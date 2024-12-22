import { generateBaseTemplate } from './templates/baseTemplate';
import { formatCurrency, formatNumber, formatDate } from './formatters';

export const generateReport = (data: any): string => {
    const content = `
        <div class="section">
            <h1 class="section-title">Solar Installation Report</h1>
            <p>Generated on ${formatDate(new Date())}</p>
            <p>${data.propertyAddress || 'Property address unavailable'}</p>
        </div>

        <div class="section">
            <h2 class="section-title">System Specifications</h2>
            <div class="grid">
                <div class="metric-card">
                    <div class="metric-title">System Size</div>
                    <div class="metric-value">${formatNumber(data.systemSize || 0)} kW</div>
                </div>
                <div class="metric-card">
                    <div class="metric-title">Annual Production</div>
                    <div class="metric-value">${formatNumber(data.annualProduction || 0)} kWh</div>
                </div>
            </div>
        </div>

        <div class="section">
            <h2 class="section-title">Financial Benefits</h2>
            <div class="grid">
                <div class="metric-card">
                    <div class="metric-title">Initial Investment</div>
                    <div class="metric-value">${formatCurrency(data.initialInvestment || 0)}</div>
                    <div class="metric-subtitle">Before incentives</div>
                </div>
                <div class="metric-card">
                    <div class="metric-title">Federal Tax Credit</div>
                    <div class="metric-value">-${formatCurrency(data.federalTaxCredit || 0)}</div>
                    <div class="metric-subtitle">30% of system cost</div>
                </div>
                <div class="metric-card">
                    <div class="metric-title">Monthly Savings</div>
                    <div class="metric-value">${formatCurrency(data.monthlySavings || 0)}</div>
                    <div class="metric-subtitle">Average utility savings</div>
                </div>
            </div>
        </div>

        <div class="section">
            <h2 class="section-title">Environmental Impact</h2>
            <div class="grid">
                <div class="metric-card">
                    <div class="metric-title">Carbon Offset</div>
                    <div class="metric-value">${formatNumber(data.carbonOffset || 0)} tons/year</div>
                    <div class="metric-subtitle">CO₂ emissions reduced</div>
                </div>
                <div class="metric-card">
                    <div class="metric-title">Trees Equivalent</div>
                    <div class="metric-value">${formatNumber(data.treesEquivalent || 0)}</div>
                    <div class="metric-subtitle">Trees planted</div>
                </div>
            </div>
        </div>
    `;

    return generateBaseTemplate().replace('{{content}}', content);
};