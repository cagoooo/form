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

## 📅 版本紀錄
- **v1.2.2** (2026-01-28): ✅CI/CD 自動化部署 (GitHub Actions) ✅PWA 支援 (可安裝至桌面)
- **v1.2.1** (2026-01-28): ✅修復登入密碼驗證錯誤 ✅修正 404 資源遺失問題 ✅強化 API Key 安全性
- **v1.2.0**: 新增管理員儀表板與權限管理功能。

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

## 🔐 權限管理
- **Admin**: 擁有完整權限，可管理所有表單與使用者。
- **Editor**: 僅能管理自己建立的表單。
- **安全性**: 支援環境變數設定管理員憑證，避免敏感資訊外洩。

## 👥 使用者管理
- 支援查看所有使用者列表。
- 管理員可手動刪除無效或重複的使用者紀錄。

