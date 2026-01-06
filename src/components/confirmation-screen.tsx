import { CheckCircle2 } from 'lucide-react';
import { FormData } from '../App';

interface ConfirmationScreenProps {
  formData: FormData;
  onViewDashboard: () => void;
}

export function ConfirmationScreen({ formData, onViewDashboard }: ConfirmationScreenProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-2xl w-full bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
            <CheckCircle2 className="w-10 h-10 text-green-600" />
          </div>
          
          <h1 className="text-3xl font-bold mb-4 text-gray-900 leading-tight">
            We're analyzing your sources
          </h1>
          
          <p className="text-gray-600 mb-8 text-lg">
            Your Hotel Review Improvement Plan for <span className="font-semibold text-gray-900">{formData.hotelName}</span> is being generated.
          </p>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-8 mb-8">
            <p className="text-blue-900 font-bold mb-4 text-left text-lg">
              You'll receive:
            </p>
            <ul className="text-left space-y-3 text-blue-800 text-base">
              <li className="flex items-start">
                <span className="mr-3 text-blue-400 font-bold">•</span>
                <span>Top themes from your reviews across all sources</span>
              </li>
              <li className="flex items-start">
                <span className="mr-3 text-blue-400 font-bold">•</span>
                <span>Top 5 priority actions to improve guest satisfaction</span>
              </li>
              <li className="flex items-start">
                <span className="mr-3 text-blue-400 font-bold">•</span>
                <span>OTA-specific insights and comparison</span>
              </li>
              <li className="flex items-start">
                <span className="mr-3 text-blue-400 font-bold">•</span>
                <span>Quick wins you can implement this week</span>
              </li>
            </ul>
          </div>

          <div className="space-y-6">
            <button
              onClick={onViewDashboard}
              className="w-full px-8 py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-md hover:shadow-lg active:transform active:scale-[0.98] text-lg cursor-pointer border-none"
            >
              View in dashboard
            </button>
            
            <div className="text-center bg-gray-50 p-6 rounded-xl border border-gray-100">
              <p className="text-gray-700 font-medium mb-3">
                Or we can email your report to:
              </p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none shadow-sm"
                />
                <button className="px-6 py-3 bg-white border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-100 transition-colors shadow-sm cursor-pointer">
                  Send
                </button>
              </div>
            </div>
          </div>

          <div className="mt-10 pt-8 border-t border-gray-100">
            <p className="text-sm text-gray-500 font-medium">
              Analysis typically takes 5-10 minutes. You'll be notified when it's ready.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

