import type { ReactNode } from "react";
import { Hanken_Grotesk, Newsreader } from "next/font/google";
import { compterDemandesNonTraitees } from "@gbum/db";
import { compteConnecte } from "../../../auth/session";
import { seDeconnecter } from "../../../actions/connexion";
import { Onglets } from "./onglets";
import { T } from "./textes";
import "../../../styles/admin.css";

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

export const metadata = { title: "Administration · GBU Maroc" };

/**
 * La disposition de l'espace d'administration.
 *
 * C'est une SECONDE racine : le site public a la sienne, sous `(public)`.
 * Les deux ne partagent ni la feuille de style, ni la langue, ni les
 * dépendances — l'administration ne charge pas le nécessaire du site public,
 * et réciproquement.
 */
export default async function DispositionAdmin({ children }: { children: ReactNode }) {
  const compte = await compteConnecte();
  const aTraiter = compte === null ? 0 : await compterOuZero();

  return (
    <html lang="fr" className={`${serif.variable} ${sans.variable}`}>
      <body>
        <header className="barre">
          <span className="barre-jeton" aria-hidden="true">
            G
          </span>
          <span>
            <span className="barre-nom" style={{ display: "block" }}>
              {T.titre}
            </span>
            <span className="barre-sous">{T.sousTitre}</span>
          </span>
          <span style={{ flexGrow: 1 }} />
          {compte === null ? null : (
            <>
              <span className="barre-compte">
                {compte.nom} · {compte.role}
              </span>
              <form action={seDeconnecter}>
                <button type="submit" className="bouton-nu">
                  {T.deconnexion}
                </button>
              </form>
            </>
          )}
        </header>
        {compte === null ? null : <Onglets demandesNonTraitees={aTraiter} />}
        {children}
      </body>
    </html>
  );
}

/**
 * R2 — le compteur n'est pas la raison d'être de cet écran. Si la base ne
 * répond pas, on journalise et on affiche zéro plutôt que de refuser toute
 * l'administration : les autres écrans diront eux-mêmes ce qui ne va pas.
 */
async function compterOuZero(): Promise<number> {
  try {
    return await compterDemandesNonTraitees();
  } catch (cause) {
    console.error("comptage des demandes non traitées", { cause });
    return 0;
  }
}
