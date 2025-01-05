import { Line, LineChart, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

interface ROIChartProps {
  timelineData: {
    year: number;
    value: number;
    savings: number;
  }[];
  breakEvenYear: number;
}

const ROIChart = ({ timelineData, breakEvenYear }: ROIChartProps) => {
  return (
    <div className="h-[400px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={timelineData}
          margin={{ top: 20, right: 30, left: 30, bottom: 20 }}
        >
          <XAxis 
            dataKey="year" 
            label={{ value: 'Years', position: 'bottom' }}
          />
          <YAxis 
            tickFormatter={(value) => `$${Math.abs(value).toLocaleString()}`}
            label={{ 
              value: 'Cumulative Savings ($)', 
              angle: -90, 
              position: 'left' 
            }}
          />
          <Tooltip 
            formatter={(value: number) => [`$${Math.abs(value).toLocaleString()}`, 'Net Position']}
            labelFormatter={(label) => `Year ${label}`}
          />
          <ReferenceLine 
            y={0} 
            stroke="#666" 
            strokeDasharray="3 3" 
            label={{ value: 'Break Even', position: 'right' }}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#00B2B2"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ROIChart;