# 🚀 專案進度與未來規劃 (Project Roadmap)

## ✅ 已完成進度 (Completed)

### v1.2.1 (2026-01-28)
- **登入修復**: 修正本地密碼驗證邏輯，改為直接串接 Firebase Auth，解決「密碼錯誤」問題。
- **路徑修正**: 修正 `index.html` 圖示路徑為相對路徑 (`./vite.svg`)，解決 GitHub Pages 404 問題。
- **安全性**: 
    - 限制 Google Cloud API Key 網域 (localhost, github.io, firebaseapp)。
    - 更新 `GEMINI.md` 開發規範，強化資安意識。
- **部署**: 手動部署最新版本至 GitHub Pages。

### v1.2.0
- **管理員儀表板**: 新增人員權限管理介面。
- **權限系統**: 實作 Admin/Editor 角色區分。

---

## 🛠️ 短期優化建議 (Short-term Goals)

### 1. 自動化部署 (CI/CD)
- **目標**: 解決「Git Push 後網站未更新」的問題。
- **作法**: 建立 GitHub Actions Workflow。
- **效益**: 每次 Push 到 main 分支時，自動執行 `npm run build` 並部署到 `gh-pages`，減少人工失誤。

### 2. PWA 漸進式網頁應用 (Progressive Web App)
- **目標**: 讓網站可以像 App 一樣安裝在手機/電腦上。
- **作法**: 設定 `manifest.json` 與 Service Worker (使用 `vite-plugin-pwa`)。
- **效益**: 支援離線瀏覽、桌面圖示、全螢幕體驗。

### 3. 表單填寫體驗優化
- **目標**: 提升使用者填寫效率。
- **作法**:
    - **自動儲存 (Auto-save)**: 防止誤觸關閉導致資料遺失。
    - **分頁式表單 (Multi-step Form)**: 將長表單拆分為多個步驟，降低填寫壓力。

---

## 🔮 長期規劃建議 (Long-term Roadmap)

### 1. 視覺化表單編輯器 (Drag & Drop Builder)
- **目標**: 讓管理員能用拖拉方式建立表單，無需寫程式。
- **功能**: 支援文字框、選單、日期、檔案上傳等元件拖曳排序。

### 2. 數據分析儀表板 (Analytics Dashboard)
- **目標**: 提供表單填寫數據的視覺化分析。
- **功能**: 每日填寫量趨勢圖、選項分佈圓餅圖、匯出 Excel/PDF 報表。

### 3. 進階通知系統
- **目標**: 多管道即時通知。
- **功能**: 整合 Line Notify、Slack 或 Email (SendGrid) 通知，不侷限於 Google Chat。

### 4. 多語系支援 (i18n)
- **目標**: 支援繁體中文、英文切換。
- **作法**: 使用 `react-i18next` 管理語系檔。
