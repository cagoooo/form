# Form System (React + Firebase)

🌐 **線上使用：[動態表單自動回報系統](https://cagoooo.github.io/form/)**

> 📌 **目前版本：v1.2.4**（依據 `package.json`）

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
- **v1.2.4** (2026-01-29): ✅UI 視覺大升級 (繽紛色彩風格) ✅拖曳式表單編輯器 ✅數據分析儀表板 ✅表單模板庫
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

---

<!-- BEGIN:PROJECT_GUIDE -->
## 專案導覽

表單填寫即時通知系統

- 專案定位：校務／行政流程數位化專案
- Repository：`cagoooo/form`
- 可見性：公開
- 主要技術：JavaScript、React、Vite、Firebase、Tailwind CSS
- 線上入口：<https://cagoooo.github.io/form/>

### 可以怎麼應用

- 把紙本、試算表或人工通知流程轉成可追蹤的線上作業
- 依不同學校的欄位、角色與簽核方式進行客製化
- 作為校務系統、資料同步或自動通知整合的參考實作

這些是依目前專案定位整理的延伸方向，不代表所有情境都已內建完成；實作前請先確認現有功能與資料格式。

### 技術與專案結構

- `README.md`
- `firebase.json`
- `index.html`
- `package.json`
- `public`
- `src`
- `vite.config.js`

檔案結構會隨版本演進；若本節與程式碼不一致，以目前預設分支的原始碼為準。

### 本機執行

```bash
npm install
# dev
npm run dev
# build
npm run build
# lint
npm run lint
```
請以 `package.json` 的 `scripts` 為準；若專案需要雲端服務，請先建立自己的環境變數與測試專案。

### 給 AI Agent 的接手指南

1. 先閱讀本 README、`AGENTS.md`（若有）、套件腳本與部署設定。
2. 先畫出角色、資料流、權限與外部服務，再修改表單或資料結構。
3. 不得提交學生個資、憑證、API 金鑰或正式環境匯出資料。
4. 涉及 schema、驗證、權限或通知時，同步檢查前後端與部署設定。
5. 不要捏造尚未存在的功能；README 與實作有落差時，應同時更新文件。
6. 提交前只納入本次任務檔案，並記錄實際執行過的驗證。

### 安全與資料注意事項

- 不要提交 `.env`、服務帳號、API 金鑰、token、學生個資或正式環境匯出資料。
- 使用 Firebase、Supabase、Google API 或其他雲端服務時，請建立自己的測試專案並套用最小權限。
- 若要公開衍生作品，請先確認程式碼、圖片、音訊、字型與教材內容的授權。

### 貢獻與客製化

歡迎依教學現場、活動或工作流程需求進行 fork／客製化。建議在變更說明中交代使用情境、主要修改、測試方式，以及是否影響資料格式或部署設定。
<!-- END:PROJECT_GUIDE -->
