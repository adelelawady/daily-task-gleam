import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { DailyStats } from '../../utils/statistics';
import { formatDate } from '../../utils/statistics';

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

export default function DailyStatusChart({ data }: DailyStatusChartProps) {
  return (
    <div className="h-[400px] w-full">
      <ResponsiveContainer>
        <BarChart data={data}>
          <XAxis 
            dataKey="date" 
            tickFormatter={formatDate}
          />
          <YAxis />
          <Tooltip 
            labelFormatter={formatDate}
            contentStyle={{ backgroundColor: 'white', borderRadius: '8px' }}
          />
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