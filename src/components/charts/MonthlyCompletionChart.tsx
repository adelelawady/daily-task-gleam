import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, TooltipProps } from 'recharts';
import { MonthlyStats } from '../../utils/statistics';

interface MonthlyCompletionChartProps {
  data: MonthlyStats[];
}

function CustomMonthlyTooltip({ active, payload, label }: TooltipProps<any, any>) {
  if (!active || !payload || !payload.length) return null

  const monthData = payload[0].payload

  return (
    <div className="p-2 bg-white rounded border border-gray-300 text-sm shadow-md">
      <p className="font-medium">{label}</p>
      <div className="flex items-center justify-between">
        <span>Completion:</span>
        <span>{monthData.completionRate.toFixed(1)}%</span>
      </div>
      <div className="flex items-center justify-between">
        <span>Total tasks:</span>
        <span>{monthData.totalTasks}</span>
      </div>
      <div className="flex items-center justify-between">
        <span>Successful tasks:</span>
        <span>{monthData.successfulTasks}</span>
      </div>
    </div>
  )
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
          <Tooltip content={<CustomMonthlyTooltip />} />
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