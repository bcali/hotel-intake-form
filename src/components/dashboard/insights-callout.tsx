import { AlertCircle } from 'lucide-react';

interface InsightsCalloutProps {
  customInsight?: string;
}

export function InsightsCallout({ customInsight }: InsightsCalloutProps) {
  return (
    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <p className="text-amber-900 font-medium">
          {customInsight || "High-severity cleanliness and AC complaints increased this period and appear across OTAs + Google."}
        </p>
      </div>
    </div>
  );
}



