from fastapi import FastAPI, HTTPException
from dotenv import load_dotenv
from pydantic import BaseModel
import redis
import os

# ✅ 新版 openai SDK 寫法
from openai import OpenAI

# 初始化
load_dotenv()
app = FastAPI()

# 初始化 OpenAI client（新版 SDK）
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# Redis 預設本機（可改用雲端 Redis）
r = redis.Redis(host="localhost", port=6379, decode_responses=True)

# 驗證白名單 token
VALID_TOKENS = {"demo123": "free-tier-user"}

# 限流參數
MAX_DAILY_REQUESTS = 10
TTL_SECONDS = 86400

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
    redis_key = f"token:{token}:count"
    count = r.get(redis_key)
    count = int(count) if count else 0

    if count >= MAX_DAILY_REQUESTS:
        raise HTTPException(status_code=429, detail="Daily quota exceeded.")

    # 增加使用次數並設過期時間
    r.incr(redis_key)
    r.expire(redis_key, TTL_SECONDS)

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
