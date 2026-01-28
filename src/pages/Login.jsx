import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Lock, ArrowRight, ShieldCheck, LogIn } from 'lucide-react';

const Login = () => {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { loginWithSharedAccount, loginWithGoogle, currentUser } = useAuth();
    const navigate = useNavigate();

    // 監聽 currentUser 變化，一旦登入成功（Context 更新完成）自動跳轉
    useEffect(() => {
        if (currentUser) {
            navigate('/admin/dashboard');
        }
    }, [currentUser, navigate]);

    const handlePasswordLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            // Pass the password directly to Firebase Auth
            await loginWithSharedAccount(password);
            // 不要在這裡 navigate，等待 useEffect 觸發
        } catch (err) {
            console.error("Login failed:", err);
            setError('登入失敗，請檢查網路或聯絡管理員');
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setError('');
        setLoading(true);
        try {
            await loginWithGoogle();
            // 不要在這裡 navigate，等待 useEffect 觸發
        } catch (err) {
            console.error("Google Login failed:", err);
            setError('Google 登入失敗');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 mesh-bg relative overflow-hidden">
            {/* Decorative Blobs */}
            <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-float"></div>
            <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-yellow-400 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-float" style={{ animationDelay: '2s' }}></div>
            <div className="absolute bottom-[-20%] left-[20%] w-96 h-96 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-float" style={{ animationDelay: '4s' }}></div>

            <div className="glass-card w-full max-w-md p-8 relative z-10 animate-slide-up">
                <div className="text-center mb-8">
                    <div className="w-20 h-20 bg-gradient-to-tr from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-500/30 transform rotate-3 hover:rotate-6 transition-transform duration-300">
                        <ShieldCheck className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-slate-800 mb-2">歡迎回來</h1>
                    <p className="text-slate-500">請選擇登入方式以繼續</p>
                </div>

                <div className="space-y-6">
                    {/* Google Login */}
                    <button
                        onClick={handleGoogleLogin}
                        disabled={loading}
                        className="w-full bg-white border border-slate-200 text-slate-700 font-bold py-3 px-6 rounded-xl shadow-sm hover:bg-slate-50 hover:shadow-md transition-all flex items-center justify-center gap-3"
                    >
                        <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
                        使用 Google 帳號登入
                    </button>

                    <div className="relative flex py-2 items-center">
                        <div className="flex-grow border-t border-slate-200"></div>
                        <span className="flex-shrink-0 mx-4 text-slate-400 text-sm">或使用簡易密碼</span>
                        <div className="flex-grow border-t border-slate-200"></div>
                    </div>

                    {/* Password Login */}
                    <form onSubmit={handlePasswordLogin} className="space-y-4">
                        {/* Hidden username for accessibility/autofill */}
                        <input type="text" name="username" value="admin" readOnly className="hidden" autoComplete="username" />

                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="輸入管理員密碼"
                                autoComplete="current-password"
                                className={`input-field pl-10 ${error ? 'ring-2 ring-red-500' : ''}`}
                            />
                        </div>
                        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full btn-primary flex items-center justify-center gap-2 group disabled:opacity-70"
                        >
                            {loading ? '登入中...' : '登入系統'}
                            {!loading && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
                        </button>
                    </form>
                </div>

                <div className="mt-8 text-center">
                    <p className="text-xs text-slate-400">
                        Protected by Secure Auth System
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
