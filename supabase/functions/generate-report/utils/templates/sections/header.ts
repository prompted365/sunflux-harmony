export function generateHeaderSection(data: any): string {
  return `
    <div class="header">
      <h1>Solar Installation Proposal</h1>
      <p>Generated on: ${data.generatedDate}</p>
      <p>${data.propertyAddress}</p>
    </div>
  `;
}