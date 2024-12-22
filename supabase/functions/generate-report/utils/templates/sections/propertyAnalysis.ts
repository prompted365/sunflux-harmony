export const generatePropertyAnalysis = (data: any) => `
<div class="section property-analysis">
    <h2 class="section-title">Property Analysis</h2>
    <div class="grid">
        <div class="metric-card">
            <div class="metric-title">Roof Suitability</div>
            <div class="metric-value">${data.roofSuitability}%</div>
            <div class="metric-subtitle">Overall solar potential</div>
        </div>
        <div class="metric-card">
            <div class="metric-title">Available Roof Area</div>
            <div class="metric-value">${data.availableArea.toFixed(1)} m²</div>
            <div class="metric-subtitle">Suitable for solar panels</div>
        </div>
        <div class="metric-card">
            <div class="metric-title">Annual Sun Hours</div>
            <div class="metric-value">${data.annualSunHours.toFixed(0)}</div>
            <div class="metric-subtitle">Hours of usable sunlight</div>
        </div>
    </div>
</div>
`;