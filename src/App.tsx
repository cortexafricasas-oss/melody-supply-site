import { useEffect, useRef, useState } from 'react';
import {
  WHATSAPP_LINK, WHATSAPP_NUMBER, CONTACT_EMAIL, nav, hero, catalogue, products, sourcing, process, store, faq, contact, doubts, foot, fact,
} from './content';
import { registerFactCheck } from './lib/fact-checks';
import { startMotion } from './lib/reveal';
import { Ask } from './components/Ask';
import { QuoteForm } from './components/QuoteForm';
import { Icon } from './components/Icon';
import { VideoNote } from './components/VideoNote';

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
        <li className="step" key={s.h}>
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
  const [all, setAll] = useState(false);

  useEffect(() => {
    registerFactCheck({
      name: 'categories de produits',
      fact: 'categories.count',
      expected: products.categories.length,
      actual: ref.current?.querySelectorAll('li').length ?? 0,
    });
  });

  /* Huit categories suffisent a montrer l'etendue ; les quinze autres tiennent
     derriere un depliage plutot que 400 px de liste sur un telephone. */
  const VISIBLES = 8;
  return (
    <>
      <ul className="cats" ref={ref}>
        {products.categories.map((c, i) => (
          <li key={c} hidden={i >= VISIBLES && !all}>{c}</li>
        ))}
      </ul>
      {!all && (
        <button className="cats__more" type="button" onClick={() => setAll(true)}>
          See all {products.categories.length} categories
        </button>
      )}
    </>
  );
}

/* Les doutes et leurs reponses : une colonne de lignes, pas une grille de cartes.
   Le rythme de la page repose sur cette rupture. */
