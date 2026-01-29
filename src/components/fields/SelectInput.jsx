import React from 'react';
import { ChevronDown } from 'lucide-react';

const SelectInput = ({ field, value, onChange, theme }) => {
    const options = field.options || [];

    return (
        <div className="relative mt-2">
            <select
                value={value || ''}
                onChange={(e) => onChange(field.id, e.target.value)}
                className={`
          w-full p-3 pr-10 border rounded-lg outline-none transition shadow-sm bg-white appearance-none
          border-slate-200 focus:ring-2 ${theme.inputRing}
          text-slate-700 font-medium
        `}
            >
                <option value="" disabled>{field.placeholder || '請選擇一個選項'}</option>
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-400">
                <ChevronDown size={20} />
            </div>
        </div>
    );
};

export default SelectInput;
