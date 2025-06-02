from fastapi import FastAPI, HTTPException
from dotenv import load_dotenv
from pydantic import BaseModel
from openai import OpenAI
from collections import defaultdict
import time
import os

# 初始化
load_dotenv()
app = FastAPI()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# 驗證白名單 token
VALID_TOKENS = {"demo123": "free-tier-user"}

# 限流參數
MAX_DAILY_REQUESTS = 20
TTL_SECONDS = 86400

# In-memory request log（token -> [timestamp1, timestamp2, ...]）
request_log = defaultdict(list)

# 資料模型
class TextRequest(BaseModel):
    token: str
    text: str

# API 路由
@app.post("/summarize")
async def summarize(req: TextRequest):
    token = req.token.strip()

    # 驗證 token
    if token not in VALID_TOKENS:
        raise HTTPException(status_code=401, detail="Invalid token.")

    # 限流檢查
    now = time.time()
    timestamps = request_log[token]
    # 移除過期記錄
    request_log[token] = [ts for ts in timestamps if now - ts < TTL_SECONDS]

    if len(request_log[token]) >= MAX_DAILY_REQUESTS:
        raise HTTPException(status_code=429, detail="Daily quota exceeded.")

    request_log[token].append(now)

    # 呼叫 OpenAI GPT
    try:
        response = client.chat.completions.create(
            model="gpt-4.1",
            messages=[
                {
                    "role": "system",
                    "content": "You are a professional assistant that summarizes long text into concise English bullet points. Use - at the beginning of each bullet. Limit the output to 4-6 bullets. Each bullet should be under 20 words."
                },
                {"role": "user", "content": req.text}
            ]
        )
        summary = response.choices[0].message.content.strip()
        return {"summary": summary}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
