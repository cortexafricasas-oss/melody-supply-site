import { useEffect, useRef } from 'react';
import { QUOTE_MAIL, nav, hero, route, services, figures, faq, quote, foot, fact } from './content';
import { registerFactCheck } from './lib/fact-checks';

const BASE = import.meta.env.BASE_URL;
const img = (f: string) => `${BASE}images/${f}`;

/* Le trajet est le moment mémorable : la ligne jaune traverse les cinq étapes.
   Son nombre d'étapes est vérifié contre le registre des faits. */
function Route() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    registerFactCheck({
      name: 'étapes du trajet',
      expected: route.steps.length,
      actual: ref.current?.querySelectorAll('.step').length ?? 0,
    });
  });

  return (
    <div className="route" ref={ref}>
      {route.steps.map((s) => (
        <div className="step" key={s.n}>
          <div className="step__n" aria-hidden="true">{s.n}</div>
          <h3>{s.h}</h3>
          <p>{s.p}</p>
          <img src={img(s.img)} alt={s.alt} width={900} height={506} loading="lazy" />
        </div>
      ))}
    </div>
  );
}

/* Les trois chiffres du bandeau viennent tous de facts.json. */
function Figures() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    registerFactCheck({
      name: 'bandeau de chiffres',
      fact: 'services.count',
      expected: fact('services.count'),
      actual: services.items.length - 1,
    });
  });

  return (
    <div className="figures" ref={ref}>
      {figures.items.map((f) => (
        <div className="figure" key={f.label}>
          <b>{f.value}</b>
          <span>{f.label}</span>
        </div>
      ))}
    </div>
  );
}

export default function App() {
  return (
    <>
      <div className="hero">
        <div className="hero__media" aria-hidden="true">
          <picture>
            <source media="(max-width: 44rem)" srcSet={img('hero-mobile.webp')} />
            <img src={img('hero.webp')} alt="" width={1600} height={900} fetchPriority="high" />
          </picture>
        </div>

        <header className="wrap nav">
          <img className="nav__logo" src={img('logo-light.webp')} alt={nav.logoAlt} width={520} height={143} />
          <a className="btn" href={QUOTE_MAIL}>{nav.cta}</a>
        </header>

        <div className="wrap hero__inner">
          <h1 className="hero__title">
            {hero.title.map((line) => <span key={line}>{line}</span>)}
          </h1>
          <p className="hero__lede">{hero.lede}</p>
          <div className="hero__stats">
            {hero.stats.map((s) => (
              <span key={s.label}><b>{s.value}</b> {s.label}</span>
            ))}
          </div>
          <div className="hero__actions">
            <a className="btn" href={QUOTE_MAIL}>{hero.cta}</a>
            <a className="btn btn--ghost" href="#route">{hero.ctaGhost}</a>
          </div>
        </div>
      </div>

      <main>
        <section className="section wrap" id="route">
          <p className="eyebrow">{route.eyebrow}</p>
          <h2 className="section__title">{route.title}</h2>
          <p className="section__lede">{route.lede}</p>
          <Route />
        </section>

        <section className="light">
          <div className="section wrap">
            <p className="eyebrow">{services.eyebrow}</p>
            <h2 className="section__title">{services.title}</h2>
            <div className="services">
              {services.items.map((s) => (
                <div className="service" key={s.h}>
                  <h3>{s.h}</h3>
                  <p>{s.p}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section wrap">
          <p className="eyebrow">{figures.eyebrow}</p>
          <h2 className="section__title">{figures.title}</h2>
          <Figures />
          <p style={{ marginTop: '2rem', fontSize: 'var(--step--1)', color: 'var(--text-dim)' }}>
            {figures.note}
          </p>
        </section>

        <section className="light">
          <div className="section wrap">
            <p className="eyebrow">{faq.eyebrow}</p>
            <h2 className="section__title">{faq.title}</h2>
            <div className="faq">
              {faq.items.map((f) => (
                <div key={f.q}>
                  <h3>{f.q}</h3>
                  <p>{f.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="quote">
          <div className="section wrap">
            <h2 className="section__title">{quote.title}</h2>
            <p className="section__lede">{quote.lede}</p>
            <p style={{ marginTop: '2rem' }}>
              <a className="btn" href={QUOTE_MAIL}>{quote.cta}</a>
            </p>
          </div>
        </section>
      </main>

      <footer className="foot wrap">
        <div className="foot__row">
          <strong>{foot.company}</strong>
          <span>{foot.tagline}</span>
          <a href={`mailto:${foot.email}`}>{foot.email}</a>
          {foot.socials.map((s) => (
            <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer">{s.label}</a>
          ))}
        </div>
      </footer>
    </>
  );
}
