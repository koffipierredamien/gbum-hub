"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

/**
 * D11 — le défilé d'images de l'ouverture.
 *
 * Quatre vues qui se succèdent EN FONDU : ni glissement, ni zoom, ni
 * panoramique. Ce sont les mouvements de grande amplitude qui déclenchent les
 * troubles vestibulaires ; le fondu d'opacité est l'alternative sûre.
 *
 * Le critère WCAG 2.2.2 (Pause, Stop, Hide) impose un moyen d'arrêter tout
 * contenu qui se met à jour tout seul. Il y en a trois ici : le bouton pause,
 * les pastilles, et l'arrêt au survol. Sous prefers-reduced-motion, la feuille
 * de style ne laisse que la première vue — et la page ne perd rien.
 *
 * Les vues sont des dégradés tant que les photographies ne sont pas fournies
 * (demande N1). Ce sont les seules images du site, et elles sont attendues.
 */
const VUES = [
  "linear-gradient(160deg,#3B2F26 0%,#6B5340 55%,#8A6B4E 100%)",
  "linear-gradient(150deg,#4A3B2E 0%,#7E6349 100%)",
  "linear-gradient(200deg,#33291F 0%,#6E5A43 100%)",
  "linear-gradient(135deg,#2F2A24 0%,#7A5F45 100%)",
];

export function DefileImages() {
  const t = useTranslations("carrousel");
  const [arrete, setArrete] = useState(false);
  const [vueChoisie, setVueChoisie] = useState(0);

  // Choisir une vue arrête le défilé : c'est le comportement attendu d'une
  // pastille, et c'est l'un des trois moyens d'arrêt exigés par WCAG 2.2.2.
  const choisir = (index: number) => {
    setVueChoisie(index);
    setArrete(true);
  };

  return (
    <>
      <div className="carrousel" data-arrete={arrete} aria-hidden="true">
        {VUES.map((vue, index) => (
          <div
            key={vue}
            className="carrousel-vue"
            style={
              arrete
                ? { background: vue, opacity: index === vueChoisie ? 1 : 0 }
                : { background: vue }
            }
          />
        ))}
      </div>

      <div className="commandes">
        <div role="group" aria-label={t("choisirVue")} style={{ display: "flex" }}>
          {VUES.map((vue, index) => (
            <button
              key={vue}
              type="button"
              className="pastille"
              aria-label={t("vueNumero", { numero: index + 1 })}
              aria-current={arrete && index === vueChoisie}
              onClick={() => {
                choisir(index);
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
          {arrete ? (
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="#FBF6EF"
              aria-hidden="true"
            >
              <path d="M7 4l13 8-13 8z" />
            </svg>
          ) : (
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="#FBF6EF"
              aria-hidden="true"
            >
              <rect x="6" y="5" width="4" height="14" rx="1" />
              <rect x="14" y="5" width="4" height="14" rx="1" />
            </svg>
          )}
        </button>
      </div>
    </>
  );
}
