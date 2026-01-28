import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getCountFromServer } from 'firebase/firestore';
import { FileText, Users, FileSpreadsheet, TrendingUp } from 'lucide-react';

const SystemStats = () => {
    const [stats, setStats] = useState({
        users: 0,
        templates: 0,
        submissions: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const usersCount = await getCountFromServer(collection(db, 'users'));
            const templatesCount = await getCountFromServer(collection(db, 'templates'));
            const submissionsCount = await getCountFromServer(collection(db, 'submissions'));

            setStats({
                users: usersCount.data().count,
                templates: templatesCount.data().count,
                submissions: submissionsCount.data().count
            });
        } catch (error) {
            console.error("Error fetching stats:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="p-8 text-center text-slate-500">載入統計數據中...</div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="text-blue-600" />
                <h2 className="text-xl font-bold text-slate-800">系統營運數據</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                    title="總使用者"
                    value={stats.users}
                    icon={<Users size={24} />}
                    color="blue"
                />
                <StatCard
                    title="已建立表單"
                    value={stats.templates}
                    icon={<FileText size={24} />}
                    color="purple"
                />
                <StatCard
                    title="總回應數"
                    value={stats.submissions}
                    icon={<FileSpreadsheet size={24} />}
                    color="green"
                />
            </div>
        </div>
    );
};

const StatCard = ({ title, value, icon, color }) => {
    const colorClasses = {
        blue: 'bg-blue-100 text-blue-600',
        purple: 'bg-purple-100 text-purple-600',
        green: 'bg-green-100 text-green-600',
    };

    return (
        <div className="glass-card p-6 flex items-center gap-4 hover:-translate-y-1 transition-transform duration-300">
            <div className={`p-4 rounded-2xl ${colorClasses[color]}`}>
                {icon}
            </div>
            <div>
                <p className="text-slate-500 text-sm font-medium">{title}</p>
                <h3 className="text-3xl font-bold text-slate-800">{value}</h3>
            </div>
        </div>
    );
};

export default SystemStats;
