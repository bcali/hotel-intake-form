import { RankedThemeList } from './ranked-theme-list';
import { OwnerBreakdown } from './owner-breakdown';
import { DashboardFilters } from '../dashboard';
import type { FormData } from '../../App';

interface NegativeDriversProps {
  filters: DashboardFilters;
  formData: FormData;
}

export function NegativeDrivers({ filters, formData }: NegativeDriversProps) {
  const mainKeyword = formData.keywords[0] || formData.brand || 'Property';
  
  const negativeThemes = [
    {
      id: '1',
      theme: `${mainKeyword} AC reliability`,
      mentions: 24,
      percent: 18.8,
      severity: 'high' as const,
      sources: ['google', 'booking', 'agoda'],
      owner: 'Engineering',
      quotes: [
        'AC broke down on day 2. Took 8 hours to get someone to look at it.',
        'Room was unbearably hot. AC unit made noise but no cold air.',
      ],
    },
    {
      id: '2',
      theme: 'Room cleanliness issues',
      mentions: 18,
      percent: 14.1,
      severity: 'high' as const,
      sources: ['google', 'tripadvisor', 'booking'],
      owner: 'Housekeeping',
      quotes: [
        'Bathroom had hair in the drain. Floors were not mopped properly.',
        'Found stains on bedding and dust on furniture.',
      ],
    },
    {
      id: '3',
      theme: 'Long check-in wait times',
      mentions: 16,
      percent: 12.5,
      severity: 'medium' as const,
      sources: ['google', 'tripadvisor'],
      owner: 'Front Office',
      quotes: [
        'Waited 45 minutes to check in despite arriving at 4pm.',
        'Only one person at front desk with a long queue.',
      ],
    },
    {
      id: '4',
      theme: 'Breakfast crowding & wait',
      mentions: 15,
      percent: 11.7,
      severity: 'medium' as const,
      sources: ['booking', 'agoda', 'tripadvisor'],
      owner: 'F&B',
      quotes: [
        'Breakfast area was packed. Had to wait for a table.',
        'Food quality good but too crowded between 8-9am.',
      ],
    },
    {
      id: '5',
      theme: 'WiFi speed slow/unreliable',
      mentions: 12,
      percent: 9.4,
      severity: 'medium' as const,
      sources: ['google', 'booking'],
      owner: 'Engineering',
      quotes: [
        'WiFi kept disconnecting. Could barely join video calls.',
        'Internet was very slow, especially in the evening.',
      ],
    },
    {
      id: '6',
      theme: 'Pool temperature too cold',
      mentions: 11,
      percent: 8.6,
      severity: 'low' as const,
      sources: ['tripadvisor', 'booking'],
      owner: 'Recreation',
      quotes: [
        'Pool water was freezing even though weather was warm.',
        'Kids complained about cold pool.',
      ],
    },
    {
      id: '7',
      theme: 'Noise from construction',
      mentions: 9,
      percent: 7.0,
      severity: 'high' as const,
      sources: ['google', 'agoda'],
      owner: 'Management',
      quotes: [
        'Construction noise started at 7am every day.',
        'Renovation work was very loud and disruptive.',
      ],
    },
    {
      id: '8',
      theme: 'Limited parking availability',
      mentions: 7,
      percent: 5.5,
      severity: 'low' as const,
      sources: ['google'],
      owner: 'Front Office',
      quotes: [
        'Had to park far from entrance. No valet available.',
        'Parking lot was full when we arrived.',
      ],
    },
  ];

  return (
    <div>
      <h2 className="mb-4 text-xl md:text-2xl font-bold text-gray-900">What's hurting us</h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Ranked List */}
        <div className="lg:col-span-2">
          <RankedThemeList themes={negativeThemes} type="negative" />
        </div>
        
        {/* Owner Breakdown */}
        <div>
          <OwnerBreakdown type="negative" />
        </div>
      </div>
    </div>
  );
}



