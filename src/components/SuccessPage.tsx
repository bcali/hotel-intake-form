import { CheckCircle, Mail } from 'lucide-react';
import type { Addon } from '../App';

interface BookingData {
  hotelName: string;
  checkIn: string;
  checkOut: string;
  nights: number;
}

interface SuccessPageProps {
  confirmationNumber: string;
  bookingData: BookingData;
  selectedAddons: Addon[];
  roomTotal: number;
  addonsTotal: number;
  grandTotal: number;
  email: string;
}

export function SuccessPage({
  confirmationNumber,
  bookingData,
  selectedAddons,
  roomTotal,
  addonsTotal,
  grandTotal,
  email,
}: SuccessPageProps) {
  return (
    <div className="min-h-screen bg-neutral-50 py-8 px-4 sm:py-12 sm:px-6 md:py-16 md:px-8">
      <div className="mx-auto max-w-2xl">
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm sm:p-8 md:p-10">
          <div className="text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 sm:h-20 sm:w-20">
              <CheckCircle className="h-10 w-10 text-green-600 sm:h-12 sm:w-12" />
            </div>
            <h1 className="mt-4 text-2xl font-semibold text-gray-900 sm:text-3xl md:text-4xl">
              Booking Confirmed!
            </h1>
            <p className="mt-2 text-sm text-gray-600 sm:text-base">
              Your confirmation number is
            </p>
            <p className="mt-1 text-lg font-semibold text-blue-600 sm:text-xl md:text-2xl">
              {confirmationNumber}
            </p>
          </div>

          <div className="mt-8 border-t border-gray-200 pt-6 sm:mt-10 sm:pt-8">
            <h2 className="text-lg font-semibold text-gray-900 sm:text-xl">Booking Details</h2>
            <div className="mt-4 space-y-3 sm:mt-5 sm:space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-700 sm:text-base">{bookingData.hotelName}</p>
                <p className="mt-1 text-sm text-gray-600 sm:text-base">
                  {bookingData.checkIn} – {bookingData.checkOut} • {bookingData.nights} nights
                </p>
              </div>

              {selectedAddons.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-700 sm:text-base">Selected Add-ons:</p>
                  <ul className="mt-2 space-y-2">
                    {selectedAddons.map((addon) => (
                      <li key={addon.id} className="text-sm text-gray-600 sm:text-base">
                        • {addon.title} - {addon.priceLabel}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="mt-4 border-t border-gray-200 pt-4">
                <div className="flex justify-between text-sm sm:text-base">
                  <span className="text-gray-600">Room Total:</span>
                  <span className="font-medium text-gray-900">${roomTotal}</span>
                </div>
                {addonsTotal > 0 && (
                  <div className="mt-2 flex justify-between text-sm sm:text-base">
                    <span className="text-gray-600">Add-ons:</span>
                    <span className="font-medium text-gray-900">${addonsTotal}</span>
                  </div>
                )}
                <div className="mt-2 flex justify-between border-t border-gray-200 pt-2 text-base font-semibold sm:text-lg">
                  <span className="text-gray-900">Total:</span>
                  <span className="text-gray-900">${grandTotal}</span>
                </div>
              </div>
            </div>
          </div>

          {email && (
            <div className="mt-6 rounded-lg bg-blue-50 p-4 sm:mt-8 sm:p-5">
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 shrink-0 text-blue-600 sm:h-6 sm:w-6" />
                <div>
                  <p className="text-sm font-medium text-blue-900 sm:text-base">
                    Confirmation email sent
                  </p>
                  <p className="mt-1 text-xs text-blue-700 sm:text-sm">
                    We've sent a confirmation email to {email}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
