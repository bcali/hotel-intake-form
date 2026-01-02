import { FormData } from '../App';
import { ChevronLeft, Check, Instagram, Facebook, Video, Youtube, MapPin, Search, Plus } from 'lucide-react';
import { useState } from 'react';

interface SocialStepProps {
  formData: FormData;
  updateFormData: (data: Partial<FormData>) => void;
  onSubmit: () => void;
  onBack: () => void;
}

export function SocialStep({ formData, updateFormData, onSubmit, onBack }: SocialStepProps) {
  const [showSocial, setShowSocial] = useState(false);
  const [showNotes, setShowNotes] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-xl font-bold text-gray-900">Social & Internal Context</h2>
        <p className="text-sm text-gray-500">Optional inputs to deepen the automated analysis</p>
      </div>

      {/* Social Links Section */}
      <div className="space-y-4">
        <button
          type="button"
          onClick={() => setShowSocial(!showSocial)}
          className="flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-blue-600 transition-colors"
        >
          <div className={`p-1 rounded-full border ${showSocial ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-200'}`}>
            <Plus size={14} className={`transition-transform ${showSocial ? 'rotate-45' : ''}`} />
          </div>
          Add Social Media Links
        </button>

        {showSocial && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-xl animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <Instagram size={16} className="text-pink-600" /> Instagram URL
              </label>
              <input
                type="url"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                placeholder="https://instagram.com/..."
                value={formData.socialLinks.instagram}
                onChange={(e) => updateFormData({ socialLinks: { ...formData.socialLinks, instagram: e.target.value } })}
              />
            </div>
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <Facebook size={16} className="text-blue-600" /> Facebook Page
              </label>
              <input
                type="url"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                placeholder="https://facebook.com/..."
                value={formData.socialLinks.facebook}
                onChange={(e) => updateFormData({ socialLinks: { ...formData.socialLinks, facebook: e.target.value } })}
              />
            </div>
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <Video size={16} className="text-black" /> TikTok Account
              </label>
              <input
                type="url"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                placeholder="https://tiktok.com/@..."
                value={formData.socialLinks.tiktok}
                onChange={(e) => updateFormData({ socialLinks: { ...formData.socialLinks, tiktok: e.target.value } })}
              />
            </div>
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <Search size={16} className="text-black" /> TikTok Search (Property Name)
              </label>
              <input
                type="url"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                placeholder="https://tiktok.com/search?q=..."
                value={formData.socialLinks.tiktokSearchUrl}
                onChange={(e) => updateFormData({ socialLinks: { ...formData.socialLinks, tiktokSearchUrl: e.target.value } })}
              />
            </div>
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <Youtube size={16} className="text-red-600" /> YouTube Channel
              </label>
              <input
                type="url"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                placeholder="https://youtube.com/..."
                value={formData.socialLinks.youtube}
                onChange={(e) => updateFormData({ socialLinks: { ...formData.socialLinks, youtube: e.target.value } })}
              />
            </div>
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <MapPin size={16} className="text-gray-600" /> Tagged Location (IG/FB)
              </label>
              <input
                type="url"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                placeholder="https://..."
                value={formData.socialLinks.taggedLocation}
                onChange={(e) => updateFormData({ socialLinks: { ...formData.socialLinks, taggedLocation: e.target.value } })}
              />
            </div>
          </div>
        )}
      </div>

      {/* Internal Notes Section */}
      <div className="space-y-4 border-t border-gray-100 pt-6">
        <button
          type="button"
          onClick={() => setShowNotes(!showNotes)}
          className="flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-blue-600 transition-colors"
        >
          <div className={`p-1 rounded-full border ${showNotes ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-200'}`}>
            <Plus size={14} className={`transition-transform ${showNotes ? 'rotate-45' : ''}`} />
          </div>
          Add Internal Context & Notes
        </button>

        {showNotes && (
          <div className="space-y-4 p-4 bg-gray-50 rounded-xl animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Top Guest Issues (Staff Observation)</label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white h-24"
                placeholder="What are guests complaining about most in person?"
                value={formData.notes.topGuestIssues}
                onChange={(e) => updateFormData({ notes: { ...formData.notes, topGuestIssues: e.target.value } })}
              />
            </div>
            
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">Have there been recent property changes?</label>
              <div className="flex gap-4">
                {['Yes', 'No'].map(val => (
                  <label key={val} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="recentChanges"
                      checked={formData.notes.recentChanges === val}
                      onChange={() => updateFormData({ notes: { ...formData.notes, recentChanges: val } })}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">{val}</span>
                  </label>
                ))}
              </div>
              {formData.notes.recentChanges === 'Yes' && (
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white h-20 animate-in fade-in zoom-in-95 duration-200"
                  placeholder="Describe recent renovations, staff changes, etc."
                  value={formData.notes.recentChangesNotes}
                  onChange={(e) => updateFormData({ notes: { ...formData.notes, recentChangesNotes: e.target.value } })}
                />
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Additional Notes for Analyst</label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white h-20"
                placeholder="Any other context we should know?"
                value={formData.notes.additionalNotes}
                onChange={(e) => updateFormData({ notes: { ...formData.notes, additionalNotes: e.target.value } })}
              />
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-between pt-6">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 px-6 py-3 rounded-lg font-bold text-gray-600 hover:bg-gray-100 transition-all border border-gray-200"
        >
          <ChevronLeft size={18} /> Back
        </button>
        <button
          type="submit"
          className="flex items-center gap-2 px-8 py-3 rounded-lg font-bold text-white bg-green-600 hover:bg-green-700 transition-all shadow-md hover:shadow-lg active:scale-95"
        >
          Generate Report <Check size={18} />
        </button>
      </div>
    </form>
  );
}

