export function generateChartSection(data: any): string {
  return `
    <div class="section">
      <div class="section-title">Return on Investment Projection</div>
      <div class="chart-container">
        <canvas id="roiChart"></canvas>
      </div>
      <div style="background: var(--success); color: white; padding: 15px; border-radius: 8px; margin-top: 20px; text-align: center;">
        <strong>ROI Inflection Point: ${data.financial.paybackPeriod.toFixed(1)} years</strong>
        <br>
        <small>After this date, your system generates pure profit!</small>
      </div>
    </div>
  `;
}

export function generateChartScript(data: any): string {
  return `
    window.addEventListener('load', function() {
      const ctx = document.getElementById('roiChart').getContext('2d');
      const initialCost = ${data.financial.netCost};
      const annualSavings = ${data.financial.annualSavings};
      const labels = Array.from({length: 20}, (_, i) => \`Year \${i + 1}\`);
      
      const chartData = labels.map((_, i) => {
        const totalSavings = annualSavings * (i + 1);
        return totalSavings - initialCost;
      });

      new Chart(ctx, {
        type: 'line',
        data: {
          labels: labels,
          datasets: [{
            label: 'Net Financial Position ($)',
            data: chartData,
            borderColor: '#C84B31',
            backgroundColor: 'rgba(200, 75, 49, 0.1)',
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
  `;
}