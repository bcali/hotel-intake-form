import { CheckCircle2, Download, Mail } from 'lucide-react';
import type { FormData } from '../App';

interface ConfirmationScreenProps {
  formData: FormData;
  onViewDashboard: () => void;
}

export function ConfirmationScreen({ formData, onViewDashboard }: ConfirmationScreenProps) {
  const submissionId = localStorage.getItem('lastSubmissionId') || 'unknown';

  const handleDownloadAgain = () => {
    try {
      const lastSubmission = localStorage.getItem('lastSubmission');
      if (!lastSubmission) {
        alert('No submission found. Please submit the form again.');
        return;
      }

      const blob = new Blob([lastSubmission], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      const fileName = `${formData.hotelName.replace(/[^a-z0-9]/gi, '-').toLowerCase()}_${Date.now()}.json`;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to download JSON:', error);
      alert('Failed to download file. Please contact support.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-2xl w-full bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
            <CheckCircle2 className="w-10 h-10 text-green-600" />
          </div>

          <h1 className="text-3xl font-bold mb-4 text-gray-900 leading-tight">
            Submission Downloaded Successfully
          </h1>

          <p className="text-gray-600 mb-4 text-lg">
            Your submission file for <span className="font-semibold text-gray-900">{formData.hotelName}</span> has been downloaded.
          </p>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-8">
            <p className="text-sm text-amber-900">
              <span className="font-semibold">Submission ID:</span> {submissionId}
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-8 mb-8">
            <p className="text-blue-900 font-bold mb-4 text-left text-lg">
              Next Steps (Localhost Mode):
            </p>
            <ol className="text-left space-y-3 text-blue-800 text-base list-decimal list-inside">
              <li className="flex items-start">
                <span className="mr-3 text-blue-600 font-bold">1.</span>
                <span className="flex-1">Locate the downloaded JSON file in your Downloads folder</span>
              </li>
              <li className="flex items-start">
                <span className="mr-3 text-blue-600 font-bold">2.</span>
                <span className="flex-1">Email the file to your analyst or upload to your shared folder</span>
              </li>
              <li className="flex items-start">
                <span className="mr-3 text-blue-600 font-bold">3.</span>
                <span className="flex-1">The analyst will process your submission and generate your action plan</span>
              </li>
              <li className="flex items-start">
                <span className="mr-3 text-blue-600 font-bold">4.</span>
                <span className="flex-1">You'll receive your report via email (typically within 24 hours)</span>
              </li>
            </ol>
          </div>

          <div className="bg-purple-50 border border-purple-200 rounded-xl p-6 mb-8">
            <p className="text-purple-900 font-bold mb-3 text-left">
              Your analysis will include:
            </p>
            <ul className="text-left space-y-2 text-purple-800 text-sm">
              <li className="flex items-start">
                <span className="mr-2 text-purple-400">✓</span>
                <span>Top themes from your reviews across all sources</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-purple-400">✓</span>
                <span>Top 5 priority actions to improve guest satisfaction</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-purple-400">✓</span>
                <span>OTA-specific insights and comparison</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-purple-400">✓</span>
                <span>Quick wins you can implement this week</span>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <button
              onClick={handleDownloadAgain}
              className="w-full px-8 py-4 bg-white border-2 border-blue-600 text-blue-600 font-bold rounded-xl hover:bg-blue-50 transition-all shadow-sm hover:shadow-md active:transform active:scale-[0.98] text-lg cursor-pointer flex items-center justify-center gap-2"
            >
              <Download className="w-5 h-5" />
              Download Submission Again
            </button>

            <button
              onClick={onViewDashboard}
              className="w-full px-8 py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-md hover:shadow-lg active:transform active:scale-[0.98] text-lg cursor-pointer border-none"
            >
              View Mock Dashboard Preview
            </button>

            <div className="text-center bg-gray-50 p-6 rounded-xl border border-gray-200">
              <p className="text-gray-700 font-medium mb-3 flex items-center justify-center gap-2">
                <Mail className="w-5 h-5" />
                Need help?
              </p>
              <p className="text-sm text-gray-600">
                Email your submission file to: <span className="font-mono text-blue-600">analysis@yourcompany.com</span>
              </p>
            </div>
          </div>

          <div className="mt-10 pt-8 border-t border-gray-100">
            <p className="text-sm text-gray-500 font-medium mb-2">
              <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              Localhost Mode Active
            </p>
            <p className="text-xs text-gray-400">
              This is a proof-of-concept version. Analysis reports are generated manually.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

