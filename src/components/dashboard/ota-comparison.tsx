import { AlertTriangle, CheckCircle, Flame } from 'lucide-react';
import { SourceIcon } from './source-icon';

interface OTATheme {
  theme: string;
  google: { percent: number; count: number };
  booking: { percent: number; count: number };
  agoda: { percent: number; count: number };
  tripadvisor: { percent: number; count: number };
  risk: 'consistent' | 'ota-only' | 'google-only' | 'high-multi';
}

const themes: OTATheme[] = [
  {
    theme: 'AC not working',
    google: { percent: 18, count: 12 },
    booking: { percent: 22, count: 8 },
    agoda: { percent: 16, count: 4 },
    tripadvisor: { percent: 0, count: 0 },
    risk: 'high-multi',
  },
  {
    theme: 'Room cleanliness',
    google: { percent: 15, count: 10 },
    booking: { percent: 14, count: 5 },
    agoda: { percent: 0, count: 0 },
    tripadvisor: { percent: 12, count: 3 },
    risk: 'high-multi',
  },
  {
    theme: 'Check-in wait time',
    google: { percent: 12, count: 8 },
    booking: { percent: 0, count: 0 },
    agoda: { percent: 0, count: 0 },
    tripadvisor: { percent: 14, count: 8 },
    risk: 'google-only',
  },
  {
    theme: 'Breakfast crowding',
    google: { percent: 0, count: 0 },
    booking: { percent: 18, count: 6 },
    agoda: { percent: 12, count: 3 },
    tripadvisor: { percent: 8, count: 6 },
    risk: 'ota-only',
  },
  {
    theme: 'WiFi speed',
    google: { percent: 10, count: 7 },
    booking: { percent: 8, count: 3 },
    agoda: { percent: 0, count: 0 },
    tripadvisor: { percent: 0, count: 0 },
    risk: 'consistent',
  },
  {
    theme: 'Pool temperature',
    google: { percent: 0, count: 0 },
    booking: { percent: 14, count: 5 },
    agoda: { percent: 0, count: 0 },
    tripadvisor: { percent: 16, count: 6 },
    risk: 'ota-only',
  },
];

const riskIcons = {
  'consistent': <CheckCircle className="w-4 h-4 text-green-600" />,
  'ota-only': <AlertTriangle className="w-4 h-4 text-amber-600" />,
  'google-only': <AlertTriangle className="w-4 h-4 text-amber-600" />,
  'high-multi': <Flame className="w-4 h-4 text-red-600" />,
};

const riskLabels = {
  'consistent': 'Consistent',
  'ota-only': 'OTA-only',
  'google-only': 'Google-only',
  'high-multi': 'High severity + multi-source',
};

const riskOrder = {
  'high-multi': 1,
  'ota-only': 2,
  'google-only': 3,
  'consistent': 4,
};

export function OTAComparison() {
  const sortedThemes = [...themes].sort((a, b) => {
    return riskOrder[a.risk] - riskOrder[b.risk];
  });

  return (
    <div className="text-left">
      <h2 className="mb-4 text-xl md:text-2xl font-bold text-gray-900">OTA vs Google Consistency</h2>
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[768px]">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-3 md:px-4 py-4 text-xs md:text-sm font-bold text-gray-600 uppercase tracking-wider text-left">Theme</th>
                <th className="px-3 md:px-4 py-4">
                  <div className="flex flex-col items-center gap-1.5">
                    <SourceIcon source="google" size="sm" />
                    <span className="text-[10px] font-bold text-gray-500 uppercase">Google</span>
                  </div>
                </th>
                <th className="px-3 md:px-4 py-4">
                  <div className="flex flex-col items-center gap-1.5">
                    <SourceIcon source="booking" size="sm" />
                    <span className="text-[10px] font-bold text-gray-500 uppercase">Booking</span>
                  </div>
                </th>
                <th className="px-3 md:px-4 py-4">
                  <div className="flex flex-col items-center gap-1.5">
                    <SourceIcon source="agoda" size="sm" />
                    <span className="text-[10px] font-bold text-gray-500 uppercase">Agoda</span>
                  </div>
                </th>
                <th className="px-3 md:px-4 py-4">
                  <div className="flex flex-col items-center gap-1.5">
                    <SourceIcon source="tripadvisor" size="sm" />
                    <span className="text-[10px] font-bold text-gray-500 uppercase">TripAdvisor</span>
                  </div>
                </th>
                <th className="px-3 md:px-4 py-4 text-xs md:text-sm font-bold text-gray-600 uppercase tracking-wider text-left">Risk Flag</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {sortedThemes.map((theme, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-4 text-gray-900 font-semibold">{theme.theme}</td>
                  <td className="px-4 py-4 text-center">
                    {theme.google.count > 0 ? (
                      <div className="space-y-0.5">
                        <div className="text-sm font-bold text-gray-900">{theme.google.percent}%</div>
                        <div className="text-[10px] font-bold text-gray-400">{theme.google.count} pts</div>
                      </div>
                    ) : (
                      <span className="text-gray-300">—</span>
                    )}
                  </td>
                  <td className="px-4 py-4 text-center">
                    {theme.booking.count > 0 ? (
                      <div className="space-y-0.5">
                        <div className="text-sm font-bold text-gray-900">{theme.booking.percent}%</div>
                        <div className="text-[10px] font-bold text-gray-400">{theme.booking.count} pts</div>
                      </div>
                    ) : (
                      <span className="text-gray-300">—</span>
                    )}
                  </td>
                  <td className="px-4 py-4 text-center">
                    {theme.agoda.count > 0 ? (
                      <div className="space-y-0.5">
                        <div className="text-sm font-bold text-gray-900">{theme.agoda.percent}%</div>
                        <div className="text-[10px] font-bold text-gray-400">{theme.agoda.count} pts</div>
                      </div>
                    ) : (
                      <span className="text-gray-300">—</span>
                    )}
                  </td>
                  <td className="px-4 py-4 text-center">
                    {theme.tripadvisor.count > 0 ? (
                      <div className="space-y-0.5">
                        <div className="text-sm font-bold text-gray-900">{theme.tripadvisor.percent}%</div>
                        <div className="text-[10px] font-bold text-gray-400">{theme.tripadvisor.count} pts</div>
                      </div>
                    ) : (
                      <span className="text-gray-300">—</span>
                    )}
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2.5">
                      <div className="flex-shrink-0">{riskIcons[theme.risk]}</div>
                      <span className="text-xs font-bold text-gray-700 uppercase tracking-tight">{riskLabels[theme.risk]}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}



