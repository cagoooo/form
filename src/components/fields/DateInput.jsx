import React from 'react';
import { Calendar } from 'lucide-react';

const DateInput = ({ field, value, onChange, theme }) => {
    return (
        <div className="relative mt-2">
            <input
                type="date"
                value={value || ''}
                min={field.minDate}
                max={field.maxDate}
                onChange={(e) => onChange(field.id, e.target.value)}
                className={`
          w-full p-3 pr-10 border rounded-lg outline-none transition shadow-sm bg-white
          border-slate-200 focus:ring-2 ${theme.inputRing}
          text-slate-700 font-medium
        `}
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-400">
                <Calendar size={20} />
            </div>
        </div>
    );
};

export default DateInput;
