import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, TooltipProps } from 'recharts';
import { DailyStats, formatDate } from '../../utils/statistics';

interface DailyStatusChartProps {
  data: DailyStats[];
}

const STATUS_COLORS = {
  Success: '#22c55e',
  High: '#eab308',
  Medium: '#3b82f6',
  Low: '#6b7280',
  Failed: '#ef4444',
};

function CustomDailyTooltip({ active, payload, label }: TooltipProps<any, any>) {
  if (!active || !payload || !payload.length) return null

  const dayData = payload[0].payload
  const total = dayData.Success + dayData.High + dayData.Medium + dayData.Low + dayData.Failed

  return (
    <div className="p-2 bg-white rounded border border-gray-300 text-sm shadow-md">
      <p className="font-medium">{formatDate(label)}</p>
      {payload.map((item) => (
        <div key={item.dataKey} className="flex items-center justify-between">
          <span style={{ color: item.fill }}>{item.dataKey}:</span>
          <span>{item.value}</span>
        </div>
      ))}
      <hr className="my-1" />
      <p>Total tasks: {total}</p>
    </div>
  )
}

export default function DailyStatusChart({ data }: DailyStatusChartProps) {
  return (
    <div className="h-[400px] w-full">
      <ResponsiveContainer>
        <BarChart data={data}>
          <XAxis dataKey="date" tickFormatter={formatDate} />
          <YAxis />
          <Tooltip content={<CustomDailyTooltip />} />
          <Legend />
          <Bar dataKey="Success" stackId="a" fill={STATUS_COLORS.Success} />
          <Bar dataKey="High" stackId="a" fill={STATUS_COLORS.High} />
          <Bar dataKey="Medium" stackId="a" fill={STATUS_COLORS.Medium} />
          <Bar dataKey="Low" stackId="a" fill={STATUS_COLORS.Low} />
          <Bar dataKey="Failed" stackId="a" fill={STATUS_COLORS.Failed} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}