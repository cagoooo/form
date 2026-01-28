import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { db } from '../firebase';
import { collection, query, where, getDocs, orderBy, doc, getDoc } from 'firebase/firestore';
import { ArrowLeft, Download } from 'lucide-react';

const SubmissionViewer = () => {
    const { templateId } = useParams();
    const [submissions, setSubmissions] = useState([]);
    const [template, setTemplate] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, [templateId]);

    const fetchData = async () => {
        try {
            // Fetch Template
            const templateSnap = await getDoc(doc(db, 'templates', templateId));
            if (templateSnap.exists()) {
                setTemplate(templateSnap.data());
            }

            // Fetch Submissions
            const q = query(
                collection(db, 'submissions'),
                where('templateId', '==', templateId),
                orderBy('timestamp', 'desc')
            );
            const querySnapshot = await getDocs(q);
            setSubmissions(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    const exportCSV = () => {
        if (!submissions.length || !template) return;

        // Get all unique field IDs from template
        const headers = ['填寫時間', '班級'];
        const fieldIds = [];
        template.sections.forEach(section => {
            section.fields.forEach(field => {
                headers.push(field.label);
                fieldIds.push(field.id);
            });
        });

        const rows = submissions.map(sub => {
            const date = sub.timestamp ? new Date(sub.timestamp.seconds * 1000).toLocaleString('zh-TW') : '';
            const row = [date, sub.className];
            fieldIds.forEach(fid => {
                row.push(`"${(sub.data[fid] || '').replace(/"/g, '""')}"`); // Escape quotes
            });
            return row.join(',');
        });

        const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${template.title}_回應資料.csv`;
        link.click();
    };

    if (loading) return <div className="p-10 text-center">載入中...</div>;
    if (!template) return <div className="p-10 text-center">找不到模板</div>;

    // Flatten fields for table header
    const allFields = [];
    template.sections.forEach(section => {
        section.fields.forEach(field => {
            allFields.push(field);
        });
    });

    return (
        <div className="min-h-screen bg-slate-50 p-6">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                        <Link to="/admin/dashboard" className="p-2 hover:bg-slate-200 rounded-full">
                            <ArrowLeft size={20} />
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold text-slate-800">{template.title} - 回應資料</h1>
                            <p className="text-slate-500 text-sm">共 {submissions.length} 筆資料</p>
                        </div>
                    </div>
                    <button onClick={exportCSV} className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-700 transition">
                        <Download size={18} />
                        匯出 CSV
                    </button>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                            <tr>
                                <th className="px-4 py-3 whitespace-nowrap">填寫時間</th>
                                <th className="px-4 py-3 whitespace-nowrap">班級</th>
                                {allFields.map(field => (
                                    <th key={field.id} className="px-4 py-3 whitespace-nowrap min-w-[100px]">{field.label}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {submissions.map(sub => (
                                <tr key={sub.id} className="hover:bg-slate-50">
                                    <td className="px-4 py-3 text-slate-500 whitespace-nowrap">
                                        {sub.timestamp ? new Date(sub.timestamp.seconds * 1000).toLocaleString('zh-TW') : '-'}
                                    </td>
                                    <td className="px-4 py-3 font-medium text-slate-800">{sub.className}</td>
                                    {allFields.map(field => (
                                        <td key={field.id} className="px-4 py-3 text-slate-600 max-w-xs truncate" title={sub.data[field.id]}>
                                            {sub.data[field.id]}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                            {submissions.length === 0 && (
                                <tr>
                                    <td colSpan={allFields.length + 2} className="px-4 py-8 text-center text-slate-400">
                                        尚無回應資料
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default SubmissionViewer;
