export function generateStyles(): string {
  return `
    :root {
      --primary: #C84B31;
      --primary-light: #FFAA5A;
      --secondary: #F5F7FA;
      --text: #1F2937;
      --accent: #FFAA5A;
      --success: #2D3A3A;
      --card-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      --transition: all 0.3s ease;
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

    .header {
      text-align: center;
      margin-bottom: 40px;
      padding: 30px;
      background: white;
      border-radius: 12px;
      box-shadow: var(--card-shadow);
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
    }

    .logo-container {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 1rem;
    }

    .logo {
      width: 64px;
      height: auto;
    }

    .brand-name {
      font-size: 1.5rem;
      color: var(--primary);
      font-weight: bold;
    }

    .metric-card {
      background: var(--primary);
      color: white;
      padding: 2rem;
      border-radius: 12px;
      margin-bottom: 1.5rem;
    }

    .metric-title {
      font-size: 1.5rem;
      font-weight: bold;
      margin-bottom: 0.5rem;
    }

    .metric-value {
      font-size: 2.5rem;
      font-weight: bold;
      margin-bottom: 0.5rem;
    }

    .metric-subtitle {
      font-size: 1rem;
      opacity: 0.9;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1.5rem;
      margin: 2rem 0;
    }

    .stat-card {
      background: white;
      padding: 1.5rem;
      border-radius: 12px;
      text-align: center;
      box-shadow: var(--card-shadow);
    }

    .stat-value {
      font-size: 1.8rem;
      font-weight: bold;
      color: var(--primary);
      margin-bottom: 0.5rem;
    }

    .stat-label {
      color: var(--text);
      font-size: 1rem;
    }

    .section {
      background: white;
      padding: 2rem;
      border-radius: 12px;
      margin-bottom: 2rem;
      box-shadow: var(--card-shadow);
    }

    .section-title {
      font-size: 1.5rem;
      color: var(--primary);
      margin-bottom: 1.5rem;
      font-weight: bold;
    }

    .financial-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 15px;
      margin-bottom: 30px;
    }

    .financial-box {
      border: 2px solid var(--accent);
      padding: 20px;
      border-radius: 12px;
      transition: var(--transition);
    }

    .financial-box:hover {
      border-color: var(--primary);
    }

    .specs-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 30px;
    }

    .spec-item {
      display: flex;
      justify-content: space-between;
      margin-bottom: 10px;
      padding-bottom: 5px;
      border-bottom: 1px solid var(--accent);
      transition: var(--transition);
    }

    .chart-container {
      background: white;
      padding: 2rem;
      border-radius: 12px;
      margin: 2rem 0;
      box-shadow: var(--card-shadow);
    }

    @media print {
      body {
        background: white;
      }
      
      .section {
        break-inside: avoid;
      }
    }
  `;
}