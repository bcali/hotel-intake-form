interface OwnerBreakdownProps {
  type: 'negative' | 'positive';
}

const negativeData = [
  { owner: 'Engineering', percent: 42, count: 45, color: 'bg-red-500' },
  { owner: 'Housekeeping', percent: 24, count: 26, color: 'bg-orange-500' },
  { owner: 'Front Office', percent: 18, count: 19, color: 'bg-amber-500' },
  { owner: 'F&B', percent: 12, count: 13, color: 'bg-yellow-500' },
  { owner: 'Recreation', percent: 4, count: 4, color: 'bg-blue-500' },
];

const positiveData = [
  { owner: 'Front Office', percent: 38, count: 42, color: 'bg-green-500' },
  { owner: 'Recreation', percent: 28, count: 31, color: 'bg-emerald-500' },
  { owner: 'F&B', percent: 22, count: 24, color: 'bg-teal-500' },
  { owner: 'Housekeeping', percent: 12, count: 13, color: 'bg-cyan-500' },
];

export function OwnerBreakdown({ type }: OwnerBreakdownProps) {
  const data = type === 'negative' ? negativeData : positiveData;
  const insight = type === 'negative'
    ? 'Engineering owns 42% of high-severity mentions.'
    : 'Front Office generates 38% of positive feedback.';

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm text-left">
      <h3 className="mb-6 text-lg font-bold text-gray-900">Owner Breakdown</h3>
      
      {/* Horizontal Bars */}
      <div className="space-y-5 mb-8">
        {data.map((item) => (
          <div key={item.owner}>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-sm font-semibold text-gray-700">{item.owner}</span>
              <span className="text-sm font-bold text-gray-900">{item.count}</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2.5">
              <div
                className={`${item.color} h-2.5 rounded-full transition-all duration-500`}
                style={{ width: `${item.percent}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Insight */}
      <div className={`p-4 rounded-xl border ${
        type === 'negative' ? 'bg-red-50 border-red-100' : 'bg-green-50 border-green-100'
      }`}>
        <p className={`text-sm font-bold ${type === 'negative' ? 'text-red-800' : 'text-green-800'}`}>
          {insight}
        </p>
      </div>
    </div>
  );
}



