import { type FormEvent, useState } from 'react';
import type { FormData } from '../App';
import { ChipsInput } from './chips-input';
import { ChevronRight, AlertCircle } from 'lucide-react';

interface PropertyStepProps {
  formData: FormData;
  updateFormData: (data: Partial<FormData>) => void;
  onNext: () => void;
}

interface FieldErrors {
  hotelName: string;
  brand: string;
  country: string;
  city: string;
}

export function PropertyStep({ formData, updateFormData, onNext }: PropertyStepProps) {
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<FieldErrors>({
    hotelName: '',
    brand: '',
    country: '',
    city: ''
  });

  const validateField = (field: keyof FieldErrors, value: string): string => {
    const fieldLabels: Record<keyof FieldErrors, string> = {
      hotelName: 'Hotel name',
      brand: 'Brand',
      country: 'Country',
      city: 'City/Area'
    };
    
    if (!value.trim()) {
      return `${fieldLabels[field]} is required`;
    }
    if (value.trim().length < 2) {
      return `${fieldLabels[field]} must be at least 2 characters`;
    }
    return '';
  };

  const handleBlur = (field: keyof FieldErrors) => {
    setTouched({ ...touched, [field]: true });
    const error = validateField(field, formData[field]);
    setErrors({ ...errors, [field]: error });
  };

  const handleChange = (field: keyof FieldErrors, value: string) => {
    updateFormData({ [field]: value });
    if (touched[field]) {
      const error = validateField(field, value);
      setErrors({ ...errors, [field]: error });
    }
  };

  const isValid = 
    formData.hotelName.trim() !== '' && 
    formData.brand.trim() !== '' && 
    formData.country.trim() !== '' && 
    formData.city.trim() !== '' &&
    !errors.hotelName &&
    !errors.brand &&
    !errors.country &&
    !errors.city;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    // Validate all fields on submit
    const newErrors = {
      hotelName: validateField('hotelName', formData.hotelName),
      brand: validateField('brand', formData.brand),
      country: validateField('country', formData.country),
      city: validateField('city', formData.city)
    };
    
    setErrors(newErrors);
    setTouched({
      hotelName: true,
      brand: true,
      country: true,
      city: true
    });

    // Check if all validations passed
    const hasErrors = Object.values(newErrors).some(error => error !== '');
    if (!hasErrors && isValid) {
      onNext();
    }
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
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 outline-none transition-all ${
              touched.hotelName && errors.hotelName
                ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
            }`}
            placeholder="e.g. Grand Resort & Spa"
            value={formData.hotelName}
            onChange={(e) => handleChange('hotelName', e.target.value)}
            onBlur={() => handleBlur('hotelName')}
          />
          {touched.hotelName && errors.hotelName && (
            <div className="flex items-center gap-1 text-sm text-red-600">
              <AlertCircle size={14} />
              <span>{errors.hotelName}</span>
            </div>
          )}
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Brand *</label>
          <input
            type="text"
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 outline-none transition-all ${
              touched.brand && errors.brand
                ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
            }`}
            placeholder="e.g. Hilton, Marriott"
            value={formData.brand}
            onChange={(e) => handleChange('brand', e.target.value)}
            onBlur={() => handleBlur('brand')}
          />
          {touched.brand && errors.brand && (
            <div className="flex items-center gap-1 text-sm text-red-600">
              <AlertCircle size={14} />
              <span>{errors.brand}</span>
            </div>
          )}
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Country *</label>
          <input
            type="text"
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 outline-none transition-all ${
              touched.country && errors.country
                ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
            }`}
            placeholder="e.g. Thailand"
            value={formData.country}
            onChange={(e) => handleChange('country', e.target.value)}
            onBlur={() => handleBlur('country')}
          />
          {touched.country && errors.country && (
            <div className="flex items-center gap-1 text-sm text-red-600">
              <AlertCircle size={14} />
              <span>{errors.country}</span>
            </div>
          )}
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">City/Area *</label>
          <input
            type="text"
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 outline-none transition-all ${
              touched.city && errors.city
                ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
            }`}
            placeholder="e.g. Bangkok"
            value={formData.city}
            onChange={(e) => handleChange('city', e.target.value)}
            onBlur={() => handleBlur('city')}
          />
          {touched.city && errors.city && (
            <div className="flex items-center gap-1 text-sm text-red-600">
              <AlertCircle size={14} />
              <span>{errors.city}</span>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Keywords (Optional)</label>
        <p className="text-xs text-gray-500 mb-2 leading-relaxed">
          Enter important keywords related to your resort to further personalize the output. 
          Things like pet friendly, location, restaurants nearby, activities etc.
        </p>
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

