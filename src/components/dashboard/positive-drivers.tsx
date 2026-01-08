import { RankedThemeList, type Theme } from './ranked-theme-list';
import { OwnerBreakdown } from './owner-breakdown';
import type { DashboardFilters } from '../dashboard';
import { Star } from 'lucide-react';
import type { FormData } from '../../App';

interface PositiveDriversProps {
  filters: DashboardFilters;
  formData: FormData;
}

export function PositiveDrivers({ filters: _filters, formData }: PositiveDriversProps) {
  const mainKeyword = formData.keywords[0] || formData.brand || 'Property';
  
  const positiveThemes: Theme[] = [
    {
      id: '1',
      theme: `${mainKeyword} staff friendliness`,
      mentions: 42,
      percent: 31.3,
      severity: 'high' as const,
      sources: ['google', 'tripadvisor', 'booking'],
      owner: 'Front Office',
      quotes: [
        'Staff went above and beyond to make our stay special.',
        'Everyone was so welcoming and helpful with recommendations.',
      ],
    },
    {
      id: '2',
      theme: `${formData.city || 'Beach'} location & views`,
      mentions: 38,
      percent: 28.4,
      severity: 'high' as const,
      sources: ['google', 'booking', 'agoda'],
      owner: 'Recreation',
      quotes: [
        'Stunning beachfront location with beautiful sunset views.',
        'Direct beach access was amazing. Perfect location.',
      ],
    },
    {
      id: '3',
      theme: 'Pool area & facilities',
      mentions: 29,
      percent: 21.6,
      severity: 'medium' as const,
      sources: ['tripadvisor', 'booking', 'agoda'],
      owner: 'Recreation',
      quotes: [
        'Multiple pools with different vibes. Loved the infinity pool.',
        'Pool areas were well maintained and not too crowded.',
      ],
    },
    {
      id: '4',
      theme: 'Food quality & variety',
      mentions: 24,
      percent: 17.9,
      severity: 'medium' as const,
      sources: ['google', 'tripadvisor', 'booking'],
      owner: 'F&B',
      quotes: [
        'Breakfast buffet had excellent variety and quality.',
        'Restaurant food was delicious with authentic Thai options.',
      ],
    },
    {
      id: '5',
      theme: 'Room size & comfort',
      mentions: 19,
      percent: 14.2,
      severity: 'medium' as const,
      sources: ['booking', 'agoda'],
      owner: 'Housekeeping',
      quotes: [
        'Spacious rooms with comfortable beds.',
        'Room was larger than expected with modern amenities.',
      ],
    },
    {
      id: '6',
      theme: 'Value for money',
      mentions: 16,
      percent: 11.9,
      severity: 'low' as const,
      sources: ['booking', 'agoda'],
      owner: 'Management',
      quotes: [
        'Great value considering the location and facilities.',
        'Worth every penny. Would definitely return.',
      ],
    },
  ];

  return (
    <div className="text-left">
      <h2 className="mb-4 text-xl md:text-2xl font-bold text-gray-900">What's working</h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Ranked List */}
        <div className="lg:col-span-2">
          <RankedThemeList themes={positiveThemes} type="positive" />
        </div>
        
        {/* Owner Breakdown & Top Differentiator */}
        <div className="space-y-4 md:space-y-6">
          <OwnerBreakdown type="positive" />
          
          {/* Top Differentiator Card */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 md:p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-green-100 p-2 rounded-full">
                <Star className="w-6 h-6 text-green-600 fill-green-600" />
              </div>
              <h3 className="m-0 text-green-900 font-bold text-lg">Top Differentiator</h3>
            </div>
            <p className="text-green-800 font-medium leading-relaxed">
              {mainKeyword} friendliness appears in <span className="font-bold">31%</span> of positive feedback across 3 sources.
            </p>
            <div className="mt-6 flex items-center gap-4">
              <button className="text-sm font-bold text-green-700 hover:text-green-900 underline bg-transparent border-none cursor-pointer p-0">
                Protect
              </button>
              <div className="w-1.5 h-1.5 bg-green-300 rounded-full" />
              <button className="text-sm font-bold text-green-700 hover:text-green-900 underline bg-transparent border-none cursor-pointer p-0">
                Promote
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}



