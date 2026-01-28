# Form System (React + Firebase)

這是一個基於 React 與 Firebase 的動態表單系統，旨在取代舊有的 Google Apps Script 表單。

## ✨ 功能特色
- **🎨 現代化 UI/UX**: 採用 Glassmorphism (毛玻璃) 設計與動態流體背景。
- **📱 響應式設計**: 完美支援手機、平板與桌面裝置。
- **🔒 安全性**: 敏感設定 (API Key) 已移至環境變數，並支援管理員登入驗證。
- **📝 動態表單**: 透過後台視覺化編輯器，輕鬆建立各類表單。
- **多主題支援**: 內建藍、綠、粉三種主題色。
- **即時通知**: 支援 Google Chat Webhook 通知。
- **資料匯出**: 支援 CSV 匯出功能。

## 🛠️ 技術堆疊
- **Frontend**: React, Vite, Tailwind CSS
- **Backend**: Firebase (Firestore, Authentication)
- **Icons**: Lucide React

## 🚀 安裝與執行

### 1. 安裝依賴
```bash
npm install
```

### 2. 開發模式
```bash
npm run dev
```

### 3. 建置生產版本
```bash
npm run build
```

## 📦 部署 (Firebase Hosting)

1. 安裝 Firebase CLI:
```bash
npm install -g firebase-tools
```

2. 登入:
```bash
firebase login
```

3. 初始化 (若尚未設定):
```bash
firebase init hosting
```

4. 部署:
```bash
firebase deploy
```

## 🔐 管理員登入
- 預設路徑: `/admin`
- 預設密碼: `smes1234`
