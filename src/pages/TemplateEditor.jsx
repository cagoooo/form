import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { doc, getDoc, setDoc, addDoc, collection } from 'firebase/firestore';
import { Plus, Trash2, Save, ArrowLeft, GripVertical } from 'lucide-react';

const TemplateEditor = () => {
    const { templateId } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [template, setTemplate] = useState({
        title: '未命名表單',
        description: '',
        theme: 'blue',
        webhookUrl: import.meta.env.VITE_DEFAULT_WEBHOOK_URL,
        sections: []
    });

    useEffect(() => {
        if (templateId && templateId !== 'new') {
            fetchTemplate();
        } else {
            setLoading(false);
        }
    }, [templateId]);

    const fetchTemplate = async () => {
        try {
            const docSnap = await getDoc(doc(db, 'templates', templateId));
            if (docSnap.exists()) {
                setTemplate(docSnap.data());
            }
        } catch (error) {
            console.error("Error:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!template.title.trim()) return alert('請輸入表單標題');
        setSaving(true);
        try {
            if (templateId === 'new') {
                await addDoc(collection(db, 'templates'), template);
            } else {
                await setDoc(doc(db, 'templates', templateId), template);
            }
            alert('儲存成功');
            navigate('/admin/dashboard');
        } catch (error) {
            console.error("Error saving:", error);
            alert('儲存失敗');
        } finally {
            setSaving(false);
        }
    };

    const addSection = () => {
        const generateId = () => Date.now().toString(36) + Math.random().toString(36).substr(2, 5);

        setTemplate(prev => ({
            ...prev,
            sections: [...prev.sections, {
                id: generateId(),
                title: '新區塊',
                description: '',
                fields: []
            }]
        }));
    };

    const removeSection = (index) => {
        if (window.confirm('確定刪除此區塊？')) {
            setTemplate(prev => {
                const newSections = [...prev.sections];
                newSections.splice(index, 1);
                return { ...prev, sections: newSections };
            });
        }
    };

    const updateSection = (index, key, value) => {
        setTemplate(prev => {
            const newSections = [...prev.sections];
            newSections[index] = { ...newSections[index], [key]: value };
            return { ...prev, sections: newSections };
        });
    };

    const addField = (sectionIndex) => {
        setTemplate(prev => {
            const newSections = [...prev.sections];
            const generateId = () => Date.now().toString(36) + Math.random().toString(36).substr(2, 5);

            newSections[sectionIndex].fields.push({
                id: generateId(),
                label: '新欄位',
                type: 'text',
                required: false,
                placeholder: ''
            });
            return { ...prev, sections: newSections };
        });
    };

    const removeField = (sectionIndex, fieldIndex) => {
        setTemplate(prev => {
            const newSections = [...prev.sections];
            newSections[sectionIndex].fields.splice(fieldIndex, 1);
            return { ...prev, sections: newSections };
        });
    };

    const updateField = (sectionIndex, fieldIndex, key, value) => {
        setTemplate(prev => {
            const newSections = [...prev.sections];
            newSections[sectionIndex].fields[fieldIndex] = {
                ...newSections[sectionIndex].fields[fieldIndex],
                [key]: value
            };
            return { ...prev, sections: newSections };
        });
    };

    if (loading) return <div className="p-10 text-center">載入中...</div>;

    return (
        <div className="min-h-screen bg-slate-100 p-4 pb-20">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-6 bg-white p-4 rounded-xl shadow-sm">
                    <div className="flex items-center gap-4">
                        <button onClick={() => navigate('/admin/dashboard')} className="p-2 hover:bg-slate-100 rounded-full">
                            <ArrowLeft size={20} />
                        </button>
                        <h1 className="text-xl font-bold">編輯表單</h1>
                    </div>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 disabled:opacity-50"
                    >
                        <Save size={18} />
                        {saving ? '儲存中...' : '儲存'}
                    </button>
                </div>

                {/* Global Settings */}
                <div className="bg-white rounded-xl shadow-sm p-6 mb-6 space-y-4">
                    <h2 className="text-lg font-bold border-b pb-2 mb-4">基本設定</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-slate-700">表單標題</label>
                            <input
                                type="text"
                                value={template.title}
                                onChange={e => setTemplate({ ...template, title: e.target.value })}
                                className="w-full p-2 border rounded-lg"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-slate-700">主題顏色</label>
                            <select
                                value={template.theme}
                                onChange={e => setTemplate({ ...template, theme: e.target.value })}
                                className="w-full p-2 border rounded-lg"
                            >
                                <option value="blue">藍色 (Blue)</option>
                                <option value="green">綠色 (Green)</option>
                                <option value="pink">粉色 (Pink)</option>
                            </select>
                        </div>
                        <div className="col-span-full space-y-1">
                            <label className="text-sm font-medium text-slate-700">說明文字</label>
                            <textarea
                                value={template.description}
                                onChange={e => setTemplate({ ...template, description: e.target.value })}
                                className="w-full p-2 border rounded-lg"
                                rows={2}
                            />
                        </div>
                        <div className="col-span-full space-y-1">
                            <label className="text-sm font-medium text-slate-700">Google Chat Webhook URL (選填)</label>
                            <input
                                type="text"
                                value={template.webhookUrl}
                                onChange={e => setTemplate({ ...template, webhookUrl: e.target.value })}
                                placeholder="https://chat.googleapis.com/..."
                                className="w-full p-2 border rounded-lg font-mono text-sm"
                            />
                        </div>
                    </div>
                </div>

                {/* Sections */}
                <div className="space-y-6">
                    {template.sections.map((section, sIndex) => (
                        <div key={section.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                            <div className="bg-slate-50 p-4 border-b border-slate-200 flex justify-between items-center">
                                <div className="flex items-center gap-2 flex-1">
                                    <GripVertical size={18} className="text-slate-400 cursor-move" />
                                    <input
                                        type="text"
                                        value={section.title}
                                        onChange={e => updateSection(sIndex, 'title', e.target.value)}
                                        className="bg-transparent font-bold text-slate-700 focus:bg-white focus:ring-2 focus:ring-blue-200 rounded px-2 py-1 outline-none w-full max-w-xs"
                                    />
                                </div>
                                <button onClick={() => removeSection(sIndex)} className="text-red-400 hover:text-red-600 p-1">
                                    <Trash2 size={18} />
                                </button>
                            </div>

                            <div className="p-4 space-y-4">
                                <input
                                    type="text"
                                    value={section.description}
                                    onChange={e => updateSection(sIndex, 'description', e.target.value)}
                                    placeholder="區塊說明 (選填)"
                                    className="w-full text-sm text-slate-500 border-b border-slate-100 focus:border-blue-300 outline-none pb-1"
                                />

                                <div className="space-y-3 pl-4 border-l-2 border-slate-100">
                                    {section.fields.map((field, fIndex) => (
                                        <div key={field.id} className="flex items-start gap-3 bg-slate-50 p-3 rounded-lg group">
                                            <div className="flex-1 grid grid-cols-1 sm:grid-cols-12 gap-2">
                                                <div className="sm:col-span-4">
                                                    <input
                                                        type="text"
                                                        value={field.label}
                                                        onChange={e => updateField(sIndex, fIndex, 'label', e.target.value)}
                                                        className="w-full p-1.5 border rounded text-sm"
                                                        placeholder="欄位名稱"
                                                    />
                                                </div>
                                                <div className="sm:col-span-3">
                                                    <select
                                                        value={field.type}
                                                        onChange={e => updateField(sIndex, fIndex, 'type', e.target.value)}
                                                        className="w-full p-1.5 border rounded text-sm"
                                                    >
                                                        <option value="text">單行文字</option>
                                                        <option value="textarea">多行文字</option>
                                                    </select>
                                                </div>
                                                <div className="sm:col-span-3">
                                                    <input
                                                        type="text"
                                                        value={field.placeholder}
                                                        onChange={e => updateField(sIndex, fIndex, 'placeholder', e.target.value)}
                                                        className="w-full p-1.5 border rounded text-sm"
                                                        placeholder="提示文字"
                                                    />
                                                </div>
                                                <div className="sm:col-span-2 flex items-center">
                                                    <label className="flex items-center gap-1 text-sm text-slate-600 cursor-pointer">
                                                        <input
                                                            type="checkbox"
                                                            checked={field.required}
                                                            onChange={e => updateField(sIndex, fIndex, 'required', e.target.checked)}
                                                            className="rounded text-blue-600"
                                                        />
                                                        必填
                                                    </label>
                                                </div>
                                            </div>
                                            <button onClick={() => removeField(sIndex, fIndex)} className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    ))}
                                    <button onClick={() => addField(sIndex)} className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1 mt-2">
                                        <Plus size={16} /> 新增欄位
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}

                    <button onClick={addSection} className="w-full py-4 border-2 border-dashed border-slate-300 rounded-xl text-slate-500 hover:border-blue-400 hover:text-blue-500 transition flex justify-center items-center gap-2 font-bold">
                        <Plus size={20} /> 新增區塊
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TemplateEditor;
