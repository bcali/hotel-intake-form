import { FormEvent } from 'react';
import type { FormData } from '../App';
import { ChipsInput } from './chips-input';
import { ChevronRight } from 'lucide-react';

interface PropertyStepProps {
  formData: FormData;
  updateFormData: (data: Partial<FormData>) => void;
  onNext: () => void;
}

export function PropertyStep({ formData, updateFormData, onNext }: PropertyStepProps) {
  const isValid = 
    formData.hotelName.trim() !== '' && 
    formData.brand.trim() !== '' && 
    formData.country.trim() !== '' && 
    formData.city.trim() !== '' && 
    formData.keywords.length >= 2;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (isValid) onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-xl font-bold text-gray-900">Property Information</h2>
        <p className="text-sm text-gray-500">Basic identifiers for your hotel property</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Hotel Name *</label>
          <input
            type="text"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            placeholder="e.g. Grand Resort & Spa"
            value={formData.hotelName}
            onChange={(e) => updateFormData({ hotelName: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Brand *</label>
          <input
            type="text"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            placeholder="e.g. Hilton, Marriott"
            value={formData.brand}
            onChange={(e) => updateFormData({ brand: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Country *</label>
          <input
            type="text"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            placeholder="e.g. Thailand"
            value={formData.country}
            onChange={(e) => updateFormData({ country: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">City/Area *</label>
          <input
            type="text"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            placeholder="e.g. Bangkok"
            value={formData.city}
            onChange={(e) => updateFormData({ city: e.target.value })}
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Keywords * (Min 2)</label>
        <p className="text-xs text-gray-500 mb-2">Include common property name variants</p>
        <ChipsInput
          values={formData.keywords}
          onChange={(keywords) => updateFormData({ keywords })}
          placeholder="Type keyword and press Enter..."
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Local Language</label>
        <select
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white"
          value={formData.localLanguage}
          onChange={(e) => updateFormData({ localLanguage: e.target.value })}
        >
          <option>English</option>
          <option>Thai</option>
          <option>Japanese</option>
          <option>Simplified Chinese</option>
          <option>Traditional Chinese</option>
        </select>
      </div>

      <div className="flex justify-end pt-4">
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

