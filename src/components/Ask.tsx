import { useEffect, useRef, useState } from 'react';

/**
 * Bot de questions. N'apparait que si VITE_BOT_URL est defini au build :
 * sans service intermediaire, pas de bouton, donc aucune promesse non tenue.
 * La cle DeepSeek vit dans le Worker, jamais ici.
 */
const BOT_URL = import.meta.env.VITE_BOT_URL as string | undefined;
const BASE = import.meta.env.BASE_URL;
const MAX = 500;

type Msg = { role: 'you' | 'bot'; text: string };

export function Ask() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const [busy, setBusy] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const logRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight, behavior: 'smooth' });
  }, [msgs, busy]);

  if (!BOT_URL) return null;

  async function send(e: React.FormEvent) {
    e.preventDefault();
    const url = BOT_URL;
    const question = q.trim();
    if (!url || !question || busy) return;

    setMsgs((m) => [...m, { role: 'you', text: question }]);
    setQ('');
    setBusy(true);

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question }),
      });
      const data = (await res.json()) as { answer?: string; error?: string };
      setMsgs((m) => [
        ...m,
        {
          role: 'bot',
          text:
            data.answer ??
            data.error ??
            'Something went wrong. Please email melodychina0505@gmail.com.',
        },
      ]);
    } catch {
      setMsgs((m) => [
        ...m,
        { role: 'bot', text: 'Connection failed. Please email melodychina0505@gmail.com.' },
      ]);
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <button
        className="ask__open"
        aria-expanded={open}
        aria-controls="ask-panel"
        aria-label={open ? 'Close the assistant' : 'Ask a question'}
        title={open ? 'Close' : 'Ask a question'}
        onClick={() => setOpen((v) => !v)}
      >
        {open ? (
          <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
            <path d="M5 5l14 14M19 5L5 19" stroke="currentColor" strokeWidth="2.4" fill="none" strokeLinecap="round" />
          </svg>
        ) : (
          <img
            src={`${BASE}images/assistant.webp`}
            srcSet={`${BASE}images/assistant.webp 1x, ${BASE}images/assistant@2x.webp 2x`}
            alt=""
            width={160}
            height={160}
            loading="lazy"
          />
        )}
      </button>

      <div id="ask-panel" className={open ? 'ask is-open' : 'ask'} hidden={!open}>
        <div className="ask__head">
          <img
            className="ask__avatar"
            src={`${BASE}images/assistant.webp`}
            srcSet={`${BASE}images/assistant.webp 1x, ${BASE}images/assistant@2x.webp 2x`}
            alt=""
            width={160}
            height={160}
          />
          <div>
            <strong>Melody Supply</strong>
            <span>Automated assistant</span>
          </div>
        </div>
        {(msgs.length > 0 || busy) && (
        <div className="ask__log" ref={logRef} aria-live="polite">
          {msgs.map((m, i) => (
            <p key={i} className={m.role === 'you' ? 'ask__you' : 'ask__bot'}>
              {m.text}
            </p>
          ))}
          {busy && (
            <p className="ask__bot ask__typing" aria-label="Typing">
              <i /><i /><i />
            </p>
          )}
        </div>
        )}

        <form className="ask__form" onSubmit={send}>
          <label className="sr-only" htmlFor="ask-input">Your question</label>
          <input
            id="ask-input"
            value={q}
            maxLength={MAX}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Ask about MOQ, shipping, opening a store…"
            autoComplete="off"
          />
          <button type="submit" disabled={busy || !q.trim()} aria-label="Send">
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
              <path d="M12 19V5M5 12l7-7 7 7" stroke="currentColor" strokeWidth="2.6"
                    fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </form>

        <p className="ask__note">
          Automated assistant — answers from this page only, not a commercial commitment.
        </p>
      </div>
    </>
  );
}
