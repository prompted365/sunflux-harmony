import { formatDate } from '../utils/formatters';

export const generateHeader = (data: any) => `
<div class="section header">
    <div class="logo-container">
        <img src="${data.logoUrl || '/logo.png'}" alt="Company Logo" class="logo" />
    </div>
    <h1 class="report-title">Solar Installation Analysis</h1>
    <div class="report-meta">
        <p>Generated on ${formatDate(new Date())}</p>
        <p class="property-address">${data.propertyAddress}</p>
    </div>
    ${generateImagerySection(data.buildingSpecs?.imagery)}
</div>
`;

const generateImagerySection = (imagery: any) => {
    if (!imagery) return '';
    
    return `
    <div class="imagery-grid">
        ${imagery.rgb ? `
        <div class="imagery-box">
            <img src="${imagery.rgb}" alt="Property Aerial View" />
            <div class="imagery-overlay">Aerial View</div>
        </div>
        ` : ''}
        ${imagery.annualFlux ? `
        <div class="imagery-box">
            <img src="${imagery.annualFlux}" alt="Solar Analysis" />
            <div class="imagery-overlay">Solar Potential Analysis</div>
        </div>
        ` : ''}
    </div>
    `;
};