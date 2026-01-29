import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../firebase';
import { doc, getDoc, addDoc, collection, serverTimestamp } from 'firebase/firestore';
import FormRenderer from '../components/FormRenderer';
import DraftRestoreDialog from '../components/DraftRestoreDialog';
import AutoSaveIndicator from '../components/AutoSaveIndicator';
import { useAutoSave } from '../hooks/useAutoSave';
import { CheckCircle, AlertCircle, FileText } from 'lucide-react';

const PublicForm = () => {
    const { templateId } = useParams();
    const [template, setTemplate] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({});
    const [showRestoreDialog, setShowRestoreDialog] = useState(false);
    const [draftData, setDraftData] = useState(null);
    const [lastSavedTime, setLastSavedTime] = useState(null);

    // 自動儲存 Hook
    const { saveToLocal, loadDraft, clearDraft } = useAutoSave(templateId, formData);

    // Mock template for development/testing
    const mockTemplate = {
        title: '班級榮譽榜調查 (預覽)',
        description: '這是一個預覽表單，請協助填寫班級獲獎與進步名單',
        theme: 'blue',
        sections: [
            {
                id: '1',
                title: '基本資料',
                description: '',
                fields: [
                    { id: 'f1', label: '班級', type: 'text', required: true, placeholder: '例: 301' }
                ]
            },
            {
                id: '2',
                title: '學期成績優異',
                description: '請填寫前五名同學',
                fields: [
                    { id: 'f2', label: '第 1 名', type: 'text', required: true },
                    { id: 'f3', label: '第 2 名', type: 'text', required: true },
                    { id: 'f4', label: '第 3 名', type: 'text', required: true },
                    { id: 'f5', label: '第 4 名', type: 'text', required: true },
                    { id: 'f6', label: '第 5 名', type: 'text', required: true },
                ]
            }
        ]
    };

    useEffect(() => {
        if (templateId) {
            fetchTemplate();
        } else {
            // Use mock template if no ID provided (for dev)
            setTemplate(mockTemplate);
            setLoading(false);
        }

        // 檢查是否有草稿
        const draft = loadDraft();
        if (draft && draft.timestamp) {
            const timeDiff = Date.now() - draft.timestamp;
            // 只在 24 小時內的草稿才提示復原
            if (timeDiff < 24 * 60 * 60 * 1000) {
                setShowRestoreDialog(true);
                setDraftData(draft);
            } else {
                // 清除過期草稿
                clearDraft();
            }
        }
    }, [templateId]);

    const fetchTemplate = async () => {
        try {
            const docRef = doc(db, 'templates', templateId);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setTemplate(docSnap.data());
            } else {
                setError('找不到此表單，可能已被刪除。');
            }
        } catch (err) {
            console.error("Error fetching template:", err);
            setError('載入表單時發生錯誤，請稍後再試。');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (submittedData) => {
        try {
            // 1. Save to Firestore
            await addDoc(collection(db, 'submissions'), {
                templateId: templateId || 'mock-id',
                data: submittedData,
                timestamp: serverTimestamp(),
                className: submittedData['f1'] || 'Unknown' // Assuming f1 is class name for now, logic can be improved
            });

            // 2. Send to Google Chat Webhook (Client-side)
            if (template.webhookUrl) {
                await sendWebhook(submittedData);
            }

            // 3. 清除草稿
            clearDraft();

            setSubmitted(true);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (err) {
            console.error("Error submitting form:", err);
            alert('送出失敗，請檢查網路連線。');
        }
    };

    const sendWebhook = async (formData) => {
        try {
            // Format message
            let text = `📋 *${template.title}* 新回應\n\n`;
            template.sections.forEach(section => {
                section.fields.forEach(field => {
                    const value = formData[field.id] || '(未填)';
                    text += `*${field.label}*: ${value}\n`;
                });
            });

            await fetch(template.webhookUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json; charset=UTF-8' },
                body: JSON.stringify({ text })
            });
        } catch (error) {
            console.error("Webhook error:", error);
            // Don't block success UI if webhook fails
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center mesh-bg">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-white"></div>
        </div>
    );

    if (error) return (
        <div className="min-h-screen flex items-center justify-center mesh-bg p-4">
            <div className="glass-card p-8 text-center max-w-md w-full animate-slide-up">
                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <AlertCircle className="w-10 h-10 text-red-500" />
                </div>
                <h2 className="text-2xl font-bold text-slate-800 mb-2">無法載入表單</h2>
                <p className="text-slate-500">{error}</p>
            </div>
        </div>
    );

    if (submitted) return (
        <div className="min-h-screen flex items-center justify-center mesh-bg p-4">
            <div className="glass-card p-10 text-center max-w-md w-full animate-slide-up">
                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
                    <CheckCircle className="w-12 h-12 text-green-600" />
                </div>
                <h2 className="text-3xl font-bold text-slate-800 mb-4">提交成功！</h2>
                <p className="text-slate-600 mb-8">感謝您的填寫，我們已收到您的資料。</p>
                <button onClick={() => window.location.reload()} className="btn-primary w-full">
                    填寫下一份
                </button>
            </div>
        </div>
    );

    // Determine theme colors
    const getThemeGradient = () => {
        switch (template.theme) {
            case 'green': return 'from-emerald-500 to-teal-500';
            case 'pink': return 'from-rose-500 to-pink-500';
            default: return 'from-blue-500 to-indigo-600';
        }
    };

    return (
        <div className="min-h-screen mesh-bg py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto space-y-8 animate-slide-up">

                {/* Header Card */}
                <div className="glass-card overflow-hidden">
                    <div className={`h-32 sm:h-40 bg-gradient-to-r ${getThemeGradient()} relative`}>
                        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/20 rounded-full blur-2xl"></div>
                        <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
                    </div>
                    <div className="px-8 py-6 -mt-12 relative">
                        <div className="bg-white rounded-2xl shadow-lg p-6 mb-4 flex items-start gap-4">
                            <div className={`p-3 rounded-xl bg-gradient-to-br ${getThemeGradient()} text-white shadow-lg`}>
                                <FileText size={32} />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-slate-800 mb-2">{template.title}</h1>
                                <p className="text-slate-600 leading-relaxed">{template.description}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Auto-save Indicator */}
                {lastSavedTime && (
                    <div className="flex justify-end">
                        <AutoSaveIndicator lastSaved={lastSavedTime} />
                    </div>
                )}

                {/* Form Content */}
                <div className="glass-card p-8">
                    <FormRenderer
                        template={template}
                        onSubmit={handleSubmit}
                        initialData={formData}
                        onDataChange={(data) => {
                            setFormData(data);
                            setLastSavedTime(Date.now());
                        }}
                    />
                </div>

                {/* Draft Restore Dialog */}
                <DraftRestoreDialog
                    show={showRestoreDialog}
                    timestamp={draftData?.timestamp}
                    onRestore={() => {
                        setFormData(draftData.data);
                        setShowRestoreDialog(false);
                    }}
                    onDiscard={() => {
                        clearDraft();
                        setShowRestoreDialog(false);
                    }}
                />

                {/* Footer */}
                <div className="text-center text-slate-500 text-sm">
                    Powered by <span className="font-bold text-slate-700">Dynamic Form System</span>
                </div>
            </div>
        </div>
    );
};

export default PublicForm;
