import { useEffect, useRef, useState } from 'react';
import {
  WHATSAPP_LINK, WHATSAPP_NUMBER, PHONE_LINK, PHONE_NUMBER,
  WECHAT_ID, CONTACT_EMAIL, FX_NOTE, nav, hero, products, sourcing, process, services, why, model, faq, contact, ctaRow, objections, foot, fact,
} from './content';
import { registerFactCheck } from './lib/fact-checks';
import { startMotion } from './lib/reveal';
import { Ask } from './components/Ask';
import { QuoteForm } from './components/QuoteForm';

const BASE = import.meta.env.BASE_URL;
const img = (f: string) => `${BASE}images/${f}`;

/* Menu : replie en tiroir sous 60rem. Le site precedent n'avait pas de menu
   utilisable sur mobile, c'est le premier reproche du client. */
function Nav() {
  const [open, setOpen] = useState(false);
  return (
    <header className="nav wrap">
      <a className="nav__brand" href="#top">
        <img src={img('logo-light.webp')} alt={nav.logoAlt} width={520} height={143} />
      </a>

      <button
        className="nav__toggle"
        aria-expanded={open}
        aria-controls="nav-menu"
        onClick={() => setOpen((v) => !v)}
      >
        {open ? 'Close' : 'Menu'}
      </button>

      <nav id="nav-menu" className={open ? 'nav__menu is-open' : 'nav__menu'}>
        {nav.links.map((l) => (
          <a key={l.href} href={l.href} onClick={() => setOpen(false)}>{l.label}</a>
        ))}
        <a className="btn btn--sm" href="#contact">{nav.cta}</a>
      </nav>
    </header>
  );
}

/* Le trajet est le moment memorable : la ligne jaune traverse les 7 etapes.
   Le nombre d'etapes rendues est verifie contre le registre des faits. */
function Process() {
  const ref = useRef<HTMLOListElement>(null);

  useEffect(() => {
    registerFactCheck({
      name: 'etapes du processus',
      fact: 'process.steps',
      expected: process.steps.length,
      actual: ref.current?.querySelectorAll('li').length ?? 0,
    });
  });

  return (
    <ol className="route" ref={ref}>
      {process.steps.map((s, i) => (
        <li className="step" data-reveal key={s.h}>
          <span className="step__n" aria-hidden="true">{i + 1}</span>
          <h3>{s.h}</h3>
          <p>{s.p}</p>
        </li>
      ))}
    </ol>
  );
}

function Categories() {
  const ref = useRef<HTMLUListElement>(null);

  useEffect(() => {
    registerFactCheck({
      name: 'categories de produits',
      fact: 'categories.count',
      expected: products.categories.length,
      actual: ref.current?.querySelectorAll('li').length ?? 0,
    });
  });

  return (
    <ul className="cats" ref={ref}>
      {products.categories.map((c) => <li data-reveal key={c}>{c}</li>)}
    </ul>
  );
}

function Why() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    registerFactCheck({
      name: 'avantages listes',
      fact: 'advantages.count',
      expected: why.items.length,
      actual: ref.current?.querySelectorAll('.card').length ?? 0,
    });
  });

  return (
    <div className="cards cards--4" ref={ref}>
      {why.items.map((w) => (
        <div className="card" data-reveal key={w.h}>
          <h3>{w.h}</h3>
          <p>{w.p}</p>
        </div>
      ))}
    </div>
  );
}

