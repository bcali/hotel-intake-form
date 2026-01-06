import { FormData } from '../App';
import { ChipsInput } from './chips-input';

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValid) {
      onNext();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-6 text-gray-900">Property details</h2>

        {/* Hotel Name */}
        <div className="mb-6 text-left">
          <label htmlFor="hotelName" className="block text-gray-700 font-medium mb-2">
            Hotel name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="hotelName"
            value={formData.hotelName}
            onChange={(e) => updateFormData({ hotelName: e.target.value })}
            placeholder="Avani+ Khao Lak Resort"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            required
          />
        </div>

        {/* Brand */}
        <div className="mb-6 text-left">
          <label htmlFor="brand" className="block text-gray-700 font-medium mb-2">
            Brand <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="brand"
            value={formData.brand}
            onChange={(e) => updateFormData({ brand: e.target.value })}
            placeholder="Avani"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            required
          />
          <p className="text-sm text-gray-500 mt-1">Example: Marriott, Hilton, Avani</p>
        </div>

        {/* Country */}
        <div className="mb-6 text-left">
          <label htmlFor="country" className="block text-gray-700 font-medium mb-2">
            Country <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="country"
            value={formData.country}
            onChange={(e) => updateFormData({ country: e.target.value })}
            placeholder="Thailand"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            required
          />
        </div>

        {/* City / Area */}
        <div className="mb-6 text-left">
          <label htmlFor="city" className="block text-gray-700 font-medium mb-2">
            City / Area <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="city"
            value={formData.city}
            onChange={(e) => updateFormData({ city: e.target.value })}
            placeholder="Khao Lak, Phang Nga"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            required
          />
        </div>

        {/* Keywords */}
        <div className="mb-6 text-left">
          <label className="block text-gray-700 font-medium mb-2">
            Hotel keywords / variants <span className="text-red-500">*</span>
          </label>
          <ChipsInput
            values={formData.keywords}
            onChange={(keywords) => updateFormData({ keywords })}
            placeholder="Type and press Enter"
          />
          <p className="text-sm text-gray-500 mt-1">
            Add common short names guests use (minimum 2)
          </p>
          <p className="text-sm text-gray-500">
            Example: "Avani Khao Lak", "Avani+ Khao Lak", "Avani Resort Khao Lak"
          </p>
          <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              These keywords help us avoid mixing your hotel with other properties.
            </p>
          </div>
        </div>

        {/* Local Language (Optional) */}
        <div className="mb-6 text-left">
          <label htmlFor="localLanguage" className="block text-gray-700 font-medium mb-2">
            Local language spelling <span className="text-gray-500">(optional)</span>
          </label>
          <input
            type="text"
            id="localLanguage"
            value={formData.localLanguage}
            onChange={(e) => updateFormData({ localLanguage: e.target.value })}
            placeholder="อวานี+ เขาหลัก รีสอร์ท"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          />
          <p className="text-sm text-gray-500 mt-1">Thai, Arabic, Japanese, etc.</p>
        </div>
      </div>

      {/* Continue Button */}
      <div className="flex justify-end pt-4">
        <button
          type="submit"
          disabled={!isValid}
          className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          Continue
        </button>
      </div>
    </form>
  );
}



