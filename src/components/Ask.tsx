import { useEffect, useRef, useState } from 'react';

/**
 * Assistant Melody Supply.
 *
 * Reglages issus des pratiques mesurees sur les widgets de chat :
 * - accroche proactive a 40 % de la page lue, pas sur un chronometre : elle
 *   arrive quand le visiteur a compris l'offre, jamais pendant qu'il lit ;
 * - une seule accroche par visite, memorisee dans sessionStorage ;
 * - le bouton s'efface devant le formulaire de devis, qu'il masquait ;
 * - badge "1" facon messagerie, qui augmente sensiblement le taux de clic ;
 * - pastille verte de presence ;
 * - message d'accueil dans le fil, pas en plein ecran.
 *
 * La cle DeepSeek n'est jamais ici : le site appelle une fonction serveur.
 */
const BOT_URL = import.meta.env.VITE_BOT_URL as string | undefined;
const QUOTE_URL = import.meta.env.VITE_QUOTE_URL as string | undefined;
const BASE = import.meta.env.BASE_URL;

const MAX = 500;
/* L'accroche ne part plus sur un chronometre mais sur la lecture : a 40 % de la
   page, le visiteur a depasse le premier ecran et sait de quoi on parle. Un
   minuteur, lui, se declenche pendant qu'il lit le heros. */
const TEASER_AT = 0.4;
const TEASER_TIMEOUT = 8000;   // l'accroche se retire seule : elle flotte
                               // au-dessus du texte, elle doit passer vite
const SEEN_KEY = 'melody.teaser.seen';
const BUBBLE_GAP = 450;  // pause entre deux bulles, comme une frappe naturelle

const TEASER_TEXT = 'Planning a store? Let us talk.';
const WELCOME_TEXT =
  "Hi. Tell me what you're building — a first store, a restock, or a product you " +
  "can't find anywhere — and I'll tell you how we'd handle it.";

/* Notre propre numero : si le visiteur le recopie, ce n'est pas un contact. */
const OUR_NUMBER = '8619316682193';

const EMAIL_RE = /[^\s@<>()[\]]+@[^\s@<>()[\]]+\.[a-z]{2,}/i;
/* Un numero utile fait au moins dix chiffres. Le garde-fou evite de prendre une
   surface, un budget ou une quantite pour un telephone. */
const PHONE_RE = /(?<![\d$])(\+?\d[\d\s().-]{8,}\d)(?!\d)/;

/** Cherche un moyen de rappeler le visiteur dans ce qu'il vient d'ecrire. */
function findContact(text: string): { email?: string; whatsapp?: string } | null {
  const email = text.match(EMAIL_RE)?.[0];
  const phoneRaw = text.match(PHONE_RE)?.[0];
  const digits = phoneRaw ? phoneRaw.replace(/\D/g, '') : '';
  const whatsapp = digits.length >= 10 && !OUR_NUMBER.includes(digits) ? phoneRaw : undefined;
  if (!email && !whatsapp) return null;
  return { email, whatsapp: whatsapp?.trim() };
}

type Msg = { role: 'you' | 'bot'; text: string };
const HANDOVER_TEXT =
  "I've passed your details to our team along with this conversation, so you " +
  "won't have to repeat yourself. They reply within 1 to 4 working days.";

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
  const [atForm, setAtForm] = useState(false);
  const [leadSent, setLeadSent] = useState(false);
  const [q, setQ] = useState('');
  const [busy, setBusy] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const logRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Accroche proactive : une seule fois par visite, passe 40 % de la page.
  useEffect(() => {
    if (!BOT_URL || alreadySeen()) return;
    let hide = 0;
    const onScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      if (total <= 0 || window.scrollY / total < TEASER_AT) return;
      window.removeEventListener('scroll', onScroll);
      setTeaser(true);
      setUnread(true);
      // Memorise des l'affichage : une visite, une accroche, meme sans clic.
      markSeen();
      hide = window.setTimeout(() => setTeaser(false), TEASER_TIMEOUT);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.clearTimeout(hide);
    };
  }, []);

  // Devant le formulaire de devis, le bouton s'efface : le visiteur y est deja,
  // l'assistant n'a plus rien a lui vendre et il masquait les champs.
  useEffect(() => {
    const form = document.getElementById('contact');
    if (!form) return;
    const io = new IntersectionObserver(
      ([entry]) => setAtForm(entry.isIntersecting),
      { threshold: 0.05 },
    );
    io.observe(form);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight, behavior: 'smooth' });
  }, [msgs, busy, open]);

  // Le clavier d'iOS reduit le viewport visuel sans toucher a la fenetre : un
  // panneau en position fixe se retrouve donc dessous. On mesure la hauteur
  // prise par le clavier et on remonte le panneau d'autant.
  useEffect(() => {
    const vv = window.visualViewport;
    const root = document.documentElement;
    const clear = () => {
      root.style.removeProperty('--ask-kb');
      root.style.removeProperty('--ask-vh');
    };
    if (!vv || !open) {
      clear();
      return;
    }
    const apply = () => {
      // Un pincement pour zoomer retrecit lui aussi le viewport : on ne bouge
      // rien tant que l'echelle n'est pas a 1.
      const keyboard =
        vv.scale > 1.01 ? 0 : Math.max(0, window.innerHeight - vv.height - vv.offsetTop);
      root.style.setProperty('--ask-kb', `${Math.round(keyboard)}px`);
      root.style.setProperty('--ask-vh', `${Math.round(vv.height)}px`);
    };
    apply();
    vv.addEventListener('resize', apply);
    vv.addEventListener('scroll', apply);
    return () => {
      vv.removeEventListener('resize', apply);
      vv.removeEventListener('scroll', apply);
      clear();
    };
  }, [open]);

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
    const thread: Msg[] = [...msgs, { role: 'you', text: question }];
    setMsgs(thread);

    // Le contact part des qu'il apparait, sans attendre la reponse du modele :
    // un visiteur qui ferme l'onglet juste apres reste un prospect atteignable.
    const contact = !leadSent && QUOTE_URL ? findContact(question) : null;
    if (contact) {
      setLeadSent(true);
      fetch(QUOTE_URL as string, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ source: 'chat', ...contact, transcript: thread.slice(-20) }),
      }).catch(() => undefined);
    }
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

      if (contact) {
        await new Promise((r) => setTimeout(r, BUBBLE_GAP));
        setMsgs((m) => [...m, { role: 'bot', text: HANDOVER_TEXT }]);
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
      {teaser && !open && !atForm && (
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
        className={open ? 'ask__open' : 'ask__open ask__open--idle'}
        hidden={atForm && !open}
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
            <span>Online · AI assistant</span>
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
            placeholder="MOQ, shipping, store setup…"
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
          AI assistant — our team confirms prices and dates before any order.
        </p>
      </div>
    </>
  );
}
