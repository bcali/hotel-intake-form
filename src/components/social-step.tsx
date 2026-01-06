import { useState } from 'react';
import { FormData } from '../App';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface SocialStepProps {
  formData: FormData;
  updateFormData: (data: Partial<FormData>) => void;
  onSubmit: () => void;
  onBack: () => void;
}

export function SocialStep({ formData, updateFormData, onSubmit, onBack }: SocialStepProps) {
  const [showSocial, setShowSocial] = useState(false);
  const [showNotes, setShowNotes] = useState(false);

  const handleRecentChangesToggle = (change: string) => {
    const newChanges = formData.recentChanges.includes(change)
      ? formData.recentChanges.filter(c => c !== change)
      : [...formData.recentChanges, change];
    updateFormData({ recentChanges: newChanges });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-2 text-gray-900 text-left">Almost done!</h2>
        <p className="text-gray-600 mb-6 text-left">
          Add optional context to help us understand your hotel better
        </p>

        {/* Social Links (Optional) */}
        <div className="border border-gray-200 rounded-lg p-4 mb-6">
          <button
            type="button"
            onClick={() => setShowSocial(!showSocial)}
            className="flex items-center justify-between w-full text-left bg-transparent border-none p-0 cursor-pointer"
          >
            <div>
              <span className="text-gray-900 font-medium">
                Social links <span className="text-gray-500 font-normal">(optional)</span>
              </span>
              <p className="text-sm text-gray-500 mt-1">
                Helps explain what guests see before booking
              </p>
            </div>
            {showSocial ? (
              <ChevronUp className="w-5 h-5 text-gray-500" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-500" />
            )}
          </button>

          {showSocial && (
            <div className="mt-6 space-y-4">
              <div className="text-left">
                <label htmlFor="instagram" className="block text-gray-700 mb-2">
                  Instagram handle or URL
                </label>
                <input
                  type="text"
                  id="instagram"
                  value={formData.instagram}
                  onChange={(e) => updateFormData({ instagram: e.target.value })}
                  placeholder="@yourhotel or https://instagram.com/yourhotel"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>

              <div className="text-left">
                <label htmlFor="facebook" className="block text-gray-700 mb-2">
                  Facebook page URL
                </label>
                <input
                  type="text"
                  id="facebook"
                  value={formData.facebook}
                  onChange={(e) => updateFormData({ facebook: e.target.value })}
                  placeholder="https://facebook.com/yourhotel"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>

              <div className="text-left">
                <label htmlFor="tiktok" className="block text-gray-700 mb-2">
                  TikTok handle or URL
                </label>
                <input
                  type="text"
                  id="tiktok"
                  value={formData.tiktok}
                  onChange={(e) => updateFormData({ tiktok: e.target.value })}
                  placeholder="@yourhotel"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>

              <div className="text-left">
                <label htmlFor="youtube" className="block text-gray-700 mb-2">
                  YouTube channel
                </label>
                <input
                  type="text"
                  id="youtube"
                  value={formData.youtube}
                  onChange={(e) => updateFormData({ youtube: e.target.value })}
                  placeholder="https://youtube.com/c/yourhotel"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>

              <div className="pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600 mb-3 text-left font-medium">UGC shortcuts</p>
                
                <div className="mb-3 text-left">
                  <label htmlFor="taggedLocation" className="block text-gray-700 mb-2">
                    Tagged location URL (Instagram)
                  </label>
                  <input
                    type="text"
                    id="taggedLocation"
                    value={formData.taggedLocationUrl}
                    onChange={(e) => updateFormData({ taggedLocationUrl: e.target.value })}
                    placeholder="https://instagram.com/explore/locations/..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                </div>

                <div className="text-left">
                  <label htmlFor="tiktokSearch" className="block text-gray-700 mb-2">
                    TikTok search URL for hotel name
                  </label>
                  <input
                    type="text"
                    id="tiktokSearch"
                    value={formData.tiktokSearchUrl}
                    onChange={(e) => updateFormData({ tiktokSearchUrl: e.target.value })}
                    placeholder="https://tiktok.com/search?q=yourhotel"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Internal Notes (Optional) */}
        <div className="border border-gray-200 rounded-lg p-4">
          <button
            type="button"
            onClick={() => setShowNotes(!showNotes)}
            className="flex items-center justify-between w-full text-left bg-transparent border-none p-0 cursor-pointer"
          >
            <div>
              <span className="text-gray-900 font-medium">
                Internal notes <span className="text-gray-500 font-normal">(optional)</span>
              </span>
              <p className="text-sm text-gray-500 mt-1">
                Context that helps us focus on what matters
              </p>
            </div>
            {showNotes ? (
              <ChevronUp className="w-5 h-5 text-gray-500" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-500" />
            )}
          </button>

          {showNotes && (
            <div className="mt-6 space-y-4">
              <div className="text-left">
                <label htmlFor="guestIssues" className="block text-gray-700 mb-2">
                  Top 3 guest issues you already know
                </label>
                <textarea
                  id="guestIssues"
                  value={formData.guestIssues}
                  onChange={(e) => updateFormData({ guestIssues: e.target.value })}
                  placeholder="E.g., WiFi speed, breakfast wait times, pool temperature..."
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                />
              </div>

              <div className="text-left">
                <label className="block text-gray-700 mb-3 font-medium">
                  Recent changes (last 90 days)
                </label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.recentChanges.includes('renovation')}
                      onChange={() => handleRecentChangesToggle('renovation')}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-gray-700">Renovation</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.recentChanges.includes('restaurant')}
                      onChange={() => handleRecentChangesToggle('restaurant')}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-gray-700">Restaurant/amenity changes</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.recentChanges.includes('staffing')}
                      onChange={() => handleRecentChangesToggle('staffing')}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-gray-700">Staffing changes</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.recentChanges.includes('maintenance')}
                      onChange={() => handleRecentChangesToggle('maintenance')}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-gray-700">Pool/area under maintenance</span>
                  </label>
                </div>
              </div>

              <div className="text-left">
                <label htmlFor="additionalNotes" className="block text-gray-700 mb-2">
                  Anything you want us to pay attention to
                </label>
                <textarea
                  id="additionalNotes"
                  value={formData.additionalNotes}
                  onChange={(e) => updateFormData({ additionalNotes: e.target.value })}
                  placeholder="Any additional context that helps us understand your situation..."
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                />
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
          className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
        >
          Generate my Hotel Review Improvement Plan
        </button>
      </div>
    </form>
  );
}



