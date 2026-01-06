import { TopBar } from './dashboard/top-bar';
import { FilterBar } from './dashboard/filter-bar';
import { KPIStrip } from './dashboard/kpi-strip';
import { InsightsCallout } from './dashboard/insights-callout';
import { NegativeDrivers } from './dashboard/negative-drivers';
import { PositiveDrivers } from './dashboard/positive-drivers';
import { TrendChart } from './dashboard/trend-chart';
import { OTAComparison } from './dashboard/ota-comparison';
import { VisualCheck } from './dashboard/visual-check';
import { ActionList } from './dashboard/action-list';
import { Appendix } from './dashboard/appendix';
import { useState, useMemo } from 'react';
import type { FormData } from '../App';

export interface DashboardFilters {
  startDate: string;
  endDate: string;
  compareEnabled: boolean;
  comparePeriod: string;
  source: string;
  severity: string;
  owner: string;
}

interface DashboardProps {
  formData: FormData;
}

export function Dashboard({ formData }: DashboardProps) {
  const [filters, setFilters] = useState<DashboardFilters>({
    startDate: formData.startDate || '2025-12-02',
    endDate: formData.endDate || '2026-01-02',
    compareEnabled: formData.comparisonPeriod !== 'none',
    comparePeriod: formData.comparisonPeriod,
    source: 'all',
    severity: 'all',
    owner: 'all',
  });

  const updateFilters = (newFilters: Partial<DashboardFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleReset = () => {
    setFilters({
      startDate: formData.startDate || '2025-12-02',
      endDate: formData.endDate || '2026-01-02',
      compareEnabled: formData.comparisonPeriod !== 'none',
      comparePeriod: formData.comparisonPeriod,
      source: 'all',
      severity: 'all',
      owner: 'all',
    });
  };

  // Mocked dynamic data based on keywords
  const mockedAnalysis = useMemo(() => {
    const mainKeyword = formData.keywords[0] || formData.hotelName || 'Property';
    return {
      topPositiveTheme: `Service at ${mainKeyword}`,
      topNegativeTheme: `Wait times at ${mainKeyword}`,
      insight: `${mainKeyword} is outperforming its category in service speed but lagging in facility maintenance during peak hours.`
    };
  }, [formData.keywords, formData.hotelName]);

  return (
    <div className="min-h-screen bg-gray-50 text-left">
      <TopBar formData={formData} />
      <FilterBar 
        filters={filters} 
        updateFilters={updateFilters}
        onReset={handleReset}
      />
      
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8 space-y-6 md:space-y-8">
        {/* KPI Section */}
        <KPIStrip filters={filters} formData={formData} />
        <InsightsCallout customInsight={mockedAnalysis.insight} />
        
        {/* Negative Drivers */}
        <NegativeDrivers filters={filters} formData={formData} />
        
        {/* Positive Drivers */}
        <PositiveDrivers filters={filters} formData={formData} />
        
        {/* Trend Chart */}
        <TrendChart filters={filters} />
        
        {/* OTA Comparison */}
        <OTAComparison filters={filters} />
        
        {/* Visual Check */}
        <VisualCheck />
        
        {/* Top 5 Actions */}
        <ActionList formData={formData} />
        
        {/* Appendix */}
        <Appendix />
      </div>
    </div>
  );
}



