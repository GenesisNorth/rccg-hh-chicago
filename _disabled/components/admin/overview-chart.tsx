"use client";

import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

interface ChartData {
  name: string;
  users: number;
  sermons: number;
  donations: number;
}

interface OverviewChartProps {
  data: ChartData[];
}

export function OverviewChart({ data }: OverviewChartProps) {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis 
            dataKey="name" 
            className="text-xs fill-muted-foreground"
            axisLine={false}
            tickLine={false}
          />
          <YAxis 
            className="text-xs fill-muted-foreground"
            axisLine={false}
            tickLine={false}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'hsl(var(--background))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '6px',
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
            }}
            labelStyle={{ color: 'hsl(var(--foreground))' }}
          />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="users" 
            stroke="hsl(var(--primary))" 
            strokeWidth={2}
            dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
            name="New Users"
          />
          <Line 
            type="monotone" 
            dataKey="sermons" 
            stroke="hsl(var(--destructive))" 
            strokeWidth={2}
            dot={{ fill: 'hsl(var(--destructive))', strokeWidth: 2, r: 4 }}
            name="Sermons"
          />
          <Line 
            type="monotone" 
            dataKey="donations" 
            stroke="hsl(var(--secondary))" 
            strokeWidth={2}
            dot={{ fill: 'hsl(var(--secondary))', strokeWidth: 2, r: 4 }}
            name="Donations (₦000s)"
            scale="linear"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}