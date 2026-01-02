import { FormData } from '../App';
import { ChevronLeft, ChevronRight, AlertCircle } from 'lucide-react';

interface TimePeriodStepProps {
  formData: FormData;
  updateFormData: (data: Partial<FormData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export function TimePeriodStep({ formData, updateFormData, onNext, onBack }: TimePeriodStepProps) {
  const isValid = formData.startDate !== '' && formData.endDate !== '';

  const validateDates = () => {
    if (!formData.startDate || !formData.endDate) return null;
    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);
    if (end < start) return "End date must be after start date";
    
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays > 180) return "Max analysis period is 180 days";
    
    return null;
  };

  const dateError = validateDates();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValid && !dateError) onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-xl font-bold text-gray-900">Analysis Time Period</h2>
        <p className="text-sm text-gray-500">Define the date range for the review analysis</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Start Date *</label>
          <input
            type="date"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            value={formData.startDate}
            onChange={(e) => updateFormData({ startDate: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">End Date *</label>
          <input
            type="date"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            value={formData.endDate}
            onChange={(e) => updateFormData({ endDate: e.target.value })}
          />
        </div>
      </div>

      {dateError && (
        <div className="flex items-center gap-2 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
          <AlertCircle size={16} />
          {dateError}
        </div>
      )}

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Comparison Period</label>
        <select
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white"
          value={formData.comparisonPeriod}
          onChange={(e) => updateFormData({ comparisonPeriod: e.target.value })}
        >
          <option value="previous_period">Previous Period (e.g. previous 30 days)</option>
          <option value="previous_year">Previous Year (YoY)</option>
          <option value="none">No Comparison</option>
        </select>
      </div>

      <div className="flex justify-between pt-4">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 px-6 py-3 rounded-lg font-bold text-gray-600 hover:bg-gray-100 transition-all border border-gray-200"
        >
          <ChevronLeft size={18} /> Back
        </button>
        <button
          type="submit"
          disabled={!isValid || !!dateError}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold text-white transition-all ${
            isValid && !dateError ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-300 cursor-not-allowed'
          }`}
        >
          Next Step <ChevronRight size={18} />
        </button>
      </div>
    </form>
  );
}

