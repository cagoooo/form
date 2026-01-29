import React from 'react';
import { Cloud, CloudOff, Loader } from 'lucide-react';

/**
 * 自動儲存狀態指示器
 * 
 * @param {boolean} saving - 是否正在儲存
 * @param {number} lastSaved - 最後儲存時間戳記
 */
const AutoSaveIndicator = ({ saving, lastSaved }) => {
    const formatTime = (ts) => {
        if (!ts) return '';
        const date = new Date(ts);
        return date.toLocaleTimeString('zh-TW', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    };

    if (saving) {
        return (
            <div className="flex items-center gap-2 text-blue-600 bg-blue-50 px-3 py-2 rounded-lg border border-blue-100">
                <Loader className="w-4 h-4 animate-spin" />
                <span className="text-sm font-medium">儲存中...</span>
            </div>
        );
    }

    if (lastSaved) {
        return (
            <div className="flex items-center gap-2 text-green-600 bg-green-50 px-3 py-2 rounded-lg border border-green-100">
                <Cloud className="w-4 h-4" />
                <span className="text-sm font-medium">
                    已自動儲存 {formatTime(lastSaved)}
                </span>
            </div>
        );
    }

    return null;
};

export default AutoSaveIndicator;
