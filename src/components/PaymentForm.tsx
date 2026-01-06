import { Lock, CreditCard } from 'lucide-react';

export function PaymentForm() {
  return (
    <div className="bg-white border border-gray-200">
      <div className="bg-[#1a2847] text-white px-6 py-4 flex items-center gap-2">
        <Lock className="w-5 h-5" />
        <h2 className="text-lg">Payment Details</h2>
      </div>

      <div className="p-6">
        {/* Credit Card Option */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <input
              type="radio"
              id="credit-card"
              name="payment-method"
              defaultChecked
              className="w-4 h-4"
            />
            <CreditCard className="w-5 h-5 text-gray-600" />
            <label htmlFor="credit-card" className="text-gray-900">
              Credit Card (present at check-in for verification)
            </label>
          </div>

          <div className="space-y-4 ml-7">
            {/* Card Number */}
            <div>
              <label className="block text-gray-700 text-sm mb-2">
                Credit Card Number : <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="•••• •••• •••• ••••"
                  className="w-full border border-gray-300 px-4 py-2 focus:outline-none focus:border-[#1a2847]"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1">
                  <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='20' viewBox='0 0 32 20'%3E%3Crect width='32' height='20' rx='2' fill='%23016fd0'/%3E%3C/svg%3E" alt="Visa" className="h-5" />
                  <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='20' viewBox='0 0 32 20'%3E%3Crect width='32' height='20' rx='2' fill='%23eb001b'/%3E%3C/svg%3E" alt="Mastercard" className="h-5" />
                  <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='20' viewBox='0 0 32 20'%3E%3Crect width='32' height='20' rx='2' fill='%23006fcf'/%3E%3C/svg%3E" alt="JCB" className="h-5" />
                </div>
              </div>
            </div>

            {/* Name on Card */}
            <div>
              <label className="block text-gray-700 text-sm mb-2">
                Name on Card : <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="John Smith"
                className="w-full border border-gray-300 px-4 py-2 focus:outline-none focus:border-[#1a2847]"
              />
            </div>

            {/* Expiration Date and CVV */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 text-sm mb-2">
                  Expiration Date : <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <select className="border border-gray-300 px-3 py-2 focus:outline-none focus:border-[#1a2847] text-gray-600">
                    <option>Month</option>
                    {Array.from({ length: 12 }, (_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {String(i + 1).padStart(2, '0')}
                      </option>
                    ))}
                  </select>
                  <select className="border border-gray-300 px-3 py-2 focus:outline-none focus:border-[#1a2847] text-gray-600">
                    <option>Year</option>
                    {Array.from({ length: 10 }, (_, i) => {
                      const year = new Date().getFullYear() + i;
                      return (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-gray-700 text-sm mb-2">
                  CVV : <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="•••"
                  maxLength={3}
                  className="w-full border border-gray-300 px-4 py-2 focus:outline-none focus:border-[#1a2847]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Installment Payment Option */}
        <div className="mb-6 pb-6 border-b border-gray-200">
          <div className="flex items-center gap-3 mb-3">
            <input
              type="radio"
              id="installment"
              name="payment-method"
              className="w-4 h-4"
            />
            <CreditCard className="w-5 h-5 text-gray-600" />
            <label htmlFor="installment" className="text-gray-900">
              Installment Payment Plan
            </label>
          </div>
          <div className="ml-7 flex gap-2 flex-wrap">
            <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='28' viewBox='0 0 48 28'%3E%3Crect width='48' height='28' rx='3' fill='%23006fcf'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='white' font-size='10' font-weight='bold'%3EBANK%3C/text%3E%3C/svg%3E" alt="Bank" className="h-7" />
            <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='28' viewBox='0 0 48 28'%3E%3Crect width='48' height='28' rx='3' fill='%231e40af'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='white' font-size='10' font-weight='bold'%3ECITI%3C/text%3E%3C/svg%3E" alt="Citi" className="h-7" />
            <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='28' viewBox='0 0 48 28'%3E%3Crect width='48' height='28' rx='3' fill='%234f46e5'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='white' font-size='9' font-weight='bold'%3ESCB%3C/text%3E%3C/svg%3E" alt="SCB" className="h-7" />
            <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='28' viewBox='0 0 48 28'%3E%3Crect width='48' height='28' rx='3' fill='%23dc2626'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='white' font-size='9' font-weight='bold'%3Ektc%3C/text%3E%3C/svg%3E" alt="KTC" className="h-7" />
          </div>
          <p className="text-gray-600 text-xs mt-3 ml-7">
            Pay 0% interest monthly installments over up to 10 months with participating credit card providers –
            Bangkok Bank, Citibank, Siam Commercial Bank, Krung Thai Credit Card and Krungsri.
          </p>
        </div>

        {/* Alternative Payment Methods */}
        <div>
          <p className="text-gray-700 text-sm mb-3">Or pay with:</p>
          <div className="flex gap-3 flex-wrap">
            <button className="border border-gray-300 p-2 hover:border-[#1a2847] transition-colors">
              <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='32' viewBox='0 0 80 32'%3E%3Crect width='80' height='32' rx='4' fill='%2300B900'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='white' font-size='14' font-weight='bold'%3ELINE Pay%3C/text%3E%3C/svg%3E" alt="LINE Pay" className="h-8" />
            </button>
            <button className="border border-gray-300 p-2 hover:border-[#1a2847] transition-colors">
              <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='32' viewBox='0 0 80 32'%3E%3Crect width='80' height='32' rx='4' fill='%2307C160'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='white' font-size='12' font-weight='bold'%3EWeChat Pay%3C/text%3E%3C/svg%3E" alt="WeChat Pay" className="h-8" />
            </button>
            <button className="border border-gray-300 p-2 hover:border-[#1a2847] transition-colors">
              <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='32' viewBox='0 0 80 32'%3E%3Crect width='80' height='32' rx='4' fill='%2300A0E9'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='white' font-size='12' font-weight='bold'%3EAlipay%3C/text%3E%3C/svg%3E" alt="Alipay" className="h-8" />
            </button>
            <button className="border border-gray-300 p-2 hover:border-[#1a2847] transition-colors">
              <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='32' viewBox='0 0 80 32'%3E%3Crect width='80' height='32' rx='4' fill='%234E2785'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='white' font-size='11' font-weight='bold'%3EPromptPay%3C/text%3E%3C/svg%3E" alt="PromptPay" className="h-8" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
