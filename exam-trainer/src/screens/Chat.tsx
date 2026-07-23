import { useEffect, useRef, useState } from 'react';
import { marked } from 'marked';
import {
  listWikis,
  streamChat,
  fetchSource,
  type Wiki,
  type Citation,
  type Confidence,
  type Usage,
  type ChatHistoryMessage,
  type SourceDocument,
} from '../lib/chat';

marked.setOptions({ gfm: true, breaks: false });

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  streaming?: boolean;
  citations?: Citation[];
  confidence?: Confidence;
  usage?: Usage;
  model?: string;
  traceUrl?: string | null;
  error?: string;
}

function newId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
  return `id-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

// Render assistant markdown, then turn inline citation markers [1], [2] into clickable chips.
function renderAnswer(md: string): string {
  const html = marked.parse(md) as string;
  return html.replace(/\[(\d+)\]/g, (_m, n) =>
    `<button type="button" class="cite-chip" data-cite="${n}">${n}</button>`);
}

export default function Chat({
  onHome,
  onViewInDocs,
}: {
  onHome: () => void;
  onViewInDocs: (source: string) => void;
}) {
  const [wikis, setWikis] = useState<Wiki[]>([]);
  const [wiki, setWiki] = useState('aif-c01');
  const [wikiError, setWikiError] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [drawer, setDrawer] = useState<{ wiki: string; citation: Citation } | null>(null);

  const sessionId = useRef(newId());
  const abortRef = useRef<AbortController | null>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Load the knowledge-base list once.
  useEffect(() => {
    let cancelled = false;
    listWikis()
      .then((w) => {
        if (cancelled) return;
        setWikis(w);
        if (w.length && !w.some((x) => x.id === wiki)) setWiki(w[0].id);
      })
      .catch((e) => {
        if (!cancelled) setWikiError(e instanceof Error ? e.message : String(e));
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keep the transcript scrolled to the newest content.
  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
  }, [messages]);

  useEffect(() => () => abortRef.current?.abort(), []);

  function send() {
    const text = input.trim();
    if (!text || sending) return;

    const history: ChatHistoryMessage[] = messages
      .filter((m) => !m.error && m.content)
      .map((m) => ({ role: m.role, content: m.content }));

    const userMsg: ChatMessage = { id: newId(), role: 'user', content: text };
    const assistantId = newId();
    const assistantMsg: ChatMessage = {
      id: assistantId,
      role: 'assistant',
      content: '',
      streaming: true,
    };
    setMessages((prev) => [...prev, userMsg, assistantMsg]);
    setInput('');
    setSending(true);

    const patch = (fields: Partial<ChatMessage>) =>
      setMessages((prev) => prev.map((m) => (m.id === assistantId ? { ...m, ...fields } : m)));

    const ac = new AbortController();
    abortRef.current = ac;

    streamChat(
      { wiki, message: text, history, sessionId: sessionId.current },
      (delta) => setMessages((prev) =>
        prev.map((m) => (m.id === assistantId ? { ...m, content: m.content + delta } : m))),
      (payload) => {
        sessionId.current = payload.session_id || sessionId.current;
        patch({
          content: payload.answer,
          streaming: false,
          citations: payload.citations,
          confidence: payload.confidence,
          usage: payload.usage,
          model: payload.model,
          traceUrl: payload.trace_url,
        });
        setSending(false);
      },
      (message) => {
        patch({ streaming: false, error: message });
        setSending(false);
      },
      ac.signal,
    );
  }

  function stop() {
    abortRef.current?.abort();
    setSending(false);
    setMessages((prev) =>
      prev.map((m) => (m.streaming ? { ...m, streaming: false, error: m.error ?? 'Stopped.' } : m)));
  }

  function onTranscriptClick(e: React.MouseEvent<HTMLDivElement>, msg: ChatMessage) {
    const target = (e.target as HTMLElement).closest('[data-cite]');
    if (!target) return;
    const n = Number(target.getAttribute('data-cite'));
    const citation = msg.citations?.find((c) => c.n === n);
    if (citation) setDrawer({ wiki, citation });
  }

  return (
    <div className="chat">
      <div className="card chat-head">
        <div>
          <h1 style={{ marginBottom: 2 }}>Ask AI</h1>
          <p className="muted small" style={{ margin: 0 }}>
            Ask questions about the knowledge base. Answers are grounded in the source material with
            citations you can open.
          </p>
        </div>
        <div className="grow" />
        <label className="small muted chat-kb">
          Knowledge base
          <select
            value={wiki}
            onChange={(e) => setWiki(e.target.value)}
            disabled={sending || wikis.length === 0}
          >
            {wikis.length === 0 && <option value={wiki}>{wiki}</option>}
            {wikis.map((w) => (
              <option key={w.id} value={w.id}>
                {w.name} ({w.count})
              </option>
            ))}
          </select>
        </label>
      </div>

      {wikiError && (
        <div className="card ai-explain-err small" style={{ margin: '0 0 16px' }}>
          &#9888;&#65039; Could not load knowledge bases: {wikiError}. Is the backend running?
        </div>
      )}

      <div className="chat-list" ref={listRef}>
        {messages.length === 0 && (
          <div className="chat-empty muted">
            <p>No messages yet. Ask something to get started, for example:</p>
            <ul>
              <li>What is the difference between Amazon Macie and Amazon Inspector?</li>
              <li>When should I use a foundation model versus training my own model?</li>
              <li>Explain the AWS shared responsibility model for AI workloads.</li>
            </ul>
          </div>
        )}

        {messages.map((m) =>
          m.role === 'user' ? (
            <div key={m.id} className="chat-msg user">
              <div className="chat-bubble">{m.content}</div>
            </div>
          ) : (
            <div key={m.id} className="chat-msg assistant">
              <div className="chat-bubble">
                {m.confidence && <ConfidenceBadge confidence={m.confidence} />}

                {m.content && (
                  <div
                    className="ai-explain-md chat-answer"
                    onClick={(e) => onTranscriptClick(e, m)}
                    dangerouslySetInnerHTML={{ __html: renderAnswer(m.content) }}
                  />
                )}

                {m.streaming && (
                  <div className="small muted chat-typing">
                    {m.content ? '' : '\u{1F916} Thinking…'}
                    <span className="chat-caret" />
                  </div>
                )}

                {m.error && <div className="ai-explain-err small">&#9888;&#65039; {m.error}</div>}

                {m.citations && m.citations.length > 0 && (
                  <div className="chat-citations small">
                    {m.citations.map((c) => (
                      <button
                        key={c.n}
                        type="button"
                        className="cite-chip"
                        title={`${c.title} — ${c.heading}`}
                        onClick={() => setDrawer({ wiki, citation: c })}
                      >
                        [{c.n}] {c.heading || c.source}
                      </button>
                    ))}
                  </div>
                )}

                {(m.usage || m.traceUrl) && <Details usage={m.usage} model={m.model} traceUrl={m.traceUrl} />}
              </div>
            </div>
          ),
        )}
      </div>

      {drawer && (
        <ReferenceDrawer
          wiki={drawer.wiki}
          citation={drawer.citation}
          onClose={() => setDrawer(null)}
          onViewInDocs={onViewInDocs}
        />
      )}

      <div className="sticky-actions chat-input">
        <textarea
          className="chat-textarea"
          placeholder="Ask a question…"
          value={input}
          rows={1}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              send();
            }
          }}
        />
        {sending ? (
          <button className="ghost" onClick={stop}>Stop</button>
        ) : (
          <button className="primary" disabled={!input.trim()} onClick={send}>Send</button>
        )}
        <button className="ghost" onClick={onHome}>&larr; Home</button>
      </div>
    </div>
  );
}

function ConfidenceBadge({ confidence }: { confidence: Confidence }) {
  const cls = confidence.label.toLowerCase(); // low | medium | high
  return (
    <span className={`conf-badge conf-${cls}`} title={confidence.rationale}>
      Confidence: {confidence.label} ({Math.round(confidence.score * 100)}%)
    </span>
  );
}

function Details({
  usage,
  model,
  traceUrl,
}: {
  usage?: Usage;
  model?: string;
  traceUrl?: string | null;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="chat-details small">
      <button type="button" className="chat-details-toggle" onClick={() => setOpen((v) => !v)}>
        {open ? '▾' : '▸'} Details
      </button>
      {open && (
        <div className="chat-details-body muted">
          {model && <div>Model: {model}</div>}
          {usage && (
            <div>
              Tokens: {usage.total_tokens} ({usage.prompt_tokens} prompt + {usage.completion_tokens} completion)
              {' '}&middot; Cost: ${usage.cost_usd.toFixed(5)}
            </div>
          )}
          {traceUrl && (
            <div>
              <a href={traceUrl} target="_blank" rel="noreferrer">View trace in LangSmith</a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function ReferenceDrawer({
  wiki,
  citation,
  onClose,
  onViewInDocs,
}: {
  wiki: string;
  citation: Citation;
  onClose: () => void;
  onViewInDocs: (source: string) => void;
}) {
  const [doc, setDoc] = useState<SourceDocument | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    setDoc(null);
    fetchSource(wiki, citation.doc_id)
      .then((d) => {
        if (!cancelled) setDoc(d);
      })
      .catch((e) => {
        if (!cancelled) setError(e instanceof Error ? e.message : String(e));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [wiki, citation.doc_id]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className="drawer-overlay" onClick={onClose}>
      <aside className="drawer" onClick={(e) => e.stopPropagation()}>
        <div className="drawer-head">
          <div>
            <div className="small muted">Reference [{citation.n}]</div>
            <h2 style={{ margin: '2px 0 0' }}>{doc?.heading || citation.heading || citation.title}</h2>
            <div className="small muted">{doc?.path || citation.source}</div>
          </div>
          <button className="ghost small" onClick={onClose}>&times; Close</button>
        </div>

        <div className="drawer-body">
          {loading && <div className="muted small">Loading source…</div>}
          {error && (
            <div className="ai-explain-err small">
              &#9888;&#65039; Could not load the source: {error}
            </div>
          )}
          {doc && (
            <div
              className="md"
              dangerouslySetInnerHTML={{ __html: marked.parse(doc.markdown) as string }}
            />
          )}
        </div>

        <div className="drawer-foot">
          <button
            className="primary small"
            onClick={() => onViewInDocs(doc?.source || citation.source)}
          >
            View in Docs &rarr;
          </button>
        </div>
      </aside>
    </div>
  );
}
