export function generateFinancialSection(data: any): string {
  return `
    <div class="card">
      <div class="section-title">Financial Analysis</div>
      <div class="financial-grid">
        <div class="financial-box">
          <div class="metric-title">System Cost</div>
          <div class="metric-value">${formatCurrency(data.financial.systemCost)}</div>
          <div class="metric-subtitle">Before incentives</div>
        </div>
        <div class="financial-box">
          <div class="metric-title">Federal Tax Credit</div>
          <div class="metric-value" style="color: var(--success)">-${formatCurrency(data.financial.federalTaxCredit)}</div>
          <div class="metric-subtitle">30% of system cost</div>
        </div>
        <div class="financial-box">
          <div class="metric-title">Net Cost</div>
          <div class="metric-value">${formatCurrency(data.financial.netCost)}</div>
          <div class="metric-subtitle">After incentives</div>
        </div>
        <div class="financial-box">
          <div class="metric-title">Payback Period</div>
          <div class="metric-value">${formatNumber(data.financial.paybackPeriod, 1)} years</div>
          <div class="metric-subtitle">Break-even timeline</div>
        </div>
      </div>
    </div>
  `;
}