function Doubts() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    registerFactCheck({
      name: 'doutes traites',
      fact: 'objections.count',
      expected: doubts.items.length,
      actual: ref.current?.querySelectorAll('.doubt').length ?? 0,
    });
  });

  return (
    <div className="doubts" ref={ref}>
      {doubts.items.map((d) => (
        <div className="doubt" key={d.q}>
          <p className="doubt__q">{d.q}</p>
          <p className="doubt__a">{d.a}</p>
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
                    <h2 className="section__title">{products.title}</h2>
          <p className="section__lede">{products.lede}</p>
          <Categories />
          <div className="cards cards--2">
            {products.points.map((p) => (
              <div className="card" key={p.h}>
                <h3>{p.h}</h3>
                <p>{p.p}</p>
              </div>
            ))}
          </div>
          <p className="sub-label">Included with every order</p>
          <ul className="chips">
            {products.included.map((i) => <li key={i}>{i}</li>)}
          </ul>
        </section>

        {/* Les deux facons d'obtenir la marchandise, en une seule section :
            se servir dans les catalogues, ou nous nommer le produit. */}
        <section className="light" id="catalogue">
          <div className="section wrap">
            <h2 className="section__title">{catalogue.title}</h2>
            <p className="section__lede">{catalogue.lede}</p>

            <div className="cards cards--2">
              {catalogue.lines.map((l) => (
                <div className="card cat" key={l.h}>
                  <h3>{l.h}</h3>
                  <p className="cat__price">{l.price}</p>
                  <p>{l.p}</p>
                  <p className="cat__cta">
                    <a className="btn btn--sm" href={l.href} target="_blank" rel="noopener noreferrer">
                      {l.cta}
                    </a>
                  </p>
                </div>
              ))}
            </div>

            <ul className="tips">
              {catalogue.tips.map((t) => <li key={t}>{t}</li>)}
            </ul>
            <p className="cat__note">{catalogue.note}</p>

            <div className="split" id="sourcing">
              <h3 className="split__title">{sourcing.title}</h3>
              <p className="split__lede">{sourcing.lede}</p>
            </div>

            <dl className="equip">
              {sourcing.items.map((item) => (
                <div className="equip__row" key={item.h}>
                  <dt>{item.h}</dt>
                  <dd>{item.p}</dd>
                </div>
              ))}
            </dl>

            <VideoNote
              title={sourcing.video.title}
              line={sourcing.video.line}
              cta={sourcing.video.cta}
              poster={sourcing.video.poster}
              src={sourcing.video.src}
            />

            <p className="sub-label">{sourcing.forWhom.h}</p>
            <ul className="chips">
              {sourcing.forWhom.list.map((i) => <li key={i}>{i}</li>)}
            </ul>
          </div>
        </section>

        {/* Les doutes, fusion des anciennes sections objections, avantages et format */}
        <section className="light" id="objections">
          <div className="section wrap">
            <p className="eyebrow">{doubts.eyebrow}</p>
            <h2 className="section__title">{doubts.title}</h2>
            <p className="section__lede">{doubts.lede}</p>
            <Doubts />
          </div>
        </section>

        {/* Le processus : moment memorable */}
        <section className="section wrap" id="process">
          <h2 className="section__title">{process.title}</h2>
          <p className="section__lede">{process.lede}</p>
          <Process />
        </section>

        {/* La salle de vente : preuve visuelle + ce qu'on equipe */}
        <section className="light" id="store">
          <div className="section wrap">
            <h2 className="section__title">{store.title}</h2>
            <p className="section__lede">{store.lede}</p>

            <div className="shots">
              {store.shots.map((shot) => (
                <figure className="shot" key={shot.src}>
                  <img
                    src={`${BASE}${shot.src}`}
                    alt={shot.alt}
                    width={1200}
                    height={675}
                    loading="lazy"
                    decoding="async"
                  />
                </figure>
              ))}
            </div>
            <p className="shots__caption">{store.caption}</p>

            <dl className="equip">
              {store.items.map((item) => (
                <div className="equip__row" key={item.h}>
                  <dt>{item.h}</dt>
                  <dd>{item.p}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* FAQ */}
        <section className="light" id="faq">
          <div className="section wrap">
                        <h2 className="section__title">{faq.title}</h2>
            <div className="faq">
              {faq.items.map((f) => (
                <details key={f.q}>
                  <summary>{f.q}</summary>
                  <p>{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* Contact */}
        <section className="quote" id="contact">
          <div className="section wrap">
            <p className="eyebrow">{contact.eyebrow}</p>
            <h2 className="section__title">{contact.title}</h2>
            <p className="section__lede">{contact.lede}</p>
            <QuoteForm />
            <p className="quote__reassure">{contact.reassurance}</p>
          </div>
        </section>
      </main>

      <Ask />

      <footer className="foot">
        <div className="wrap">
          <div className="foot__brand">
            <strong>{foot.company}</strong>
            <span>{foot.tagline}</span>
          </div>

          <ul className="foot__reach">
            {foot.reach.map((r) => (
              <li key={r.label}>
                <span className="foot__ico" aria-hidden="true">
                  <Icon name={r.icon as never} />
                </span>
                <span className="foot__txt">
                  <b>{r.label}</b>
                  {r.href ? (
                    <a href={r.href} target={r.href.startsWith('http') ? '_blank' : undefined}
                       rel={r.href.startsWith('http') ? 'noopener' : undefined}>{r.value}</a>
                  ) : (
                    <span className="foot__plain">{r.value}</span>
                  )}
                  {r.note && <em>{r.note}</em>}
                </span>
              </li>
            ))}
          </ul>

          <ul className="foot__social">
            {foot.socials.map((sn) => (
              <li key={sn.label}>
                {/* Une icone sans destination ne doit pas etre un lien : ni au
                    clavier, ni pour un lecteur d'ecran, qui annoncerait un lien
                    menant nulle part. */}
                {sn.href ? (
                  <a href={sn.href} target="_blank" rel="noopener noreferrer"
                     aria-label={sn.label} title={sn.label}>
                    <Icon name={sn.icon as never} size={22} />
                  </a>
                ) : (
                  <span className="foot__social-mute" aria-hidden="true" title={sn.label}>
                    <Icon name={sn.icon as never} size={22} />
                  </span>
                )}
              </li>
            ))}
          </ul>

          <p className="foot__legal">{foot.legal}</p>
          <p className="foot__legal">{foot.terms}</p>
        </div>
      </footer>
    </>
  );
}
