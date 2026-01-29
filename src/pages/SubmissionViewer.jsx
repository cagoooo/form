import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { collection, query, where, getDocs, orderBy, doc, getDoc } from 'firebase/firestore';
import { ArrowLeft, Download, FileSpreadsheet, Search } from 'lucide-react';

const SubmissionViewer = () => {
    const { templateId } = useParams();
    const navigate = useNavigate();
    const [submissions, setSubmissions] = useState([]);
    const [template, setTemplate] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchData();
    }, [templateId]);

    const fetchData = async () => {
        try {
            // Fetch Template Info
            const templateSnap = await getDoc(doc(db, 'templates', templateId));
            if (templateSnap.exists()) {
                setTemplate(templateSnap.data());
            }

            // Fetch Submissions
            const q = query(
                collection(db, 'submissions'),
                where('templateId', '==', templateId)
                // orderBy('timestamp', 'desc') // Temporarily removed to fix index error
            );
            const querySnapshot = await getDocs(q);
            const list = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setSubmissions(list);
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    const exportCSV = () => {
        if (!submissions.length) return;

        // Headers
        const headers = ['時間', '班級'];
        template.sections.forEach(section => {
            section.fields.forEach(field => {
                headers.push(field.label);
            });
        });

        // Rows
        const rows = submissions.map(sub => {
            const row = [
                sub.timestamp?.toDate().toLocaleString() || '',
                sub.className || ''
            ];
            template.sections.forEach(section => {
                section.fields.forEach(field => {
                    // Wrap in quotes to handle commas in content
                    row.push(`"${sub.data[field.id] || ''}"`);
                });
            });
            return row.join(',');
        });

        const csvContent = "\uFEFF" + [headers.join(','), ...rows].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${template.title}_回應_${new Date().toLocaleDateString()}.csv`;
        link.click();
    };

    // Filter submissions
    const filteredSubmissions = submissions.filter(sub =>
        sub.className.toLowerCase().includes(searchTerm.toLowerCase()) ||
        Object.values(sub.data).some(val => String(val).toLowerCase().includes(searchTerm.toLowerCase()))
    );

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center mesh-bg">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-white"></div>
        </div>
    );

    return (
        <div className="min-h-screen mesh-bg p-4 pb-20">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="glass-card p-4 flex flex-col md:flex-row justify-between items-center gap-4 sticky top-4 z-50">
                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <button onClick={() => navigate('/admin/dashboard')} className="p-2 hover:bg-slate-100 rounded-full transition">
                            <ArrowLeft size={24} className="text-slate-600" />
                        </button>
                        <div>
                            <h1 className="text-xl font-bold text-slate-800">{template?.title} - 回應列表</h1>
                            <p className="text-xs text-slate-500">共 {submissions.length} 筆資料</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <div className="relative flex-1 md:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="搜尋關鍵字..."
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                className="w-full pl-9 pr-4 py-2 bg-slate-50 border-none rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 outline-none"
                            />
                        </div>
                        <button
                            onClick={exportCSV}
                            disabled={!submissions.length}
                            className="btn-primary flex items-center gap-2 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Download size={18} />
                            <span className="hidden sm:inline">匯出 CSV</span>
                        </button>
                    </div>
                </div>

                {/* Data Table */}
                <div className="glass-card overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-slate-50/80 text-slate-500 uppercase font-bold border-b border-slate-200">
                                <tr>
                                    <th className="px-6 py-4 whitespace-nowrap">提交時間</th>
                                    <th className="px-6 py-4 whitespace-nowrap">班級</th>
                                    {template?.sections.map(section =>
                                        section.fields.map(field => (
                                            <th key={field.id} className="px-6 py-4 whitespace-nowrap min-w-[150px]">
                                                {field.label}
                                            </th>
                                        ))
                                    )}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredSubmissions.map((sub) => (
                                    <tr key={sub.id} className="hover:bg-blue-50/30 transition-colors">
                                        <td className="px-6 py-4 font-mono text-slate-600">
                                            {sub.timestamp?.toDate().toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 font-bold text-slate-700">
                                            <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">
                                                {sub.className}
                                            </span>
                                        </td>
                                        {template?.sections.map(section =>
                                            section.fields.map(field => (
                                                <td key={field.id} className="px-6 py-4 text-slate-600 max-w-xs truncate" title={sub.data[field.id]}>
                                                    {sub.data[field.id] || '-'}
                                                </td>
                                            ))
                                        )}
                                    </tr>
                                ))}
                                {filteredSubmissions.length === 0 && (
                                    <tr>
                                        <td colSpan="100" className="px-6 py-12 text-center text-slate-400">
                                            <div className="flex flex-col items-center gap-2">
                                                <FileSpreadsheet size={40} className="text-slate-300" />
                                                <p>沒有找到符合的資料</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SubmissionViewer;
