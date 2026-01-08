import { X, Quote } from 'lucide-react';
import type { Theme } from './ranked-theme-list';
import { SourceIcon } from './source-icon';

interface ThemeDetailModalProps {
  theme: Theme;
  type: 'negative' | 'positive';
  onClose: () => void;
}

const sourceLabels: Record<string, string> = {
  google: 'Google',
  tripadvisor: 'TripAdvisor',
  booking: 'Booking.com',
  agoda: 'Agoda',
  social: 'Social',
};

export function ThemeDetailModal({ theme, type, onClose }: ThemeDetailModalProps) {
  const actions = type === 'negative' 
    ? [
        'Schedule immediate AC inspection and maintenance for all units',
        'Create emergency repair protocol with 2-hour response time target',
      ]
    : [
        'Highlight staff friendliness in marketing materials',
        'Share positive feedback in team meetings',
      ];

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black bg-opacity-50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-4 md:px-6 py-4 flex items-center justify-between">
          <h2 className="m-0 text-lg md:text-xl font-bold text-gray-900 pr-4">{theme.theme}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0 bg-transparent border-none cursor-pointer"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-4 md:p-6 space-y-6 md:space-y-8 overflow-y-auto text-left">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 md:gap-4">
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Mentions</p>
              <p className="text-xl font-bold text-gray-900">{theme.mentions}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Impact</p>
              <p className="text-xl font-bold text-gray-900">{theme.percent}%</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Owner</p>
              <p className="text-xl font-bold text-gray-900">{theme.owner}</p>
            </div>
          </div>

          {/* Where it shows up */}
          <div>
            <p className="text-gray-900 font-bold mb-3 text-sm uppercase tracking-wider">Where it shows up</p>
            <div className="space-y-2">
              {theme.sources.map((source) => (
                <div key={source} className="flex items-center justify-between px-4 py-3 bg-gray-50 rounded-lg border border-gray-100">
                  <div className="flex items-center gap-3">
                    <SourceIcon source={source} size="sm" />
                    <span className="text-gray-700 font-semibold">{sourceLabels[source]}</span>
                  </div>
                  <span className="text-gray-900 font-medium">
                    {Math.round((theme.mentions / theme.sources.length) + Math.random() * 5)} mentions
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Representative quotes */}
          <div>
            <p className="text-gray-900 font-bold mb-3 text-sm uppercase tracking-wider">Representative quotes</p>
            <div className="space-y-3">
              {theme.quotes.map((quote, index) => (
                <div key={index} className="flex gap-4 p-4 bg-blue-50 bg-opacity-50 rounded-xl border border-blue-100">
                  <Quote className="w-6 h-6 text-blue-300 flex-shrink-0 mt-1" />
                  <p className="text-gray-700 italic text-base leading-relaxed">"{quote}"</p>
                </div>
              ))}
            </div>
          </div>

          {/* Suggested actions */}
          <div>
            <p className="text-gray-900 font-bold mb-3 text-sm uppercase tracking-wider text-blue-600">Suggested actions</p>
            <ul className="space-y-3">
              {actions.map((action, index) => (
                <li key={index} className="flex items-start gap-3 bg-white border border-gray-200 p-3 rounded-lg shadow-sm">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-xs mt-0.5">{index + 1}</span>
                  <span className="text-gray-700 font-medium">{action}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}



