document.addEventListener("DOMContentLoaded", async () => {
  const { selectedText } = await chrome.storage.local.get(["selectedText"]);
  if (selectedText) {
    document.getElementById("inputText").value = selectedText;
    chrome.storage.local.remove(["selectedText"]);
    document.getElementById("summarizeBtn").click();
  }
});

document.getElementById("summarizeBtn").addEventListener("click", async () => {
  const text = document.getElementById("inputText").value.trim();
  const summaryBox = document.getElementById("summary");

  summaryBox.classList.remove("error", "visible");
  summaryBox.innerHTML = "";

  if (!text) {
    summaryBox.classList.add("error", "visible");
    summaryBox.textContent = "Please enter some text to summarize.";
    return;
  }

  // 顯示 loading spinner
  summaryBox.style.display = "block";
  summaryBox.innerHTML = '<div class="spinner"></div>';

  try {
    const summary = await summarizeWithBackend(text);
    summaryBox.classList.remove("error");
    summaryBox.innerHTML = summary.replace(/\n/g, "<br>");
    summaryBox.classList.add("visible");
  } catch (err) {
    summaryBox.classList.add("error", "visible");
    summaryBox.textContent = "Error: " + err.message;
  }
});

async function summarizeWithBackend(text) {
  // const endpoint = "http://127.0.0.1:8000/summarize"; //testing use local backend
  const endpoint = "https://summary-api.fly.dev/summarize";

  const token = "demo123";

  const res = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token, text })
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || "Server error");

  return data.summary;
}
