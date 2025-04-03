
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface SalesChartData {
  name: string;
  Vendas: number;
  Receita: number;
}

interface SalesChartProps {
  data: SalesChartData[];
}

export const SalesChart: React.FC<SalesChartProps> = ({ data }) => {
  return (
    <ChartContainer
      config={{
        Vendas: {
          color: "#8884d8",
          label: "Vendas",
        },
        Receita: {
          color: "#82ca9d",
          label: "Receita",
        },
      }}
      className="h-full w-full"
    >
      <BarChart
        data={data}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 70,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey="name" 
          angle={-45} 
          textAnchor="end" 
          height={70} 
          tick={{ fontSize: 11 }} 
        />
        <YAxis yAxisId="left" label={{ value: 'Quantidade', angle: -90, position: 'insideLeft' }} />
        <YAxis yAxisId="right" orientation="right" label={{ value: 'Receita (R$)', angle: 90, position: 'insideRight' }} />
        <Tooltip content={<ChartTooltipContent />} />
        <Bar dataKey="Vendas" yAxisId="left" fill="var(--color-Vendas)" barSize={30} />
        <Bar dataKey="Receita" yAxisId="right" fill="var(--color-Receita)" barSize={30} />
      </BarChart>
    </ChartContainer>
  );
};
