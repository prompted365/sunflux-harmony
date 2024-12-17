export function generateMetricsSection(data: any): string {
  return `
    <div class="metric-card">
      <div class="metric-title">Solar Potential Analysis</div>
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-value">${data.systemMetrics.roofSuitability}%</div>
          <div class="stat-label">Roof Suitability</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${data.systemMetrics.availableArea.toFixed(2)} m²</div>
          <div class="stat-label">Available Area</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${data.systemMetrics.orientation}</div>
          <div class="stat-label">Optimal Orientation</div>
        </div>
      </div>
    </div>

    <div class="metric-card">
      <div class="metric-title">Recommended System</div>
      <div class="metric-value">${data.systemMetrics.panelCount} Panels</div>
      <div class="metric-subtitle">Optimal configuration for your usage</div>
    </div>

    <div class="metric-card">
      <div class="metric-title">Annual Production</div>
      <div class="metric-value">${data.systemMetrics.annualProduction.toLocaleString()} kWh</div>
      <div class="metric-subtitle">Estimated yearly energy generation</div>
    </div>
  `;
}