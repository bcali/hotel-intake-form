import { useState } from 'react';
import { ChevronLeft, ChevronRight, AlertTriangle } from 'lucide-react';
import { SourceIcon } from './source-icon';

const photos = [
  { id: 1, url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800', label: 'Pool area' },
  { id: 2, url: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800', label: 'Room' },
  { id: 3, url: 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=800', label: 'Breakfast' },
  { id: 4, url: 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800', label: 'Bathroom' },
  { id: 5, url: 'https://images.unsplash.com/photo-1559508551-44bff1de756b?w=800', label: 'Beach view' },
];

const ugcThemes = {
  mostShown: [
    { theme: 'Pool area', count: 42 },
    { theme: 'Kids club', count: 28 },
    { theme: 'Breakfast buffet', count: 24 },
  ],
  risks: [
    { theme: 'Crowded breakfast area', count: 18 },
    { theme: 'Dated bathroom fixtures', count: 12 },
    { theme: 'Small room size', count: 9 },
  ],
  mismatches: [
    'Room size expectations (photos show larger spaces)',
    'Breakfast crowding visible in photos',
  ],
};

export function VisualCheck() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'google' | 'tripadvisor' | 'social'>('google');

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? photos.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === photos.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="text-left">
      <h2 className="mb-4 text-xl md:text-2xl font-bold text-gray-900">Visual Reality Check</h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Photo Carousel */}
        <div className="lg:col-span-2">
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm flex flex-col">
            {/* Tabs */}
            <div className="border-b border-gray-200 flex bg-gray-50">
              {(['google', 'tripadvisor', 'social'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 px-3 md:px-4 py-4 flex items-center justify-center gap-3 text-xs md:text-sm font-bold uppercase tracking-wider transition-all border-none cursor-pointer ${
                    activeTab === tab
                      ? 'bg-white text-blue-600 border-b-2 border-blue-600 shadow-sm'
                      : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <SourceIcon source={tab} size="sm" />
                  <span className="hidden sm:inline">{tab === 'google' ? 'Google' : tab === 'tripadvisor' ? 'TripAdvisor' : 'Social'}</span>
                </button>
              ))}
            </div>

            {/* Image Display */}
            <div className="relative aspect-video bg-gray-100 group">
              <img
                src={photos[currentIndex].url}
                alt={photos[currentIndex].label}
                className="w-full h-full object-cover"
              />
              
              {/* Label */}
              <div className="absolute bottom-4 left-4 px-4 py-2 bg-black bg-opacity-70 text-white text-xs font-bold uppercase tracking-widest rounded-md backdrop-blur-sm">
                {photos[currentIndex].label}
              </div>

              {/* Navigation */}
              <button
                onClick={handlePrevious}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white bg-opacity-90 text-gray-900 rounded-full shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-white border-none cursor-pointer"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={handleNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white bg-opacity-90 text-gray-900 rounded-full shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-white border-none cursor-pointer"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>

            {/* Thumbnails */}
            <div className="p-4 bg-gray-50 grid grid-cols-5 gap-3">
              {photos.map((photo, index) => (
                <button
                  key={photo.id}
                  onClick={() => setCurrentIndex(index)}
                  className={`aspect-video rounded-lg overflow-hidden border-2 transition-all p-0 cursor-pointer ${
                    index === currentIndex ? 'border-blue-600 scale-105 shadow-md' : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img
                    src={photo.url}
                    alt={photo.label}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* UGC Summary */}
        <div className="space-y-4 md:space-y-6">
          {/* Most Shown */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Most shown</h3>
            <div className="space-y-3">
              {ugcThemes.mostShown.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-gray-800 font-semibold">{item.theme}</span>
                  <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded-md font-bold text-xs">{item.count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Potential Risks */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Potential risks</h3>
            <div className="space-y-3">
              {ugcThemes.risks.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-gray-800 font-semibold">{item.theme}</span>
                  <span className="bg-red-50 text-red-700 px-2 py-0.5 rounded-md font-bold text-xs">{item.count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Expectation Mismatch */}
          <div className="bg-amber-50 border border-amber-100 rounded-xl p-5 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-amber-100 p-1.5 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
              </div>
              <h3 className="m-0 text-amber-900 font-bold text-base">Expectation Mismatch</h3>
            </div>
            <ul className="space-y-3">
              {ugcThemes.mismatches.map((mismatch, index) => (
                <li key={index} className="text-sm font-medium text-amber-800 flex items-start gap-2 leading-relaxed">
                  <span className="text-amber-400 mt-1 flex-shrink-0">•</span>
                  <span>{mismatch}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}



