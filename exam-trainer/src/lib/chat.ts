// Typed client for the rag-service backend, reached via the Vite `/api` proxy.
// See rag-service/API_CONTRACT.md for the source of truth.

export interface Wiki {
  id: string;
  name: string;
  description: string;
  count: number;
}

export interface Citation {
  n: number;
  wiki: string;
  doc_id: string;
  source: string;
  title: string;
  heading: string;
  snippet: string;
  score: number;
}

export type ConfidenceLabel = 'Low' | 'Medium' | 'High';

export interface Confidence {
  score: number;
  label: ConfidenceLabel;
  rationale: string;
}

export interface Usage {
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
  cost_usd: number;
}

export interface FinalPayload {
  answer: string;
  citations: Citation[];
  confidence: Confidence;
  usage: Usage;
  model: string;
  trace_url: string | null;
  session_id: string;
}

export interface ChatHistoryMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface SourceDocument {
  wiki: string;
  doc_id: string;
  source: string;
  title: string;
  heading: string;
  markdown: string;
  path: string;
}

export interface StreamChatArgs {
  wiki: string;
  message: string;
  history: ChatHistoryMessage[];
  sessionId: string;
}

// Extract the `message` field from a backend error body, falling back to status text.
async function errorMessage(res: Response): Promise<string> {
  try {
    const body = await res.json();
    if (body && typeof body.message === 'string') return body.message;
  } catch {
    /* not JSON — fall through */
  }
  return `Request failed (${res.status} ${res.statusText}).`;
}

// GET /api/wikis — list the available knowledge bases.
export async function listWikis(): Promise<Wiki[]> {
  const res = await fetch('/api/wikis', { headers: { accept: 'application/json' } });
  if (!res.ok) throw new Error(await errorMessage(res));
  return res.json();
}

// GET /api/source/{wiki}/{doc_id} — full markdown of a cited chunk for the reference drawer.
export async function fetchSource(wiki: string, docId: string): Promise<SourceDocument> {
  const res = await fetch(
    `/api/source/${encodeURIComponent(wiki)}/${encodeURIComponent(docId)}`,
    { headers: { accept: 'application/json' } },
  );
  if (!res.ok) throw new Error(await errorMessage(res));
  return res.json();
}

// POST /api/chat with SSE streaming. EventSource cannot POST, so we read the
// ReadableStream body directly and parse `event:` / `data:` lines by hand.
export async function streamChat(
  args: StreamChatArgs,
  onToken: (delta: string) => void,
  onDone: (payload: FinalPayload) => void,
  onError: (message: string) => void,
  signal?: AbortSignal,
): Promise<void> {
  let res: Response;
  try {
    res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'content-type': 'application/json', accept: 'text/event-stream' },
      signal,
      body: JSON.stringify({
        wiki: args.wiki,
        message: args.message,
        history: args.history,
        session_id: args.sessionId,
        stream: true,
      }),
    });
  } catch (e) {
    if (signal?.aborted) return;
    onError(e instanceof Error ? e.message : String(e));
    return;
  }

  if (!res.ok || !res.body) {
    onError(await errorMessage(res));
    return;
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  // Dispatch one SSE event block (`event:` + `data:` lines).
  function dispatch(rawEvent: string) {
    let event = 'message';
    const dataLines: string[] = [];
    for (const line of rawEvent.split('\n')) {
      if (line.startsWith('event:')) event = line.slice(6).trim();
      else if (line.startsWith('data:')) dataLines.push(line.slice(5).replace(/^ /, ''));
    }
    if (dataLines.length === 0) return;
    const data = dataLines.join('\n');
    if (event === 'token') {
      try {
        const parsed = JSON.parse(data) as { delta?: string };
        if (parsed.delta) onToken(parsed.delta);
      } catch {
        /* ignore malformed token frame */
      }
    } else if (event === 'done') {
      try {
        onDone(JSON.parse(data) as FinalPayload);
      } catch {
        onError('Malformed final payload from server.');
      }
    } else if (event === 'error') {
      try {
        const parsed = JSON.parse(data) as { message?: string };
        onError(parsed.message || 'Streaming error.');
      } catch {
        onError('Streaming error.');
      }
    }
  }

  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      // SSE events are separated by a blank line.
      let sep: number;
      while ((sep = buffer.indexOf('\n\n')) !== -1) {
        const rawEvent = buffer.slice(0, sep);
        buffer = buffer.slice(sep + 2);
        if (rawEvent.trim()) dispatch(rawEvent);
      }
    }
    if (buffer.trim()) dispatch(buffer);
  } catch (e) {
    if (signal?.aborted) return;
    onError(e instanceof Error ? e.message : String(e));
  }
}
