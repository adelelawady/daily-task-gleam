import React from 'react';
import { getTaskHistory } from '../data/tasks';
import { calculateDailyStats, calculateMonthlyStats } from '../utils/statistics';
import DailyStatusChart from '../components/charts/DailyStatusChart';
import MonthlyCompletionChart from '../components/charts/MonthlyCompletionChart';

export default function Statistics() {
  const history = getTaskHistory();
  const dailyStats = calculateDailyStats(history);
  const monthlyStats = calculateMonthlyStats(history);

  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-2xl font-bold mb-4">Daily Task Status Distribution</h2>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <DailyStatusChart data={dailyStats} />
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Monthly Completion Rate</h2>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <MonthlyCompletionChart data={monthlyStats} />
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-gray-600 mb-2">Today's Tasks</h3>
            <p className="text-3xl font-bold text-indigo-600">
              {dailyStats[dailyStats.length - 1].Success +
                dailyStats[dailyStats.length - 1].High +
                dailyStats[dailyStats.length - 1].Medium +
                dailyStats[dailyStats.length - 1].Low +
                dailyStats[dailyStats.length - 1].Failed}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-gray-600 mb-2">Success Rate</h3>
            <p className="text-3xl font-bold text-green-600">
              {monthlyStats[monthlyStats.length - 1].completionRate.toFixed(1)}%
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-gray-600 mb-2">Monthly Tasks</h3>
            <p className="text-3xl font-bold text-blue-600">
              {monthlyStats[monthlyStats.length - 1].totalTasks}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-gray-600 mb-2">Successful Tasks</h3>
            <p className="text-3xl font-bold text-indigo-600">
              {monthlyStats[monthlyStats.length - 1].successfulTasks}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}