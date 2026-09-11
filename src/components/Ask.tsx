import { useEffect, useRef, useState } from 'react';

/**
 * Assistant Melody Supply.
 *
 * Reglages issus des pratiques mesurees sur les widgets de chat :
 * - accroche proactive entre 5 et 10 s (avant 3 s c'est intrusif, apres 15 s
 *   une partie des visiteurs est deja partie) ;
 * - une seule accroche par session, memorisee dans sessionStorage ;
 * - badge "1" facon messagerie, qui augmente sensiblement le taux de clic ;
 * - pastille verte de presence ;
 * - message d'accueil dans le fil, pas en plein ecran.
 *
 * La cle DeepSeek n'est jamais ici : le site appelle une fonction serveur.
 */
const BOT_URL = import.meta.env.VITE_BOT_URL as string | undefined;
const BASE = import.meta.env.BASE_URL;

const MAX = 500;
const TEASER_DELAY = 7000;     // 7 s : dans la fenetre 5-10 s
const TEASER_TIMEOUT = 14000;  // l'accroche se retire seule
const SEEN_KEY = 'melody.teaser.seen';
const BUBBLE_GAP = 450;  // pause entre deux bulles, comme une frappe naturelle

const TEASER_TEXT = 'Opening a store or placing a new order? I can walk you through it.';
const WELCOME_TEXT =
  'Welcome. Tell me what you are working on — a new store, a restock, or specific ' +
  'products — and I will tell you exactly how we handle it.';

type Msg = { role: 'you' | 'bot'; text: string };
type Turn = { role: 'user' | 'assistant'; content: string };

/** Le fil renvoye au serveur. Sans lui, l'assistant redemande a chaque message
 *  ce que le visiteur vient de dire : impossible de qualifier une affaire.
 *  Une reponse etant affichee en plusieurs bulles, on la recolle d'abord. */
function toHistory(msgs: Msg[]): Turn[] {
  const out: Turn[] = [];
  for (const m of msgs) {
    const role: Turn['role'] = m.role === 'you' ? 'user' : 'assistant';
    const last = out[out.length - 1];
    if (last && last.role === role) last.content += `\n\n${m.text}`;
    else out.push({ role, content: m.text });
  }
  return out.slice(-10);
}

/** Transforme les URL d'une reponse en liens cliquables. Le reste est rendu tel
 *  quel : jamais de HTML injecte, seulement du texte et des <a>. */
