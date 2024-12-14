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
            transition: var(--transition);
        }

        .header:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
        }

        .grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 20px;
            margin-bottom: 30px;
        }

        .card {
            background: white;
            border-radius: 12px;
            padding: 25px;
            margin-bottom: 20px;
            box-shadow: var(--card-shadow);
            transition: var(--transition);
        }

        .card:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
        }

        .metric-box {
            padding: 20px;
            border-radius: 12px;
            margin-bottom: 15px;
            transition: var(--transition);
            box-shadow: var(--card-shadow);
        }

        .metric-box:hover {
            transform: translateY(-2px);
        }

        .blue-bg {
            background: var(--primary);
            color: white;
        }

        .green-bg {
            background: var(--primary-light);
            color: white;
        }

        .yellow-bg {
            background: var(--primary);
            color: white;
        }

        .metric-title {
            font-size: 16px;
            font-weight: 600;
            margin-bottom: 8px;
        }

        .metric-value {
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 4px;
        }

        .metric-subtitle {
            font-size: 12px;
            opacity: 0.9;
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

        .spec-item:hover {
            border-bottom-color: var(--primary);
        }

        .section-title {
            font-size: 22px;
            font-weight: bold;
            margin-bottom: 25px;
            color: var(--primary);
        }

        .imagery-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 20px;
            margin-bottom: 30px;
        }

        .imagery-box {
            border-radius: 12px;
            overflow: hidden;
            position: relative;
            box-shadow: var(--card-shadow);
            transition: var(--transition);
        }

        .imagery-box:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
        }

        .imagery-box img {
            width: 100%;
            height: 300px;
            object-fit: cover;
        }

        .imagery-overlay {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            background: rgba(0, 178, 178, 0.9);
            color: white;
            padding: 15px;
            font-size: 14px;
        }

        .solar-stats {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 10px;
            margin-top: 15px;
            background: white;
            padding: 15px;
            border-radius: 8px;
            box-shadow: var(--card-shadow);
        }

        .stat-item {
            text-align: center;
        }

        .stat-value {
            font-weight: bold;
            color: var(--primary);
        }

        .stat-label {
            font-size: 12px;
            color: var(--text);
        }

        .roi-chart {
            height: 400px;
            margin: 20px 0;
            padding: 20px;
            background: white;
            border-radius: 12px;
            box-shadow: var(--card-shadow);
        }

        .inflection-point {
            background: var(--success);
            color: white;
            padding: 15px;
            border-radius: 8px;
            margin-top: 20px;
            text-align: center;
            font-weight: bold;
        }

        @media (max-width: 768px) {
            .grid, .financial-grid, .specs-grid, .imagery-grid {
                grid-template-columns: 1fr;
            }
        }
        </style>
  `;
}
