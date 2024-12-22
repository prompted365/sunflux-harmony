export const generateBaseTemplate = () => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Solar Installation Report</title>
    <style>
        :root {
            --primary: #00B2B2;
            --secondary: #F5F7FA;
            --text: #2D3748;
            --accent: #E2E8F0;
            --success: #38A169;
        }

        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: var(--text);
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
        }

        .section {
            margin-bottom: 2rem;
            padding: 1.5rem;
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .section-title {
            color: var(--primary);
            font-size: 1.5rem;
            margin-bottom: 1rem;
        }

        .grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 1rem;
        }

        .metric-card {
            padding: 1rem;
            background: var(--secondary);
            border-radius: 6px;
        }

        .metric-title {
            font-weight: 600;
            margin-bottom: 0.5rem;
        }

        .metric-value {
            font-size: 1.25rem;
            font-weight: bold;
            color: var(--primary);
        }

        .metric-subtitle {
            font-size: 0.875rem;
            color: #666;
        }

        .chart-container {
            width: 100%;
            height: 400px;
            margin: 2rem 0;
        }
    </style>
</head>
<body>
    {{content}}
</body>
</html>
`;