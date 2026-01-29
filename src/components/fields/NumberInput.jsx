import React from 'react';
import { Plus, Minus } from 'lucide-react';

const NumberInput = ({ field, value, onChange, theme }) => {
    const numValue = value === undefined || value === '' ? '' : Number(value);
    const min = field.min !== undefined ? Number(field.min) : undefined;
    const max = field.max !== undefined ? Number(field.max) : undefined;
    const step = field.step !== undefined ? Number(field.step) : 1;

    const handleIncrement = () => {
        const current = numValue === '' ? 0 : numValue;
        const next = current + step;
        if (max !== undefined && next > max) return;
        onChange(field.id, next);
    };

    const handleDecrement = () => {
        const current = numValue === '' ? 0 : numValue;
        const next = current - step;
        if (min !== undefined && next < min) return;
        onChange(field.id, next);
    };

    return (
        <div className="flex items-center gap-2 mt-2">
            <div className="relative flex-1">
                <input
                    type="number"
                    value={numValue}
                    min={min}
                    max={max}
                    step={step}
                    onChange={(e) => onChange(field.id, e.target.value)}
                    placeholder={field.placeholder}
                    className={`
            w-full p-3 border rounded-lg outline-none transition shadow-sm bg-white
            border-slate-200 focus:ring-2 ${theme.inputRing}
            text-slate-700 font-medium [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none
          `}
                />
                {field.suffix && (
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-400 font-medium">
                        {field.suffix}
                    </div>
                )}
            </div>
            <div className="flex flex-col gap-1">
                <button
                    type="button"
                    onClick={handleIncrement}
                    className={`p-1.5 rounded-md border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition-colors`}
                >
                    <Plus size={14} />
                </button>
                <button
                    type="button"
                    onClick={handleDecrement}
                    className={`p-1.5 rounded-md border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition-colors`}
                >
                    <Minus size={14} />
                </button>
            </div>
        </div>
    );
};

export default NumberInput;
