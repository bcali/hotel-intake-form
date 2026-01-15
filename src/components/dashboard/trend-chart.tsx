import { useState } from 'react';

const weeklyData = [
  { week: 'Week 1', high: 8, medium: 12, low: 15 },
  { week: 'Week 2', high: 12, medium: 14, low: 18 },
  { week: 'Week 3', high: 18, medium: 16, low: 12 },
  { week: 'Week 4', high: 14, medium: 13, low: 16 },
  { week: 'Week 5', high: 11, medium: 15, low: 14 },
];

export function TrendChart() {
  const [viewMode, setViewMode] = useState<'severity' | 'themes'>('severity');

  const maxValue = Math.max(...weeklyData.map(d => d.high + d.medium + d.low));

  return (
    <div className="text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h2 className="m-0 text-xl md:text-2xl font-bold text-gray-900">Trend Over Time</h2>
        <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setViewMode('severity')}
            className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-all border-none cursor-pointer ${
              viewMode === 'severity'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Severity
          </button>
          <button
            onClick={() => setViewMode('themes')}
            className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-all border-none cursor-pointer ${
              viewMode === 'themes'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Top themes
          </button>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-4 md:p-8 shadow-sm">
        {/* Chart */}
        <div className="flex items-end justify-between gap-3 md:gap-6 h-64 md:h-80">
          {weeklyData.map((data) => {
            const total = data.high + data.medium + data.low;
            const highHeight = (data.high / maxValue) * 100;
            const mediumHeight = (data.medium / maxValue) * 100;
            const lowHeight = (data.low / maxValue) * 100;

            return (
              <div key={data.week} className="flex-1 flex flex-col items-center gap-4 group">
                <div className="w-full flex flex-col justify-end h-full gap-1.5">
                  <div
                    className="w-full bg-red-500 rounded-t shadow-sm transition-all duration-500 group-hover:brightness-110"
                    style={{ height: `${highHeight}%` }}
                    title={`High: ${data.high}`}
                  />
                  <div
                    className="w-full bg-amber-500 shadow-sm transition-all duration-500 group-hover:brightness-110"
                    style={{ height: `${mediumHeight}%` }}
                    title={`Medium: ${data.medium}`}
                  />
                  <div
                    className="w-full bg-blue-500 rounded-b shadow-sm transition-all duration-500 group-hover:brightness-110"
                    style={{ height: `${lowHeight}%` }}
                    title={`Low: ${data.low}`}
                  />
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-sm font-bold text-gray-900 uppercase tracking-tight">{data.week}</span>
                  <span className="text-xs font-medium text-gray-500">{total} mentions</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center justify-center gap-6 mt-10 pt-8 border-t border-gray-100">
          <div className="flex items-center gap-2.5">
            <div className="w-4 h-4 bg-red-500 rounded-sm shadow-sm" />
            <span className="text-sm font-bold text-gray-700">High severity</span>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="w-4 h-4 bg-amber-500 rounded-sm shadow-sm" />
            <span className="text-sm font-bold text-gray-700">Medium severity</span>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="w-4 h-4 bg-blue-500 rounded-sm shadow-sm" />
            <span className="text-sm font-bold text-gray-700">Low severity</span>
          </div>
        </div>

        {/* Annotation */}
        <div className="mt-8 p-4 bg-amber-50 border border-amber-100 rounded-xl flex items-center gap-3">
          <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
          <p className="text-sm font-bold text-amber-900 uppercase tracking-wide">
            High severity peaked in Week 3 due to AC failures.
          </p>
        </div>
      </div>
    </div>
  );
}



