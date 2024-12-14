export function generateMetricsSection(data: any): string {
  return `
    <div class="grid">
      <div class="metric-box blue-bg">
        <div class="metric-title">Recommended System</div>
        <div class="metric-value">${formatNumber(data.systemMetrics.panelCount)} Panels</div>
        <div class="metric-subtitle">Optimal configuration for your usage</div>
      </div>
      <div class="metric-box green-bg">
        <div class="metric-title">Annual Production</div>
        <div class="metric-value">${formatNumber(data.systemMetrics.annualProduction)} kWh</div>
        <div class="metric-subtitle">Estimated yearly energy</div>
      </div>
      <div class="metric-box yellow-bg">
        <div class="metric-title">Carbon Offset</div>
        <div class="metric-value">${formatNumber(data.systemMetrics.carbonOffset)} kg</div>
        <div class="metric-subtitle">Annual CO2 reduction</div>
      </div>
    </div>
  `;
}
