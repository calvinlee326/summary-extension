// 建立右鍵選單
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "summarize-selection",
    title: "Summarize Selection",
    contexts: ["selection"]
  });
});

// 當使用者點選右鍵選單時
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "summarize-selection" && info.selectionText) {
    // 將選取文字儲存到 local storage
    chrome.storage.local.set({ selectedText: info.selectionText }, () => {
      // 嘗試開啟 popup（注意：Chrome 限制，有時無法從背景直接觸發）
      chrome.action.openPopup?.();  // 非必要，讓 popup.js 可偵測
    });
  }
});
