// === create right click menu ===
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "summarize-selection",
    title: "Summarize Selection",
    contexts: ["selection"]
  });
});

// === handle right click ===
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "summarize-selection" && info.selectionText) {
    chrome.storage.local.set({ selectedText: info.selectionText }, () => {
      chrome.action.openPopup?.();  // try to open popup (not guaranteed to work)
    });
  }
});

// === handle shortcut (e.g. Ctrl+Shift+Y) ===
chrome.commands.onCommand.addListener((command) => {
  if (command === "summarize-selection") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        func: () => window.getSelection().toString()
      }, (results) => {
        const selectedText = results?.[0]?.result;
        if (selectedText) {
          chrome.storage.local.set({ selectedText }, () => {
            chrome.action.openPopup?.();  // trigger popup to automatically load selected content
          });
        }
      });
    });
  }
});
