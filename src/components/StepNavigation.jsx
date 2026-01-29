import React from 'react';
import { ArrowLeft, ArrowRight, Send } from 'lucide-react';

const StepNavigation = ({ currentStep, totalSteps, onBack, onNext, isSubmitting, theme }) => {
    const isLastStep = currentStep === totalSteps - 1;

    return (
        <div className="flex items-center gap-4 pt-6 mt-8 border-t border-slate-100">
            {currentStep > 0 && (
                <button
                    type="button"
                    onClick={onBack}
                    className="flex-1 py-3 px-6 rounded-xl border-2 border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
                >
                    <ArrowLeft size={20} />
                    上一步
                </button>
            )}

            <button
                type={isLastStep ? "submit" : "button"}
                onClick={isLastStep ? undefined : onNext}
                disabled={isSubmitting}
                className={`
          ${currentStep === 0 ? 'w-full' : 'flex-[2]'}
          py-3.5 px-6 rounded-xl text-white font-bold transition-all duration-200 shadow-lg flex justify-center items-center gap-2 text-lg
          ${theme.button}
          disabled:opacity-70 disabled:cursor-not-allowed active:scale-[0.98]
        `}
            >
                {isSubmitting ? (
                    <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        處理中...
                    </>
                ) : isLastStep ? (
                    <>
                        <span>確認送出</span>
                        <Send className="w-5 h-5" />
                    </>
                ) : (
                    <>
                        <span>下一步</span>
                        <ArrowRight className="w-5 h-5" />
                    </>
                )}
            </button>
        </div>
    );
};

export default StepNavigation;
