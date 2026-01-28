import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, ArrowRight, ShieldCheck } from 'lucide-react';

const Login = () => {
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const [error, setError] = useState(false);

    const handleLogin = (e) => {
        e.preventDefault();
        if (password === 'smes1234') {
            localStorage.setItem('isAdmin', 'true');
            navigate('/admin/dashboard');
        } else {
            setError(true);
            setTimeout(() => setError(false), 500); // Shake animation reset
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
                    <p className="text-slate-500">請輸入管理員密碼以繼續</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="輸入密碼"
                            className={`input-field pl-10 ${error ? 'ring-2 ring-red-500 animate-pulse' : ''}`}
                            autoFocus
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full btn-primary flex items-center justify-center gap-2 group"
                    >
                        登入系統
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                </form>

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
