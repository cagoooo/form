import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../firebase';
import { doc, getDoc, addDoc, collection, serverTimestamp } from 'firebase/firestore';
import FormRenderer from '../components/FormRenderer';

const PublicForm = () => {
    const { templateId } = useParams();
    const [template, setTemplate] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        const fetchTemplate = async () => {
            try {
                // For development/testing without ID, use a mock template
                if (!templateId) {
                    // Mock template for initial dev
                    setTemplate({
                        id: 'mock',
                        title: '班級榮譽榜調查 (預覽)',
                        description: '這是一個預覽表單，請協助填寫班級獲獎與進步名單',
                        theme: 'blue',
                        sections: [
                            {
                                id: 'basic',
                                title: '基本資料',
                                fields: [{ id: 'className', label: '班級', required: true, placeholder: '例: 301' }]
                            },
                            {
                                id: 'top5',
                                title: '學期成績優異',
                                description: '請填寫前五名同學',
                                fields: [
                                    { id: 'top_1', label: '第 1 名', required: true },
                                    { id: 'top_2', label: '第 2 名', required: true },
                                    { id: 'top_3', label: '第 3 名', required: true },
                                    { id: 'top_4', label: '第 4 名', required: true },
                                    { id: 'top_5', label: '第 5 名', required: true },
                                ]
                            }
                        ]
                    });
                    setLoading(false);
                    return;
                }

                const docRef = doc(db, 'templates', templateId);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    setTemplate({ id: docSnap.id, ...docSnap.data() });
                } else {
                    setError('找不到此表單模板');
                }
            } catch (err) {
                console.error(err);
                setError('載入表單時發生錯誤');
            } finally {
                setLoading(false);
            }
        };

        fetchTemplate();
    }, [templateId]);

    const handleSubmit = async (formData) => {
        setIsSubmitting(true);
        try {
            // 1. Save to Firestore
            await addDoc(collection(db, 'submissions'), {
                templateId: template.id,
                data: formData,
                timestamp: serverTimestamp(),
                className: formData.className || 'Unknown'
            });

            // 2. Send Webhook (if configured)
            if (template.webhookUrl) {
                try {
                    // Format message for Google Chat
                    const text = `📢 *${template.title} - 新提交通知*\n` +
                        `────────────────\n` +
                        Object.entries(formData).map(([key, val]) => `• ${key}: ${val}`).join('\n') +
                        `\n────────────────`;

                    await fetch(template.webhookUrl, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ text })
                    });
                } catch (webhookErr) {
                    console.error('Webhook failed', webhookErr);
                    // Don't block success UI if webhook fails
                }
            }

            setSubmitted(true);
        } catch (err) {
            console.error(err);
            alert('提交失敗，請稍後再試');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center">載入中...</div>;
    if (error) return <div className="min-h-screen flex items-center justify-center text-red-500">{error}</div>;
    if (submitted) return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
            <div className="bg-white p-8 rounded-xl shadow-lg text-center max-w-md w-full">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-10 h-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <h2 className="text-2xl font-bold text-slate-800 mb-2">提交成功！</h2>
                <p className="text-slate-600 mb-6">感謝您的填寫，資料已成功送出。</p>
                <button onClick={() => window.location.reload()} className="text-blue-600 font-semibold hover:underline">
                    填寫下一份
                </button>
            </div>
        </div>
    );

    return <FormRenderer template={template} onSubmit={handleSubmit} isSubmitting={isSubmitting} />;
};

export default PublicForm;
