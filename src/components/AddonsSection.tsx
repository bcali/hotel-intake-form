import { Check } from 'lucide-react';
import type { Addon } from './PaymentPage';

interface AddonsSectionProps {
  addons: Addon[];
  selectedAddons: string[];
  onToggleAddon: (addonId: string) => void;
}

export function AddonsSection({ addons, selectedAddons, onToggleAddon }: AddonsSectionProps) {
  return (
    <div className="bg-white border border-gray-200 overflow-hidden">
      <div className="bg-[#1a2847] text-white px-6 py-4">
        <h2 className="text-lg">Enhance Your Stay</h2>
      </div>
      
      <div className="p-6 space-y-4">
        {addons.map((addon) => {
          const isSelected = selectedAddons.includes(addon.id);
          
          return (
            <div
              key={addon.id}
              className={`border-2 transition-all cursor-pointer hover:border-[#1a2847]/30 ${
                isSelected ? 'border-[#1a2847] bg-blue-50/30' : 'border-gray-200'
              }`}
              onClick={() => onToggleAddon(addon.id)}
            >
              <div className="p-4 flex items-start gap-4">
                {/* Icon */}
                <div className="text-4xl flex-shrink-0">
                  {addon.icon}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="text-gray-900 flex items-center gap-2">
                      {addon.title}
                      {addon.popular && (
                        <span className="bg-orange-500 text-white text-xs px-2 py-0.5 uppercase tracking-wide">
                          Popular
                        </span>
                      )}
                    </h3>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-2">
                    {addon.description}
                  </p>

                  {addon.socialProof && (
                    <p className="text-gray-500 text-xs italic mb-3">
                      {addon.socialProof}
                    </p>
                  )}

                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-gray-900">
                        THB {addon.price.toLocaleString()}
                      </span>
                    </div>

                    <button
                      className={`px-6 py-2 border-2 transition-all flex items-center gap-2 ${
                        isSelected
                          ? 'bg-[#1a2847] border-[#1a2847] text-white'
                          : 'bg-white border-gray-300 text-gray-700 hover:border-[#1a2847]'
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleAddon(addon.id);
                      }}
                    >
                      {isSelected && <Check className="w-4 h-4" />}
                      {isSelected ? 'ADDED' : 'ADD'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {selectedAddons.length > 0 && (
          <div className="bg-green-50 border border-green-200 p-4 mt-4">
            <p className="text-green-800 text-sm">
              💰 <strong>Smart Choice!</strong> You're saving time and money by booking these add-ons now 
              rather than arranging them separately later.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
