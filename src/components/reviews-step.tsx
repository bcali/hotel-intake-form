import { FormEvent, useState } from 'react';
import type { FormData } from '../App';
import { ChevronLeft, ChevronRight, Info, AlertTriangle } from 'lucide-react';

interface ReviewsStepProps {
  formData: FormData;
  updateFormData: (data: Partial<FormData>) => void;
  onNext: () => void;
  onBack: () => void;
}

const OTA_LIST = ['Booking.com', 'Agoda', 'Expedia', 'Other'];

export function ReviewsStep({ formData, updateFormData, onNext, onBack }: ReviewsStepProps) {
  const [showOptional, setShowOptional] = useState(false);

  const validateUrl = (url: string, domain: string) => {
    if (!url) return true;
    try {
      const u = new URL(url);
      return u.hostname.includes(domain);
    } catch {
      return false;
    }
  };

  const googleError = formData.googleMapsUrl && !validateUrl(formData.googleMapsUrl, 'google.com');
  const tripAdvisorError = formData.tripAdvisorUrl && !validateUrl(formData.tripAdvisorUrl, 'tripadvisor');

  const isValid = 
    formData.googleMapsUrl.trim() !== '' && 
    formData.tripAdvisorUrl.trim() !== '' &&
    !googleError && 
    !tripAdvisorError &&
    formData.selectedOTAs.every(ota => formData.otaUrls[ota]?.trim() !== '');

  const handleOTAToggle = (ota: string) => {
    const newSelected = formData.selectedOTAs.includes(ota)
      ? formData.selectedOTAs.filter(o => o !== ota)
      : [...formData.selectedOTAs, ota];
    
    updateFormData({ selectedOTAs: newSelected });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (isValid) onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-xl font-bold text-gray-900">Review & OTA Links</h2>
        <p className="text-sm text-gray-500">Links to your public profiles for review collection</p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Google Maps URL *</label>
          <input
            type="url"
            required
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all ${
              googleError ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="https://www.google.com/maps/place/..."
            value={formData.googleMapsUrl}
            onChange={(e) => updateFormData({ googleMapsUrl: e.target.value })}
          />
          {googleError && (
            <p className="text-xs text-red-600 flex items-center gap-1">
              <AlertTriangle size={12} /> Please enter a valid Google Maps URL
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">TripAdvisor URL *</label>
          <input
            type="url"
            required
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all ${
              tripAdvisorError ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="https://www.tripadvisor.com/Hotel_Review-..."
            value={formData.tripAdvisorUrl}
            onChange={(e) => updateFormData({ tripAdvisorUrl: e.target.value })}
          />
          {tripAdvisorError && (
            <p className="text-xs text-red-600 flex items-center gap-1">
              <AlertTriangle size={12} /> Please enter a valid TripAdvisor URL
            </p>
          )}
        </div>
      </div>

      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700">Select OTAs to include</label>
        <div className="flex flex-wrap gap-2">
          {OTA_LIST.map(ota => (
            <button
              key={ota}
              type="button"
              onClick={() => handleOTAToggle(ota)}
              className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                formData.selectedOTAs.includes(ota)
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300'
              }`}
            >
              {ota}
            </button>
          ))}
        </div>
      </div>

      {formData.selectedOTAs.map(ota => (
        <div key={ota} className="space-y-2 animate-in fade-in slide-in-from-top-1 duration-200">
          <label className="block text-sm font-medium text-gray-700">{ota} URL *</label>
          <input
            type="url"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            placeholder={`https://www.${ota.toLowerCase().replace(' ', '')}.com/...`}
            value={formData.otaUrls[ota] || ''}
            onChange={(e) => updateFormData({ 
              otaUrls: { ...formData.otaUrls, [ota]: e.target.value } 
            })}
          />
        </div>
      ))}

      <div className="border-t border-gray-100 pt-4">
        <button
          type="button"
          onClick={() => setShowOptional(!showOptional)}
          className="text-sm font-medium text-blue-600 flex items-center gap-1 hover:text-blue-700"
        >
          <Info size={16} /> {showOptional ? 'Hide' : 'Add'} optional review counts & ratings
        </button>

        {showOptional && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 animate-in fade-in slide-in-from-top-2">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Total Reviews (est.)</label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. 1,240"
                value={formData.totalReviews}
                onChange={(e) => updateFormData({ totalReviews: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Avg. Rating (est.)</label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. 4.5"
                value={formData.averageRating}
                onChange={(e) => updateFormData({ averageRating: e.target.value })}
              />
            </div>
          </div>
        )}
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
          disabled={!isValid}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold text-white transition-all ${
            isValid ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-300 cursor-not-allowed'
          }`}
        >
          Next Step <ChevronRight size={18} />
        </button>
      </div>
    </form>
  );
}

