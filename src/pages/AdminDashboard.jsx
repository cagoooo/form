import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../firebase';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { Plus, Edit, Trash2, Eye, FileText } from 'lucide-react';

const AdminDashboard = () => {
    const [templates, setTemplates] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTemplates();
    }, []);

    const fetchTemplates = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, 'templates'));
            const list = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setTemplates(list);
        } catch (error) {
            console.error("Error fetching templates:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('確定要刪除此模板嗎？此動作無法復原。')) {
            try {
                await deleteDoc(doc(db, 'templates', id));
                setTemplates(prev => prev.filter(t => t.id !== id));
            } catch (error) {
                console.error("Error deleting template:", error);
                alert("刪除失敗");
            }
        }
    };

    if (loading) return <div className="p-10 text-center">載入中...</div>;

    return (
        <div className="min-h-screen bg-slate-50 p-6">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-slate-800">表單管理後台</h1>
                    <Link to="/admin/editor/new" className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition">
                        <Plus size={20} />
                        建立新表單
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {templates.map(template => (
                        <div key={template.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition">
                            <div className={`h-2 bg-gradient-to-r ${template.theme === 'green' ? 'from-emerald-500 to-teal-500' : template.theme === 'pink' ? 'from-pink-500 to-rose-500' : 'from-blue-500 to-indigo-500'}`}></div>
                            <div className="p-5">
                                <h3 className="text-xl font-bold text-slate-800 mb-2 truncate">{template.title}</h3>
                                <p className="text-slate-500 text-sm mb-4 line-clamp-2 h-10">{template.description || '無描述'}</p>

                                <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                                    <div className="flex gap-2">
                                        <Link to={`/admin/editor/${template.id}`} className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg" title="編輯">
                                            <Edit size={18} />
                                        </Link>
                                        <Link to={`/form/${template.id}`} target="_blank" className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg" title="預覽">
                                            <Eye size={18} />
                                        </Link>
                                        <button onClick={() => handleDelete(template.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg" title="刪除">
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                    <Link to={`/admin/submissions/${template.id}`} className="text-sm text-blue-600 font-medium hover:underline flex items-center gap-1">
                                        <FileText size={16} />
                                        查看回應
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}

                    {templates.length === 0 && (
                        <div className="col-span-full text-center py-20 text-slate-400">
                            目前沒有任何表單，請點擊右上角建立。
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
