export function generatePropertySection(data: any): string {
  return `
    <div class="card">
      <div class="section-title">Property Analysis</div>
      <div class="imagery-grid">
        <div class="imagery-box">
          <img src="${data.property.satelliteImage}" alt="Satellite View">
          <div class="imagery-overlay">Satellite View</div>
        </div>
        <div class="imagery-box">
          <img src="${data.property.solarAnalysisImage}" alt="Solar Analysis">
          <div class="imagery-overlay">Solar Potential Analysis</div>
        </div>
      </div>
      <div class="solar-stats">
        <div class="stat-item">
          <div class="stat-value">${data.systemMetrics.roofSuitability}%</div>
          <div class="stat-label">Roof Suitability</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">${formatNumber(data.systemMetrics.availableArea, 2)} m²</div>
          <div class="stat-label">Available Area</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">${data.systemMetrics.orientation}</div>
          <div class="stat-label">Optimal Orientation</div>
        </div>
      </div>
    </div>
  `;
}