export default function App() {
  useEffect(() => startMotion(), []);

  return (
    <>
      <div className="hero" id="top">
        <div className="hero__media" aria-hidden="true">
          <picture>
            <source media="(max-width: 44rem)" srcSet={img('hero-mobile.webp')} />
            <img src={img('hero.webp')} alt="" width={1600} height={900} fetchPriority="high" />
          </picture>
        </div>

        <Nav />

        <div className="wrap hero__inner">
          <h1 className="hero__title">
            {hero.title.map((line) => <span key={line}>{line}</span>)}
          </h1>
          <p className="hero__lede">{hero.lede}</p>
          <div className="hero__stats">
            {hero.stats.map((s) => (
              <span key={s.l}><b>{s.v}</b> {s.l}</span>
            ))}
          </div>
          <div className="hero__actions">
            <a className="btn" href="#contact">{hero.cta}</a>
            <a className="btn btn--ghost" href="#products">{hero.ctaGhost}</a>
            <a className="btn btn--wa" href={WHATSAPP_LINK} target="_blank" rel="noopener">
              WhatsApp
            </a>
          </div>
        </div>
      </div>

      <main>
        {/* Produits */}
        <section className="section wrap" id="products">
          <p className="eyebrow">{products.eyebrow}</p>
          <h2 className="section__title" data-reveal>{products.title}</h2>
          <p className="section__lede" data-reveal>{products.lede}</p>
          <Categories />
          <div className="cards cards--2">
            {products.points.map((p) => (
              <div className="card" data-reveal key={p.h}>
                <h3>{p.h}</h3>
                <p>{p.p}</p>
              </div>
            ))}
          </div>
          <p className="eyebrow" style={{ marginTop: '3rem' }}>Included with every order</p>
          <ul className="chips">
            {products.included.map((i) => <li key={i}>{i}</li>)}
          </ul>
          <p className="fxnote">{FX_NOTE}</p>
        </section>

        {/* Sourcing */}
        <section className="light" id="sourcing">
          <div className="section wrap">
            <p className="eyebrow">{sourcing.eyebrow}</p>
            <h2 className="section__title" data-reveal>{sourcing.title}</h2>
            <p className="section__lede" data-reveal>{sourcing.lede}</p>
            <div className="cards cards--3">
              {sourcing.items.map((s) => (
                <div className="card" data-reveal key={s.h}>
                  <h3>{s.h}</h3>
                  <p>{s.p}</p>
                </div>
              ))}
            </div>
            <p className="eyebrow" style={{ marginTop: '3rem' }}>{sourcing.forWhom.h}</p>
            <ul className="chips">
              {sourcing.forWhom.list.map((i) => <li key={i}>{i}</li>)}
            </ul>
          </div>
        </section>

        {/* Les 6 objections : le frein avant l'achat */}
        <section className="light" id="objections">
          <div className="section wrap">
            <p className="eyebrow">{objections.eyebrow}</p>
            <h2 className="section__title" data-reveal>{objections.title}</h2>
            <p className="section__lede" data-reveal>{objections.lede}</p>
            <div className="cards cards--3">
              {objections.items.map((o) => (
                <div className="card" data-reveal key={o.h}>
                  <h3>{o.h}</h3>
                  <p>{o.p}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Le processus : moment memorable */}
        <section className="section wrap" id="process">
          <p className="eyebrow">{process.eyebrow}</p>
          <h2 className="section__title" data-reveal>{process.title}</h2>
          <p className="section__lede" data-reveal>{process.lede}</p>
          <Process />
        </section>

        {/* Bandeau image */}
        <div className="band" aria-hidden="true">
          <img src={img('step-fixture.webp')} alt="" width={900} height={506} loading="lazy" />
        </div>

        {/* Services */}
        <section className="section wrap" id="services">
          <p className="eyebrow">{services.eyebrow}</p>
          <h2 className="section__title" data-reveal>{services.title}</h2>
          <p className="section__lede" data-reveal>{services.lede}</p>
          <div className="cards cards--2">
            {services.items.map((s) => (
              <div className="card" data-reveal key={s.h}>
                <h3>{s.h}</h3>
                <p>{s.p}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Le format */}
        <section className="light">
          <div className="section wrap">
            <p className="eyebrow">{model.eyebrow}</p>
            <h2 className="section__title" data-reveal>{model.title}</h2>
            <p className="section__lede" data-reveal>{model.lede}</p>
            <div className="cards cards--4">
              {model.items.map((m) => (
                <div className="card" data-reveal key={m.h}>
                  <h3>{m.h}</h3>
                  <p>{m.p}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pourquoi nous */}
        <section className="section wrap" id="why">
          <p className="eyebrow">{why.eyebrow}</p>
          <h2 className="section__title" data-reveal>{why.title}</h2>
          <Why />
        </section>

        {/* FAQ */}
        <section className="light" id="faq">
          <div className="section wrap">
            <p className="eyebrow">{faq.eyebrow}</p>
            <h2 className="section__title" data-reveal>{faq.title}</h2>
            <div className="faq">
              {faq.items.map((f) => (
                <details data-reveal key={f.q}>
                  <summary>{f.q}</summary>
                  <p>{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* Les trois actions recurrentes du site d'origine */}
        <section className="section wrap" id="start">
          <h2 className="section__title" data-reveal>{ctaRow.title}</h2>
          <div className="cards cards--3">
            {ctaRow.items.map((c) => (
              <div className="card" data-reveal key={c.h}>
                <h3>{c.h}</h3>
                <p>{c.p}</p>
                <p><a className="btn btn--sm" href="#contact">{c.h}</a></p>
              </div>
            ))}
          </div>
        </section>

        {/* Contact */}
        <section className="quote" id="contact">
          <div className="section wrap">
            <p className="eyebrow">{contact.eyebrow}</p>
            <h2 className="section__title" data-reveal>{contact.title}</h2>
            <p className="section__lede" data-reveal>{contact.lede}</p>
            <ul className="chips chips--dark">
              {contact.offers.map((o) => <li key={o}>{o}</li>)}
            </ul>
            <QuoteForm />
            <dl className="channels">
              {contact.channels.map((c) => (
                <div key={c.label}>
                  <dt>{c.label}</dt>
                  <dd>
                    {c.label === 'WhatsApp' && <a href={WHATSAPP_LINK} target="_blank" rel="noopener">{c.value}</a>}
                    {c.label === 'Phone' && <a href={PHONE_LINK}>{c.value}</a>}
                    {c.label === 'Email' && <a href={`mailto:${CONTACT_EMAIL}`}>{c.value}</a>}
                    {c.label === 'WeChat' && <span>{c.value}</span>}
                    {c.note && <em> — {c.note}</em>}
                  </dd>
                </div>
              ))}
            </dl>
            <p className="quote__reassure">{contact.reassurance}</p>
          </div>
        </section>
      </main>

      {/* Barre d'action permanente sur mobile : l'acheteur ne doit jamais
          avoir a chercher comment nous joindre. */}
      <div className="sticky-cta">
        <a className="btn" href="#contact">Get a quote</a>
        <a className="btn btn--wa" href={WHATSAPP_LINK} target="_blank" rel="noopener">WhatsApp</a>
      </div>

      <Ask />

      <footer className="foot wrap">
        <div className="foot__row">
          <strong>{foot.company}</strong>
          <span>{foot.tagline}</span>
          <a href={`mailto:${foot.email}`}>{foot.email}</a>
          <a href={WHATSAPP_LINK} target="_blank" rel="noopener">WhatsApp {WHATSAPP_NUMBER}</a>
          <a href={PHONE_LINK}>{PHONE_NUMBER}</a>
          <span>WeChat {WECHAT_ID}</span>
          {foot.socials.map((s) => (
            <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer">{s.label}</a>
          ))}
        </div>
      </footer>
    </>
  );
}
