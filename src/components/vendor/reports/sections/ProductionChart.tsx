import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Card } from "@/components/ui/card";

interface ProductionChartProps {
  monthlyProduction: Array<{
    month: string;
    production: number;
    average: number;
  }>;
}

const ProductionChart = ({ monthlyProduction }: ProductionChartProps) => {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Monthly Production Forecast</h3>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={monthlyProduction}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis 
              label={{ 
                value: 'Energy (kWh)', 
                angle: -90, 
                position: 'insideLeft' 
              }}
            />
            <Tooltip 
              formatter={(value: number) => [`${value.toFixed(0)} kWh`, '']}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="production" 
              stroke="#2563eb" 
              name="Predicted Production"
              strokeWidth={2}
            />
            <Line 
              type="monotone" 
              dataKey="average" 
              stroke="#9333ea" 
              name="Regional Average"
              strokeWidth={2}
              strokeDasharray="5 5"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default ProductionChart;