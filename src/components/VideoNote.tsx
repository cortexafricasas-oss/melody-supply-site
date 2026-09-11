import { useEffect, useRef, useState } from 'react';

/**
 * Une preuve, pas une piece de decoration : le visage qui repond dans le chat
 * est celui qui parle dans la video. C'est la reponse a l'objection « fournisseur
 * pas fiable », et elle tient en une ligne.
 *
 * La video n'est montee qu'a l'ouverture : tant que personne ne clique, la page
 * ne telecharge que la vignette. Un fichier de 6 Mo dans le chargement initial
 * couterait plus de visiteurs qu'il n'en convainc.
 */
const BASE = import.meta.env.BASE_URL;

type Props = {
  title: string;
  line: string;
  cta: string;
  poster: string;
  src: string;
};

export function VideoNote({ title, line, cta, poster, src }: Props) {
  const [open, setOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKey);

    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Le clic d'ouverture est un geste utilisateur : la plupart des navigateurs
    // acceptent le son. Les mobiles le refusent souvent ; plutot que de laisser
    // une image fixe, on rejoue en sourdine — les sous-titres sont incrustes.
    const video = videoRef.current;
    video?.play().catch(() => {
      video.muted = true;
      video.play().catch(() => undefined);
    });

    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = previous;
    };
  }, [open]);

  return (
    <>
      <button className="vnote" type="button" onClick={() => setOpen(true)} data-reveal>
        <span className="vnote__thumb">
          <img src={`${BASE}${poster}`} alt="" width={576} height={1024} loading="lazy" />
          <span className="vnote__play" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="12" height="12">
              <path d="M8 5v14l11-7z" fill="currentColor" />
            </svg>
          </span>
        </span>
        <span className="vnote__text">
          <strong>{title}</strong>
          <span>{line}</span>
          <span className="vnote__cta">{cta}</span>
        </span>
      </button>

      {open && (
        <div
          className="vmodal"
          role="dialog"
          aria-modal="true"
          aria-label={title}
          onClick={() => setOpen(false)}
        >
          <div className="vmodal__box" onClick={(e) => e.stopPropagation()}>
            <video
              ref={videoRef}
              className="vmodal__video"
              src={`${BASE}${src}`}
              poster={`${BASE}${poster}`}
              controls
              playsInline
              preload="auto"
            />
            <button
              className="vmodal__close"
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close the video"
            >
              <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
                <path
                  d="M6 6l12 12M18 6L6 18"
                  stroke="currentColor"
                  strokeWidth="2.6"
                  fill="none"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
