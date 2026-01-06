import { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { ThemeDetailModal } from './theme-detail-modal';
import { SourceIcon } from './source-icon';

export interface Theme {
  id: string;
  theme: string;
  mentions: number;
  percent: number;
  severity: 'high' | 'medium' | 'low';
  sources: string[];
  owner: string;
  quotes: string[];
}

interface RankedThemeListProps {
  themes: Theme[];
  type: 'negative' | 'positive';
}

const severityColors = {
  high: 'bg-red-100 text-red-800 border-red-200',
  medium: 'bg-amber-100 text-amber-800 border-amber-200',
  low: 'bg-blue-100 text-blue-800 border-blue-200',
};

export function RankedThemeList({ themes, type }: RankedThemeListProps) {
  const [selectedTheme, setSelectedTheme] = useState<Theme | null>(null);

  return (
    <>
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
        <div className="overflow-x-auto text-left">
          <table className="w-full min-w-[640px]">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-3 md:px-4 py-3 text-xs md:text-sm font-bold text-gray-600 uppercase tracking-wider">Theme</th>
                <th className="px-3 md:px-4 py-3 text-xs md:text-sm font-bold text-gray-600 uppercase tracking-wider text-right">Mentions</th>
                <th className="px-3 md:px-4 py-3 text-xs md:text-sm font-bold text-gray-600 uppercase tracking-wider text-right">%</th>
                <th className="px-3 md:px-4 py-3 text-xs md:text-sm font-bold text-gray-600 uppercase tracking-wider text-center">Severity</th>
                <th className="px-3 md:px-4 py-3 text-xs md:text-sm font-bold text-gray-600 uppercase tracking-wider text-center">Sources</th>
                <th className="px-3 md:px-4 py-3 text-xs md:text-sm font-bold text-gray-600 uppercase tracking-wider">Owner</th>
                <th className="w-8"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {themes.map((theme) => (
                <tr
                  key={theme.id}
                  onClick={() => setSelectedTheme(theme)}
                  className="hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <td className="px-3 md:px-4 py-4 text-sm md:text-base font-semibold text-gray-900">{theme.theme}</td>
                  <td className="px-3 md:px-4 py-4 text-right text-sm md:text-base font-medium text-gray-900">{theme.mentions}</td>
                  <td className="px-3 md:px-4 py-4 text-right text-sm md:text-base font-medium text-gray-600">{theme.percent}%</td>
                  <td className="px-3 md:px-4 py-4">
                    <div className="flex justify-center">
                      <span className={`px-2.5 py-0.5 text-xs font-bold border rounded-full uppercase tracking-wide ${severityColors[theme.severity]}`}>
                        {theme.severity}
                      </span>
                    </div>
                  </td>
                  <td className="px-3 md:px-4 py-4">
                    <div className="flex justify-center gap-1.5">
                      {theme.sources.map((source) => (
                        <SourceIcon key={source} source={source} size="sm" />
                      ))}
                    </div>
                  </td>
                  <td className="px-3 md:px-4 py-4 text-sm md:text-base font-medium text-gray-700">{theme.owner}</td>
                  <td className="px-3 md:px-4 py-4">
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedTheme && (
        <ThemeDetailModal
          theme={selectedTheme}
          type={type}
          onClose={() => setSelectedTheme(null)}
        />
      )}
    </>
  );
}



