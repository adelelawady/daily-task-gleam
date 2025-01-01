import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { MonthlyStats } from '../../utils/statistics';

interface MonthlyCompletionChartProps {
  data: MonthlyStats[];
}

export default function MonthlyCompletionChart({ data }: MonthlyCompletionChartProps) {
  return (
    <div className="h-[400px] w-full">
      <ResponsiveContainer>
        <AreaChart data={data}>
          <XAxis dataKey="month" />
          <YAxis
            tickFormatter={(value) => `${value}%`}
            domain={[0, 100]}
          />
          <Tooltip 
            formatter={(value: number) => [`${value.toFixed(1)}%`, 'Completion Rate']}
            contentStyle={{ backgroundColor: 'white', borderRadius: '8px' }}
          />
          <Area
            type="monotone"
            dataKey="completionRate"
            stroke="#6366f1"
            fill="#6366f1"
            fillOpacity={0.2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}