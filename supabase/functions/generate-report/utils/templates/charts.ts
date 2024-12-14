export function generateChartScript(data: any): string {
  return `
    window.addEventListener('load', function() {
      const ctx = document.getElementById('roiChart').getContext('2d');
      const initialCost = ${data.financial.netCost}; // After tax credits
      const annualSavings = ${data.financial.annualSavings}; // Annual utility savings
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
  `;
}
