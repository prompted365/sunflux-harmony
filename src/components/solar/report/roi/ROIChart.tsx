import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine } from 'recharts';

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
        <LineChart data={timelineData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="year" />
          <YAxis />
          <Tooltip 
            formatter={(value: number) => 
              new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                maximumFractionDigits: 0
              }).format(value)
            }
          />
          <ReferenceLine
            x={breakEvenYear}
            stroke="#10B981"
            label={{ value: 'Break Even', position: 'top' }}
            strokeDasharray="3 3"
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#2563EB"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ROIChart;