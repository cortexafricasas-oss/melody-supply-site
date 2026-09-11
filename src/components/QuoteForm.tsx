import { useState } from 'react';
import { CONTACT_EMAIL, WHATSAPP_LINK, WHATSAPP_NUMBER } from '../content';

/**
 * Formulaire de devis, reprenant les champs du formulaire WPForms d'origine.
 * L'envoi passe par la fonction Edge `quote`, qui relaie vers Resend : la cle
 * reste cote serveur. Si l'URL n'est pas configuree au build, on affiche les
 * moyens de contact directs plutot qu'un formulaire qui n'enverrait rien.
 */
const QUOTE_URL = import.meta.env.VITE_QUOTE_URL as string | undefined;

const GOALS = [
  'Open a new store',
  'Restock an existing store',
  'Source specific products',
  'Private label / own brand',
  'Something else',
];

const SITUATIONS = [
  'Dollar store / variety store',
  'Discount or bazaar',
  'Supermarket',
  'Online seller',
  'Wholesaler / importer',
  'Not in retail yet',
];

const YES_NO = ['Yes', 'No'];

const BUDGETS = [
  'Under $5,000',
  '$5,000 – $20,000',
  '$20,000 – $50,000',
  'Over $50,000',
  'Not decided yet',
];

type Status = 'idle' | 'sending' | 'sent' | 'error';

export function QuoteForm() {
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState('');

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const url = QUOTE_URL;
    if (!url || status === 'sending') return;

    const data = Object.fromEntries(new FormData(e.currentTarget).entries());
    setStatus('sending');
    setError('');

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const body = (await res.json()) as { ok?: boolean; error?: string };
      if (res.ok && body.ok) {
        setStatus('sent');
      } else {
        setStatus('error');
        setError(body.error ?? 'Could not send. Please try again.');
      }
    } catch {
      setStatus('error');
      setError('Connection failed. Please try again or use WhatsApp.');
    }
  }

  if (!QUOTE_URL) {
    return (
      <div className="form__fallback">
        <p>
          Email us at <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> or message{' '}
          <a href={WHATSAPP_LINK} target="_blank" rel="noopener">
            WhatsApp {WHATSAPP_NUMBER}
          </a>
          .
        </p>
      </div>
    );
  }

  if (status === 'sent') {
    return (
      <div className="form__done" role="status">
        <h3>Request received.</h3>
        <p>
          We reply by email within 1 to 4 working days. For anything urgent, message{' '}
          <a href={WHATSAPP_LINK} target="_blank" rel="noopener">
            WhatsApp {WHATSAPP_NUMBER}
          </a>
          .
        </p>
      </div>
    );
  }

  return (
    <form className="form" onSubmit={submit} noValidate={false}>
      {/* Piege a robots : invisible pour un humain, rempli par les automates. */}
      <input
        type="text"
        name="company"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="form__trap"
      />

      <div className="form__grid">
        <label>
          <span>Name *</span>
          <input name="name" required maxLength={120} autoComplete="name" />
        </label>

        <label>
          <span>Country *</span>
          <input name="country" required maxLength={80} autoComplete="country-name" />
        </label>

        <label>
          <span>WhatsApp or phone *</span>
          <input name="whatsapp" required maxLength={60} autoComplete="tel" inputMode="tel" />
        </label>

        <label>
          <span>Email *</span>
          <input name="email" type="email" required maxLength={160} autoComplete="email" />
        </label>

        <label>
          <span>My goal *</span>
          <select name="goal" required defaultValue="">
            <option value="" disabled>Choose…</option>
            {GOALS.map((g) => <option key={g}>{g}</option>)}
          </select>
        </label>

        <label>
          <span>My situation</span>
          <select name="situation" defaultValue="">
            <option value="">Choose…</option>
            {SITUATIONS.map((s) => <option key={s}>{s}</option>)}
          </select>
        </label>

        <label>
          <span>Already imported from China</span>
          <select name="imported" defaultValue="">
            <option value="">Choose…</option>
            {YES_NO.map((y) => <option key={y}>{y}</option>)}
          </select>
        </label>

        <label>
          <span>Approx. budget (shipping excluded)</span>
          <select name="budget" defaultValue="">
            <option value="">Choose…</option>
            {BUDGETS.map((b) => <option key={b}>{b}</option>)}
          </select>
        </label>

        <label>
          <span>I already have premises</span>
          <select name="premises" defaultValue="">
            <option value="">Choose…</option>
            {YES_NO.map((y) => <option key={y}>{y}</option>)}
          </select>
        </label>

        <label>
          <span>Store floor area (sq ft or sqm)</span>
          <input name="area" maxLength={40} inputMode="numeric" />
        </label>
      </div>

      <label className="form__full">
        <span>Anything else we should know</span>
        <textarea name="message" rows={4} maxLength={2000} />
      </label>

      <div className="form__actions">
        <button className="btn" type="submit" disabled={status === 'sending'}>
          {status === 'sending' ? 'Sending…' : 'Send my request'}
        </button>
        <a className="btn btn--wa" href={WHATSAPP_LINK} target="_blank" rel="noopener">
          WhatsApp instead
        </a>
      </div>

      {status === 'error' && (
        <p className="form__error" role="alert">{error}</p>
      )}

      <p className="form__note">
        We reply by email within 1 to 4 working days. Your details are used only to
        answer your request.
      </p>
    </form>
  );
}