function withLinks(text: string) {
  const parts = text.split(/(https?:\/\/[^\s<>()]+)/g);
  return parts.map((part, i) =>
    /^https?:\/\//.test(part) ? (
      <a key={i} href={part} target="_blank" rel="noopener noreferrer">
        {part.replace(/^https?:\/\//, '').replace(/\/$/, '')}
      </a>
    ) : (
      part
    ),
  );
}

/** Decoupe une reponse en bulles lisibles plutot qu'un seul pave.
 *  On coupe sur les paragraphes ; une puce reste avec son intitule. */
function toBubbles(text: string): string[] {
  const blocks = text
    .split(/\n{2,}/)
    .map((b) => b.trim())
    .filter(Boolean);

  const out: string[] = [];
  for (const block of blocks) {
    // Un bloc trop long se recoupe sur les phrases.
    if (block.length > 320 && !block.includes('\n')) {
      const sentences = block.match(/[^.!?]+[.!?]+(?:\s|$)/g) ?? [block];
      let buf = '';
      for (const sentence of sentences) {
        if ((buf + sentence).length > 320 && buf) {
          out.push(buf.trim());
          buf = '';
        }
        buf += sentence;
      }
      if (buf.trim()) out.push(buf.trim());
    } else {
      out.push(block);
    }
  }
  return out.length ? out : [text];
}

function alreadySeen(): boolean {
  try {
    return sessionStorage.getItem(SEEN_KEY) === '1';
  } catch {
    return false;
  }
}

function markSeen(): void {
  try {
    sessionStorage.setItem(SEEN_KEY, '1');
  } catch {
    /* navigation privee ou stockage bloque : sans consequence */
  }
}

export function Ask() {
  const [open, setOpen] = useState(false);
  const [teaser, setTeaser] = useState(false);
  const [unread, setUnread] = useState(false);
  const [q, setQ] = useState('');
  const [busy, setBusy] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const logRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Accroche proactive, une seule fois par session.
  useEffect(() => {
    if (!BOT_URL || alreadySeen()) return;
    const show = window.setTimeout(() => {
      setTeaser(true);
      setUnread(true);
    }, TEASER_DELAY);
    const hide = window.setTimeout(() => setTeaser(false), TEASER_DELAY + TEASER_TIMEOUT);
    return () => {
      window.clearTimeout(show);
      window.clearTimeout(hide);
    };
  }, []);

  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight, behavior: 'smooth' });
  }, [msgs, busy, open]);

  if (!BOT_URL) return null;

  function openPanel() {
    setOpen(true);
    setTeaser(false);
    setUnread(false);
    markSeen();
    // Le fil s'ouvre sur un mot d'accueil, pas sur un vide.
    setMsgs((m) => (m.length ? m : [{ role: 'bot', text: WELCOME_TEXT }]));
    window.setTimeout(() => inputRef.current?.focus(), 120);
  }

  function dismissTeaser() {
    setTeaser(false);
    setUnread(false);
    markSeen();
  }

  async function send(e: React.FormEvent) {
    e.preventDefault();
    const url = BOT_URL;
    const question = q.trim();
    if (!url || !question || busy) return;

    const history = toHistory(msgs);
    setMsgs((m) => [...m, { role: 'you', text: question }]);
    setQ('');
    setBusy(true);

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, history }),
      });
      const data = (await res.json()) as { answer?: string; error?: string };
      const full =
        data.answer ??
        data.error ??
        'Something went wrong. Please email melodychina0505@gmail.com.';

      const bubbles = toBubbles(full);
      for (let i = 0; i < bubbles.length; i += 1) {
        if (i > 0) await new Promise((r) => setTimeout(r, BUBBLE_GAP));
        setMsgs((m) => [...m, { role: 'bot', text: bubbles[i] }]);
      }
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
      {/* Accroche : une bulle a cote du bouton, jamais par-dessus la page. */}
      {teaser && !open && (
        <div className="ask__teaser">
          <button className="ask__teaser-body" onClick={openPanel}>
            {TEASER_TEXT}
          </button>
          <button className="ask__teaser-close" onClick={dismissTeaser} aria-label="Dismiss">
            <svg viewBox="0 0 24 24" width="12" height="12" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="3"
                    fill="none" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      )}

      <button
        className="ask__open"
        aria-expanded={open}
        aria-controls="ask-panel"
        aria-label={open ? 'Close the assistant' : 'Ask a question'}
        onClick={() => (open ? setOpen(false) : openPanel())}
      >
        {open ? (
          <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
            <path d="M5 5l14 14M19 5L5 19" stroke="currentColor" strokeWidth="2.6"
                  fill="none" strokeLinecap="round" />
          </svg>
        ) : (
          <img
            src={`${BASE}images/assistant.webp`}
            srcSet={`${BASE}images/assistant.webp 1x, ${BASE}images/assistant@2x.webp 2x`}
            alt=""
            width={160}
            height={160}
          />
        )}
        {!open && <span className="ask__dot" aria-hidden="true" />}
        {!open && unread && <span className="ask__badge" aria-hidden="true">1</span>}
      </button>

      <div id="ask-panel" className={open ? 'ask is-open' : 'ask'} hidden={!open}>
        <div className="ask__head">
          <span className="ask__avatar-wrap">
            <img
              className="ask__avatar"
              src={`${BASE}images/assistant.webp`}
              srcSet={`${BASE}images/assistant.webp 1x, ${BASE}images/assistant@2x.webp 2x`}
              alt=""
              width={160}
              height={160}
            />
            <i className="ask__dot ask__dot--head" aria-hidden="true" />
          </span>
          <div>
            <strong>Melody Supply</strong>
            <span>Online · Automated assistant</span>
          </div>
        </div>

        <div className="ask__log" ref={logRef} aria-live="polite">
          {msgs.map((m, i) => (
            <p key={i} className={m.role === 'you' ? 'ask__you' : 'ask__bot'}>
              {m.role === 'bot' ? withLinks(m.text) : m.text}
            </p>
          ))}
          {busy && (
            <p className="ask__bot ask__typing" aria-label="Typing">
              <i /><i /><i />
            </p>
          )}
        </div>

        <form className="ask__form" onSubmit={send}>
          <label className="sr-only" htmlFor="ask-input">Your question</label>
          <input
            id="ask-input"
            ref={inputRef}
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
