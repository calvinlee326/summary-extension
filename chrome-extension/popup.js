// 當 popup 載入時，自動帶入右鍵選取文字（如果有）
document.addEventListener("DOMContentLoaded", async () => {
  const { selectedText } = await chrome.storage.local.get(["selectedText"]);

  if (selectedText) {
    document.getElementById("inputText").value = selectedText;
    chrome.storage.local.remove(["selectedText"]);
    document.getElementById("summarizeBtn").click();
  }
});

// 點擊 Summarize 按鈕時呼叫後端 API
document.getElementById("summarizeBtn").addEventListener("click", async () => {
  const text = document.getElementById("inputText").value.trim();
  const summaryBox = document.getElementById("summary");

  if (!text) {
    summaryBox.innerText = "Please enter some text to summarize.";
    return;
  }

  summaryBox.innerText = "Summarizing...";

  try {
    const summary = await summarizeWithBackend(text);
    summaryBox.innerText = summary;
  } catch (err) {
    summaryBox.innerText = "Error: " + err.message;
  }
});

// 改為呼叫你自己的 FastAPI 後端
async function summarizeWithBackend(text) {
  const endpoint = "http://127.0.0.1:8000/summarize"; // 開發中用本機，部署後改成你雲端網址
  const token = "demo123";  // 對應你後端白名單 token

  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      token,
      text
    })
  });

  const data = await res.json();

  if (!res.ok) throw new Error(data.detail || "Server error");
  return data.summary;
}
