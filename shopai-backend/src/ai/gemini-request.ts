import {ApiError} from '@google/genai';
import {SYSTEM_PROMPT} from './ai-prompt';
import {setTimeout as delay} from 'node:timers/promises';

function isTemporaryFailure(error: unknown): boolean {
 if (error instanceof ApiError) return [500, 502, 503, 504].includes(error.status);
 // Node fetch can fail before an HTTP response exists (connection reset/timeout).
 // Do not retry arbitrary TypeErrors, which may indicate a programming error.
 if (!(error instanceof TypeError) || error.message !== 'fetch failed') return false;
 const code = (error.cause as {code?: string} | undefined)?.code;
 return ['ECONNRESET', 'ETIMEDOUT', 'EAI_AGAIN', 'UND_ERR_CONNECT_TIMEOUT', 'UND_ERR_SOCKET'].includes(code ?? '');
}

// Retry one temporary upstream failure; preserve the original error/status.
export async function withGeminiRetry<T>(request: () => Promise<T>, deadline = Infinity): Promise<T> {
 for (let attempt = 0; ; attempt++) {
  try {return await request();}
  catch (error) {
   if (attempt >= 1 || !isTemporaryFailure(error) || Date.now() + 500 >= deadline) throw error;
   await delay(500);
  }
 }
}

type ChatTurn = {role: 'user' | 'model'; text: string};
type InteractionInput = {apiKey: string; model: string; message: string; history: ChatTurn[]; deadline: number; systemInstruction?: string};

// REST v1 keeps the integration compatible with the stable Interactions API.
// Stateless history avoids storing conversations on Google's server.
export async function requestGeminiInteraction(input: InteractionInput, fetcher: typeof fetch = fetch): Promise<string> {
 const response = await fetcher('https://generativelanguage.googleapis.com/v1/interactions', {
  method: 'POST',
  headers: {'Content-Type': 'application/json', 'x-goog-api-key': input.apiKey},
  signal: AbortSignal.timeout(Math.max(1, input.deadline - Date.now())),
  body: JSON.stringify({
   model: input.model,
   store: false,
   system_instruction: input.systemInstruction ?? SYSTEM_PROMPT,
   input: [...input.history, {role: 'user', text: input.message}].map(turn => ({
    type: turn.role === 'user' ? 'user_input' : 'model_output',
    content: [{type: 'text', text: turn.text}],
   })),
   generation_config: {thinking_level: 'low', max_output_tokens: 1024},
  }),
 });
 const data = await response.json() as {
  status?: string;
  error?: {message?: string};
  steps?: {type?: string; content?: {type?: string; text?: string}[]}[];
 };
 if (!response.ok) throw new ApiError({status: response.status, message: data.error?.message ?? 'Gemini request failed'});
 const output = Array.isArray(data.steps) ? data.steps.filter(step => step.type === 'model_output').at(-1) : undefined;
 const text = Array.isArray(output?.content) ? output.content.filter(part => part.type === 'text' && typeof part.text === 'string').map(part => part.text).join('\n').trim() : '';
 if (data.status !== 'completed' || !text) throw new ApiError({status: 502, message: 'Gemini returned no completed text reply'});
 return text;
}
