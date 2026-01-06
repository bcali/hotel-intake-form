import { useState } from 'react';
import { Header } from './Header';
import { ProgressStepper } from './ProgressStepper';
import { PaymentForm } from './PaymentForm';
import { BookingSummary } from './BookingSummary';
import { AddonsSection } from './AddonsSection';
import { Lock } from 'lucide-react';

interface PaymentPageProps {
  onConfirm: (selectedAddons: string[]) => void;
}

export interface Addon {
  id: string;
  title: string;
  description: string;
  price: number;
  popular?: boolean;
  socialProof?: string;
  icon?: string;
}

const ADDONS: Addon[] = [
  {
    id: 'airport-pickup',
    title: 'Airport Pickup Service',
    description: 'Premium private car transfer from airport to hotel',
    price: 7600,
    popular: true,
    socialProof: '89% of international guests choose this',
    icon: '🚗'
  },
  {
    id: 'early-checkin',
    title: 'Early Check-in',
    description: 'Check in from 10:00 AM instead of 3:00 PM',
    price: 1500,
    popular: true,
    socialProof: 'Available for your arrival date',
    icon: '🔑'
  },
  {
    id: 'late-checkout',
    title: 'Late Checkout',
    description: 'Extend your stay until 6:00 PM on departure day',
    price: 2000,
    socialProof: '67% of guests extend their last day',
    icon: '🌅'
  }
];

const BASE_PRICE = 15960.00;
const TAXES_FEES = 2803.68;

export function PaymentPage({ onConfirm }: PaymentPageProps) {
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);

  const toggleAddon = (addonId: string) => {
    setSelectedAddons(prev =>
      prev.includes(addonId)
        ? prev.filter(id => id !== addonId)
        : [...prev, addonId]
    );
  };

  const calculateTotal = () => {
    const addonsTotal = ADDONS
      .filter(addon => selectedAddons.includes(addon.id))
      .reduce((sum, addon) => sum + addon.price, 0);
    return BASE_PRICE + TAXES_FEES + addonsTotal;
  };

  const handleConfirmBooking = () => {
    onConfirm(selectedAddons);
  };

  return (
    <div>
      <Header />
      <ProgressStepper currentStep={2} />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-gray-900 mb-2">Your Payment Information</h1>
        <p className="text-gray-600 mb-8">Nearly there! This is the final step.</p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Payment Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Add-ons Section */}
            <AddonsSection 
              addons={ADDONS}
              selectedAddons={selectedAddons}
              onToggleAddon={toggleAddon}
            />

            {/* Payment Form */}
            <PaymentForm />

            {/* Confirm Button */}
            <button
              onClick={handleConfirmBooking}
              className="w-full bg-[#1a2847] text-white py-4 px-6 hover:bg-[#2a3857] transition-colors flex items-center justify-center gap-2"
            >
              <Lock className="w-5 h-5" />
              CONFIRM BOOKING
            </button>
            <p className="text-center text-gray-600 text-sm">
              Confirmation will be sent to your email address
            </p>
          </div>

          {/* Right Column - Booking Summary */}
          <div className="lg:col-span-1">
            <BookingSummary 
              basePrice={BASE_PRICE}
              taxesFees={TAXES_FEES}
              addons={ADDONS.filter(addon => selectedAddons.includes(addon.id))}
              total={calculateTotal()}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

