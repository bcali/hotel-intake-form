import { Header } from './Header';
import { ProgressStepper } from './ProgressStepper';
import { CheckCircle2, Mail, Calendar, MapPin, CreditCard } from 'lucide-react';

interface ConfirmationPageProps {
  selectedAddons: string[];
  onBack: () => void;
}

const ADDON_NAMES: Record<string, { title: string; price: number }> = {
  'airport-pickup': { title: 'Airport Pickup Service', price: 7600 },
  'early-checkin': { title: 'Early Check-in', price: 1500 },
  'late-checkout': { title: 'Late Checkout', price: 2000 }
};

const BASE_PRICE = 15960.00;
const TAXES_FEES = 2803.68;

export function ConfirmationPage({ selectedAddons, onBack }: ConfirmationPageProps) {
  const calculateTotal = () => {
    const addonsTotal = selectedAddons.reduce(
      (sum, addonId) => sum + (ADDON_NAMES[addonId]?.price || 0),
      0
    );
    return BASE_PRICE + TAXES_FEES + addonsTotal;
  };

  const total = calculateTotal();
  const confirmationNumber = 'AVANI' + Math.random().toString(36).substring(2, 10).toUpperCase();

  return (
    <div>
      <Header />
      <ProgressStepper currentStep={3} />
      
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Success Message */}
        <div className="text-center mb-8">
          <CheckCircle2 className="w-16 h-16 text-green-600 mx-auto mb-4" />
          <h1 className="text-green-700 mb-2">Booking Confirmed!</h1>
          <p className="text-gray-600">
            Thank you for your reservation. Your booking has been successfully confirmed.
          </p>
        </div>

        {/* Confirmation Details */}
        <div className="bg-white border border-gray-200 mb-6">
          <div className="bg-[#1a2847] text-white px-6 py-4">
            <h2 className="text-lg">Reservation Details</h2>
          </div>

          <div className="p-6">
            {/* Confirmation Number */}
            <div className="bg-blue-50 border border-blue-200 p-4 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm mb-1">Confirmation Number</p>
                  <p className="text-2xl text-gray-900 tracking-wide">{confirmationNumber}</p>
                </div>
                <Mail className="w-8 h-8 text-blue-600" />
              </div>
              <p className="text-gray-600 text-sm mt-3">
                A confirmation email has been sent to your email address with all the details.
              </p>
            </div>

            {/* Property and Room */}
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-400">Room Image</span>
                </div>
              </div>
              <div>
                <h3 className="text-gray-900 mb-2">Avani+ Hua Hin Resort</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-600">1499 Petchkasem Road, Hua Hin, Thailand</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Calendar className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                    <div className="text-gray-600">
                      <p>Check-in: Sunday, April 12, 2026 (3:00 PM)</p>
                      <p>Check-out: Tuesday, April 14, 2026 (12:00 PM)</p>
                      <p className="mt-1">2 Nights • 2 Deluxe Rooms • 4 Adults</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* What's Included */}
            <div className="border-t border-gray-200 pt-4 mb-6">
              <h3 className="text-gray-900 mb-3">What's Included</h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  2 Deluxe Rooms
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  Daily Breakfast for 4 guests
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  Welcome amenity
                </li>
                {selectedAddons.map(addonId => (
                  <li key={addonId} className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    {ADDON_NAMES[addonId]?.title}
                  </li>
                ))}
              </ul>
            </div>

            {/* Payment Summary */}
            <div className="border-t border-gray-200 pt-4">
              <h3 className="text-gray-900 mb-3 flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Payment Summary
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Room Rate (2 nights)</span>
                  <span>THB {BASE_PRICE.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                </div>
                {selectedAddons.map(addonId => {
                  const addon = ADDON_NAMES[addonId];
                  return addon ? (
                    <div key={addonId} className="flex justify-between text-gray-600">
                      <span>{addon.title}</span>
                      <span>THB {addon.price.toLocaleString()}</span>
                    </div>
                  ) : null;
                })}
                <div className="flex justify-between text-gray-600">
                  <span>Taxes & Fees</span>
                  <span>THB {TAXES_FEES.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="border-t-2 border-gray-300 pt-2 flex justify-between text-gray-900">
                  <span className="uppercase tracking-wide">Total Paid</span>
                  <span className="text-xl">THB {total.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-green-50 border border-green-200 p-6 mb-6">
          <h3 className="text-green-900 mb-3">What Happens Next?</h3>
          <ol className="space-y-2 text-green-800 text-sm list-decimal list-inside">
            <li>You'll receive a confirmation email with your booking reference</li>
            <li>Please present your confirmation number at check-in</li>
            <li>Your credit card will be verified at the hotel</li>
            {selectedAddons.includes('airport-pickup') && (
              <li>Airport pickup details will be sent 24 hours before arrival</li>
            )}
            <li>Contact the hotel directly for any special requests</li>
          </ol>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="bg-[#1a2847] text-white px-8 py-3 hover:bg-[#2a3857] transition-colors">
            PRINT CONFIRMATION
          </button>
          <button className="border-2 border-[#1a2847] text-[#1a2847] px-8 py-3 hover:bg-[#1a2847] hover:text-white transition-colors">
            EMAIL CONFIRMATION
          </button>
          <button 
            onClick={onBack}
            className="border-2 border-gray-300 text-gray-700 px-8 py-3 hover:border-gray-400 transition-colors"
          >
            BACK TO PAYMENT
          </button>
        </div>
      </div>
    </div>
  );
}

