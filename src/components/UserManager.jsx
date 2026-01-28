import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { User, Shield, ShieldAlert, CheckCircle } from 'lucide-react';

const UserManager = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const { currentUser } = useAuth();

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, 'users'));
            const list = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setUsers(list);
        } catch (error) {
            console.error("Error fetching users:", error);
        } finally {
            setLoading(false);
        }
    };

    const toggleRole = async (userId, currentRole) => {
        const newRole = currentRole === 'admin' ? 'editor' : 'admin';
        try {
            await updateDoc(doc(db, 'users', userId), { role: newRole });
            setUsers(prev => prev.map(user =>
                user.id === userId ? { ...user, role: newRole } : user
            ));
        } catch (error) {
            console.error("Error updating role:", error);
            alert("權限更新失敗");
        }
    };

    if (loading) return <div className="p-8 text-center text-slate-500">載入使用者名單中...</div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-2 mb-4">
                <UsersIcon className="text-blue-600" />
                <h2 className="text-xl font-bold text-slate-800">人員權限管理</h2>
            </div>

            <div className="glass-card overflow-hidden">
                <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 text-slate-500 uppercase font-bold border-b border-slate-200">
                        <tr>
                            <th className="px-6 py-4">使用者 Email</th>
                            <th className="px-6 py-4">目前權限</th>
                            <th className="px-6 py-4 text-right">操作</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {users.map((user) => (
                            <tr key={user.id} className="hover:bg-slate-50/50 transition">
                                <td className="px-6 py-4 font-medium text-slate-700 flex items-center gap-3">
                                    <div className={`p-2 rounded-full ${user.role === 'admin' ? 'bg-purple-100 text-purple-600' : 'bg-slate-100 text-slate-500'}`}>
                                        <User size={18} />
                                    </div>
                                    {user.email}
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${user.role === 'admin'
                                            ? 'bg-purple-100 text-purple-700 border border-purple-200'
                                            : 'bg-blue-50 text-blue-600 border border-blue-100'
                                        }`}>
                                        {user.role || 'EDITOR'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button
                                        onClick={() => toggleRole(user.id, user.role)}
                                        disabled={user.email === 'admin@form.system' || user.email === currentUser?.email}
                                        className={`text-xs font-bold px-3 py-1.5 rounded-lg transition flex items-center gap-1 ml-auto ${user.email === 'admin@form.system' || user.email === currentUser?.email
                                                ? 'opacity-50 cursor-not-allowed bg-slate-100 text-slate-400'
                                                : user.role === 'admin'
                                                    ? 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                                                    : 'bg-purple-600 text-white hover:bg-purple-700 shadow-md shadow-purple-200'
                                            }`}
                                    >
                                        {user.role === 'admin' ? (
                                            <>
                                                <ShieldAlert size={14} /> 降級為 Editor
                                            </>
                                        ) : (
                                            <>
                                                <Shield size={14} /> 升級為 Admin
                                            </>
                                        )}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const UsersIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
);

export default UserManager;
