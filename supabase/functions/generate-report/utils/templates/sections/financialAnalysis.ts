import { formatCurrency } from '../utils/formatters';

export const generateFinancialAnalysis = (data: any) => `
<div class="section financial-analysis">
    <h2 class="section-title">Financial Benefits</h2>
    <div class="grid">
        <div class="metric-card highlight">
            <div class="metric-title">Initial Investment</div>
            <div class="metric-value">${formatCurrency(data.initialInvestment)}</div>
            <div class="metric-subtitle">Before incentives</div>
        </div>
        <div class="metric-card success">
            <div class="metric-title">Federal Tax Credit</div>
            <div class="metric-value">-${formatCurrency(data.federalTaxCredit)}</div>
            <div class="metric-subtitle">30% of system cost</div>
        </div>
        <div class="metric-card">
            <div class="metric-title">Monthly Savings</div>
            <div class="metric-value">${formatCurrency(data.monthlySavings)}</div>
            <div class="metric-subtitle">Average utility savings</div>
        </div>
        <div class="metric-card">
            <div class="metric-title">Payback Period</div>
            <div class="metric-value">${data.paybackPeriod.toFixed(1)} Years</div>
            <div class="metric-subtitle">Return on investment</div>
        </div>
    </div>
    
    <div class="savings-timeline">
        <h3>Long-term Savings</h3>
        <div class="grid">
            <div class="metric-card">
                <div class="metric-title">5-Year Savings</div>
                <div class="metric-value">${formatCurrency(data.fiveYearSavings)}</div>
            </div>
            <div class="metric-card">
                <div class="metric-title">10-Year Savings</div>
                <div class="metric-value">${formatCurrency(data.tenYearSavings)}</div>
            </div>
            <div class="metric-card">
                <div class="metric-title">25-Year Savings</div>
                <div class="metric-value">${formatCurrency(data.twentyFiveYearSavings)}</div>
            </div>
        </div>
    </div>
</div>
`;