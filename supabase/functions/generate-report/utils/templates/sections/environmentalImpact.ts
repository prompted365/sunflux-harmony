export const generateEnvironmentalImpact = (data: any) => `
<div class="section environmental-impact">
    <h2 class="section-title">Environmental Impact</h2>
    <div class="grid">
        <div class="metric-card">
            <div class="metric-title">Carbon Offset</div>
            <div class="metric-value">${data.carbonOffset.toFixed(1)} tons/year</div>
            <div class="metric-subtitle">CO₂ emissions reduced</div>
        </div>
        <div class="metric-card">
            <div class="metric-title">Trees Equivalent</div>
            <div class="metric-value">${data.treesEquivalent.toLocaleString()}</div>
            <div class="metric-subtitle">Trees planted</div>
        </div>
        <div class="metric-card">
            <div class="metric-title">Homes Powered</div>
            <div class="metric-value">${data.homesPowered}</div>
            <div class="metric-subtitle">Annual home energy use</div>
        </div>
        <div class="metric-card">
            <div class="metric-title">Car Miles</div>
            <div class="metric-value">${data.carMiles.toLocaleString()}</div>
            <div class="metric-subtitle">Miles not driven</div>
        </div>
    </div>
</div>
`;