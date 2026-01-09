import { useState } from 'react';
import type { FormData } from '../App';
import { ChevronDown, ChevronUp, AlertCircle } from 'lucide-react';

interface ReviewsStepProps {
  formData: FormData;
  updateFormData: (data: Partial<FormData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export function ReviewsStep({ formData, updateFormData, onNext, onBack }: ReviewsStepProps) {
  const [showOptional, setShowOptional] = useState(false);

  const validateUrl = (url: string, domain: string) => {
    if (!url) return '';
    try {
      const urlObj = new URL(url);
      if (!urlObj.hostname.includes(domain)) {
        return `Please enter a valid ${domain} URL`;
      }
    } catch {
      return 'Please enter a valid URL';
    }
    return '';
  };

  const googleError = validateUrl(formData.googleMapsUrl, 'google.com');
  const tripadvisorError = validateUrl(formData.tripAdvisorUrl, 'tripadvisor');

  const otaErrors = {
    booking: formData.selectedOTAs.includes('booking') ? validateUrl(formData.otaUrls['booking'] || '', 'booking.com') : '',
    agoda: formData.selectedOTAs.includes('agoda') ? validateUrl(formData.otaUrls['agoda'] || '', 'agoda.com') : '',
    expedia: formData.selectedOTAs.includes('expedia') ? validateUrl(formData.otaUrls['expedia'] || '', 'expedia') : '',
  };

  const isValid = 
    formData.googleMapsUrl !== '' &&
    !googleError &&
    formData.tripAdvisorUrl !== '' &&
    !tripadvisorError &&
    formData.selectedOTAs.length > 0 &&
    !otaErrors.booking &&
    !otaErrors.agoda &&
    !otaErrors.expedia;

  const handleOTAToggle = (ota: string) => {
    const newOTAs = formData.selectedOTAs.includes(ota)
      ? formData.selectedOTAs.filter(o => o !== ota)
      : [...formData.selectedOTAs, ota];
    updateFormData({ selectedOTAs: newOTAs });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValid) {
      onNext();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-6 text-gray-900 text-left">Review sources</h2>

        {/* Google Maps */}
        <div className="mb-6 text-left">
          <label htmlFor="googleMaps" className="block text-gray-700 font-medium mb-2">
            Google Maps listing URL <span className="text-red-500">*</span>
          </label>
          <input
            type="url"
            id="googleMaps"
            value={formData.googleMapsUrl}
            onChange={(e) => updateFormData({ googleMapsUrl: e.target.value })}
            placeholder="https://maps.google.com/..."
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 outline-none transition-all ${
              googleError
                ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
            }`}
            required
          />
          {!googleError && (
            <p className="text-sm text-gray-500 mt-1">
              Open your Google Maps listing and paste the link
            </p>
          )}
          {googleError && (
            <div className="flex items-center gap-1 text-sm text-red-600 mt-1">
              <AlertCircle size={14} />
              <span>{googleError}</span>
            </div>
          )}
        </div>

        {/* TripAdvisor */}
        <div className="mb-6 text-left">
          <label htmlFor="tripadvisor" className="block text-gray-700 font-medium mb-2">
            TripAdvisor hotel URL <span className="text-red-500">*</span>
          </label>
          <input
            type="url"
            id="tripadvisor"
            value={formData.tripAdvisorUrl}
            onChange={(e) => updateFormData({ tripAdvisorUrl: e.target.value })}
            placeholder="https://www.tripadvisor.com/Hotel_Review-..."
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 outline-none transition-all ${
              tripadvisorError
                ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
            }`}
            required
          />
          {tripadvisorError && (
            <div className="flex items-center gap-1 text-sm text-red-600 mt-1">
              <AlertCircle size={14} />
              <span>{tripadvisorError}</span>
            </div>
          )}
        </div>

        {/* OTA Selection */}
        <div className="mb-6 text-left">
          <label className="block text-gray-700 font-medium mb-3">
            Which OTAs do you list on? <span className="text-red-500">*</span>
          </label>
          {formData.selectedOTAs.length === 0 && (
            <div className="flex items-center gap-1 text-sm text-amber-600 mb-2 bg-amber-50 p-2 rounded">
              <AlertCircle size={14} />
              <span>Please select at least one OTA platform</span>
            </div>
          )}
          <div className="space-y-3">
            {/* Booking.com */}
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.selectedOTAs.includes('booking')}
                  onChange={() => handleOTAToggle('booking')}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                />
                <span className="ml-2 text-gray-700">Booking.com</span>
              </label>
              {formData.selectedOTAs.includes('booking') && (
                <>
                  <input
                    type="url"
                    value={formData.otaUrls['booking'] || ''}
                    onChange={(e) => updateFormData({ otaUrls: { ...formData.otaUrls, booking: e.target.value } })}
                    placeholder="https://www.booking.com/hotel/..."
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 outline-none transition-all ${
                      otaErrors.booking
                        ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                        : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                    }`}
                    required
                  />
                  {otaErrors.booking && (
                    <div className="flex items-center gap-1 text-sm text-red-600">
                      <AlertCircle size={14} />
                      <span>{otaErrors.booking}</span>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Agoda */}
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.selectedOTAs.includes('agoda')}
                  onChange={() => handleOTAToggle('agoda')}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                />
                <span className="ml-2 text-gray-700">Agoda</span>
              </label>
              {formData.selectedOTAs.includes('agoda') && (
                <>
                  <input
                    type="url"
                    value={formData.otaUrls['agoda'] || ''}
                    onChange={(e) => updateFormData({ otaUrls: { ...formData.otaUrls, agoda: e.target.value } })}
                    placeholder="https://www.agoda.com/..."
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 outline-none transition-all ${
                      otaErrors.agoda
                        ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                        : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                    }`}
                    required
                  />
                  {otaErrors.agoda && (
                    <div className="flex items-center gap-1 text-sm text-red-600">
                      <AlertCircle size={14} />
                      <span>{otaErrors.agoda}</span>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Expedia */}
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.selectedOTAs.includes('expedia')}
                  onChange={() => handleOTAToggle('expedia')}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                />
                <span className="ml-2 text-gray-700">Expedia</span>
              </label>
              {formData.selectedOTAs.includes('expedia') && (
                <>
                  <input
                    type="url"
                    value={formData.otaUrls['expedia'] || ''}
                    onChange={(e) => updateFormData({ otaUrls: { ...formData.otaUrls, expedia: e.target.value } })}
                    placeholder="https://www.expedia.com/..."
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 outline-none transition-all ${
                      otaErrors.expedia
                        ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                        : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                    }`}
                    required
                  />
                  {otaErrors.expedia && (
                    <div className="flex items-center gap-1 text-sm text-red-600">
                      <AlertCircle size={14} />
                      <span>{otaErrors.expedia}</span>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Other */}
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.selectedOTAs.includes('other')}
                  onChange={() => handleOTAToggle('other')}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                />
                <span className="ml-2 text-gray-700">Other</span>
              </label>
              {formData.selectedOTAs.includes('other') && (
                <input
                  type="url"
                  value={formData.otaUrls['other'] || ''}
                  onChange={(e) => updateFormData({ otaUrls: { ...formData.otaUrls, other: e.target.value } })}
                  placeholder="https://..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              )}
            </div>
          </div>
        </div>

        {/* Optional Section */}
        <div className="border-t border-gray-200 pt-6 text-left">
          <button
            type="button"
            onClick={() => setShowOptional(!showOptional)}
            className="flex items-center text-gray-700 hover:text-gray-900 mb-4 bg-transparent border-none p-0 cursor-pointer"
          >
            {showOptional ? (
              <ChevronUp className="w-5 h-5 mr-2" />
            ) : (
              <ChevronDown className="w-5 h-5 mr-2" />
            )}
            <span className="font-medium">If you have it (optional)</span>
          </button>

          {showOptional && (
            <div className="space-y-6">
              <div>
                <label htmlFor="totalReviews" className="block text-gray-700 font-medium mb-2">
                  Total reviews in period
                </label>
                <input
                  type="number"
                  id="totalReviews"
                  value={formData.totalReviews}
                  onChange={(e) => updateFormData({ totalReviews: e.target.value })}
                  placeholder="150"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Approximate number across all sources
                </p>
              </div>

              <div>
                <label htmlFor="averageRating" className="block text-gray-700 font-medium mb-2">
                  Average rating/score in period
                </label>
                <input
                  type="number"
                  id="averageRating"
                  value={formData.averageRating}
                  onChange={(e) => updateFormData({ averageRating: e.target.value })}
                  placeholder="4.2"
                  step="0.1"
                  min="0"
                  max="5"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Out of 5 stars
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-4">
        <button
          type="button"
          onClick={onBack}
          className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors bg-transparent cursor-pointer"
        >
          Back
        </button>
        <button
          type="submit"
          disabled={!isValid}
          className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors cursor-pointer"
        >
          Continue
        </button>
      </div>
    </form>
  );
}



