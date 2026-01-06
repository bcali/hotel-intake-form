import { DashboardFilters } from '../dashboard';

interface FilterBarProps {
  filters: DashboardFilters;
  updateFilters: (filters: Partial<DashboardFilters>) => void;
  onReset: () => void;
}

export function FilterBar({ filters, updateFilters, onReset }: FilterBarProps) {
  return (
    <div className="sticky top-0 lg:top-[89px] z-40 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-3">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 flex-wrap">
            {/* Date Range */}
            <div className="flex items-center gap-2">
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) => updateFilters({ startDate: e.target.value })}
                className="flex-1 sm:flex-none px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
              <span className="text-gray-500 text-sm">to</span>
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) => updateFilters({ endDate: e.target.value })}
                className="flex-1 sm:flex-none px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>

            {/* Compare Toggle */}
            <label className="flex items-center gap-2 px-3 py-1.5 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="checkbox"
                checked={filters.compareEnabled}
                onChange={(e) => updateFilters({ compareEnabled: e.target.checked })}
                className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700 font-medium">Compare</span>
            </label>

            {filters.compareEnabled && (
              <select
                value={filters.comparePeriod}
                onChange={(e) => updateFilters({ comparePeriod: e.target.value })}
                className="w-full sm:w-auto px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
              >
                <option value="previous-period">Previous period</option>
                <option value="previous-month">Previous month</option>
                <option value="previous-quarter">Previous quarter</option>
              </select>
            )}

            {/* Source Filter */}
            <select
              value={filters.source}
              onChange={(e) => updateFilters({ source: e.target.value })}
              className="w-full sm:w-auto px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
            >
              <option value="all">All sources</option>
              <option value="google">Google</option>
              <option value="tripadvisor">TripAdvisor</option>
              <option value="booking">Booking.com</option>
              <option value="agoda">Agoda</option>
              <option value="social">Social</option>
            </select>

            {/* Severity Filter */}
            <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-lg">
              {['all', 'high', 'medium', 'low'].map((severity) => (
                <button
                  key={severity}
                  onClick={() => updateFilters({ severity })}
                  className={`px-3 py-1 text-xs md:text-sm rounded-md transition-colors font-medium border-none cursor-pointer ${
                    filters.severity === severity
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {severity.charAt(0).toUpperCase() + severity.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Reset Button */}
          <button
            onClick={onReset}
            className="px-4 py-1.5 text-sm text-gray-600 hover:text-gray-800 underline self-start lg:self-auto bg-transparent border-none cursor-pointer"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}



