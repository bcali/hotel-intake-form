import { Check, CarFront, Clock, Utensils } from 'lucide-react';
import type { Addon } from '../App';

interface AddonCardProps {
  addon: Addon;
  isSelected: boolean;
  onToggle: () => void;
}

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  'car-front': CarFront,
  clock: Clock,
  utensils: Utensils,
};

export function AddonCard({ addon, isSelected, onToggle }: AddonCardProps) {
  const IconComponent = ICON_MAP[addon.image] || Clock;

  return (
    <div
      className={`group relative rounded-lg border bg-white p-4 transition-all duration-200 hover:shadow-lg hover:-translate-y-1 sm:p-5 md:p-6 ${
        isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
      } ${addon.disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}
      onClick={addon.disabled ? undefined : onToggle}
    >
      <div className="flex flex-col items-center text-center">
        <div
          className={`flex h-20 w-20 items-center justify-center rounded-lg transition-colors sm:h-24 sm:w-24 md:h-[120px] md:w-[120px] ${
            isSelected ? 'bg-blue-100' : 'bg-gray-100 group-hover:bg-gray-200'
          }`}
        >
          <IconComponent
            className={`h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 ${isSelected ? 'text-blue-600' : 'text-gray-600'}`}
          />
        </div>

        <h3 className="mt-3 text-sm font-semibold text-gray-900 sm:mt-4 sm:text-base md:text-lg">{addon.title}</h3>
        <p className="mt-1 text-xs text-gray-600 sm:text-sm md:text-base">{addon.description}</p>
        <p className="mt-2 text-sm font-medium text-gray-900 sm:text-base">{addon.priceLabel}</p>

        <button
          type="button"
          className={`mt-3 flex h-9 w-full items-center justify-center gap-2 rounded-lg border-2 text-sm font-medium transition-all sm:mt-4 sm:h-10 sm:text-base ${
            isSelected
              ? 'border-blue-600 bg-blue-600 text-white'
              : 'border-blue-600 bg-white text-blue-600 hover:bg-blue-50'
          } ${addon.disabled ? 'cursor-not-allowed' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            if (!addon.disabled) {
              onToggle();
            }
          }}
          disabled={addon.disabled}
        >
          {isSelected && <Check className="h-4 w-4 sm:h-5 sm:w-5" />}
          <span>{isSelected ? 'Added' : 'Add'}</span>
        </button>

        {addon.disabled && addon.disabledReason && (
          <p className="mt-2 text-xs text-red-500 sm:text-sm">{addon.disabledReason}</p>
        )}
      </div>
    </div>
  );
}
