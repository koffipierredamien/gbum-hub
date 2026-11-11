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
  readonly etiquette?: string;
}

export function DefileImages({ photos = [] }: { photos?: readonly PhotoDuDefile[] }) {
  const t = useTranslations("carrousel");
  const combien = photos.length > 0 ? photos.length : DEGRADES.length;

  const [actif, setActif] = useState(0);
  const [arrete, setArrete] = useState(false);
  const [survol, setSurvol] = useState(false);

  /**
   * Changer de vue à la main ARRÊTE le défilé, toujours.
   *
   * Sans cela, la minuterie reprendrait la main deux secondes après un clic
   * sur « suivante » et emporterait la photographie qu'on venait de choisir.
   * C'est aussi l'un des trois moyens d'arrêt qu'exige WCAG 2.2.2.
   */
  function allerA(indice: number) {
    setActif(((indice % combien) + combien) % combien);
    setArrete(true);
  }

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

      {photos[actif]?.etiquette === undefined ? null : (
        <p className="etiquette-photo">{photos[actif].etiquette}</p>
      )}

      <div className="commandes">
        {/* Au-delà de huit vues, la rangée de pastilles touche les boutons sur
            un téléphone de 393 px : douze pastilles en demandent 336 à elles
            seules. On les remplace alors par un compteur, qui tient en trois
            caractères quel que soit le nombre de photographies. Les flèches
            assurent la navigation, et le bouton pause le critère WCAG 2.2.2. */}
        <p className="compteur-vue">
          {actif + 1} / {combien}
        </p>
        <div
          role="group"
          aria-label={t("choisirVue")}
          className="pastilles"
          style={{ display: "flex" }}
        >
          {Array.from({ length: combien }, (_, index) => (
            <button
              key={photos[index]?.chemin ?? DEGRADES[index]}
              type="button"
              className="pastille"
              aria-label={t("vueNumero", { numero: index + 1 })}
              aria-current={index === actif}
              onClick={() => {
                allerA(index);
              }}
            >
              <span />
            </button>
          ))}
        </div>

        <div style={{ flexGrow: 1 }} />

        <div className="boutons-vue">
          <button
            type="button"
            className="fleche-vue"
            aria-label={t("precedente")}
            onClick={() => {
              allerA(actif - 1);
            }}
          >
            <Chevron vers="gauche" />
          </button>
          <button
            type="button"
            className="fleche-vue"
            aria-label={t("suivante")}
            onClick={() => {
              allerA(actif + 1);
            }}
          >
            <Chevron vers="droite" />
          </button>

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
      </div>
    </>
  );
}

/** Le chevron des deux flèches. Décoratif : le bouton porte déjà son nom. */
function Chevron({ vers }: { vers: "gauche" | "droite" }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d={vers === "gauche" ? "M15 5l-7 7 7 7" : "M9 5l7 7-7 7"}
        fill="none"
        stroke="#FBF6EF"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
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
