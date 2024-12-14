export function generateSystemSection(data: any): string {
  return `
    <div class="card">
      <div class="section-title">System Details</div>
      <div class="specs-grid">
        <div>
          <h3>Installation Specifications</h3>
          <div class="spec-item">
            <span>Panel Capacity:</span>
            <strong>${formatNumber(data.specifications.panelCapacity)} watts</strong>
          </div>
          <div class="spec-item">
            <span>System Size:</span>
            <strong>${formatNumber(data.specifications.systemSize, 1)} kW</strong>
          </div>
          <div class="spec-item">
            <span>Panel Dimensions:</span>
            <strong>${formatNumber(data.specifications.panelDimensions.height, 2)}m × ${formatNumber(data.specifications.panelDimensions.width, 2)}m</strong>
          </div>
          <div class="spec-item">
            <span>Annual Sun Hours:</span>
            <strong>${formatNumber(data.specifications.annualSunHours)} hours</strong>
          </div>
        </div>
        <div>
          <h3>Performance Metrics</h3>
          <div class="spec-item">
            <span>Energy Offset:</span>
            <strong>${formatNumber(data.specifications.energyOffset, 1)}%</strong>
          </div>
          <div class="spec-item">
            <span>Daily Production:</span>
            <strong>${formatNumber(data.specifications.dailyProduction, 1)} kWh</strong>
          </div>
          <div class="spec-item">
            <span>Monthly Production:</span>
            <strong>${formatNumber(data.specifications.monthlyProduction, 1)} kWh</strong>
          </div>
          <div class="spec-item">
            <span>System Efficiency:</span>
            <strong>${formatNumber(data.specifications.systemEfficiency, 1)}%</strong>
          </div>
        </div>
      </div>
    </div>
  `;
}
