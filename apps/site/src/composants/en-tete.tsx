"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "../i18n/navigation";
import { LANGUES } from "../i18n/routage";
import { MENU } from "./pages";

/**
 * La barre du site.
 *
 * Sur téléphone : la marque, le sélecteur de langue, et un menu qui se
 * déplie. Au bureau : les sept entrées, et le bouton « Rejoindre le GBUM » —
 * l'unique bouton ambre de l'en-tête, parce que c'est l'unique action.
 *
 * Sur l'accueil, elle est posée par-dessus l'ouverture : ni fond, ni filet, et
 * son texte passe en crème — sur un voile, le texte est en crème et seulement
 * en crème (D3).
 */
export function EnTete() {
  const t = useTranslations("navigation");
  const langue = useLocale();
  const chemin = usePathname();
  const [deplie, setDeplie] = useState(false);

  // Sur l'accueil, la barre est posée PAR-DESSUS le défilé d'images : elle n'a
  // ni fond ni filet, et son texte passe en crème. Elle le décide elle-même
  // plutôt que d'être configurée par chaque page — sinon l'accueil devait la
  // rendre une seconde fois, et il y en avait deux.
  const surPhoto = chemin === "/";

  return (
    <>
      <header className={`en-tete${surPhoto ? " en-tete-sur-photo" : ""}`}>
        <Link href="/" className="marque">
          <span className="marque-jeton" aria-hidden="true">
            G
          </span>
          <span style={{ lineHeight: 1.15 }}>
            <span style={{ display: "block", fontSize: "0.90625rem", fontWeight: 700 }}>
              {t("marque")}
            </span>
            <span style={{ display: "block", fontSize: "0.6875rem", opacity: 0.75 }}>
              {t("marqueLong")}
            </span>
          </span>
        </Link>

        <div style={{ flexGrow: 1 }} />

        <nav className="nav" aria-label={t("menuPrincipal")}>
          {MENU.map((entree) => (
            <Link
              key={entree.chemin}
              href={entree.chemin}
              aria-current={chemin === entree.chemin ? "page" : undefined}
            >
              <span>{t(entree.cle)}</span>
            </Link>
          ))}
        </nav>

        <div className="langues">
          {LANGUES.map((code) => (
            <Link
              key={code}
              href={chemin}
              locale={code}
              hrefLang={code}
              aria-current={code === langue}
            >
              {code.toUpperCase()}
            </Link>
          ))}
        </div>

        <Link href="/rejoindre" className="cta nav-cta" style={{ minHeight: 44 }}>
          {t("rejoindre")}
        </Link>

        <button
          type="button"
          className="menu-bouton"
          aria-expanded={deplie}
          aria-controls="menu-repli"
          aria-label={deplie ? t("fermerMenu") : t("ouvrirMenu")}
          onClick={() => {
            setDeplie((etat) => !etat);
          }}
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.9"
            strokeLinecap="round"
            aria-hidden="true"
          >
            {deplie ? (
              <path d="M6 6l12 12M18 6L6 18" />
            ) : (
              <path d="M3 7h18M3 12h18M3 17h18" />
            )}
          </svg>
        </button>
      </header>

      <nav
        id="menu-repli"
        className="menu-repli"
        aria-label={t("menuPrincipal")}
        hidden={!deplie}
      >
        {MENU.map((entree) => (
          <Link
            key={entree.chemin}
            href={entree.chemin}
            onClick={() => {
              setDeplie(false);
            }}
          >
            {t(entree.cle)}
          </Link>
        ))}
      </nav>
    </>
  );
}
