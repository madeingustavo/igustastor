
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface SalesPieChartData {
  name: string;
  value: number;
  percentage: string;
}

interface SalesPieChartProps {
  data: SalesPieChartData[];
}

export const SalesPieChart: React.FC<SalesPieChartProps> = ({ data }) => {
  // Generate colors based on percentage
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];
  
  // Format data for tooltip
  const formattedData = data.map((item, index) => ({
    ...item,
    color: COLORS[index % COLORS.length],
    label: `${item.name}: ${item.percentage}%`
  }));

  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-background p-2 border border-border shadow-md rounded-md">
          <p className="font-medium">{data.name}</p>
          <p className="text-sm">Vendas: {data.value}</p>
          <p className="text-sm">{data.percentage}% do total</p>
        </div>
      );
    }
    return null;
  };

  return (
    <ChartContainer
      config={Object.fromEntries(
        formattedData.map((item) => [
          item.name,
          {
            color: item.color,
            label: item.label,
          },
        ])
      )}
      className="h-full w-full"
    >
      <PieChart>
        <Pie
          data={formattedData}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={90}
          fill="#8884d8"
          dataKey="value"
          nameKey="name"
          label={({ name, percentage }) => `${name}: ${percentage}%`}
        >
          {formattedData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={`var(--color-${entry.name})`} />
          ))}
        </Pie>
        <Tooltip content={<ChartTooltipContent />} />
      </PieChart>
    </ChartContainer>
  );
};
