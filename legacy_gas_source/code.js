/**
 * 建立網頁介面
 */
function doGet() {
  return HtmlService.createHtmlOutputFromFile('index')
      .setTitle('班級榮譽榜調查表');
}

/**
 * 處理 POST 請求
 */
function doPost(e) {
  var lock = LockService.getScriptLock();
  
  try {
    // 等待鎖定，避免多人同時寫入衝突
    lock.waitLock(10000); 
    
    var formObject = JSON.parse(e.postData.contents);
    
    // 處理資料 (寫入試算表 + 發送通知)
    var result = processData(formObject);
    
    return ContentService.createTextOutput(JSON.stringify({
      status: "success", 
      message: result
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    // 記錄錯誤到執行日誌，方便除錯
    console.error("doPost 發生錯誤: " + error.toString());
    
    return ContentService.createTextOutput(JSON.stringify({
      status: "error", 
      message: "系統發生錯誤: " + error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
    
  } finally {
    lock.releaseLock();
  }
}

/**
 * 處理資料寫入邏輯
 */
function processData(formObject) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheetName = "回應資料";
  var sheet = ss.getSheetByName(sheetName);
  
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
  }

  // 建立標題列
  if (sheet.getLastRow() === 0) {
    var header = [
      "填寫時間", "班級", 
      "學期成績優異-1", "學期成績優異-2", "學期成績優異-3", "學期成績優異-4", "學期成績優異-5", 
      "成績優異備用-1", "成績優異備用-2", "成績優異備用-3",
      "進步獎-1", "進步獎-2", "進步獎-3",
      "進步獎備用-1", "進步獎備用-2"
    ];
    sheet.appendRow(header);
    sheet.setFrozenRows(1);
  }

  var timestamp = Utilities.formatDate(new Date(), "GMT+8", "yyyy/MM/dd HH:mm:ss");

  // 寫入 Google Sheet
  var rowData = [
    timestamp,
    "'" + formObject.className,
    formObject.top_1, formObject.top_2, formObject.top_3, formObject.top_4, formObject.top_5,
    formObject.top_backup_1, formObject.top_backup_2, formObject.top_backup_3,
    formObject.imp_1, formObject.imp_2, formObject.imp_3,
    formObject.imp_backup_1, formObject.imp_backup_2
  ];
  sheet.appendRow(rowData);
  
  // *** 新增功能：發送 Google Chat 通知 ***
  // 加入 console.log 以便在執行項目中追蹤
  console.log("準備發送 Chat 通知...");
  sendChatNotification(formObject, timestamp);
  
  // 修改回傳訊息，讓前端使用者知道通知已發送
  return "資料已成功送出！(已發送通知)";
}

/**
 * 發送 Google Chat Webhook 通知
 */
function sendChatNotification(data, timeStr) {
  // 您的 Webhook URL
  var webhookUrl = "https://chat.googleapis.com/v1/spaces/AAQAhXGIgeQ/messages?key=AIzaSyDdI0hCZtE6vySjMm-WEfRq3CPzqKqqsHI&token=Z3bseV0ZKWq6aesxS_KcmnEoiY20MxoqFXCd9nev3Bw";

  // 整理名單 (過濾掉空值，用逗號連接)
  var topList = [data.top_1, data.top_2, data.top_3, data.top_4, data.top_5].filter(function(n){ return n && n.trim() !== "" }).join("、");
  var impList = [data.imp_1, data.imp_2, data.imp_3].filter(function(n){ return n && n.trim() !== "" }).join("、");

  // 建立訊息內容
  var payload = {
    "text": "📢 *班級榮譽榜 - 新提交通知*\n" +
            "────────────────\n" +
            "🏫 *班級：* " + data.className + "\n" +
            "🏆 *優異：* " + (topList || "無") + "\n" +
            "📈 *進步：* " + (impList || "無") + "\n" +
            "────────────────\n" +
            "⏰ " + timeStr
  };

  var options = {
    "method": "post",
    "contentType": "application/json",
    "payload": JSON.stringify(payload),
    "muteHttpExceptions": true
  };

  try {
    var response = UrlFetchApp.fetch(webhookUrl, options);
    console.log("Chat 通知回應代碼: " + response.getResponseCode());
  } catch(e) {
    console.error("Google Chat 通知發送失敗: " + e.toString());
  }
}