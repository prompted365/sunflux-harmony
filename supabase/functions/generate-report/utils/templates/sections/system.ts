export function generateSystemSection(data: any): string {
  return `
    <div class="card">
      <div class="section-title">System Details</div>
      <div class="specs-grid">
        <div>
          <h3>Installation Specifications</h3>
          <div class="spec-item">
            <span>Panel Capacity:</span>
            <strong>${data.specifications.panelCapacity} watts</strong>
          </div>
          <div class="spec-item">
            <span>System Size:</span>
            <strong>${data.specifications.systemSize.toFixed(1)} kW</strong>
          </div>
          <div class="spec-item">
            <span>Panel Dimensions:</span>
            <strong>${data.specifications.panelDimensions.height}m × ${data.specifications.panelDimensions.width}m</strong>
          </div>
          <div class="spec-item">
            <span>Annual Sun Hours:</span>
            <strong>${data.specifications.annualSunHours} hours</strong>
          </div>
        </div>
        <div>
          <h3>Performance Metrics</h3>
          <div class="spec-item">
            <span>Energy Offset:</span>
            <strong>${data.specifications.energyOffset.toFixed(1)}%</strong>
          </div>
          <div class="spec-item">
            <span>Daily Production:</span>
            <strong>${data.specifications.dailyProduction.toFixed(1)} kWh</strong>
          </div>
          <div class="spec-item">
            <span>Monthly Production:</span>
            <strong>${data.specifications.monthlyProduction.toFixed(1)} kWh</strong>
          </div>
          <div class="spec-item">
            <span>System Efficiency:</span>
            <strong>${data.specifications.systemEfficiency.toFixed(1)}%</strong>
          </div>
        </div>
      </div>
    </div>
  `;
}