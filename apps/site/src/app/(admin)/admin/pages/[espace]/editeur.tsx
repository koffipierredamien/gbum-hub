"use client";

import { useActionState, useState } from "react";
import {
  enregistrerSections,
  publierSections,
  type EtatEditeur,
} from "../../../../../actions/editorial";
import { T, type PageEditable } from "../../textes";
import { ChampSection, type ValeurSection } from "./champ-section";
import { PanneauEtat } from "./panneau-etat";

export type { ValeurSection };

/**
 * L'éditeur d'une page, en deux langues.
 *
 * Il ne fait qu'une chose : recueillir ce qui est écrit et l'envoyer. L'état
 * de la page et le geste de publication vivent dans le panneau, à côté —
 * parce qu'ils répondent à une autre question, et qu'un écran qui mélange
 * « ce que j'écris » et « ce qui est en ligne » finit par publier par erreur.
 */
export function Editeur({
  page,
  valeurs,
}: {
  page: PageEditable;
  valeurs: Record<string, ValeurSection>;
}) {
  const [langue, setLangue] = useState<"fr" | "en">("fr");
  const [etatEnregistrement, enregistrer, enregistrementEnCours] = useActionState<
    EtatEditeur,
    FormData
  >(enregistrerSections, { type: "repos" });
  const [etatPublication, publier, publicationEnCours] = useActionState<
    EtatEditeur,
    FormData
  >(publierSections, { type: "repos" });

  const etat = etatPublication.type === "repos" ? etatEnregistrement : etatPublication;

  const brouillonsEnBase = page.sections.some((section) => {
    const valeur = valeurs[`${langue}:${section.cle}`];
    return (
      valeur !== undefined &&
      valeur.brouillon !== "" &&
      valeur.brouillon !== valeur.publie
    );
  });

  // Le rafraîchissement du serveur arrive une fraction de seconde après
  // l'enregistrement. Sans ces deux corrections, le bouton « Publier » restait
  // grisé juste après avoir enregistré — le seul geste qui met le texte en
  // ligne devenait impossible au moment précis où l'on en avait besoin.
  const aDesBrouillons =
    etatPublication.type === "publiee"
      ? false
      : brouillonsEnBase || etatEnregistrement.type === "enregistre";

  const message =
    etat.type === "enregistre"
      ? T.editeur.enregistre
      : etat.type === "publiee"
        ? T.editeur.publiee
        : T.editeur.echec;

  return (
    <main className="corps-admin">
      <p className="etiquette-admin">{T.pages.titre}</p>
      <h1 className="titre-admin">{page.titre}</h1>

      <div className="barre-boutons" style={{ marginBottom: 22 }}>
        {(["fr", "en"] as const).map((code) => (
          <button
            key={code}
            type="button"
            className={`onglet${langue === code ? " onglet-actif" : ""}`}
            aria-pressed={langue === code}
            onClick={() => {
              setLangue(code);
            }}
          >
            {code === "fr" ? T.editeur.francais : T.editeur.anglais}
          </button>
        ))}
        {langue === "en" ? (
          <span className="filet-texte">{T.editeur.anglaisAbsent}</span>
        ) : null}
      </div>

      <div className="editeur">
        <form action={enregistrer}>
          <input type="hidden" name="espace" value={page.espace} />
          <input type="hidden" name="langue" value={langue} />

          {page.sections.map((section) => (
            <ChampSection
              key={`${langue}:${section.cle}`}
              section={section}
              valeur={valeurs[`${langue}:${section.cle}`]}
            />
          ))}

          {etat.type === "repos" ? null : (
            <div
              className={`filet${etat.type === "echec" ? " filet-alerte" : ""}`}
              role="status"
            >
              <p className="filet-texte">{message}</p>
            </div>
          )}

          <button type="submit" className="bouton" disabled={enregistrementEnCours}>
            {T.editeur.enregistrer}
          </button>
        </form>

        <PanneauEtat
          page={page}
          valeurs={valeurs}
          langue={langue}
          aDesBrouillons={aDesBrouillons}
          publier={publier}
          publicationEnCours={publicationEnCours}
        />
      </div>
    </main>
  );
}
