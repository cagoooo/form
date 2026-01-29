import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { Plus, Edit, Trash2, Eye, FileText, LayoutDashboard, LogOut, User, Users, Settings, BarChart3, ArrowRight } from 'lucide-react';
import UserManager from '../components/UserManager';
import SystemStats from '../components/SystemStats';
import ConfirmModal from '../components/ConfirmModal';
import { defaultTemplates } from '../data/defaultTemplates';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('forms');
    const [templates, setTemplates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deleteModal, setDeleteModal] = useState({ isOpen: false, templateId: null, createdBy: null });
    const [templateModalOpen, setTemplateModalOpen] = useState(false);
    const { currentUser, userRole, logout } = useAuth();
    const navigate = useNavigate();

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

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/admin/login');
        } catch (error) {
            console.error("Logout failed", error);
        }
    };

    const handleDeleteClick = (e, id, createdBy) => {
        e.preventDefault();
        e.stopPropagation();

        // Permission check
        if (userRole !== 'admin') {
            if (createdBy !== currentUser.uid) {
                alert('權限不足：您只能刪除自己建立的表單');
                return;
            }
        }

        // Open the custom modal
        setDeleteModal({ isOpen: true, templateId: id, createdBy: createdBy });
    };

    const handleConfirmDelete = async () => {
        const { templateId } = deleteModal;

        try {
            await deleteDoc(doc(db, 'templates', templateId));
            setTemplates(prev => prev.filter(t => t.id !== templateId));
            setDeleteModal({ isOpen: false, templateId: null, createdBy: null });
        } catch (error) {
            console.error("Error deleting template:", error);
            alert("刪除失敗: " + error.message);
        }
    };

    const handleCancelDelete = () => {
        setDeleteModal({ isOpen: false, templateId: null, createdBy: null });
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center mesh-bg">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-white"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen mesh-bg p-6">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div className="glass-card p-6 flex flex-col md:flex-row justify-between items-center gap-4 animate-slide-up">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg shadow-blue-500/30 text-white">
                            <LayoutDashboard size={28} />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">管理儀表板</h1>
                            <div className="flex items-center gap-2 text-slate-500 text-sm mt-1">
                                <User size={14} />
                                <span>{currentUser?.email}</span>
                                <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs font-bold rounded-full border border-purple-200 uppercase tracking-wider">{userRole}</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button onClick={handleLogout} className="px-4 py-2 text-slate-500 hover:bg-slate-100 rounded-lg flex items-center gap-2 transition">
                            <LogOut size={18} />
                            登出
                        </button>
                        <button onClick={() => setTemplateModalOpen(true)} className="px-4 py-2 bg-white text-blue-600 border border-blue-200 hover:bg-blue-50 rounded-lg flex items-center gap-2 transition font-medium">
                            <LayoutDashboard size={20} />
                            從模板建立
                        </button>
                        <Link to="/admin/editor/new" className="btn-primary flex items-center gap-2">
                            <Plus size={20} />
                            建立空白表單
                        </Link>
                    </div>
                </div>

                {/* Tabs Navigation */}
                <div className="glass-card p-2 mb-8 flex gap-2 overflow-x-auto">
                    <button
                        onClick={() => setActiveTab('forms')}
                        className={`flex-1 py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 font-medium ${activeTab === 'forms'
                            ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/30'
                            : 'text-slate-500 hover:bg-white/50 hover:text-slate-700'
                            }`}
                    >
                        <FileText size={18} />
                        表單管理
                    </button>
                    {userRole === 'admin' && (
                        <button
                            onClick={() => setActiveTab('users')}
                            className={`flex-1 py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 font-medium ${activeTab === 'users'
                                ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg shadow-purple-500/30'
                                : 'text-slate-500 hover:bg-white/50 hover:text-slate-700'
                                }`}
                        >
                            <Users size={18} />
                            人員管理
                        </button>
                    )}
                    <button
                        onClick={() => setActiveTab('stats')}
                        className={`flex-1 py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 font-medium ${activeTab === 'stats'
                            ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/30'
                            : 'text-slate-500 hover:bg-white/50 hover:text-slate-700'
                            }`}
                    >
                        <BarChart3 size={18} />
                        系統統計
                    </button>
                </div>

                {/* Tab Content */}
                <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
                    {/* Forms Tab */}
                    {activeTab === 'forms' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {templates.map((template) => (
                                <div key={template.id} className="glass-card group hover:-translate-y-1 transition-all duration-300 flex flex-col h-full relative">
                                    <div className={`h-32 bg-gradient-to-br ${template.theme === 'green' ? 'from-emerald-400 to-teal-600' : template.theme === 'pink' ? 'from-rose-400 to-pink-600' : 'from-blue-400 to-indigo-600'} p-6 relative rounded-t-2xl`}>
                                        <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm p-2 rounded-lg text-white">
                                            <FileText size={20} />
                                        </div>
                                        <h3 className="text-white text-xl font-bold mt-8 truncate shadow-black/10 drop-shadow-md">{template.title}</h3>
                                    </div>

                                    <div className="p-6 flex-1 flex flex-col">
                                        <p className="text-slate-500 text-sm mb-6 line-clamp-2 flex-1">{template.description || '無描述'}</p>

                                        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                                            <div className="flex gap-2 relative z-10">
                                                <Link to={`/admin/editor/${template.id}`} className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition" title="編輯">
                                                    <Edit size={18} />
                                                </Link>
                                                <Link to={`/form/${template.id}`} target="_blank" className="p-2 text-slate-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition" title="預覽">
                                                    <Eye size={18} />
                                                </Link>
                                                {(userRole === 'admin' || template.createdBy === currentUser?.uid) && (
                                                    <button
                                                        type="button"
                                                        onClick={(e) => handleDeleteClick(e, template.id, template.createdBy)}
                                                        className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition cursor-pointer"
                                                        title="刪除"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                )}
                                            </div>
                                            <Link to={`/admin/submissions/${template.id}`} className="px-4 py-2 bg-slate-100 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-200 transition flex items-center gap-2">
                                                查看回應
                                                <ArrowRight size={14} />
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {templates.length === 0 && (
                                <div className="col-span-full py-20 text-center">
                                    <div className="w-24 h-24 bg-white/50 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <FileText size={40} className="text-slate-300" />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-600">尚無表單</h3>
                                    <p className="text-slate-400 mb-6">開始建立您的第一個動態表單吧！</p>
                                    <Link to="/admin/editor/new" className="btn-primary inline-flex items-center gap-2">
                                        <Plus size={20} />
                                        立即建立
                                    </Link>
                                </div>
                            )}
                        </div>
                    )}

                    {/* User Management Tab */}
                    {activeTab === 'users' && userRole === 'admin' && (
                        <UserManager />
                    )}

                    {/* Statistics Tab */}
                    {activeTab === 'stats' && userRole === 'admin' && (
                        <SystemStats />
                    )}
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            <ConfirmModal
                isOpen={deleteModal.isOpen}
                title="確定要刪除嗎？"
                message="此動作無法復原，刪除後所有相關資料都將永久消失。"
                onConfirm={handleConfirmDelete}
                onCancel={handleCancelDelete}
            />

            {/* Template Selection Modal */}
            {templateModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-5xl max-h-[85vh] overflow-hidden flex flex-col animate-scale-up border border-white/50 ring-1 ring-black/5">
                        <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-gradient-to-r from-slate-50/80 to-white/80">
                            <div>
                                <h2 className="text-2xl font-bold text-slate-800 tracking-tight">選擇表單模板</h2>
                                <p className="text-slate-500 text-sm mt-1">從精選模板快速開始，或建立全新表單</p>
                            </div>
                            <button onClick={() => setTemplateModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-600">
                                <LogOut size={24} className="rotate-180" />
                            </button>
                        </div>
                        <div className="p-8 overflow-y-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 bg-slate-50/50">
                            {defaultTemplates.map(template => (
                                <div key={template.id} className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 overflow-hidden group cursor-pointer hover:-translate-y-2 ring-1 ring-transparent hover:ring-blue-500/20"
                                    onClick={() => {
                                        navigate('/admin/editor/new', { state: { templateData: template } });
                                    }}
                                >
                                    <div className={`h-32 bg-gradient-to-br ${template.theme === 'green' ? 'from-emerald-400 to-teal-600' : template.theme === 'pink' ? 'from-rose-400 to-pink-600' : 'from-blue-400 to-indigo-600'} p-6 flex items-center justify-center relative overflow-hidden`}>
                                        <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                        <FileText className="text-white w-14 h-14 group-hover:scale-110 transition-transform duration-500 drop-shadow-md" />
                                    </div>
                                    <div className="p-6">
                                        <h3 className="font-bold text-lg text-slate-800 mb-2 group-hover:text-blue-600 transition-colors">{template.title}</h3>
                                        <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed">{template.description}</p>
                                        <div className="mt-6 pt-4 border-t border-slate-50 flex justify-between items-center text-xs font-medium text-slate-400">
                                            <span className="bg-slate-100 px-2 py-1 rounded-md">{template.sections.length} 個區塊</span>
                                            <span className="text-blue-500 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all transform translate-x-[-10px] group-hover:translate-x-0">
                                                使用此模板 <ArrowRight size={12} />
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
