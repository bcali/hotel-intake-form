import { useState, KeyboardEvent } from 'react';
import { X } from 'lucide-react';

interface ChipsInputProps {
  values: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
}

export function ChipsInput({ values, onChange, placeholder }: ChipsInputProps) {
  const [inputValue, setInputValue] = useState('');

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault();
      if (!values.includes(inputValue.trim())) {
        onChange([...values, inputValue.trim()]);
      }
      setInputValue('');
    } else if (e.key === 'Backspace' && !inputValue && values.length > 0) {
      onChange(values.slice(0, -1));
    }
  };

  const removeChip = (index: number) => {
    onChange(values.filter((_, i) => i !== index));
  };

  return (
    <div className="w-full px-4 py-2 border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent">
      <div className="flex flex-wrap gap-2 mb-2">
        {values.map((value, index) => (
          <div
            key={index}
            className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full"
          >
            <span>{value}</span>
            <button
              type="button"
              onClick={() => removeChip(index)}
              className="hover:bg-blue-200 rounded-full p-0.5 transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}
      </div>
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={values.length === 0 ? placeholder : ''}
        className="w-full outline-none"
      />
    </div>
  );
}



