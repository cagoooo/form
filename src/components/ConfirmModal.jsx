import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

const ConfirmModal = ({ isOpen, title, message, onConfirm, onCancel }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onCancel}
            />

            {/* Modal */}
            <div className="relative bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full mx-4 animate-slide-up">
                {/* Close button */}
                <button
                    onClick={onCancel}
                    className="absolute top-4 right-4 p-1 text-slate-400 hover:text-slate-600 transition"
                >
                    <X size={20} />
                </button>

                {/* Icon */}
                <div className="flex justify-center mb-4">
                    <div className="p-3 bg-red-100 rounded-full">
                        <AlertTriangle size={32} className="text-red-500" />
                    </div>
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-slate-800 text-center mb-2">
                    {title}
                </h3>
                <p className="text-slate-500 text-center mb-6">
                    {message}
                </p>

                {/* Buttons */}
                <div className="flex gap-3">
                    <button
                        onClick={onCancel}
                        className="flex-1 px-4 py-3 bg-slate-100 text-slate-700 rounded-xl font-medium hover:bg-slate-200 transition"
                    >
                        取消
                    </button>
                    <button
                        onClick={onConfirm}
                        className="flex-1 px-4 py-3 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600 transition"
                    >
                        確定刪除
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;
