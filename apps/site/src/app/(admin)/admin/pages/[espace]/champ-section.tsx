"use client";

import type { SectionEditable } from "../../textes";

export interface ValeurSection {
  readonly brouillon: string;
  readonly publie: string;
  readonly livre: string;
}

/**
 * Le champ montre le brouillon s'il y en a un, sinon le texte publié, sinon
 * le texte livré avec le site. On voit donc toujours quelque chose de réel —
 * jamais un champ vide qui laisserait croire que la section l'est aussi alors
 * que le site affiche un texte.
 */
export function contenuInitial(valeur: ValeurSection | undefined): string {
  if (valeur === undefined) return "";
  if (valeur.brouillon !== "") return valeur.brouillon;
  if (valeur.publie !== "") return valeur.publie;
  return valeur.livre;
}

export function ChampSection({
  section,
  valeur,
}: {
  section: SectionEditable;
  valeur: ValeurSection | undefined;
}) {
  const contenu = contenuInitial(valeur);
  const nom = `section:${section.cle}`;

  return (
    <div className="groupe-admin">
      <label className="libelle-admin" htmlFor={nom}>
        {section.libelle}
      </label>
      {section.aide === undefined ? null : <p className="aide-admin">{section.aide}</p>}

      {/* La valeur d'origine repart avec le formulaire : l'action n'enregistre
          que ce qui a changé, et la colonne d'état ne marque « brouillon » que
          les sections réellement touchées. */}
      <input type="hidden" name={`origine:${section.cle}`} value={contenu} />

      {section.long === true ? (
        <textarea className="champ-admin" id={nom} name={nom} defaultValue={contenu} />
      ) : (
        <input className="champ-admin" id={nom} name={nom} defaultValue={contenu} />
      )}
    </div>
  );
}
