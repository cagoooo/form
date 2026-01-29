# 📋 未來優化詳細建議 (Future Enhancement Details)

> 建立日期：2026-01-29 | 適用版本：v1.2.1+

本文件提供各項未來功能的**詳細技術實作建議**，供開發時參考。

---

## 🔴 高優先級功能詳解

### 1. 自動儲存 (Auto-save) 功能

#### 設計概念
- 使用 `LocalStorage` 或 `IndexedDB` 儲存草稿
- 每 30 秒自動儲存，或在欄位失焦時觸發
- 頁面載入時檢查是否有暫存草稿，提示使用者復原

#### 實作步驟
```javascript
// 1. 建立 useAutoSave hook
// src/hooks/useAutoSave.js

import { useEffect, useCallback } from 'react';

export const useAutoSave = (formId, formData, interval = 30000) => {
  const saveToLocal = useCallback(() => {
    const key = `form_draft_${formId}`;
    localStorage.setItem(key, JSON.stringify({
      data: formData,
      timestamp: Date.now()
    }));
  }, [formId, formData]);

  // 自動儲存
  useEffect(() => {
    const timer = setInterval(saveToLocal, interval);
    return () => clearInterval(timer);
  }, [saveToLocal, interval]);

  // 復原草稿
  const loadDraft = useCallback(() => {
    const key = `form_draft_${formId}`;
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : null;
  }, [formId]);

  // 清除草稿
  const clearDraft = useCallback(() => {
    localStorage.removeItem(`form_draft_${formId}`);
  }, [formId]);

  return { saveToLocal, loadDraft, clearDraft };
};
```

#### UI 提示設計
- 顯示「已自動儲存」小提示 (Toast)
- 草稿復原時顯示確認對話框
- 儲存狀態指示器 (雲端圖示 + 時間)

---

### 2. 分頁式表單 (Multi-step Form)

#### 設計概念
- 將表單區塊 (Section) 轉換為獨立步驟
- 每個步驟獨立驗證，通過後才能進入下一步
- 支援返回修改前面步驟

#### 資料結構調整
```javascript
// 現有結構
template.sections = [
  { title: '基本資料', fields: [...] },
  { title: '聯絡資訊', fields: [...] }
];

// 新增步驟設定
template.settings = {
  isMultiStep: true,  // 啟用分頁模式
  showProgress: true, // 顯示進度條
  allowBack: true     // 允許返回上一步
};
```

#### 組件設計
```jsx
// src/components/StepIndicator.jsx
const StepIndicator = ({ steps, currentStep }) => (
  <div className="flex items-center justify-between mb-8">
    {steps.map((step, index) => (
      <div key={index} className="flex items-center">
        <div className={`
          w-10 h-10 rounded-full flex items-center justify-center
          ${index < currentStep ? 'bg-green-500' : 
            index === currentStep ? 'bg-blue-500' : 'bg-gray-300'}
          text-white font-bold transition-all
        `}>
          {index < currentStep ? '✓' : index + 1}
        </div>
        {index < steps.length - 1 && (
          <div className={`w-20 h-1 mx-2
            ${index < currentStep ? 'bg-green-500' : 'bg-gray-300'}
          `} />
        )}
      </div>
    ))}
  </div>
);
```

---

### 3. 更多欄位類型實作

#### 欄位類型定義

| 類型 | type 值 | 額外屬性 |
|------|---------|----------|
| 單選題 | `radio` | `options: [{value, label}]` |
| 多選題 | `checkbox` | `options: [{value, label}]`, `maxSelect` |
| 下拉選單 | `select` | `options: [{value, label}]` |
| 日期 | `date` | `minDate`, `maxDate` |
| 數字 | `number` | `min`, `max`, `step` |
| 量表 | `rating` | `maxRating`, `icon` (star/heart) |

#### FormRenderer 擴充

```jsx
// src/components/FormRenderer.jsx 新增

const renderField = (field) => {
  switch (field.type) {
    case 'text':
      return <InputText {...field} />;
    case 'textarea':
      return <InputTextarea {...field} />;
    case 'radio':
      return (
        <div className="space-y-2">
          {field.options.map(opt => (
            <label key={opt.value} className="flex items-center gap-2">
              <input
                type="radio"
                name={field.id}
                value={opt.value}
                className="w-4 h-4 text-blue-500"
              />
              <span>{opt.label}</span>
            </label>
          ))}
        </div>
      );
    case 'checkbox':
      return (
        <div className="space-y-2">
          {field.options.map(opt => (
            <label key={opt.value} className="flex items-center gap-2">
              <input
                type="checkbox"
                value={opt.value}
                className="w-4 h-4 rounded text-blue-500"
              />
              <span>{opt.label}</span>
            </label>
          ))}
        </div>
      );
    case 'select':
      return (
        <select className="form-select">
          <option value="">請選擇...</option>
          {field.options.map(opt => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      );
    case 'date':
      return <input type="date" className="form-input" />;
    case 'number':
      return (
        <input
          type="number"
          min={field.min}
          max={field.max}
          step={field.step || 1}
          className="form-input"
        />
      );
    case 'rating':
      return <RatingInput maxRating={field.maxRating || 5} />;
    default:
      return <InputText {...field} />;
  }
};
```

