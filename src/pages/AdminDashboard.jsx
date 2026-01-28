import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { Plus, Edit, Trash2, Eye, FileText, LayoutDashboard, LogOut, User, Settings, BarChart3 } from 'lucide-react';
import UserManager from '../components/UserManager';
import SystemStats from '../components/SystemStats';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('forms');
    const [templates, setTemplates] = useState([]);
    const [loading, setLoading] = useState(true);
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

    const handleDelete = async (id, createdBy) => {
        // Permission check
        if (userRole !== 'admin') {
            if (createdBy !== currentUser.uid) {
                alert('權限不足：您只能刪除自己建立的表單');
                return;
            }
        }

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

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center mesh-bg">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-white"></div>
        </div>
    );

    return (
        <div className="min-h-screen mesh-bg p-6">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div className="glass-card p-6 flex flex-col md:flex-row justify-between items-center gap-4 animate-slide-up">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-100 rounded-2xl text-blue-600">
                            <LayoutDashboard size={28} />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-slate-800">管理儀表板</h1>
                            <div className="flex items-center gap-2 text-slate-500 text-sm">
                                <User size={14} />
                                <span>{currentUser?.email}</span>
                                <span className={`px-2 py-0.5 rounded-full text-xs font-bold uppercase ${userRole === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-slate-200 text-slate-600'
                                    }`}>
                                    {userRole || 'User'}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button onClick={handleLogout} className="px-4 py-2 text-slate-500 hover:bg-slate-100 rounded-lg flex items-center gap-2 transition">
                            <LogOut size={18} />
                            登出
                        </button>
                        <Link to="/admin/editor/new" className="btn-primary flex items-center gap-2">
                            <Plus size={20} />
                            建立新表單
                        </Link>
                    </div>
                </div>

                {/* Tabs Navigation */}
                <div className="bg-white/30 backdrop-blur-md rounded-xl p-1.5 flex gap-2 overflow-x-auto shadow-sm border border-white/20">
                    <button
                        onClick={() => setActiveTab('forms')}
                        className={`flex-1 py-3 px-6 rounded-lg font-bold transition-all duration-300 flex items-center justify-center gap-2 whitespace-nowrap ${activeTab === 'forms'
                            ? 'bg-white text-blue-600 shadow-sm shadow-blue-100'
                            : 'text-slate-600 hover:bg-white/40'
                            }`}
                    >
                        <FileText size={18} /> 表單管理
                    </button>

                    {userRole === 'admin' && (
                        <>
                            <button
                                onClick={() => setActiveTab('users')}
                                className={`flex-1 py-3 px-6 rounded-lg font-bold transition-all duration-300 flex items-center justify-center gap-2 whitespace-nowrap ${activeTab === 'users'
                                    ? 'bg-white text-blue-600 shadow-sm shadow-blue-100'
                                    : 'text-slate-600 hover:bg-white/40'
                                    }`}
                            >
                                <Settings size={18} /> 人員管理
                            </button>
                            <button
                                onClick={() => setActiveTab('stats')}
                                className={`flex-1 py-3 px-6 rounded-lg font-bold transition-all duration-300 flex items-center justify-center gap-2 whitespace-nowrap ${activeTab === 'stats'
                                    ? 'bg-white text-blue-600 shadow-sm shadow-blue-100'
                                    : 'text-slate-600 hover:bg-white/40'
                                    }`}
                            >
                                <BarChart3 size={18} /> 系統統計
                            </button>
                        </>
                    )}
                </div>

                {/* Tab Content */}
                <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>

                    {/* Forms Tab */}
                    {activeTab === 'forms' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {templates.map((template) => (
                                <div key={template.id} className="glass-card group hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col h-full">
                                    <div className={`h-32 bg-gradient-to-br ${template.theme === 'green' ? 'from-emerald-400 to-teal-600' :
                                        template.theme === 'pink' ? 'from-rose-400 to-pink-600' :
                                            'from-blue-400 to-indigo-600'
                                        } p-6 relative`}>
                                        <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm p-2 rounded-lg text-white">
                                            <FileText size={20} />
                                        </div>
                                        <h3 className="text-white text-xl font-bold mt-8 truncate shadow-black/10 drop-shadow-md">{template.title}</h3>
                                    </div>

                                    <div className="p-6 flex-1 flex flex-col">
                                        <p className="text-slate-500 text-sm mb-6 line-clamp-2 flex-1">{template.description || '無描述'}</p>

                                        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                                            <div className="flex gap-2">
                                                <Link to={`/admin/editor/${template.id}`} className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition" title="編輯">
                                                    <Edit size={18} />
                                                </Link>
                                                <Link to={`/form/${template.id}`} target="_blank" className="p-2 text-slate-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition" title="預覽">
                                                    <Eye size={18} />
                                                </Link>
                                                {(userRole === 'admin' || template.createdBy === currentUser?.uid) && (
                                                    <button onClick={() => handleDelete(template.id, template.createdBy)} className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition" title="刪除">
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
        </div>
    );
};

// Helper component for ArrowRight
const ArrowRight = ({ size }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
);

export default AdminDashboard;
