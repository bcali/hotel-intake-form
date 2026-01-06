import { ThumbsUp, Clock, Smile } from 'lucide-react';
import type { Addon } from './PaymentPage';

interface BookingSummaryProps {
  basePrice: number;
  taxesFees: number;
  addons: Addon[];
  total: number;
}

export function BookingSummary({ basePrice, taxesFees, addons, total }: BookingSummaryProps) {
  return (
    <div className="bg-white border border-gray-200 sticky top-4">
      <div className="bg-[#1a2847] text-white px-6 py-4">
        <h2 className="text-lg">Your Selection</h2>
      </div>

      <div className="p-6">
        {/* Hotel Info */}
        <div className="mb-4">
          <h3 className="text-gray-900 mb-1">Avani+ Hua Hin Resort</h3>
          <p className="text-gray-600 mb-3">2 x Deluxe Room</p>
          
          {/* Room Image Placeholder */}
          <div className="w-full h-48 bg-gray-200 flex items-center justify-center mb-3">
            <span className="text-gray-400">Room Image</span>
          </div>

          {/* Breakfast Badge */}
          <div className="bg-green-50 border border-green-200 px-3 py-1 inline-block mb-3">
            <span className="text-green-800 text-sm">🍳 Includes Breakfast</span>
          </div>

          {/* Non-refundable */}
          <p className="text-gray-600 text-sm mb-3">• Non-refundable</p>

          {/* Benefits */}
          <div className="mb-4">
            <p className="text-gray-700 text-sm mb-2">DIRECT BOOKING BENEFITS</p>
            <div className="flex flex-wrap gap-2 text-gray-600 text-xs">
              <span className="flex items-center gap-1">
                <ThumbsUp className="w-3 h-3" />
                Early check-in
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                Late check-out
              </span>
              <span className="flex items-center gap-1">
                <Smile className="w-3 h-3" />
                Welcome amenity
              </span>
            </div>
          </div>

          {/* Dates */}
          <div className="space-y-1 text-sm mb-4">
            <div className="flex justify-between">
              <span className="text-gray-600">CHECK-IN:</span>
              <span className="text-gray-900">Sun 12 Apr 2026</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">CHECK-OUT:</span>
              <span className="text-gray-900">Tue 14 Apr 2026</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">NIGHTS:</span>
              <span className="text-gray-900">2 Nights</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">FOR:</span>
              <span className="text-gray-900">4 Adults, 2 Rooms</span>
            </div>
          </div>
        </div>

        {/* Price Breakdown */}
        <div className="border-t border-gray-200 pt-4 space-y-2 text-sm">
          <h3 className="text-gray-900 mb-3">Price Breakdown</h3>
          <div className="flex justify-between text-gray-600">
            <span>Sun 12 Apr 2026</span>
            <span>THB {(basePrice / 2).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Mon 13 Apr 2026</span>
            <span>THB {(basePrice / 2).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
          </div>
          <div className="flex justify-between text-gray-900">
            <span>Rooms:</span>
            <span>THB {basePrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
          </div>

          {/* Add-ons */}
          {addons.length > 0 && (
            <>
              <div className="border-t border-gray-200 pt-2 mt-2">
                <p className="text-gray-700 mb-2">Add-ons:</p>
                {addons.map(addon => (
                  <div key={addon.id} className="flex justify-between text-gray-600 mb-1">
                    <span>{addon.title}</span>
                    <span>THB {addon.price.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </>
          )}

          <div className="flex justify-between text-gray-600">
            <span>Taxes & Fees:</span>
            <span>THB {taxesFees.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
          </div>
        </div>

        {/* Total */}
        <div className="border-t-2 border-gray-300 mt-4 pt-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-900 uppercase tracking-wide">Total Price</span>
            <span className="text-gray-900 text-xl">
              THB {total.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </span>
          </div>
          {addons.length > 0 && (
            <div className="bg-blue-50 border border-blue-200 p-2 flex items-center gap-2">
              <span className="text-blue-800 text-xs">
                💎 EARN UP TO 0.5B loyalty points
              </span>
            </div>
          )}
          <p className="text-gray-600 text-xs mt-2">
            Your payment will be based on the following amount and currency
          </p>
        </div>
      </div>
    </div>
  );
}
