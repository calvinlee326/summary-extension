# ✨ Summary Extension – Text Summarizer Chrome Extension (with OpenAI API)

A powerful Chrome Extension that allows users to **summarize selected or input text** using **GPT-based AI summarization** via a **secure backend API** deployed on [Fly.io](https://fly.io/).

- 🔍 Right-click selected text → Summarize
- 💬 Input text manually from popup
- 🛡️ Uses backend API (no API key exposed on frontend)
- 🚀 Built with FastAPI, deployed on Fly.io

---

## 🧰 Features

- ✅ Summarize any selected text on a webpage with one click
- ✅ Uses OpenAI GPT-4.0 API via a secure backend
- ✅ Clean UI with popup form
- ✅ Free-tier token authentication
- ✅ Rate-limiting (in-memory logic)
- ✅ Easy to deploy and extend

---

## 🔧 Tech Stack

| Frontend (Extension) | Backend API         | Deployment |
|----------------------|---------------------|------------|
| HTML + JS + Manifest | Python + FastAPI    | Fly.io     |
| Chrome Context Menus | OpenAI SDK (v1+)    |            |

---

## 📦 Installation

### 1. Clone the Repo

```bash
git clone https://github.com/calvinlee326/summary-extension.git
cd summary-extension
```

---

## 💻 Frontend – Chrome Extension

### 🔨 Load Locally in Chrome

1. Go to `chrome://extensions`
2. Enable **Developer Mode**
3. Click **"Load Unpacked"**
4. Select the root folder containing:

   ```
   ├── manifest.json
   ├── popup.html
   ├── popup.js
   ├── background.js
   ├── icons/*.png
   ```

> ✅ You will see the extension icon in your toolbar.

---

### 🚀 Usage

#### Option 1: Right-click to summarize

1. Select any text on a webpage
2. Right-click → `Summarize Selection`
3. Popup will auto-open and show a summarized version

#### Option 2: Manual text input

1. Click the extension icon
2. Paste any long text
3. Click **Summarize** → AI-generated summary appears

---

## 🧠 Backend – FastAPI Server (via Fly.io)

### 🔧 Environment Setup

#### 1. Python + Virtualenv

```bash
cd backend-api
python3 -m venv myenv
source myenv/bin/activate
pip install -r requirements.txt
```

#### 2. Environment variables (`.env`)

Create a `.env` file:

```env
OPENAI_API_KEY=sk-...your-real-key...
```

---

### ▶️ Run Locally

```bash
uvicorn main:app --reload
```

Test with:

```bash
curl -X POST http://127.0.0.1:8000/summarize \
  -H "Content-Type: application/json" \
  -d '{"token": "demo123", "text": "OpenAI builds ChatGPT."}'
```

---

### ☁️ Deployment (Fly.io)

#### 1. Install Fly CLI

```bash
brew install flyctl
fly auth login
```

#### 2. Deploy

```bash
cd backend-api
fly launch
# Accept prompts, set app name e.g., summary-api
fly deploy
```

Your API will be live at:

```
https://summary-api.fly.dev/summarize
```

> ✅ Make sure `.env` has been added with `fly secrets`:

```bash
fly secrets set OPENAI_API_KEY=your-key
```

---

## 📌 API Specification

**Endpoint:**

```
POST /summarize
```

**Request:**

```json
{
  "token": "demo123",
  "text": "Your long input text here..."
}
```

**Response:**

```json
{
  "summary": "- Bullet 1...\n- Bullet 2..."
}
```

---

## 🛡️ Security Notes

- API Key is **never exposed** in the Chrome Extension.
- Free-tier token is used for testing (`demo123`) — you can replace it with JWT or user login for production.
- In-memory rate limiting can be replaced by Redis or DB-based logic if needed.

---

## 📎 Roadmap

- [ ] User login and auth
- [ ] History of past summaries
- [ ] PDF or DOCX summarization
- [ ] Multi-language support

---

## 📜 License

MIT License © 2025 Calvin Lee