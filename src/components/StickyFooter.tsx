import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import type { FormData } from '../App';

interface StickyFooterProps {
  roomTotal: number;
  addonsTotal: number;
  grandTotal: number;
  onComplete: () => void;
  formData: FormData;
}

export function StickyFooter({
  roomTotal,
  addonsTotal,
  grandTotal,
  onComplete,
  formData,
}: StickyFooterProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = () => {
    // Trigger form validation by submitting the form
    const form = document.querySelector('form');
    if (form) {
      // Check if form is valid
      const fullName = formData.fullName.trim();
      const email = formData.email.trim();
      const cardNumber = formData.cardNumber.replace(/\s/g, '');
      const expiryDate = formData.expiryDate;
      const cvv = formData.cvv;

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const expiryRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;

      const isValid =
        fullName &&
        email &&
        emailRegex.test(email) &&
        cardNumber.length >= 13 &&
        cardNumber.length <= 19 &&
        /^\d+$/.test(cardNumber) &&
        expiryRegex.test(expiryDate) &&
        /^\d{3,4}$/.test(cvv);

      if (isValid) {
        // Valid form, show loading and complete
        setIsLoading(true);
        setTimeout(() => {
          setIsLoading(false);
          onComplete();
        }, 1000);
      } else {
        // Invalid form, trigger validation
        form.requestSubmit();
      }
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200 bg-white shadow-lg">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:px-5 sm:py-4 md:px-10">
        <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-gray-700 sm:justify-start sm:gap-3 sm:text-sm md:gap-4 md:text-base">
          <span>Room: ${roomTotal}</span>
          <span className="text-gray-400">•</span>
          <span>Addons: ${addonsTotal}</span>
          <span className="text-gray-400">•</span>
          <span className="font-semibold text-gray-900">Total: ${grandTotal}</span>
        </div>

        <button
          type="button"
          onClick={handleClick}
          disabled={isLoading}
          className="flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70 sm:h-12 sm:w-auto sm:text-base"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin sm:h-5 sm:w-5" />
              <span>Processing...</span>
            </>
          ) : (
            <span>Complete Booking</span>
          )}
        </button>
      </div>
    </div>
  );
}
