export function generateStyles(): string {
  return `
    :root {
      --primary: #00B2B2;
      --primary-light: #33c3c3;
      --secondary: #F5F7FA;
      --text: #2D3748;
      --accent: #E2E8F0;
      --success: #38A169;
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