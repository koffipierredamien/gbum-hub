import Link from "next/link";
import {
  compterDemandesNonTraitees,
  lireSectionsPubliees,
  lireVillesEtCellules,
} from "@gbum/db";
import { exigerCompte } from "../../../auth/garde";
import { PAGES_EDITABLES, T } from "./textes";

export const dynamic = "force-dynamic";

/**
 * Le tableau de bord : ce qui attend une main.
 *
 * Il ne montre pas des statistiques d'usage — le mouvement n'en a que faire.
 * Il montre exactement ce que le site public annonce comme manquant, parce
 * que chaque ligne remplie ici fait disparaître un encadré là-bas.
 */
export default async function TableauDeBord() {
  await exigerCompte();

  const total =
    PAGES_EDITABLES.reduce((somme, page) => somme + page.sections.length, 0) * 2;
  const etat = await lireEtat();
  const ecrites = etat.publiees;

  const chiffres = [
    { valeur: total - ecrites, libelle: T.tableau.sectionsVides, attente: true },
    { valeur: ecrites, libelle: T.tableau.sectionsEcrites, attente: false },
    { valeur: etat.villes, libelle: T.tableau.villes, attente: etat.villes === 0 },
    {
      valeur: etat.cellules,
      libelle: T.tableau.cellules,
      attente: etat.cellules === 0,
    },
    {
      valeur: etat.demandes,
      libelle: T.tableau.demandesNonTraitees,
      attente: etat.demandes > 0,
    },
  ];

  return (
    <main className="corps-admin">
      <h1 className="titre-admin">{T.tableau.titre}</h1>
      <p className="accroche-admin">{T.tableau.accroche}</p>

      <div className="grille-admin grille-3-admin" style={{ marginBottom: 28 }}>
        {chiffres.map((chiffre) => (
          <div className="carte-admin" key={chiffre.libelle}>
            <p className={`chiffre-admin${chiffre.attente ? " chiffre-attente" : ""}`}>
              {chiffre.valeur}
            </p>
            <p className="filet-texte" style={{ marginTop: 6 }}>
              {chiffre.libelle}
            </p>
          </div>
        ))}
      </div>

      <div className="barre-boutons">
        <Link href="/admin/pages" className="bouton">
          {T.onglets.pages}
        </Link>
        <a href="/fr" className="bouton bouton-second" target="_blank" rel="noreferrer">
          {T.tableau.voirLeSite}
        </a>
      </div>
    </main>
  );
}

/**
 * R2 — si la base ne répond pas, on le journalise et on rend des zéros plutôt
 * que de refuser l'écran : les autres onglets diront eux-mêmes ce qui cloche,
 * et un tableau de bord qui refuse de s'afficher n'apprend rien à personne.
 */
async function lireEtat(): Promise<{
  publiees: number;
  villes: number;
  cellules: number;
  demandes: number;
}> {
  try {
    const [sections, structure, demandes] = await Promise.all([
      lireSectionsPubliees(),
      lireVillesEtCellules(),
      compterDemandesNonTraitees(),
    ]);
    const utiles = sections.filter(
      (section) => section.publie !== null && section.publie.trim() !== "",
    );
    return {
      publiees: utiles.length,
      villes: structure.villes.length,
      cellules: structure.cellules.length,
      demandes,
    };
  } catch (cause) {
    console.error("lecture de l'état du site", { cause });
    return { publiees: 0, villes: 0, cellules: 0, demandes: 0 };
  }
}
