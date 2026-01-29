export const defaultTemplates = [
    {
        id: 'event-registration',
        title: '活動報名表',
        description: '適用於各類活動、研討會或課程的線上報名。',
        theme: 'blue',
        sections: [
            {
                id: 's1',
                title: '基本資料',
                description: '請填寫您的聯絡資訊',
                fields: [
                    { id: 'f1', label: '姓名', type: 'text', required: true, placeholder: '請輸入您的姓名' },
                    { id: 'f2', label: 'Email', type: 'text', required: true, placeholder: 'example@email.com' },
                    { id: 'f3', label: '聯絡電話', type: 'text', required: true, placeholder: '09xx-xxx-xxx' }
                ]
            },
            {
                id: 's2',
                title: '報名細節',
                description: '請選擇您要參加的場次',
                fields: [
                    {
                        id: 'f4', label: '參加場次', type: 'radio', required: true,
                        options: [
                            { value: 'morning', label: '上午場 (09:00 - 12:00)' },
                            { value: 'afternoon', label: '下午場 (14:00 - 17:00)' }
                        ]
                    },
                    {
                        id: 'f5', label: '飲食習慣', type: 'select', required: false,
                        options: [
                            { value: 'normal', label: '葷食' },
                            { value: 'vegetarian', label: '素食' },
                            { value: 'no-pork', label: '不吃豬肉' }
                        ]
                    }
                ]
            }
        ]
    },
    {
        id: 'feedback-survey',
        title: '滿意度調查',
        description: '收集使用者對產品或服務的回饋意見。',
        theme: 'green',
        sections: [
            {
                id: 's1',
                title: '滿意度評分',
                description: '請依照您的實際體驗進行評分',
                fields: [
                    { id: 'f1', label: '整體滿意度', type: 'rating', required: true, maxRating: 5, icon: 'star' },
                    { id: 'f2', label: '服務品質', type: 'rating', required: true, maxRating: 5, icon: 'heart' }
                ]
            },
            {
                id: 's2',
                title: '詳細意見',
                description: '我們重視您的每一個建議',
                fields: [
                    { id: 'f3', label: '您最喜歡的部分是？', type: 'textarea', required: false, placeholder: '請分享您的想法...' },
                    { id: 'f4', label: '有哪些需要改進的地方？', type: 'textarea', required: false, placeholder: '請告訴我們如何做得更好...' }
                ]
            }
        ]
    },
    {
        id: 'contact-form',
        title: '聯絡我們',
        description: '簡單的聯絡表單，讓訪客能快速聯繫您。',
        theme: 'pink',
        sections: [
            {
                id: 's1',
                title: '聯絡資訊',
                description: '',
                fields: [
                    { id: 'f1', label: '您的稱呼', type: 'text', required: true, placeholder: '' },
                    { id: 'f2', label: '電子郵件', type: 'text', required: true, placeholder: '' },
                    {
                        id: 'f3', label: '主旨', type: 'select', required: true,
                        options: [
                            { value: 'inquiry', label: '產品諮詢' },
                            { value: 'support', label: '技術支援' },
                            { value: 'cooperation', label: '合作提案' },
                            { value: 'other', label: '其他' }
                        ]
                    },
                    { id: 'f4', label: '訊息內容', type: 'textarea', required: true, placeholder: '請詳細描述您的需求...' }
                ]
            }
        ]
    }
];
