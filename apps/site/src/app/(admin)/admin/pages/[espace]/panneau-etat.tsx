"use client";

import Link from "next/link";
import { T, type PageEditable } from "../../textes";
import type { ValeurSection } from "./champ-section";

function etatDe(valeur: ValeurSection | undefined): { texte: string; classe: string } {
  if (valeur === undefined) return { texte: T.editeur.vide, classe: "etat-vide" };
  if (valeur.brouillon !== "" && valeur.brouillon !== valeur.publie) {
    return { texte: T.editeur.brouillon, classe: "etat-brouillon" };
  }
  if (valeur.publie !== "") return { texte: T.editeur.ecrite, classe: "etat-ecrite" };
  return { texte: T.editeur.vide, classe: "etat-vide" };
}

/**
 * Le panneau de droite : l'état de la page, le bouton qui publie, et la liste
 * des sections avec ce qu'elles valent.
 *
 * Il est séparé de l'éditeur parce qu'il répond à une autre question. Le
 * formulaire demande « qu'est-ce que j'écris ? » ; ce panneau demande « qu'est-ce
 * qui est en ligne ? ». Ce sont deux choses qu'un espace d'administration ne
 * doit jamais confondre.
 */
export function PanneauEtat({
  page,
  valeurs,
  langue,
  aDesBrouillons,
  publier,
  publicationEnCours,
}: {
  page: PageEditable;
  valeurs: Record<string, ValeurSection>;
  langue: string;
  aDesBrouillons: boolean;
  publier: (donnees: FormData) => void;
  publicationEnCours: boolean;
}) {
  return (
    <aside>
      <div className="panneau-encre" style={{ marginBottom: 16 }}>
        <p className="etiquette-admin" style={{ color: "var(--sur-encre-accent)" }}>
          {T.editeur.etat}
        </p>
        <p className="panneau-titre">
          {aDesBrouillons ? T.editeur.nonPublie : T.editeur.toutPublie}
        </p>
        <p className="filet-texte">
          {aDesBrouillons ? T.editeur.nonPublieTexte : T.editeur.toutPublieTexte}
        </p>
      </div>

      <form action={publier} style={{ marginBottom: 16 }}>
        <input type="hidden" name="espace" value={page.espace} />
        <button
          type="submit"
          className="bouton"
          disabled={publicationEnCours || !aDesBrouillons}
        >
          {T.editeur.publier}
        </button>
      </form>

      <div className="carte-admin">
        <p className="etiquette-admin">{T.editeur.sections}</p>
        {page.sections.map((section) => {
          const marque = etatDe(valeurs[`${langue}:${section.cle}`]);
          return (
            <div className="rang-admin" key={section.cle}>
              <span style={{ fontSize: "0.9375rem", fontWeight: 600 }}>
                {section.libelle}
              </span>
              <span className={`marque-etat ${marque.classe}`}>{marque.texte}</span>
            </div>
          );
        })}
      </div>

      <p style={{ marginTop: 16 }}>
        <Link href={`/fr${page.chemin === "/" ? "" : page.chemin}`} target="_blank">
          {T.editeur.voir}
        </Link>
      </p>
    </aside>
  );
}
