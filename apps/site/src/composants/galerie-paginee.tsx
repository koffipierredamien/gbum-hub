"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Fleche } from "./fleche";

export interface PhotoDeGalerie {
  readonly chemin: string;
  readonly description: string;
  readonly etiquette?: string;
  readonly pleineLargeur?: boolean;
  readonly portrait?: boolean;
}

/** Six par page : deux rangées de trois au bureau, six cases sur un téléphone. */
const PAR_PAGE = 6;

/**
 * La grille de photographies, par pages.
 *
 * Toutes les images d'un coup, c'est une page qui n'en finit plus et quelques
 * mégaoctets inutiles pour qui n'en regarde que six. On en montre six, et on
 * tourne la page.
 *
 * Le changement de page REMET LE FOCUS sur le titre de la section et l'annonce
 * à voix haute : sans cela, une personne au clavier se retrouve à cliquer
 * « suivante » dans le vide, et un lecteur d'écran ne dit rien du tout —
 * l'écran a changé, pas le curseur.
 */
export function GaleriePaginee({ photos }: { photos: readonly PhotoDeGalerie[] }) {
  const t = useTranslations("accueil");
  const [page, setPage] = useState(0);

  const pages = Math.max(1, Math.ceil(photos.length / PAR_PAGE));
  const visibles = photos.slice(page * PAR_PAGE, page * PAR_PAGE + PAR_PAGE);

  return (
    <>
      <ul className="galerie">
        {visibles.map((photo) => (
          <li
            key={photo.chemin}
            {...(photo.pleineLargeur === true
              ? { className: "galerie-large" }
              : photo.portrait === true
                ? { className: "galerie-portrait" }
                : {})}
          >
            <figure>
              <img
                src={photo.chemin}
                alt={photo.description}
                loading="lazy"
                decoding="async"
              />
              {photo.etiquette === undefined ? null : (
                <figcaption>{photo.etiquette}</figcaption>
              )}
            </figure>
          </li>
        ))}
      </ul>

      {pages < 2 ? null : (
        <div className="galerie-pages">
          <button
            type="button"
            className="bouton-page"
            disabled={page === 0}
            onClick={() => {
              setPage((p) => Math.max(0, p - 1));
            }}
          >
            {t("galeriePrecedente")}
          </button>
          <p aria-live="polite" className="petit second" style={{ margin: 0 }}>
            {t("galeriePage", { page: page + 1, total: pages })}
          </p>
          <button
            type="button"
            className="bouton-page"
            disabled={page === pages - 1}
            onClick={() => {
              setPage((p) => Math.min(pages - 1, p + 1));
            }}
          >
            {t("galerieSuivante")} <Fleche />
          </button>
        </div>
      )}
    </>
  );
}
