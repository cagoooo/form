import React, { useState, useEffect } from 'react';
import { Send, AlertCircle, CheckCircle2 } from 'lucide-react';
import RadioGroup from './fields/RadioGroup';
import CheckboxGroup from './fields/CheckboxGroup';
import SelectInput from './fields/SelectInput';
import DateInput from './fields/DateInput';
import NumberInput from './fields/NumberInput';
import RatingInput from './fields/RatingInput';
import StepIndicator from './StepIndicator';
import StepNavigation from './StepNavigation';

const FormRenderer = ({ template, onSubmit, isSubmitting, initialData = {}, onDataChange }) => {
    const [formData, setFormData] = useState(initialData);
    const [errors, setErrors] = useState({});
    const [currentStep, setCurrentStep] = useState(0);

    const isMultiStep = template.settings?.isMultiStep;
    const sections = template.sections || [];
    const currentSection = isMultiStep ? sections[currentStep] : null;

    if (!template) return <div className="text-center p-10">載入中...</div>;

    // 當 initialData 變更時同步到 formData
    useEffect(() => {
        if (initialData && Object.keys(initialData).length > 0) {
            setFormData(initialData);
        }
    }, [initialData]);

    const handleChange = (fieldId, value) => {
        const newData = { ...formData, [fieldId]: value };
        setFormData(newData);

        // 通知父組件資料更新
        if (onDataChange) {
            onDataChange(newData);
        }

        if (errors[fieldId]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[fieldId];
                return newErrors;
            });
        }
    };

    const validateStep = (stepIndex) => {
        const newErrors = {};
        const section = sections[stepIndex];
        if (!section) return true;

        section.fields.forEach(field => {
            if (field.required) {
                const val = formData[field.id];
                if (val === undefined || val === null || (typeof val === 'string' && !val.trim()) || (Array.isArray(val) && val.length === 0)) {
                    newErrors[field.id] = '此欄位必填';
                }
            }
        });

        setErrors(prev => ({ ...prev, ...newErrors }));
        return Object.keys(newErrors).length === 0;
    };

    const validate = () => {
        const newErrors = {};
        sections.forEach(section => {
            section.fields.forEach(field => {
                if (field.required) {
                    const val = formData[field.id];
                    if (val === undefined || val === null || (typeof val === 'string' && !val.trim()) || (Array.isArray(val) && val.length === 0)) {
                        newErrors[field.id] = '此欄位必填';
                    }
                }
            });
        });
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        if (validateStep(currentStep)) {
            setCurrentStep(prev => prev + 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handleBack = () => {
        setCurrentStep(prev => prev - 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            onSubmit(formData);
        } else {
            const firstError = document.querySelector('.error-field');
            if (firstError) firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    };

    // Theme colors
    const themeColors = {
        blue: {
            gradient: 'from-blue-600 to-indigo-600',
            bg: 'bg-blue-50',
            border: 'border-blue-100',
            text: 'text-blue-800',
            subtext: 'text-blue-600',
            inputRing: 'focus:ring-blue-500',
            button: 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-blue-500/30'
        },
        green: {
            gradient: 'from-emerald-600 to-teal-600',
            bg: 'bg-emerald-50',
            border: 'border-emerald-100',
            text: 'text-emerald-800',
            subtext: 'text-emerald-600',
            inputRing: 'focus:ring-emerald-500',
            button: 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-emerald-500/30'
        },
        pink: {
            gradient: 'from-pink-600 to-rose-600',
            bg: 'bg-pink-50',
            border: 'border-pink-100',
            text: 'text-pink-800',
            subtext: 'text-pink-600',
            inputRing: 'focus:ring-pink-500',
            button: 'bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 shadow-pink-500/30'
        }
    };

    const theme = themeColors[template.theme || 'blue'];

    const renderField = (field, formData, handleChange, errors, theme) => {
        if (field.type === 'textarea') {
            return (
                <textarea
                    value={formData[field.id] || ''}
                    onChange={(e) => handleChange(field.id, e.target.value)}
                    placeholder={field.placeholder}
                    className={`w-full p-3 border rounded-lg outline-none transition shadow-sm bg-white ${errors[field.id] ? 'border-red-500 focus:ring-red-500' : `border-slate-200 ${theme.inputRing} focus:ring-2`
                        }`}
                    rows={3}
                />
            );
        } else if (field.type === 'radio') {
            return <RadioGroup field={field} value={formData[field.id]} onChange={handleChange} theme={theme} />;
        } else if (field.type === 'checkbox') {
            return <CheckboxGroup field={field} value={formData[field.id]} onChange={handleChange} theme={theme} />;
        } else if (field.type === 'select') {
            return <SelectInput field={field} value={formData[field.id]} onChange={handleChange} theme={theme} />;
        } else if (field.type === 'date') {
            return <DateInput field={field} value={formData[field.id]} onChange={handleChange} theme={theme} />;
        } else if (field.type === 'number') {
            return <NumberInput field={field} value={formData[field.id]} onChange={handleChange} theme={theme} />;
        } else if (field.type === 'rating') {
            return <RatingInput field={field} value={formData[field.id]} onChange={handleChange} theme={theme} />;
        } else {
            return (
                <input
                    type={field.type || 'text'}
                    value={formData[field.id] || ''}
                    onChange={(e) => handleChange(field.id, e.target.value)}
                    placeholder={field.placeholder}
                    className={`w-full p-3 border rounded-lg outline-none transition shadow-sm bg-white ${errors[field.id] ? 'border-red-500 focus:ring-red-500' : `border-slate-200 ${theme.inputRing} focus:ring-2`
                        }`}
                />
            );
        }
    };

    return (
        <div className="w-full max-w-3xl mx-auto p-2 sm:p-4">
            <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">

                {/* Header */}
                <div className={`bg-gradient-to-r ${theme.gradient} p-6 text-center relative overflow-hidden`}>
                    <div className="absolute top-0 left-0 w-24 h-24 bg-white opacity-10 rounded-full -translate-x-10 -translate-y-10"></div>
                    <div className="absolute bottom-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full translate-x-10 translate-y-10"></div>
                    <h1 className="text-2xl font-bold text-white relative z-10 drop-shadow-md">{template.title}</h1>
                    {template.description && (
                        <p className="text-white/90 text-sm mt-2 relative z-10">{template.description}</p>
                    )}
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-8">
                    {isMultiStep && template.settings?.showProgress && (
                        <StepIndicator
                            steps={sections}
                            currentStep={currentStep}
                            theme={theme}
                        />
                    )}

                    {isMultiStep ? (
                        /* Multi-step Section Rendering */
                        <div key={currentSection.id} className={`${theme.bg} rounded-xl border ${theme.border} p-5 animate-fade-in`}>
                            <div className="mb-4 border-b border-black/5 pb-2">
                                <h2 className={`text-lg font-bold ${theme.text}`}>{currentSection.title}</h2>
                                {currentSection.description && <p className={`text-xs ${theme.subtext}`}>{currentSection.description}</p>}
                            </div>

                            <div className="grid grid-cols-1 gap-4">
                                {currentSection.fields.map((field) => (
                                    <div key={field.id} className={`space-y-1 ${errors[field.id] ? 'error-field' : ''}`}>
                                        <label className={`block text-sm font-semibold ${theme.text} ml-1`}>
                                            {field.label} {field.required && <span className="text-red-500">*</span>}
                                        </label>
                                        {/* Field rendering logic remains the same */}
                                        {renderField(field, formData, handleChange, errors, theme)}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        /* Standard Single-page Rendering */
                        sections.map((section) => (
                            <div key={section.id} className={`${theme.bg} rounded-xl border ${theme.border} p-5`}>
                                <div className="mb-4 border-b border-black/5 pb-2">
                                    <h2 className={`text-lg font-bold ${theme.text}`}>{section.title}</h2>
                                    {section.description && <p className={`text-xs ${theme.subtext}`}>{section.description}</p>}
                                </div>

                                <div className="grid grid-cols-1 gap-4">
                                    {section.fields.map((field) => (
                                        <div key={field.id} className={`space-y-1 ${errors[field.id] ? 'error-field' : ''}`}>
                                            <label className={`block text-sm font-semibold ${theme.text} ml-1`}>
                                                {field.label} {field.required && <span className="text-red-500">*</span>}
                                            </label>
                                            {renderField(field, formData, handleChange, errors, theme)}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))
                    )}

                    {isMultiStep ? (
                        <StepNavigation
                            currentStep={currentStep}
                            totalSteps={sections.length}
                            onBack={handleBack}
                            onNext={handleNext}
                            isSubmitting={isSubmitting}
                            theme={theme}
                        />
                    ) : (
                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`w-full ${theme.button} text-white font-bold py-3.5 px-6 rounded-lg active:scale-[0.98] transition-all duration-200 shadow-lg flex justify-center items-center gap-2 text-lg disabled:opacity-70 disabled:cursor-not-allowed`}
                            >
                                {isSubmitting ? (
                                    <>
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                        處理中...
                                    </>
                                ) : (
                                    <>
                                        <span>確認送出</span>
                                        <Send className="w-5 h-5" />
                                    </>
                                )}
                            </button>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
};

export default FormRenderer;
