import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, m } from 'framer-motion';
import { FALLBACK_ANSWER, answerQuestion, suggestions } from '../lib/answer.js';

// "llm" calls the /api/ask serverless function (key stays server-side).
// Anything else uses the scripted, content.js-grounded answers only.
const USE_LLM = import.meta.env.VITE_ASK_AGENT_MODE === 'llm';

async function askLLM(question, history) {
  const res = await fetch('/api/ask', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question, history: history.slice(-6) }),
  });
  if (!res.ok) throw new Error(`ask failed: ${res.status}`);
  const data = await res.json();
  if (!data.answer) throw new Error('empty answer');
  return data.answer;
}

export default function AskAgent({ reducedMotion }) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hi — I'm Shreya's portfolio agent. Ask me about her projects, skills or experience." },
  ]);
  const listRef = useRef(null);
  const inputRef = useRef(null);
  const toggleRef = useRef(null);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: reducedMotion ? 'auto' : 'smooth' });
  }, [messages, reducedMotion]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const send = async (text) => {
    const question = text.trim().slice(0, 500);
    if (!question || busy) return;
    const history = [...messages, { role: 'user', content: question }];
    setMessages(history);
    setInput('');
    setBusy(true);
    let answer = null;
    if (USE_LLM) {
      try {
        answer = await askLLM(question, history.slice(1, -1));
      } catch {
        answer = null;
      }
    }
    if (!answer) {
      await new Promise((r) => setTimeout(r, reducedMotion ? 0 : 350));
      answer = answerQuestion(question) ?? FALLBACK_ANSWER;
    }
    setMessages((m) => [...m, { role: 'assistant', content: answer }]);
    setBusy(false);
  };

  return (
    <div className="fixed right-4 bottom-4 z-50 flex flex-col items-end sm:right-6 sm:bottom-6">
      <AnimatePresence>
        {open && (
          <m.div
            id="ask-agent-panel"
            role="dialog"
            aria-label="Ask my agent"
            initial={reducedMotion ? false : { opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="mb-3 flex h-[min(32rem,calc(100dvh-7rem))] w-[min(24rem,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border border-line bg-deep shadow-2xl shadow-black/60"
          >
            <div className="flex items-center justify-between border-b border-line px-4 py-3">
              <div>
                <p className="font-semibold">ask_my_agent</p>
                <p className="font-mono text-[11px] text-muted">
                  grounded in portfolio data · {USE_LLM ? 'llm' : 'scripted'} mode
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-md px-2 py-1 text-muted hover:text-text"
                aria-label="Close chat"
              >
                ✕
              </button>
            </div>

            <ol ref={listRef} className="flex-1 space-y-3 overflow-y-auto p-4 text-sm" aria-live="polite">
              {messages.map((m, i) => (
                <li key={i} className={m.role === 'user' ? 'flex justify-end' : 'flex'}>
                  <p
                    className={`max-w-[85%] rounded-xl px-3 py-2 leading-relaxed break-words ${
                      m.role === 'user' ? 'bg-violet text-ink' : 'border border-line bg-ink/60 text-text'
                    }`}
                  >
                    <span className="sr-only">{m.role === 'user' ? 'You: ' : 'Agent: '}</span>
                    {m.content}
                  </p>
                </li>
              ))}
              {busy && (
                <li className="font-mono text-xs text-muted">
                  [agent] thinking<span className="caret" />
                </li>
              )}
            </ol>

            {messages.length < 3 && (
              <div className="flex flex-wrap gap-1.5 px-4 pb-2">
                {suggestions.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => send(s)}
                    className="rounded-full border border-line px-2.5 py-1 text-xs text-muted transition hover:border-violet hover:text-lilac"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            <form
              className="flex gap-2 border-t border-line p-3"
              onSubmit={(e) => {
                e.preventDefault();
                send(input);
              }}
            >
              <label htmlFor="ask-input" className="sr-only">
                Your question
              </label>
              <input
                id="ask-input"
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                maxLength={500}
                placeholder="Ask about projects, skills…"
                autoComplete="off"
                className="min-w-0 flex-1 rounded-lg border border-line bg-ink px-3 py-2 text-sm text-text placeholder:text-muted/80 focus:border-violet focus:outline-none"
              />
              <button
                type="submit"
                disabled={busy || !input.trim()}
                className="rounded-lg bg-violet px-3 py-2 text-sm font-semibold text-ink disabled:opacity-50"
              >
                Send
              </button>
            </form>
          </m.div>
        )}
      </AnimatePresence>

      <button
        ref={toggleRef}
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="ask-agent-panel"
        className="flex items-center gap-2 rounded-full border border-violet/60 bg-deep px-4 py-2.5 font-mono text-sm text-lilac shadow-[0_0_30px_-6px_rgb(139_92_246_/_0.7)] transition hover:bg-night"
      >
        <span className="status-dot h-2 w-2 rounded-full bg-ok" aria-hidden="true" />
        {open ? 'close agent' : 'ask my agent'}
      </button>
    </div>
  );
}
