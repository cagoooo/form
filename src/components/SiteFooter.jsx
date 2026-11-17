import { FileText, GripVertical, Save, BellRing } from 'lucide-react';

const APP_VERSION = 'v1.2.5';
const AUTHOR_URL = 'https://cagoooo.github.io/Akai/';

const points = [
    { icon: GripVertical, title: '拖曳式編輯器', desc: '區塊與欄位用拖曳排序，還有現成模板可套用' },
    { icon: Save, title: '自動儲存草稿', desc: '填到一半會暫存在這台裝置，回來可以接著填' },
    { icon: BellRing, title: '通知與匯出', desc: '新回應可送 Google Chat 通知，資料可匯出 CSV' },
];

const Credit = () => (
    <p className="text-slate-600 text-sm sm:text-base">
        Made with <span className="inline-block mx-0.5" aria-label="愛心">❤️</span> by{' '}
        <a
            href={AUTHOR_URL}
            target="_blank"
            rel="noopener noreferrer"
            title="阿凱老師教育科技創新專區"
            className="font-bold text-indigo-600 hover:text-purple-600 border-b border-dotted border-current pb-px transition-colors"
        >
            阿凱老師
        </a>
        <span className="block sm:inline text-slate-500">
            <span className="hidden sm:inline" aria-hidden="true">・</span>桃園市龍潭區石門國民小學
        </span>
    </p>
);

const VersionTag = () => (
    <span className="inline-block px-3 py-0.5 rounded-full text-xs font-semibold text-slate-500 bg-white/60 border border-white/80 shadow-sm">
        {APP_VERSION}
    </span>
);

// 頁尾（2026-11-17 新增）：compact 用在填寫表單頁，只顯示署名列
const SiteFooter = ({ compact = false, className = '' }) => {
    if (compact) {
        return (
            <footer className={`print:hidden flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 text-center ${className}`}>
                <Credit />
                <VersionTag />
            </footer>
        );
    }

    return (
        <footer className={`glass-card relative overflow-hidden print:hidden ${className}`}>
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" aria-hidden="true"></div>
            <div className="p-6 sm:p-8 grid gap-6 lg:grid-cols-[minmax(220px,1fr)_2.4fr] items-start">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 flex-shrink-0 rounded-xl bg-gradient-to-tr from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
                        <FileText className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <strong className="block text-lg text-slate-800">動態表單系統</strong>
                        <span className="block text-sm text-slate-500">自己設計表單、分享連結收回應，不必寫程式</span>
                    </div>
                </div>
                <ul className="grid gap-3 sm:grid-cols-3">
                    {points.map(({ icon: Icon, title, desc }) => (
                        <li key={title} className="flex gap-3 items-start p-4 rounded-xl bg-white/50 border border-white/70">
                            <Icon className="w-5 h-5 mt-0.5 flex-shrink-0 text-indigo-500" />
                            <div>
                                <strong className="block text-slate-800 text-sm sm:text-base">{title}</strong>
                                <small className="block text-slate-500 text-sm leading-relaxed">{desc}</small>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="px-6 sm:px-8 py-4 border-t border-white/60 flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
                <Credit />
                <VersionTag />
            </div>
        </footer>
    );
};

export default SiteFooter;