---

### 4. 檔案上傳功能

#### Firebase Storage 設定

```javascript
// src/firebase.js 新增

import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

export const storage = getStorage(app);

export const uploadFile = async (file, path, onProgress) => {
  const storageRef = ref(storage, path);
  const uploadTask = uploadBytesResumable(storageRef, file);

  return new Promise((resolve, reject) => {
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        onProgress?.(progress);
      },
      (error) => reject(error),
      async () => {
        const url = await getDownloadURL(uploadTask.snapshot.ref);
        resolve(url);
      }
    );
  });
};
```

#### 檔案上傳組件

```jsx
// src/components/FileUploader.jsx

import { useState } from 'react';
import { Upload, X, FileIcon } from 'lucide-react';
import { uploadFile } from '../firebase';

const FileUploader = ({ field, onChange }) => {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // 檔案大小限制 (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('檔案大小不可超過 5MB');
      return;
    }

    setUploading(true);
    try {
      const path = `uploads/${Date.now()}_${file.name}`;
      const url = await uploadFile(file, path, setProgress);
      setFiles(prev => [...prev, { name: file.name, url }]);
      onChange?.(url);
    } catch (error) {
      console.error('上傳失敗:', error);
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  return (
    <div className="border-2 border-dashed rounded-lg p-6 text-center">
      <input
        type="file"
        onChange={handleUpload}
        className="hidden"
        id={field.id}
        accept={field.accept || 'image/*,.pdf'}
      />
      <label htmlFor={field.id} className="cursor-pointer">
        <Upload className="mx-auto mb-2 text-gray-400" size={32} />
        <p className="text-gray-500">點擊或拖曳檔案至此區域</p>
      </label>
      {uploading && (
        <div className="mt-4">
          <div className="bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-sm text-gray-500 mt-1">{Math.round(progress)}%</p>
        </div>
      )}
    </div>
  );
};
```

---

## 🟠 中優先級功能詳解

### 5. 拖曳編輯器實作建議

#### 推薦套件

| 套件 | 優點 | 缺點 |
|------|------|------|
| **@dnd-kit/core** | 現代化、效能好、無障礙支援 | 學習曲線較高 |
| react-beautiful-dnd | 動畫流暢、API 簡單 | 已停止維護 |
| react-sortable-hoc | 輕量、簡單 | 功能較少 |

**推薦使用**：`@dnd-kit/core` + `@dnd-kit/sortable`

#### 安裝與基礎設定

```bash
npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
```

```jsx
// src/components/DraggableField.jsx

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';

const DraggableField = ({ field, children }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: field.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="flex items-center gap-2">
      <button
        {...attributes}
        {...listeners}
        className="p-2 cursor-grab active:cursor-grabbing"
      >
        <GripVertical size={16} className="text-gray-400" />
      </button>
      {children}
    </div>
  );
};
```

---

### 6. 數據分析圖表

#### 推薦套件

| 套件 | 適用場景 | 大小 |
|------|----------|------|
| **recharts** | React 原生、聲明式 | ~50KB |
| chart.js | 多種圖表、彈性高 | ~70KB |
| visx | D3 封裝、高度客製 | 按需載入 |

**推薦使用**：`recharts` (React 友好，學習曲線低)

#### 安裝與範例

```bash
npm install recharts
```

```jsx
// src/components/SubmissionChart.jsx

import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';

// 每日填寫趨勢
const TrendChart = ({ data }) => (
  <ResponsiveContainer width="100%" height={300}>
    <LineChart data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="date" />
      <YAxis />
      <Tooltip />
      <Line type="monotone" dataKey="count" stroke="#3B82F6" strokeWidth={2} />
    </LineChart>
  </ResponsiveContainer>
);

// 選項分佈圓餅圖
const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

const DistributionChart = ({ data }) => (
  <ResponsiveContainer width="100%" height={300}>
    <PieChart>
      <Pie
        data={data}
        dataKey="value"
        nameKey="name"
        cx="50%"
        cy="50%"
        outerRadius={100}
        label
      >
        {data.map((_, index) => (
          <Cell key={index} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip />
    </PieChart>
  </ResponsiveContainer>
);
```

