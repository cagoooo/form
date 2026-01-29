import React from 'react';

const RadioGroup = ({ field, value, onChange, theme }) => {
    const options = field.options || [];
    const layout = field.layout || 'vertical';

    return (
        <div className={`flex ${layout === 'horizontal' ? 'flex-row flex-wrap gap-4' : 'flex-col gap-2'} mt-2`}>
            {options.map((option) => (
                <label
                    key={option.value}
                    className={`
            flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all duration-200
            ${value === option.value
                            ? `${theme.bg} ${theme.border.replace('border-', 'border-')} border-2 shadow-sm`
                            : 'bg-white border-slate-200 hover:border-slate-300'}
          `}
                >
                    <div className="relative flex items-center justify-center">
                        <input
                            type="radio"
                            name={field.id}
                            value={option.value}
                            checked={value === option.value}
                            onChange={() => onChange(field.id, option.value)}
                            className="sr-only"
                        />
                        <div className={`
              w-5 h-5 rounded-full border-2 transition-all duration-200
              ${value === option.value
                                ? `border-current ${theme.text.replace('text-', 'bg-')}`
                                : 'border-slate-300 bg-white'}
            `}>
                            {value === option.value && (
                                <div className="absolute inset-0 m-auto w-2 h-2 bg-white rounded-full" />
                            )}
                        </div>
                    </div>
                    <span className={`text-sm font-medium ${value === option.value ? theme.text : 'text-slate-700'}`}>
                        {option.label}
                    </span>
                </label>
            ))}
        </div>
    );
};

export default RadioGroup;
