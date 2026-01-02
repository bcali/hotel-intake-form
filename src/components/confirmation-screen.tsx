import { CheckCircle2, ArrowRight, Download, Mail } from 'lucide-react';
import type { FormData } from '../App';

interface ConfirmationScreenProps {
  formData: FormData;
  onViewDashboard: () => void;
}

export function ConfirmationScreen({ formData, onViewDashboard }: ConfirmationScreenProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-2xl w-full bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-green-600">
            <CheckCircle2 size={48} />
          </div>
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Submission Received!</h1>
        <p className="text-gray-600 mb-8">
          We've received the data for <span className="font-semibold text-gray-900">{formData.hotelName}</span>. 
          Our automated analysis engine is now generating your prioritized action plan.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 text-left">
          <div className="p-4 rounded-lg bg-blue-50 border border-blue-100">
            <h3 className="text-sm font-bold text-blue-800 mb-1">Estimated Ready Time</h3>
            <p className="text-lg font-medium text-blue-900">3 - 5 Minutes</p>
          </div>
          <div className="p-4 rounded-lg bg-blue-50 border border-blue-100">
            <h3 className="text-sm font-bold text-blue-800 mb-1">Submission ID</h3>
            <p className="text-lg font-mono text-blue-900">HG-{Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
          </div>
        </div>

        <div className="space-y-4">
          <button
            onClick={onViewDashboard}
            className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-md hover:shadow-lg active:scale-95 text-lg"
          >
            View in Dashboard <ArrowRight size={20} />
          </button>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white text-gray-700 font-semibold rounded-lg border border-gray-200 hover:bg-gray-50 transition-all">
              <Download size={18} /> Download PDF
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white text-gray-700 font-semibold rounded-lg border border-gray-200 hover:bg-gray-50 transition-all">
              <Mail size={18} /> Email Report
            </button>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-100">
          <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">What happens next?</h4>
          <ul className="text-left space-y-3">
            {[
              "Analysis of Google and TripAdvisor reviews",
              "Categorization of issues by department",
              "Comparison of performance across OTA platforms",
              "Generation of Top 5 prioritized owner actions"
            ].map((text, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-gray-600">
                <div className="mt-1 w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                {text}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

