import { useEffect, useRef, useState } from 'react';

/**
 * Bot de questions. N'apparait que si VITE_BOT_URL est defini au build :
 * sans service intermediaire, pas de bouton, donc aucune promesse non tenue.
 * La cle DeepSeek vit dans le Worker, jamais ici.
 */
const BOT_URL = import.meta.env.VITE_BOT_URL as string | undefined;
const MAX = 500;

type Msg = { role: 'you' | 'bot'; text: string };

export function Ask() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const [busy, setBusy] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([
    {
      role: 'bot',
      text:
        'Ask about products, minimum order, shipping or opening a store. ' +
        'I answer from this page only — for anything else, email melodychina0505@gmail.com.',
    },
  ]);
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
        onClick={() => setOpen((v) => !v)}
      >
        {open ? 'Close' : 'Ask a question'}
      </button>

      <div id="ask-panel" className={open ? 'ask is-open' : 'ask'} hidden={!open}>
        <div className="ask__log" ref={logRef} aria-live="polite">
          {msgs.map((m, i) => (
            <p key={i} className={m.role === 'you' ? 'ask__you' : 'ask__bot'}>
              {m.text}
            </p>
          ))}
          {busy && <p className="ask__bot ask__typing">…</p>}
        </div>

        <form className="ask__form" onSubmit={send}>
          <label className="sr-only" htmlFor="ask-input">Your question</label>
          <input
            id="ask-input"
            value={q}
            maxLength={MAX}
            onChange={(e) => setQ(e.target.value)}
            placeholder="What is the minimum order?"
            autoComplete="off"
          />
          <button type="submit" disabled={busy || !q.trim()}>
            {busy ? '…' : 'Send'}
          </button>
        </form>

        <p className="ask__note">
          Automated assistant. Answers come from this page only and are not a
          commercial commitment.
        </p>
      </div>
    </>
  );
}
