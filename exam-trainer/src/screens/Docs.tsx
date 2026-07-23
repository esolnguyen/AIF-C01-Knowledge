import { useMemo, useState, useEffect, useRef } from 'react';
import { marked } from 'marked';
import type { Domain } from '../types';
import { DOMAIN_NAMES, ALL_DOMAINS } from '../lib/domains';
import { getReadTopics, setTopicRead } from '../lib/storage';
import docsData from '../data/docs.json';

type Topic = {
  id: string;
  domain: Domain;
  heading: string;
  detail: string;
  part: string;
  partTitle: string;
  body: string;
};

const TOPICS = (docsData.topics as Topic[]).map((t) => ({ ...t, domain: Number(t.domain) as Domain }));

marked.setOptions({ gfm: true, breaks: false });

export default function Docs({ onHome, initialSource }: { onHome: () => void; initialSource?: string }) {
  const [query, setQuery] = useState('');
  const [activeId, setActiveId] = useState(
    () => (initialSource && TOPICS.find((t) => t.part === initialSource)?.id) || TOPICS[0]?.id || '',
  );
  const [read, setRead] = useState<Record<string, boolean>>(() => getReadTopics());
  const [navOpen, setNavOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const q = query.trim().toLowerCase();
  const matches = useMemo(() => {
    if (!q) return TOPICS;
    return TOPICS.filter((t) =>
      t.heading.toLowerCase().includes(q) ||
      t.detail.toLowerCase().includes(q) ||
      t.body.toLowerCase().includes(q));
  }, [q]);

  const groups = useMemo(
    () => ALL_DOMAINS.map((d) => ({ domain: d, topics: matches.filter((t) => t.domain === d) })),
    [matches],
  );

  const active = TOPICS.find((t) => t.id === activeId) ?? TOPICS[0];
  const flat = matches.length ? matches : TOPICS;
  const pos = flat.findIndex((t) => t.id === active.id);
  // Filtering while the open topic is not in the results (pos = -1) → "Next" jumps to the first result.
  const prev = pos > 0 ? flat[pos - 1] : null;
  const next = pos < 0 ? flat[0] : pos < flat.length - 1 ? flat[pos + 1] : null;

  const html = useMemo(() => marked.parse(active.body) as string, [active.id]);

  useEffect(() => {
    contentRef.current?.scrollTo({ top: 0 });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [active.id]);

  function open(id: string) {
    setActiveId(id);
    setNavOpen(false);
  }

  function toggleRead(id: string) {
    setRead(setTopicRead(id, !read[id]));
  }

  const doneTotal = TOPICS.filter((t) => read[t.id]).length;

  return (
    <div>
      <div className="card docs-head">
        <div>
          <h1 style={{ marginBottom: 2 }}>Study Notes</h1>
          <p className="muted small" style={{ margin: 0 }}>
            {TOPICS.length} topics from the AIF-C01 notes, ordered by domain D1 → D5. Read{' '}
            <strong>{doneTotal}/{TOPICS.length}</strong>.
          </p>
        </div>
        <div className="grow" />
        <input
          className="docs-search"
          placeholder="Search topics or content…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <button className="ghost docs-navtoggle" onClick={() => setNavOpen((v) => !v)}>
        {navOpen ? '✕ Close contents' : '☰ Contents'}
      </button>

      <div className="docs">
        <nav className={`docs-nav ${navOpen ? 'open' : ''}`}>
          {q && <div className="small muted" style={{ padding: '0 4px 8px' }}>{matches.length} results</div>}
          {groups.map(({ domain, topics }) => {
            const done = topics.filter((t) => read[t.id]).length;
            return (
              <div key={domain} className="docs-group">
                <div className="docs-group-head">
                  <span className={`dbadge d${domain}`}>D{domain}</span>
                  <span className="docs-group-name">{DOMAIN_NAMES[domain]}</span>
                  <span className="muted small">{done}/{topics.length}</span>
                </div>
                {topics.map((t) => (
                  <button
                    key={t.id}
                    className={`docs-item ${t.id === active.id ? 'active' : ''} ${read[t.id] ? 'read' : ''}`}
                    onClick={() => open(t.id)}
                  >
                    <span className="docs-check">{read[t.id] ? '✓' : ''}</span>
                    <span className="docs-item-text">{t.heading}</span>
                  </button>
                ))}
                {!topics.length && <div className="small muted" style={{ padding: '2px 8px 6px' }}>—</div>}
              </div>
            );
          })}
        </nav>

        <article className="card docs-body" ref={contentRef}>
          <div className="docs-crumb small muted">
            <span className={`dbadge d${active.domain}`}>D{active.domain}</span>
            {DOMAIN_NAMES[active.domain]} · {active.partTitle}
          </div>
          <h2 className="docs-title">{active.heading}</h2>
          {active.detail && <p className="muted small docs-detail">{active.detail}</p>}

          <div className="md" dangerouslySetInnerHTML={{ __html: html }} />

          <div className="docs-foot">
            <button className={read[active.id] ? 'primary' : ''} onClick={() => toggleRead(active.id)}>
              {read[active.id] ? '✓ Read' : 'Mark as read'}
            </button>
            <div className="grow" />
            <button className="ghost" disabled={!prev} onClick={() => prev && open(prev.id)}>← Previous</button>
            <button className="ghost" disabled={!next} onClick={() => next && open(next.id)}>Next →</button>
          </div>
        </article>
      </div>

      <div className="row" style={{ marginTop: 16 }}>
        <button className="ghost" onClick={onHome}>← Home</button>
      </div>
    </div>
  );
}
