import React from 'react';
import { Clock, RotateCcw, X } from 'lucide-react';

/**
 * 草稿復原對話框
 * 
 * @param {boolean} show - 是否顯示對話框
 * @param {number} timestamp - 草稿儲存時間戳記
 * @param {function} onRestore - 復原草稿的回調函數
 * @param {function} onDiscard - 捨棄草稿的回調函數
 */
const DraftRestoreDialog = ({ show, timestamp, onRestore, onDiscard }) => {
    if (!show) return null;

    const formatTime = (ts) => {
        const date = new Date(ts);
        const now = new Date();
        const diffMinutes = Math.floor((now - date) / 60000);

        if (diffMinutes < 1) return '剛剛';
        if (diffMinutes < 60) return `${diffMinutes} 分鐘前`;
        if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)} 小時前`;
        return date.toLocaleString('zh-TW', {
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
            {/* 背景遮罩 */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onDiscard}
            />

            {/* 對話框 */}
            <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-scale-up">
                {/* 頂部裝飾條 */}
                <div className="h-2 bg-gradient-to-r from-blue-500 to-indigo-600" />

                <div className="p-6">
                    {/* 圖示 */}
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <RotateCcw className="w-8 h-8 text-blue-600" />
                    </div>

                    {/* 標題 */}
                    <h3 className="text-2xl font-bold text-slate-800 text-center mb-2">
                        找到未完成的填寫紀錄
                    </h3>

                    {/* 說明 */}
                    <p className="text-slate-600 text-center mb-6">
                        系統偵測到您有尚未完成的表單。是否要繼續填寫？
                    </p>

                    {/* 時間資訊 */}
                    <div className="bg-slate-50 rounded-lg p-4 mb-6 flex items-center gap-3">
                        <Clock className="w-5 h-5 text-slate-400" />
                        <div>
                            <p className="text-sm text-slate-500">草稿儲存時間</p>
                            <p className="text-sm font-semibold text-slate-700">
                                {formatTime(timestamp)}
                            </p>
                        </div>
                    </div>

                    {/* 按鈕組 */}
                    <div className="flex gap-3">
                        <button
                            onClick={onDiscard}
                            className="flex-1 px-4 py-3 border-2 border-slate-200 text-slate-700 font-semibold rounded-lg hover:bg-slate-50 transition-all duration-200 flex items-center justify-center gap-2"
                        >
                            <X className="w-4 h-4" />
                            捨棄草稿
                        </button>
                        <button
                            onClick={onRestore}
                            className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2"
                        >
                            <RotateCcw className="w-4 h-4" />
                            復原草稿
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DraftRestoreDialog;
