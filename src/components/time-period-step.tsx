import type { FormData } from '../App';

interface TimePeriodStepProps {
  formData: FormData;
  updateFormData: (data: Partial<FormData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export function TimePeriodStep({ formData, updateFormData, onNext, onBack }: TimePeriodStepProps) {
  const isValid = formData.startDate !== '' && formData.endDate !== '';
  
  const validateDates = () => {
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      
      if (end <= start) {
        return 'End date must be after start date';
      }
      
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays > 180) {
        return 'Maximum date range is 180 days';
      }
    }
    return '';
  };

  const dateError = validateDates();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValid && !dateError) {
      onNext();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-6 text-gray-900 text-left">Time period</h2>

        {/* Date Range */}
        <div className="mb-6 text-left">
          <label className="block text-gray-700 font-medium mb-2">
            Report period <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="startDate" className="block text-sm text-gray-600 mb-1">
                Start date
              </label>
              <input
                type="date"
                id="startDate"
                value={formData.startDate}
                onChange={(e) => updateFormData({ startDate: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                required
              />
            </div>
            <div>
              <label htmlFor="endDate" className="block text-sm text-gray-600 mb-1">
                End date
              </label>
              <input
                type="date"
                id="endDate"
                value={formData.endDate}
                onChange={(e) => updateFormData({ endDate: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                required
              />
            </div>
          </div>
          {dateError && (
            <p className="text-sm text-red-600 mt-2">{dateError}</p>
          )}
          <p className="text-sm text-gray-500 mt-2">
            We'll analyze reviews from this period. Maximum 180 days.
          </p>
        </div>

        {/* Comparison Period */}
        <div className="mb-6 text-left">
          <label htmlFor="comparisonPeriod" className="block text-gray-700 font-medium mb-2">
            Comparison period <span className="text-red-500">*</span>
          </label>
          <select
            id="comparisonPeriod"
            value={formData.comparisonPeriod}
            onChange={(e) => updateFormData({ comparisonPeriod: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
            required
          >
            <option value="previous-period">Previous period (same length)</option>
            <option value="previous-month">Previous month</option>
            <option value="previous-quarter">Previous quarter</option>
            <option value="none">None</option>
          </select>
          <p className="text-sm text-gray-500 mt-1">
            Compare your results to see if things are improving
          </p>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-4">
        <button
          type="button"
          onClick={onBack}
          className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
        >
          Back
        </button>
        <button
          type="submit"
          disabled={!isValid || !!dateError}
          className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          Continue
        </button>
      </div>
    </form>
  );
}



