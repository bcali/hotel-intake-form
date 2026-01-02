import { useState } from 'react';
import type { KeyboardEvent } from 'react';
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
      removeChip(values.length - 1);
    }
  };

  const removeChip = (index: number) => {
    onChange(values.filter((_, i) => i !== index));
  };

  return (
    <div className="flex flex-wrap gap-2 p-2 border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 bg-white">
      {values.map((value, index) => (
        <span
          key={index}
          className="flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded-md text-sm font-medium"
        >
          {value}
          <button
            type="button"
            onClick={() => removeChip(index)}
            className="text-blue-500 hover:text-blue-700 focus:outline-none"
          >
            <X size={14} />
          </button>
        </span>
      ))}
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={values.length === 0 ? placeholder : ''}
        className="flex-1 min-w-[120px] outline-none border-none p-1 text-gray-700 bg-transparent"
      />
    </div>
  );
}

