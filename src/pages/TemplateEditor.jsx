import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { doc, getDoc, setDoc, addDoc, collection } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import { Plus, Trash2, Save, ArrowLeft, GripVertical, Settings, Layout } from 'lucide-react';

const TemplateEditor = () => {
    const { templateId } = useParams();
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [template, setTemplate] = useState({
        title: '未命名表單',
        description: '',
        theme: 'blue',
        webhookUrl: import.meta.env.VITE_DEFAULT_WEBHOOK_URL || '',
        sections: [],
        settings: {
            isMultiStep: false,
            showProgress: true,
            allowBack: true
        }
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
                const data = docSnap.data();
                // Merge with default settings to prevent undefined values
                setTemplate({
                    title: data.title || '未命名表單',
                    description: data.description || '',
                    theme: data.theme || 'blue',
                    webhookUrl: data.webhookUrl || import.meta.env.VITE_DEFAULT_WEBHOOK_URL || '',
                    sections: data.sections || [],
                    settings: {
                        isMultiStep: data.settings?.isMultiStep ?? false,
                        showProgress: data.settings?.showProgress ?? true,
                        allowBack: data.settings?.allowBack ?? true
                    },
                    createdBy: data.createdBy,
                    createdAt: data.createdAt
                });
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
                const newTemplate = {
                    ...template,
                    createdBy: currentUser.uid,
                    createdAt: new Date()
                };
                await addDoc(collection(db, 'templates'), newTemplate);
            } else {
                await setDoc(doc(db, 'templates', templateId), {
                    ...template,
                    updatedAt: new Date()
                }, { merge: true });
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

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center mesh-bg">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-white"></div>
        </div>
    );

    return (
        <div className="min-h-screen mesh-bg p-4 pb-20">
            <div className="max-w-5xl mx-auto space-y-6">
                {/* Header */}
                <div className="glass-card p-4 flex items-center justify-between sticky top-4 z-50">
                    <div className="flex items-center gap-4">
                        <button onClick={() => navigate('/admin/dashboard')} className="p-2 hover:bg-slate-100 rounded-full transition">
                            <ArrowLeft size={24} className="text-slate-600" />
                        </button>
                        <div>
                            <h1 className="text-xl font-bold text-slate-800">編輯表單</h1>
                            <p className="text-xs text-slate-500">設計您的動態表單</p>
                        </div>
                    </div>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="btn-primary flex items-center gap-2 disabled:opacity-50"
                    >
                        <Save size={18} />
                        {saving ? '儲存中...' : '儲存變更'}
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column: Global Settings */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="glass-card p-6 space-y-4 animate-slide-up">
                            <div className="flex items-center gap-2 text-slate-800 font-bold border-b border-slate-100 pb-2">
                                <Settings size={20} className="text-blue-500" />
                                <h2>基本設定</h2>
                            </div>

                            <div className="space-y-3">
                                <div>
                                    <label className="text-sm font-medium text-slate-600 mb-1 block">表單標題</label>
                                    <input
                                        type="text"
                                        value={template.title}
                                        onChange={e => setTemplate({ ...template, title: e.target.value })}
                                        className="input-field"
                                        placeholder="輸入標題..."
                                    />
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-slate-600 mb-1 block">主題顏色</label>
                                    <div className="grid grid-cols-3 gap-2">
                                        {['blue', 'green', 'pink'].map(color => (
                                            <button
                                                key={color}
                                                onClick={() => setTemplate({ ...template, theme: color })}
                                                className={`h-10 rounded-lg border-2 transition-all ${template.theme === color ? 'border-slate-600 scale-105' : 'border-transparent opacity-70 hover:opacity-100'
                                                    }`}
                                                style={{
                                                    background: color === 'blue' ? 'linear-gradient(to right, #3b82f6, #4f46e5)' :
                                                        color === 'green' ? 'linear-gradient(to right, #10b981, #14b8a6)' :
                                                            'linear-gradient(to right, #f43f5e, #ec4899)'
                                                }}
                                            />
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-slate-600 mb-1 block">說明文字</label>
                                    <textarea
                                        value={template.description}
                                        onChange={e => setTemplate({ ...template, description: e.target.value })}
                                        className="input-field min-h-[100px]"
                                        placeholder="輸入表單說明..."
                                    />
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-slate-600 mb-1 block">Webhook URL</label>
                                    <input
                                        type="text"
                                        value={template.webhookUrl || ''}
                                        onChange={e => setTemplate({ ...template, webhookUrl: e.target.value })}
                                        className="input-field text-xs font-mono"
                                        placeholder="https://chat.googleapis.com/..."
                                    />
                                </div>

                                <div className="pt-4 border-t border-slate-100 space-y-3">
                                    <div className="flex items-center justify-between">
                                        <label className="text-sm font-bold text-slate-700">分頁模式</label>
                                        <input
                                            type="checkbox"
                                            checked={template.settings?.isMultiStep ?? false}
                                            onChange={e => setTemplate({
                                                ...template,
                                                settings: { ...template.settings, isMultiStep: e.target.checked }
                                            })}
                                            className="w-5 h-5 rounded text-blue-600 focus:ring-blue-500"
                                        />
                                    </div>
                                    {template.settings?.isMultiStep && (
                                        <>
                                            <div className="flex items-center justify-between">
                                                <label className="text-sm text-slate-600 ml-2">顯示進度條</label>
                                                <input
                                                    type="checkbox"
                                                    checked={template.settings?.showProgress ?? true}
                                                    onChange={e => setTemplate({
                                                        ...template,
                                                        settings: { ...template.settings, showProgress: e.target.checked }
                                                    })}
                                                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                                                />
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <label className="text-sm text-slate-600 ml-2">允許返回上一步</label>
                                                <input
                                                    type="checkbox"
                                                    checked={template.settings?.allowBack ?? true}
                                                    onChange={e => setTemplate({
                                                        ...template,
                                                        settings: { ...template.settings, allowBack: e.target.checked }
                                                    })}
                                                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                                                />
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Sections & Fields */}
                    <div className="lg:col-span-2 space-y-6">
                        {template.sections.map((section, sIndex) => (
                            <div key={section.id} className="glass-card overflow-hidden animate-slide-up" style={{ animationDelay: `${sIndex * 0.1}s` }}>
                                <div className="bg-slate-50/50 p-4 border-b border-slate-100 flex justify-between items-center">
                                    <div className="flex items-center gap-3 flex-1">
                                        <div className="cursor-move p-2 hover:bg-slate-200 rounded-lg text-slate-400">
                                            <GripVertical size={20} />
                                        </div>
                                        <div className="flex-1">
                                            <input
                                                type="text"
                                                value={section.title}
                                                onChange={e => updateSection(sIndex, 'title', e.target.value)}
                                                className="bg-transparent font-bold text-lg text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-200 rounded px-2 py-1 outline-none w-full"
                                                placeholder="區塊標題"
                                            />
                                            <input
                                                type="text"
                                                value={section.description}
                                                onChange={e => updateSection(sIndex, 'description', e.target.value)}
                                                placeholder="新增區塊說明..."
                                                className="bg-transparent text-sm text-slate-500 focus:bg-white focus:ring-2 focus:ring-blue-200 rounded px-2 py-0.5 outline-none w-full mt-1"
                                            />
                                        </div>
                                    </div>
                                    <button onClick={() => removeSection(sIndex)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition">
                                        <Trash2 size={20} />
                                    </button>
                                </div>

                                <div className="p-4 space-y-3">
                                    {section.fields.map((field, fIndex) => (
                                        <div key={field.id} className="flex items-start gap-3 bg-white border border-slate-100 p-4 rounded-xl shadow-sm hover:shadow-md transition group">
                                            <div className="flex-1 grid grid-cols-1 sm:grid-cols-12 gap-3">
                                                <div className="sm:col-span-5">
                                                    <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">欄位名稱</label>
                                                    <input
                                                        type="text"
                                                        value={field.label}
                                                        onChange={e => updateField(sIndex, fIndex, 'label', e.target.value)}
                                                        className="w-full p-2 bg-slate-50 border-none rounded-lg focus:ring-2 focus:ring-blue-500/20 outline-none font-medium"
                                                        placeholder="例如：姓名"
                                                    />
                                                </div>
                                                <div className="sm:col-span-3">
                                                    <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">類型</label>
                                                    <select
                                                        value={field.type}
                                                        onChange={e => updateField(sIndex, fIndex, 'type', e.target.value)}
                                                        className="w-full p-2 bg-slate-50 border-none rounded-lg focus:ring-2 focus:ring-blue-500/20 outline-none"
                                                    >
                                                        <option value="text">單行文字</option>
                                                        <option value="textarea">多行文字</option>
                                                        <option value="radio">單選題</option>
                                                        <option value="checkbox">多選題</option>
                                                        <option value="select">下拉選單</option>
                                                        <option value="date">日期選擇</option>
                                                        <option value="number">數字輸入</option>
                                                        <option value="rating">評分欄位</option>
                                                    </select>
                                                </div>
                                                <div className="sm:col-span-4">
                                                    <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">提示文字</label>
                                                    <input
                                                        type="text"
                                                        value={field.placeholder || ''}
                                                        onChange={e => updateField(sIndex, fIndex, 'placeholder', e.target.value)}
                                                        className="w-full p-2 bg-slate-50 border-none rounded-lg focus:ring-2 focus:ring-blue-500/20 outline-none"
                                                        placeholder="輸入框內的提示..."
                                                    />
                                                </div>

                                                {/* Conditional Fields based on Type */}
                                                {(field.type === 'radio' || field.type === 'checkbox' || field.type === 'select') && (
                                                    <div className="sm:col-span-12 space-y-2 bg-slate-50 p-3 rounded-lg border border-slate-100">
                                                        <label className="text-xs font-bold text-slate-400 uppercase block">選項設定 (每行一個選項)</label>
                                                        <textarea
                                                            value={field.options?.map(o => o.label).join('\n') || ''}
                                                            onChange={e => {
                                                                const lines = e.target.value.split('\n');
                                                                const options = lines.map(line => ({ value: line, label: line }));
                                                                updateField(sIndex, fIndex, 'options', options);
                                                            }}
                                                            className="w-full p-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 outline-none text-sm min-h-[80px]"
                                                            placeholder="選項 1&#10;選項 2&#10;選項 3"
                                                        />
                                                    </div>
                                                )}

                                                {field.type === 'number' && (
                                                    <div className="sm:col-span-12 grid grid-cols-4 gap-3 bg-slate-50 p-3 rounded-lg border border-slate-100">
                                                        <div>
                                                            <label className="text-xs font-bold text-slate-400 uppercase block mb-1">最小值</label>
                                                            <input type="number" value={field.min || ''} onChange={e => updateField(sIndex, fIndex, 'min', e.target.value)} className="w-full p-2 bg-white border border-slate-200 rounded-lg text-sm" />
                                                        </div>
                                                        <div>
                                                            <label className="text-xs font-bold text-slate-400 uppercase block mb-1">最大值</label>
                                                            <input type="number" value={field.max || ''} onChange={e => updateField(sIndex, fIndex, 'max', e.target.value)} className="w-full p-2 bg-white border border-slate-200 rounded-lg text-sm" />
                                                        </div>
                                                        <div>
                                                            <label className="text-xs font-bold text-slate-400 uppercase block mb-1">間隔 (Step)</label>
                                                            <input type="number" value={field.step || 1} onChange={e => updateField(sIndex, fIndex, 'step', e.target.value)} className="w-full p-2 bg-white border border-slate-200 rounded-lg text-sm" />
                                                        </div>
                                                        <div>
                                                            <label className="text-xs font-bold text-slate-400 uppercase block mb-1">單位 (Suffix)</label>
                                                            <input type="text" value={field.suffix || ''} onChange={e => updateField(sIndex, fIndex, 'suffix', e.target.value)} className="w-full p-2 bg-white border border-slate-200 rounded-lg text-sm" placeholder="如: 元" />
                                                        </div>
                                                    </div>
                                                )}

                                                {field.type === 'rating' && (
                                                    <div className="sm:col-span-12 grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-lg border border-slate-100">
                                                        <div>
                                                            <label className="text-xs font-bold text-slate-400 uppercase block mb-1">評分上限 (1-10)</label>
                                                            <input type="number" min="1" max="10" value={field.maxRating || 5} onChange={e => updateField(sIndex, fIndex, 'maxRating', parseInt(e.target.value))} className="w-full p-2 bg-white border border-slate-200 rounded-lg text-sm" />
                                                        </div>
                                                        <div>
                                                            <label className="text-xs font-bold text-slate-400 uppercase block mb-1">圖示類型</label>
                                                            <select value={field.icon || 'star'} onChange={e => updateField(sIndex, fIndex, 'icon', e.target.value)} className="w-full p-2 bg-white border border-slate-200 rounded-lg text-sm">
                                                                <option value="star">星星 (Star)</option>
                                                                <option value="heart">愛心 (Heart)</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                )}

                                                {field.type === 'date' && (
                                                    <div className="sm:col-span-12 grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-lg border border-slate-100">
                                                        <div>
                                                            <label className="text-xs font-bold text-slate-400 uppercase block mb-1">最小日期</label>
                                                            <input type="date" value={field.minDate || ''} onChange={e => updateField(sIndex, fIndex, 'minDate', e.target.value)} className="w-full p-2 bg-white border border-slate-200 rounded-lg text-sm" />
                                                        </div>
                                                        <div>
                                                            <label className="text-xs font-bold text-slate-400 uppercase block mb-1">最大日期</label>
                                                            <input type="date" value={field.maxDate || ''} onChange={e => updateField(sIndex, fIndex, 'maxDate', e.target.value)} className="w-full p-2 bg-white border border-slate-200 rounded-lg text-sm" />
                                                        </div>
                                                    </div>
                                                )}
                                                <div className="sm:col-span-12 flex items-center justify-between pt-2">
                                                    <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer select-none hover:text-blue-600 transition">
                                                        <input
                                                            type="checkbox"
                                                            checked={field.required ?? false}
                                                            onChange={e => updateField(sIndex, fIndex, 'required', e.target.checked)}
                                                            className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                                                        />
                                                        設為必填
                                                    </label>
                                                    <button onClick={() => removeField(sIndex, fIndex)} className="text-slate-400 hover:text-red-500 text-sm flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
                                                        <Trash2 size={14} /> 移除
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    <button onClick={() => addField(sIndex)} className="w-full py-3 border-2 border-dashed border-slate-200 rounded-xl text-slate-500 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition flex justify-center items-center gap-2 font-bold text-sm">
                                        <Plus size={18} /> 新增欄位
                                    </button>
                                </div>
                            </div>
                        ))}

                        <button onClick={addSection} className="w-full py-6 glass-card border-2 border-dashed border-white/50 text-slate-600 hover:text-blue-600 hover:border-blue-400 transition flex flex-col justify-center items-center gap-2 font-bold shadow-none hover:shadow-lg group">
                            <div className="p-3 bg-white rounded-full shadow-sm group-hover:scale-110 transition-transform">
                                <Layout size={24} className="text-blue-500" />
                            </div>
                            新增一個區塊
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TemplateEditor;
