import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { SourceIcon } from './source-icon';

export function Appendix() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm text-left">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors border-none bg-transparent cursor-pointer rounded-xl"
      >
        <h2 className="m-0 text-xl md:text-2xl font-bold text-gray-900">Appendix & Methodology</h2>
        <div className="bg-gray-100 p-1.5 rounded-lg">
          {isOpen ? (
            <ChevronUp className="w-5 h-5 text-gray-500 flex-shrink-0" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
          )}
        </div>
      </button>

      {isOpen && (
        <div className="px-6 pb-8 space-y-10 border-t border-gray-100 pt-8 animate-in fade-in slide-in-from-top-4 duration-300">
          {/* Data Sources */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Data sources and counts</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between py-2.5 px-4 bg-gray-50 rounded-lg border border-gray-100">
                  <div className="flex items-center gap-3">
                    <SourceIcon source="google" size="sm" />
                    <span className="text-gray-700 font-semibold">Google Maps</span>
                  </div>
                  <span className="text-gray-900 font-bold">67 reviews</span>
                </div>
                <div className="flex items-center justify-between py-2.5 px-4 bg-gray-50 rounded-lg border border-gray-100">
                  <div className="flex items-center gap-3">
                    <SourceIcon source="tripadvisor" size="sm" />
                    <span className="text-gray-700 font-semibold">TripAdvisor</span>
                  </div>
                  <span className="text-gray-900 font-bold">24 reviews</span>
                </div>
                <div className="flex items-center justify-between py-2.5 px-4 bg-gray-50 rounded-lg border border-gray-100">
                  <div className="flex items-center gap-3">
                    <SourceIcon source="booking" size="sm" />
                    <span className="text-gray-700 font-semibold">Booking.com</span>
                  </div>
                  <span className="text-gray-900 font-bold">29 reviews</span>
                </div>
                <div className="flex items-center justify-between py-2.5 px-4 bg-gray-50 rounded-lg border border-gray-100">
                  <div className="flex items-center gap-3">
                    <SourceIcon source="agoda" size="sm" />
                    <span className="text-gray-700 font-semibold">Agoda</span>
                  </div>
                  <span className="text-gray-900 font-bold">8 reviews</span>
                </div>
                <div className="flex items-center justify-between py-3 px-4 bg-blue-50 rounded-lg border border-blue-100 mt-4">
                  <span className="text-blue-900 font-black uppercase tracking-widest text-xs">Total Analyzed</span>
                  <span className="text-blue-900 font-black text-lg">128</span>
                </div>
              </div>
            </div>

            {/* Included vs Excluded */}
            <div>
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Content Filtering</h3>
              <div className="space-y-4">
                <div className="p-4 bg-green-50 border border-green-100 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs font-bold text-green-600 uppercase tracking-widest">Included</p>
                    <span className="text-lg font-black text-green-700">112</span>
                  </div>
                  <p className="text-sm text-green-800 font-medium leading-relaxed">
                    Reviews with substantive feedback mentioning property features, service, or operational issues.
                  </p>
                </div>
                <div className="p-4 bg-gray-50 border border-gray-100 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Excluded</p>
                    <span className="text-lg font-black text-gray-500">16</span>
                  </div>
                  <p className="text-sm text-gray-600 font-medium leading-relaxed">
                    Filtered due to: non-textual ratings, duplicate entries, or suspected non-guest spam.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Methodology */}
          <div className="pt-8 border-t border-gray-100">
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-6 text-center">Analysis Methodology</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="space-y-2">
                <p className="text-xs font-black text-blue-600 uppercase">Theme Extraction</p>
                <p className="text-sm text-gray-600 font-medium leading-relaxed">
                  Identifies recurring topics using NLP, normalized across all platforms.
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-xs font-black text-blue-600 uppercase">Severity Scoring</p>
                <p className="text-sm text-gray-600 font-medium leading-relaxed">
                  Weighted by booking impact, safety risks, and operational disruption.
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-xs font-black text-blue-600 uppercase">Owner Assignment</p>
                <p className="text-sm text-gray-600 font-medium leading-relaxed">
                  Themes mapped to core operational departments best suited for action.
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-xs font-black text-blue-600 uppercase">Trend Logic</p>
                <p className="text-sm text-gray-600 font-medium leading-relaxed">
                  Moving average comparison against historical benchmarks.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}



