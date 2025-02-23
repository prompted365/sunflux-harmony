export function generateReportHtml(data: any): string {
  // Format numbers for display
  const formatNumber = (num: number, decimals = 0) => 
    num.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
  
  const formatCurrency = (num: number) => 
    num.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Solar Installation Proposal</title>
        <script src="https://cdn.jsdelivr.net/npm/chart.js@3.7.0/dist/chart.min.js"></script>
        <style>
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
    </head>
    <body>
        <div class="header">
            <h1>Solar Installation Proposal</h1>
            <p>Generated on: ${data.property.generatedDate}</p>
            <p>${data.property.address}</p>
        </div>

        <div class="card">
            <div class="section-title">Property Analysis</div>
            <div class="imagery-grid">
                <div class="imagery-box">
                    <img src="${data.property.satelliteImage}" alt="Satellite View">
                    <div class="imagery-overlay">Satellite View</div>
                </div>
                <div class="imagery-box">
                    <img src="${data.property.solarAnalysisImage}" alt="Solar Analysis">
                    <div class="imagery-overlay">Solar Potential Analysis</div>
                </div>
            </div>
            <div class="solar-stats">
                <div class="stat-item">
                    <div class="stat-value">${data.systemMetrics.roofSuitability}%</div>
                    <div class="stat-label">Roof Suitability</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">${formatNumber(data.systemMetrics.availableArea, 2)} m²</div>
                    <div class="stat-label">Available Area</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">${data.systemMetrics.orientation}</div>
                    <div class="stat-label">Optimal Orientation</div>
                </div>
            </div>
        </div>

        <div class="grid">
            <div class="metric-box blue-bg">
                <div class="metric-title">Recommended System</div>
                <div class="metric-value">${formatNumber(data.systemMetrics.panelCount)} Panels</div>
                <div class="metric-subtitle">Optimal configuration for your usage</div>
            </div>
            <div class="metric-box green-bg">
                <div class="metric-title">Annual Production</div>
                <div class="metric-value">${formatNumber(data.systemMetrics.annualProduction)} kWh</div>
                <div class="metric-subtitle">Estimated yearly energy</div>
            </div>
            <div class="metric-box yellow-bg">
                <div class="metric-title">Carbon Offset</div>
                <div class="metric-value">${formatNumber(data.systemMetrics.carbonOffset)} kg</div>
                <div class="metric-subtitle">Annual CO2 reduction</div>
            </div>
        </div>

        <div class="card">
            <div class="section-title">Financial Analysis</div>
            <div class="financial-grid">
                <div class="financial-box">
                    <div class="metric-title">System Cost</div>
                    <div class="metric-value">${formatCurrency(data.financial.systemCost)}</div>
                    <div class="metric-subtitle">Before incentives</div>
                </div>
                <div class="financial-box">
                    <div class="metric-title">Federal Tax Credit</div>
                    <div class="metric-value" style="color: var(--success)">-${formatCurrency(data.financial.federalTaxCredit)}</div>
                    <div class="metric-subtitle">30% of system cost</div>
                </div>
                <div class="financial-box">
                    <div class="metric-title">Net Cost</div>
                    <div class="metric-value">${formatCurrency(data.financial.netCost)}</div>
                    <div class="metric-subtitle">After incentives</div>
                </div>
                <div class="financial-box">
                    <div class="metric-title">Payback Period</div>
                    <div class="metric-value">${formatNumber(data.financial.paybackPeriod, 1)} years</div>
                    <div class="metric-subtitle">Break-even timeline</div>
                </div>
            </div>
        </div>

        <div class="card">
            <div class="section-title">Return on Investment Projection</div>
            <div class="roi-chart">
                <canvas id="roiChart"></canvas>
            </div>
            <div class="inflection-point">
                ROI Inflection Point: ${formatNumber(data.financial.paybackPeriod, 1)} years
                <br>
                <small>After this date, your system generates pure profit!</small>
            </div>
        </div>

        <div class="card">
            <div class="section-title">System Details</div>
            <div class="specs-grid">
                <div>
                    <h3>Installation Specifications</h3>
                    <div class="spec-item">
                        <span>Panel Capacity:</span>
                        <strong>${formatNumber(data.specifications.panelCapacity)} watts</strong>
                    </div>
                    <div class="spec-item">
                        <span>System Size:</span>
                        <strong>${formatNumber(data.specifications.systemSize, 1)} kW</strong>
                    </div>
                    <div class="spec-item">
                        <span>Panel Dimensions:</span>
                        <strong>${formatNumber(data.specifications.panelDimensions.height, 2)}m × ${formatNumber(data.specifications.panelDimensions.width, 2)}m</strong>
                    </div>
                    <div class="spec-item">
                        <span>Annual Sun Hours:</span>
                        <strong>${formatNumber(data.specifications.annualSunHours)} hours</strong>
                    </div>
                </div>
                <div>
                    <h3>Performance Metrics</h3>
                    <div class="spec-item">
                        <span>Energy Offset:</span>
                        <strong>${formatNumber(data.specifications.energyOffset, 1)}%</strong>
                    </div>
                    <div class="spec-item">
                        <span>Daily Production:</span>
                        <strong>${formatNumber(data.specifications.dailyProduction, 1)} kWh</strong>
                    </div>
                    <div class="spec-item">
                        <span>Monthly Production:</span>
                        <strong>${formatNumber(data.specifications.monthlyProduction, 1)} kWh</strong>
                    </div>
                    <div class="spec-item">
                        <span>System Efficiency:</span>
                        <strong>${formatNumber(data.specifications.systemEfficiency, 1)}%</strong>
                    </div>
                </div>
            </div>
        </div>

        <div class="card">
            <div class="section-title">20-Year Financial Summary</div>
            <div class="specs-grid">
                <div>
                    <div class="spec-item">
                        <span>Total Energy Savings:</span>
                        <strong>${formatCurrency(data.summary.totalEnergySavings)}</strong>
                    </div>
                    <div class="spec-item">
                        <span>Monthly Average Savings:</span>
                        <strong>${formatCurrency(data.summary.monthlySavings)}</strong>
                    </div>
                    <div class="spec-item">
                        <span>Return on Investment:</span>
                        <strong>${formatNumber(data.summary.returnOnInvestment, 1)}%</strong>
                    </div>
                </div>
                <div>
                    <div class="spec-item">
                        <span>Lifetime Energy Production:</span>
                        <strong>${formatNumber(data.summary.lifetimeProduction)} kWh</strong>
                    </div>
                    <div class="spec-item">
                        <span>Total Carbon Offset:</span>
                        <strong>${formatNumber(data.summary.totalCarbonOffset)} kg</strong>
                    </div>
                    <div class="spec-item">
                        <span>Equivalent Trees Planted:</span>
                        <strong>${formatNumber(data.summary.treesEquivalent)} trees</strong>
                    </div>
                </div>
            </div>
        </div>

        <script>
            window.addEventListener('load', function() {
                const ctx = document.getElementById('roiChart').getContext('2d');
                const initialCost = ${data.financial.netCost}; // After tax credits
                const annualSavings = ${data.financial.annualSavings}; // Annual utility savings
                const labels = Array.from({length: 20}, (_, i) => \`Year \${i + 1}\`);
                
                const data = labels.map((_, i) => {
                    const totalSavings = annualSavings * (i + 1);
                    return totalSavings - initialCost;
                });

                new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: labels,
                        datasets: [{
                            label: 'Net Financial Position ($)',
                            data: data,
                            borderColor: '#00B2B2',
                            backgroundColor: 'rgba(0, 178, 178, 0.1)',
                            fill: true,
                            tension: 0.4
                        }]
                    },
                    options: {
                        responsive: true,
                        plugins: {
                            legend: {
                                position: 'top',
                            },
                            tooltip: {
                                callbacks: {
                                    label: function(context) {
                                        const value = context.parsed.y;
                                        return \`Net Position: \${value.toLocaleString('en-US', {
                                            style: 'currency',
                                            currency: 'USD'
                                        })}\`;
                                    }
                                }
                            }
                        },
                        scales: {
                            y: {
                                beginAtZero: true,
                                ticks: {
                                    callback: function(value) {
                                        return value.toLocaleString('en-US', {
                                            style: 'currency',
                                            currency: 'USD'
                                        });
                                    }
                                }
                            }
                        }
                    }
                });
            });
        </script>
    </body>
    </html>
  `;
}
