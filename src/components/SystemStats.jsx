import React, { useState, useEffect } from 'react';
import { db } from '../firebase';

import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { FileText, Users, FileSpreadsheet, TrendingUp, PieChart as PieIcon } from 'lucide-react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend
} from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white/90 backdrop-blur-md border border-white/50 p-3 rounded-xl shadow-lg">
                <p className="text-sm font-bold text-slate-700 mb-1">{label}</p>
                <p className="text-sm text-blue-600 font-medium">
                    {payload[0].name}: {payload[0].value}
                </p>
            </div>
        );
    }
    return null;
};

const SystemStats = () => {
    const [stats, setStats] = useState({
        users: 0,
        templates: 0,
        submissions: 0,
        trendData: [],
        distributionData: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            // Fetch counts
            const usersSnapshot = await getDocs(collection(db, 'users'));
            const templatesSnapshot = await getDocs(collection(db, 'templates'));
            const submissionsSnapshot = await getDocs(query(collection(db, 'submissions'), orderBy('createdAt', 'desc'), limit(100))); // Limit to last 100 for performance

            // Process Trend Data (Last 7 days)
            const submissions = submissionsSnapshot.docs.map(doc => doc.data());
            const last7Days = [...Array(7)].map((_, i) => {
                const d = new Date();
                d.setDate(d.getDate() - i);
                return d.toISOString().split('T')[0];
            }).reverse();

            const trendData = last7Days.map(date => {
                return {
                    date: date.slice(5), // MM-DD
                    count: submissions.filter(s => {
                        if (!s.createdAt) return false;
                        const sDate = s.createdAt.toDate ? s.createdAt.toDate() : new Date(s.createdAt);
                        return sDate.toISOString().split('T')[0] === date;
                    }).length
                };
            });

            // Process Distribution Data (Mock data for now as we need specific form answers)
            // In a real scenario, we would aggregate answers from specific questions.
            // Here we just show submissions by template.
            const submissionsByTemplate = {};
            submissions.forEach(s => {
                const tId = s.templateId || 'unknown';
                submissionsByTemplate[tId] = (submissionsByTemplate[tId] || 0) + 1;
            });

            // Map template IDs to titles
            const templatesMap = {};
            templatesSnapshot.docs.forEach(doc => {
                templatesMap[doc.id] = doc.data().title;
            });

            const distributionData = Object.keys(submissionsByTemplate).map(tId => ({
                name: templatesMap[tId] || '未知表單',
                value: submissionsByTemplate[tId]
            }));

            setStats({
                users: usersSnapshot.size,
                templates: templatesSnapshot.size,
                submissions: submissionsSnapshot.size, // This is limited count, for total count we might need count query again or just use this
                trendData,
                distributionData
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

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="glass-card p-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
                    <div className="flex items-center gap-2 mb-6">
                        <TrendingUp className="text-blue-500" size={20} />
                        <h3 className="font-bold text-slate-700">近 7 日填寫趨勢</h3>
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={stats.trendData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                <XAxis dataKey="date" stroke="#64748b" fontSize={12} />
                                <YAxis stroke="#64748b" fontSize={12} allowDecimals={false} />
                                <Tooltip content={<CustomTooltip />} />
                                <Line
                                    type="monotone"
                                    dataKey="count"
                                    name="填寫數"
                                    stroke="#3b82f6"
                                    strokeWidth={3}
                                    dot={{ r: 4, fill: '#3b82f6', strokeWidth: 2, stroke: '#fff' }}
                                    activeDot={{ r: 6, strokeWidth: 0 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="glass-card p-6 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                    <div className="flex items-center gap-2 mb-6">
                        <PieIcon className="text-purple-500" size={20} />
                        <h3 className="font-bold text-slate-700">表單填寫分佈</h3>
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={stats.distributionData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {stats.distributionData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'][index % 5]} />

                                    ))}
                                </Pie>
                                <Tooltip content={<CustomTooltip />} />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div >
    );
};

const StatCard = ({ title, value, icon, color }) => {
    const colorClasses = {
        blue: 'from-blue-500 to-indigo-600 shadow-blue-500/30',
        purple: 'from-purple-500 to-pink-600 shadow-purple-500/30',
        green: 'from-emerald-500 to-teal-600 shadow-emerald-500/30',
    };

    return (
        <div className="glass-card p-6 flex items-center gap-4 hover:-translate-y-1 transition-transform duration-300 group">
            <div className={`p-4 rounded-2xl bg-gradient-to-br ${colorClasses[color]} text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                {icon}
            </div>
            <div>
                <p className="text-slate-500 text-sm font-medium mb-1">{title}</p>
                <h3 className={`text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r ${colorClasses[color].split(' ')[0]} ${colorClasses[color].split(' ')[2]}`}>{value}</h3>
            </div>
        </div>
    );
};

export default SystemStats;
