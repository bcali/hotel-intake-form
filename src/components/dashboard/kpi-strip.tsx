import { TrendingUp, TrendingDown } from 'lucide-react';
import { DashboardFilters } from '../dashboard';
import type { FormData } from '../../App';

interface KPIStripProps {
  filters: DashboardFilters;
  formData: FormData;
}

interface KPICardData {
  label: string;
  value: string;
  delta: number;
  deltaLabel: string;
  isPositive: boolean;
}

export function KPIStrip({ filters, formData }: KPIStripProps) {
  const kpis: KPICardData[] = [
    {
      label: 'Google Rating',
      value: formData.averageRating || '4.5',
      delta: 0.1,
      deltaLabel: '+0.1 vs prior',
      isPositive: true,
    },
    {
      label: 'OTA Score (Blended)',
      value: '8.6',
      delta: -0.2,
      deltaLabel: '-0.2 vs prior',
      isPositive: false,
    },
    {
      label: 'Review Volume',
      value: formData.totalReviews || '128',
      delta: 12,
      deltaLabel: '+12%',
      isPositive: true,
    },
    {
      label: 'Negative Mentions',
      value: '42',
      delta: 18,
      deltaLabel: '+18%',
      isPositive: false,
    },
    {
      label: 'High Severity Issues',
      value: '6',
      delta: 2,
      deltaLabel: '+2',
      isPositive: false,
    },
  ];

  return (
    <div>
      <h2 className="mb-4 text-xl md:text-2xl font-bold text-gray-900">Health Snapshot</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
        {kpis.map((kpi, index) => (
          <KPICard key={index} {...kpi} showComparison={filters.compareEnabled} />
        ))}
      </div>
    </div>
  );
}

function KPICard({ label, value, delta, deltaLabel, isPositive, showComparison }: KPICardData & { showComparison: boolean }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
      <p className="text-sm text-gray-600 mb-1 font-medium">{label}</p>
      <p className="text-2xl font-bold text-gray-900 mb-2">{value}</p>
      {showComparison && (
        <div className={`flex items-center gap-1 text-xs md:text-sm font-semibold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
          {isPositive ? (
            <TrendingUp className="w-4 h-4" />
          ) : (
            <TrendingDown className="w-4 h-4" />
          )}
          <span>{deltaLabel}</span>
        </div>
      )}
    </div>
  );
}



