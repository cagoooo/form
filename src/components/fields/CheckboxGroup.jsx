import React from 'react';
import { Check } from 'lucide-react';

const CheckboxGroup = ({ field, value = [], onChange, theme }) => {
    const options = field.options || [];
    const layout = field.layout || 'vertical';

    const handleToggle = (optionValue) => {
        const newValue = Array.isArray(value) ? [...value] : [];
        const index = newValue.indexOf(optionValue);

        if (index > -1) {
            newValue.splice(index, 1);
        } else {
            if (field.maxSelect && newValue.length >= field.maxSelect) {
                return; // Limit reached
            }
            newValue.push(optionValue);
        }

        onChange(field.id, newValue);
    };

    return (
        <div className={`flex ${layout === 'horizontal' ? 'flex-row flex-wrap gap-4' : 'flex-col gap-2'} mt-2`}>
            {options.map((option) => {
                const isChecked = Array.isArray(value) && value.includes(option.value);
                return (
                    <label
                        key={option.value}
                        className={`
              flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all duration-200
              ${isChecked
                                ? `${theme.bg} ${theme.border} border-2 shadow-sm`
                                : 'bg-white border-slate-200 hover:border-slate-300'}
            `}
                    >
                        <div className="relative flex items-center justify-center">
                            <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => handleToggle(option.value)}
                                className="sr-only"
                            />
                            <div className={`
                w-5 h-5 rounded-md border-2 transition-all duration-200 flex items-center justify-center
                ${isChecked
                                    ? `border-current ${theme.text.replace('text-', 'bg-')}`
                                    : 'border-slate-300 bg-white'}
              `}>
                                {isChecked && <Check className="w-3.5 h-3.5 text-white stroke-[3]" />}
                            </div>
                        </div>
                        <span className={`text-sm font-medium ${isChecked ? theme.text : 'text-slate-700'}`}>
                            {option.label}
                        </span>
                    </label>
                );
            })}
        </div>
    );
};

export default CheckboxGroup;
