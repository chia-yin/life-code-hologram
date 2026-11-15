export interface Env {
  OPENAI_API_KEY: string
}

const SYSTEM_FALLBACK =
  '你是溫和、具體且不宿命論的生命密碼解析顧問。一律使用繁體中文，語氣專業但不說教，避免空泛套話與宿命斷言。'

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

function json(status: number, body: unknown) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      ...CORS_HEADERS,
    },
  })
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: CORS_HEADERS })
    }

    if (request.method !== 'POST') {
      return json(405, { error: '只接受 POST' })
    }

    if (!env.OPENAI_API_KEY) {
      return json(500, { error: '伺服器尚未設定 OPENAI_API_KEY' })
    }

    try {
      const body = (await request.json()) as { prompt?: string; system?: string }
      const prompt = body.prompt?.trim()
      if (!prompt) {
        return json(400, { error: '缺少解析內容' })
      }

      const upstream = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${env.OPENAI_API_KEY}`,
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
        return json(upstream.status, {
          error: payload.error?.message || 'OpenAI 請求失敗',
        })
      }

      const analysis = payload.choices?.[0]?.message?.content?.trim()
      if (!analysis) {
        return json(502, { error: 'OpenAI 沒有回傳內容' })
      }

      return json(200, { analysis })
    } catch {
      return json(500, { error: 'AI 代理發生錯誤' })
    }
  },
}
