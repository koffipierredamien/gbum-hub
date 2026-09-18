"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

/**
 * D11 — le défilé d'images de l'ouverture.
 *
 * Les vues se succèdent EN FONDU : ni glissement, ni zoom, ni panoramique. Ce
 * sont les mouvements de grande amplitude qui déclenchent les troubles
 * vestibulaires ; le fondu d'opacité est l'alternative sûre.
 *
 * Le critère WCAG 2.2.2 (Pause, Stop, Hide) impose un moyen d'arrêter tout
 * contenu qui se met à jour tout seul. Il y en a trois : le bouton pause, les
 * pastilles, et l'arrêt au survol. Sous `prefers-reduced-motion`, le défilé ne
 * démarre pas — la première vue reste, et la page ne perd rien.
 *
 * Tant qu'aucune photographie n'est déposée dans `public/photos/`, ce sont des
 * dégradés qui tiennent la place, et le marqueur d'attente l'annonce. Dès
 * qu'il y en a, elles défilent et le marqueur disparaît de lui-même.
 *
 * **La rotation est pilotée ici et non par la feuille de style.** Une
 * animation CSS suppose un nombre de vues connu d'avance : avec trois
 * photographies au lieu de quatre, l'ouverture restait noire sept secondes par
 * tour. Trouvé le 18 septembre 2026, en déposant trois images.
 */
const DEGRADES = [
  "linear-gradient(160deg,#3B2F26 0%,#6B5340 55%,#8A6B4E 100%)",
  "linear-gradient(150deg,#4A3B2E 0%,#7E6349 100%)",
  "linear-gradient(200deg,#33291F 0%,#6E5A43 100%)",
  "linear-gradient(135deg,#2F2A24 0%,#7A5F45 100%)",
];

const DUREE_MS = 7000;

export interface PhotoDuDefile {
  readonly chemin: string;
  readonly description: string;
}

export function DefileImages({ photos = [] }: { photos?: readonly PhotoDuDefile[] }) {
  const t = useTranslations("carrousel");
  const combien = photos.length > 0 ? photos.length : DEGRADES.length;

  const [actif, setActif] = useState(0);
  const [arrete, setArrete] = useState(false);
  const [survol, setSurvol] = useState(false);

  useEffect(() => {
    if (arrete || survol || combien < 2) return undefined;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;

    const minuterie = setInterval(() => {
      setActif((index) => (index + 1) % combien);
    }, DUREE_MS);
    return () => {
      clearInterval(minuterie);
    };
  }, [arrete, survol, combien]);

  return (
    <>
      <div
        className="carrousel"
        aria-hidden={photos.length === 0}
        onMouseEnter={() => {
          setSurvol(true);
        }}
        onMouseLeave={() => {
          setSurvol(false);
        }}
      >
        {Array.from({ length: combien }, (_, index) => (
          <Vue
            key={photos[index]?.chemin ?? DEGRADES[index]}
            photo={photos[index]}
            degrade={DEGRADES[index % DEGRADES.length] ?? ""}
            visible={index === actif}
          />
        ))}
      </div>

      <div className="commandes">
        <div role="group" aria-label={t("choisirVue")} style={{ display: "flex" }}>
          {Array.from({ length: combien }, (_, index) => (
            <button
              key={photos[index]?.chemin ?? DEGRADES[index]}
              type="button"
              className="pastille"
              aria-label={t("vueNumero", { numero: index + 1 })}
              aria-current={index === actif}
              onClick={() => {
                // Choisir une vue arrête le défilé : c'est le comportement
                // attendu d'une pastille, et l'un des trois moyens d'arrêt
                // exigés par WCAG 2.2.2.
                setActif(index);
                setArrete(true);
              }}
            >
              <span />
            </button>
          ))}
        </div>

        <div style={{ flexGrow: 1 }} />

        <button
          type="button"
          className="pause"
          aria-pressed={arrete}
          aria-label={arrete ? t("reprendre") : t("arreter")}
          onClick={() => {
            setArrete((etat) => !etat);
          }}
        >
          <Icone lecture={arrete} />
        </button>
      </div>
    </>
  );
}

/**
 * Une vue : une photographie, ou un dégradé s'il n'y en a pas encore.
 *
 * Seule la vue visible porte sa description. Sans cela, un lecteur d'écran
 * énoncerait les quatre descriptions à la suite, alors qu'une seule est à
 * l'écran.
 */
function Vue({
  photo,
  degrade,
  visible,
}: {
  photo: PhotoDuDefile | undefined;
  degrade: string;
  visible: boolean;
}) {
  const opacite = { opacity: visible ? 1 : 0 };

  if (photo === undefined) {
    return (
      <div className="carrousel-vue" style={{ background: degrade, ...opacite }} />
    );
  }

  return (
    <img
      className="carrousel-vue"
      src={photo.chemin}
      alt={visible ? photo.description : ""}
      aria-hidden={!visible}
      style={opacite}
    />
  );
}

function Icone({ lecture }: { lecture: boolean }) {
  return lecture ? (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="#FBF6EF" aria-hidden="true">
      <path d="M7 4l13 8-13 8z" />
    </svg>
  ) : (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="#FBF6EF" aria-hidden="true">
      <rect x="6" y="5" width="4" height="14" rx="1" />
      <rect x="14" y="5" width="4" height="14" rx="1" />
    </svg>
  );
}
