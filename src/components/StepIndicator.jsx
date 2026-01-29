import React from 'react';
import { Check } from 'lucide-react';

const StepIndicator = ({ steps, currentStep, theme }) => {
    return (
        <div className="flex items-center justify-between mb-10 px-2 sm:px-6">
            {steps.map((step, index) => {
                const isCompleted = index < currentStep;
                const isActive = index === currentStep;

                return (
                    <React.Fragment key={index}>
                        {/* Step Circle */}
                        <div className="flex flex-col items-center relative z-10">
                            <div className={`
                w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300
                ${isCompleted
                                    ? `${theme.bg.replace('bg-', 'bg-')} ${theme.text.replace('text-', 'text-')} border-2 border-current`
                                    : isActive
                                        ? `bg-white border-2 border-current ${theme.text} scale-110 shadow-lg`
                                        : 'bg-white border-2 border-slate-200 text-slate-400'}
              `}>
                                {isCompleted ? <Check size={20} className="stroke-[3]" /> : index + 1}
                            </div>
                            <span className={`
                absolute -bottom-7 text-[10px] sm:text-xs font-bold whitespace-nowrap transition-colors duration-300
                ${isActive ? theme.text : 'text-slate-400'}
              `}>
                                {step.title}
                            </span>
                        </div>

                        {/* Connector Line */}
                        {index < steps.length - 1 && (
                            <div className="flex-1 h-0.5 mx-2 bg-slate-200 relative -mt-7">
                                <div
                                    className={`absolute inset-0 transition-all duration-500 ${theme.gradient.replace('from-', 'bg-')}`}
                                    style={{ width: isCompleted ? '100%' : '0%' }}
                                />
                            </div>
                        )}
                    </React.Fragment>
                );
            })}
        </div>
    );
};

export default StepIndicator;
