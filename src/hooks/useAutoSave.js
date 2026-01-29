import { useEffect, useCallback } from 'react';

/**
 * 自動儲存 Hook
 * 
 * @param {string} formId - 表單 ID (用於區分不同表單的草稿)
 * @param {object} formData - 表單資料
 * @param {number} interval - 自動儲存間隔 (毫秒)，預設 30 秒
 * @returns {object} - { saveToLocal, loadDraft, clearDraft }
 */
export const useAutoSave = (formId, formData, interval = 30000) => {
    /**
     * 儲存草稿至 LocalStorage
     */
    const saveToLocal = useCallback(() => {
        if (!formId) return;

        const key = `form_draft_${formId}`;
        const draftData = {
            data: formData,
            timestamp: Date.now()
        };

        try {
            localStorage.setItem(key, JSON.stringify(draftData));
            console.log('[AutoSave] 草稿已儲存:', new Date(draftData.timestamp).toLocaleTimeString());
        } catch (error) {
            console.error('[AutoSave] 儲存草稿失敗:', error);
        }
    }, [formId, formData]);

    /**
     * 自動儲存定時器
     */
    useEffect(() => {
        // 只在有資料時才啟動自動儲存
        const hasData = Object.keys(formData).length > 0;
        if (!hasData || !formId) return;

        const timer = setInterval(() => {
            saveToLocal();
        }, interval);

        return () => clearInterval(timer);
    }, [saveToLocal, interval, formId, formData]);

    /**
     * 載入草稿
     * 
     * @returns {object|null} - 草稿資料 { data, timestamp } 或 null
     */
    const loadDraft = useCallback(() => {
        if (!formId) return null;

        const key = `form_draft_${formId}`;
        try {
            const saved = localStorage.getItem(key);
            if (saved) {
                const draft = JSON.parse(saved);
                console.log('[AutoSave] 找到草稿:', new Date(draft.timestamp).toLocaleString());
                return draft;
            }
        } catch (error) {
            console.error('[AutoSave] 載入草稿失敗:', error);
        }
        return null;
    }, [formId]);

    /**
     * 清除草稿
     */
    const clearDraft = useCallback(() => {
        if (!formId) return;

        const key = `form_draft_${formId}`;
        try {
            localStorage.removeItem(key);
            console.log('[AutoSave] 草稿已清除');
        } catch (error) {
            console.error('[AutoSave] 清除草稿失敗:', error);
        }
    }, [formId]);

    return {
        saveToLocal,
        loadDraft,
        clearDraft
    };
};