---

## 🟢 低優先級功能詳解

### 7. 多語系 (i18n) 實作

#### 安裝套件

```bash
npm install react-i18next i18next
```

#### 設定檔

```javascript
// src/i18n/index.js

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import zhTW from './locales/zh-TW.json';
import en from './locales/en.json';

i18n.use(initReactI18next).init({
  resources: {
    'zh-TW': { translation: zhTW },
    'en': { translation: en }
  },
  lng: 'zh-TW',
  fallbackLng: 'zh-TW',
  interpolation: { escapeValue: false }
});

export default i18n;
```

```json
// src/i18n/locales/zh-TW.json
{
  "nav": {
    "home": "首頁",
    "admin": "管理後台",
    "logout": "登出"
  },
  "form": {
    "submit": "確認送出",
    "required": "此欄位為必填",
    "success": "表單已成功送出！"
  }
}
```

#### 使用方式

```jsx
import { useTranslation } from 'react-i18next';

const FormPage = () => {
  const { t, i18n } = useTranslation();

  return (
    <div>
      <button onClick={() => i18n.changeLanguage('en')}>
        English
      </button>
      <button>{t('form.submit')}</button>
    </div>
  );
};
```

---

### 8. reCAPTCHA 整合

#### 安裝套件

```bash
npm install react-google-recaptcha-v3
```

#### 設定

```jsx
// src/main.jsx
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';

ReactDOM.createRoot(document.getElementById('root')).render(
  <GoogleReCaptchaProvider reCaptchaKey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}>
    <App />
  </GoogleReCaptchaProvider>
);
```

```jsx
// 在表單提交時驗證
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';

const PublicForm = () => {
  const { executeRecaptcha } = useGoogleReCaptcha();

  const handleSubmit = async (formData) => {
    const token = await executeRecaptcha('submit_form');
    // 將 token 送至後端驗證
    await submitForm({ ...formData, recaptchaToken: token });
  };
};
```

---

## 🛠️ 技術債處理建議

### 單元測試 (Vitest)

```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom
```

```javascript
// vitest.config.js
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.js'
  }
});
```

```jsx
// src/components/__tests__/FormRenderer.test.jsx
import { render, screen } from '@testing-library/react';
import FormRenderer from '../FormRenderer';

describe('FormRenderer', () => {
  it('renders form fields', () => {
    const template = {
      sections: [
        { fields: [{ id: '1', label: '姓名', type: 'text' }] }
      ]
    };
    render(<FormRenderer template={template} />);
    expect(screen.getByLabelText('姓名')).toBeInTheDocument();
  });
});
```

---

## 📌 實作優先級建議

根據**投入產出比 (ROI)** 排序：

1. ⭐⭐⭐⭐⭐ **更多欄位類型** — 低成本、高價值
2. ⭐⭐⭐⭐ **自動儲存** — 大幅提升使用者體驗
3. ⭐⭐⭐⭐ **檔案上傳** — 擴展表單應用場景
4. ⭐⭐⭐ **分頁式表單** — 長表單必備
5. ⭐⭐⭐ **數據分析** — 提升管理價值
6. ⭐⭐ **拖曳編輯器** — 成本較高但直觀
7. ⭐⭐⭐⭐⭐ **電子簽名** — 同意書系統核心需求
8. ⭐⭐⭐⭐ **PDF 自動生成** — 正式存檔必備
9. ⭐⭐⭐ **條件邏輯** — 提升表單動態性

---

## 🚀 2026 新增進階建議

### 11. 電子簽名 (E-Signature) 組件
#### 設計概念
- 使用 `react-signature-canvas` 實現手寫簽名。
- 簽名結果以 Base64 或圖片上傳至 Firebase Storage。
- 支援行動裝置觸控操作。

### 12. PDF 自動生成 (PDF Generation)
#### 設計概念
- 使用 `jspdf` 或 `react-pdf` 在前端生成 PDF。
- 或是使用 Firebase Functions 搭配 `puppeteer` 在後端生成。
- 包含浮水印與填寫時間戳記。

### 13. 條件邏輯 (Conditional Logic)
#### 設計概念
- 欄位定義新增 `visibilityRule` 屬性。
- 例如：`{ "field": "q1", "op": "==", "value": "yes" }`。
- `FormRenderer` 根據規則動態過濾顯示的欄位。

### 14. QR Code 整合
#### 設計概念
- 使用 `qrcode.react` 自動生成表單連結 QR Code。
- 提供「下載 QR Code」功能供管理員列印。

---

> 💡 本文件持續更新中，歡迎隨時補充需求或調整優先順序。
