import type { ReactNode } from "react";
import { Hanken_Grotesk, Newsreader } from "next/font/google";
import "../../styles/admin.css";

const serif = Newsreader({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--police-serif-chargee",
  display: "swap",
});
const sans = Hanken_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--police-sans-chargee",
  display: "swap",
});

/**
 * La disposition du formulaire de collecte : une TROISIÈME racine.
 *
 * Elle emprunte la feuille de style de l'administration — c'est un formulaire
 * de travail, pas une page de vitrine — mais ni ses onglets, ni son en-tête de
 * compte : la personne qui répond n'est pas connectée, et n'a rien à faire
 * dans l'espace d'administration.
 */
export default function DispositionCollecte({ children }: { children: ReactNode }) {
  return (
    <html lang="fr" className={`${serif.variable} ${sans.variable}`}>
      <body>
        <header className="barre">
          <span className="barre-jeton" aria-hidden="true">
            G
          </span>
          <span>
            <span className="barre-nom" style={{ display: "block" }}>
              GBU Maroc
            </span>
            <span className="barre-sous">renseigner le site</span>
          </span>
        </header>
        {children}
      </body>
    </html>
  );
}
