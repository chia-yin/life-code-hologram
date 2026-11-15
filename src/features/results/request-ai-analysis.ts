import type { HologramResult } from '../../lib/hologram'
import { AI_SYSTEM_PROMPT, buildAiPrompt, type PromptFocus } from './ai-prompt'

export function getAiApiUrl() {
  const configured = import.meta.env.VITE_AI_API_URL
  if (typeof configured === 'string' && configured.trim()) {
    return configured.trim().replace(/\/$/, '')
  }
  return '/api/analyze'
}

export async function requestAiAnalysis(result: HologramResult, focus: PromptFocus) {
  const response = await fetch(getAiApiUrl(), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      prompt: buildAiPrompt(result, focus),
      system: AI_SYSTEM_PROMPT,
    }),
  })

  const payload = (await response.json().catch(() => null)) as
    | { analysis?: string; error?: string }
    | null

  if (!response.ok) {
    throw new Error(payload?.error || 'AI 解析暫時無法使用，請稍後再試。')
  }

  if (!payload?.analysis?.trim()) {
    throw new Error('AI 沒有回傳可用內容，請再試一次。')
  }

  return payload.analysis.trim()
}
