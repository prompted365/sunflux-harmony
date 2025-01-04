export function generateHeaderSection(data: any): string {
  return `
    <div class="header">
      <div class="logo-container">
        <img 
          src="/lovable-uploads/b72825ac-f807-4e0e-8dd7-d11fa7046731.png" 
          alt="SunLink.ai Logo" 
          class="logo"
        />
        <span class="brand-name">SunLink.ai</span>
      </div>
      <h1>Solar Installation Analysis</h1>
      <p>Generated on: ${data.generatedDate}</p>
      <p>${data.propertyAddress}</p>
    </div>
  `;
}