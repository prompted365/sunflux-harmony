import { formatCurrency } from '../utils/formatters';

export const generateROITimeline = (data: any) => `
<div class="section roi-timeline">
    <h2 class="section-title">Return on Investment Timeline</h2>
    <div class="chart-container">
        <canvas id="roiChart"></canvas>
    </div>
    <div class="roi-summary">
        <div class="grid">
            <div class="metric-card">
                <div class="metric-title">Initial Investment</div>
                <div class="metric-value">${formatCurrency(data.initialInvestment)}</div>
                <div class="metric-subtitle">After federal incentive</div>
            </div>
            <div class="metric-card">
                <div class="metric-title">Break Even Point</div>
                <div class="metric-value">${data.paybackPeriod.toFixed(1)} Years</div>
                <div class="metric-subtitle">Return on investment</div>
            </div>
            <div class="metric-card">
                <div class="metric-title">25-Year Savings</div>
                <div class="metric-value">${formatCurrency(data.lifetimeSavings)}</div>
                <div class="metric-subtitle">Total financial benefit</div>
            </div>
        </div>
    </div>
</div>

<script>
${generateROIChartScript(data)}
</script>
`;

const generateROIChartScript = (data: any) => `
window.addEventListener('load', function() {
    const ctx = document.getElementById('roiChart').getContext('2d');
    const chartData = ${JSON.stringify(data.roiChartData)};
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: chartData.labels,
            datasets: [{
                label: 'Cumulative Savings ($)',
                data: chartData.values,
                borderColor: '#00B2B2',
                backgroundColor: 'rgba(0, 178, 178, 0.1)',
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return 'Net Position: ' + 
                                context.raw.toLocaleString('en-US', {
                                    style: 'currency',
                                    currency: 'USD'
                                });
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
                                currency: 'USD',
                                maximumFractionDigits: 0
                            });
                        }
                    }
                }
            }
        }
    });
});
`;