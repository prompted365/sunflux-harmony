export const generateBaseTemplate = () => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Solar Installation Analysis - SunLink.ai</title>
    <script src="https://cdn.jsdelivr.net/npm/chart.js@3.7.0/dist/chart.min.js"></script>
    <style>
      ${generateBaseStyles()}
    </style>
</head>
<body>
    <div class="report-container">
        {{header}}
        {{propertyAnalysis}}
        {{systemSpecs}}
        {{financialAnalysis}}
        {{roiTimeline}}
        {{environmentalImpact}}
        {{nextSteps}}
    </div>
    <script>
      {{chartScripts}}
    </script>
</body>
</html>
`;

const generateBaseStyles = () => `
:root {
    --primary: #00B2B2;
    --primary-light: #33c3c3;
    --secondary: #F5F7FA;
    --text: #2D3748;
    --accent: #E2E8F0;
    --success: #38A169;
    --card-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

body {
    font-family: Arial, sans-serif;
    line-height: 1.6;
    color: var(--text);
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
    background: var(--secondary);
}

.report-container {
    background: white;
    border-radius: 8px;
    box-shadow: var(--card-shadow);
    overflow: hidden;
}

.section {
    padding: 2rem;
    border-bottom: 1px solid var(--accent);
}

.section:last-child {
    border-bottom: none;
}

.section-title {
    color: var(--primary);
    font-size: 1.5rem;
    font-weight: bold;
    margin-bottom: 1.5rem;
}

.grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.5rem;
}

.metric-card {
    background: white;
    padding: 1.5rem;
    border-radius: 8px;
    box-shadow: var(--card-shadow);
}

.metric-title {
    color: var(--text);
    font-size: 0.875rem;
    font-weight: 500;
}

.metric-value {
    color: var(--primary);
    font-size: 1.5rem;
    font-weight: bold;
    margin: 0.5rem 0;
}

.metric-subtitle {
    color: var(--text);
    font-size: 0.75rem;
    opacity: 0.8;
}

@media (max-width: 768px) {
    .grid {
        grid-template-columns: 1fr;
    }
}
`;