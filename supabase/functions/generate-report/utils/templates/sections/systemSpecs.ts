export const generateSystemSpecs = (data: any) => `
<div class="section system-specs">
    <h2 class="section-title">System Specifications</h2>
    <div class="grid">
        <div class="metric-card">
            <div class="metric-title">System Size</div>
            <div class="metric-value">${data.systemSize.toFixed(1)} kW</div>
            <div class="metric-subtitle">Total system capacity</div>
        </div>
        <div class="metric-card">
            <div class="metric-title">Annual Production</div>
            <div class="metric-value">${Math.round(data.annualProduction).toLocaleString()} kWh</div>
            <div class="metric-subtitle">Estimated yearly energy</div>
        </div>
        <div class="metric-card">
            <div class="metric-title">Panel Count</div>
            <div class="metric-value">${data.panelCount}</div>
            <div class="metric-subtitle">High-efficiency solar panels</div>
        </div>
        <div class="metric-card">
            <div class="metric-title">System Efficiency</div>
            <div class="metric-value">${data.systemEfficiency.toFixed(1)}%</div>
            <div class="metric-subtitle">Energy conversion rate</div>
        </div>
    </div>
</div>
`;