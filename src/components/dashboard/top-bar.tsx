import { Download, Link2, Clock } from 'lucide-react';
import type { FormData } from '../../App';

interface TopBarProps {
  formData: FormData;
}

export function TopBar({ formData }: TopBarProps) {
  const now = new Date();
  const formattedDate = now.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  }) + ' ' + now.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit', 
    hour12: false 
  });

  return (
    <div className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Left: Property Info */}
          <div>
            <h1 className="mb-1 text-xl md:text-2xl font-bold text-gray-900">
              {formData.hotelName || 'Property Name'}
            </h1>
            <p className="text-sm md:text-base text-gray-600">
              {formData.brand && `${formData.brand} · `}
              {[formData.city, formData.country].filter(Boolean).join(', ')}
            </p>
          </div>
          
          {/* Right: Actions */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="flex items-center gap-2 text-gray-500 text-sm order-first sm:order-none">
              <Clock className="w-4 h-4" />
              <span>Updated: {formattedDate}</span>
            </div>
            
            <button className="flex items-center justify-center gap-2 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors bg-white">
              <Link2 className="w-4 h-4" />
              <span>Copy Link</span>
            </button>
            
            <button className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Download className="w-4 h-4" />
              <span>Download PDF</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}



