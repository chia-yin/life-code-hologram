import type { IncomingMessage, ServerResponse } from 'node:http'
import { loadEnv, type Plugin } from 'vite'

const SYSTEM_FALLBACK =
  '你是溫和、具體且不宿命論的生命密碼解析顧問。一律使用繁體中文，語氣專業但不說教，避免空泛套話與宿命斷言。'

type AnalyzeBody = {
  prompt?: string
  system?: string
}

async function readJsonBody(req: IncomingMessage) {
  const chunks: Buffer[] = []
  for await (const chunk of req) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk))
  }
  const raw = Buffer.concat(chunks).toString('utf8')
  if (!raw.trim()) return {} as AnalyzeBody
  return JSON.parse(raw) as AnalyzeBody
}

function sendJson(res: ServerResponse, status: number, body: unknown) {
  res.statusCode = status
  res.setHeader('Content-Type', 'application/json; charset=utf-8')
  res.end(JSON.stringify(body))
}

async function handleAnalyze(
  req: IncomingMessage,
  res: ServerResponse,
  apiKey: string | undefined,
) {
  if (req.method === 'OPTIONS') {
    res.statusCode = 204
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
    res.end()
    return
  }

  if (req.method !== 'POST') {
    sendJson(res, 405, { error: '只接受 POST' })
    return
  }

  if (!apiKey) {
    sendJson(res, 500, { error: '伺服器尚未設定 OPENAI_API_KEY' })
    return
  }

  try {
    const body = await readJsonBody(req)
    const prompt = body.prompt?.trim()
    if (!prompt) {
      sendJson(res, 400, { error: '缺少解析內容' })
      return
    }

    const upstream = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        temperature: 0.7,
        messages: [
          { role: 'system', content: body.system?.trim() || SYSTEM_FALLBACK },
          { role: 'user', content: prompt },
        ],
      }),
    })

    const payload = (await upstream.json()) as {
      error?: { message?: string }
      choices?: Array<{ message?: { content?: string } }>
    }

    if (!upstream.ok) {
      sendJson(res, upstream.status, {
        error: payload.error?.message || 'OpenAI 請求失敗',
      })
      return
    }

    const analysis = payload.choices?.[0]?.message?.content?.trim()
    if (!analysis) {
      sendJson(res, 502, { error: 'OpenAI 沒有回傳內容' })
      return
    }

    sendJson(res, 200, { analysis })
  } catch {
    sendJson(res, 500, { error: 'AI 代理發生錯誤' })
  }
}

export function aiProxyPlugin(): Plugin {
  return {
    name: 'ai-proxy',
    configureServer(server) {
      const env = loadEnv(server.config.mode, server.config.root, '')
      server.middlewares.use('/api/analyze', (req, res) => {
        void handleAnalyze(req, res, env.OPENAI_API_KEY)
      })
    },
    configurePreviewServer(server) {
      const env = loadEnv(server.config.mode, server.config.root, '')
      server.middlewares.use('/api/analyze', (req, res) => {
        void handleAnalyze(req, res, env.OPENAI_API_KEY)
      })
    },
  }
}
