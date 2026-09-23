"use client";

import { useActionState } from "react";
import { envoyerCollecte, type EtatCollecte } from "../../../actions/collecte";
import { QUESTIONS } from "../questions";

const MESSAGES: Record<EtatCollecte["type"], string> = {
  repos: "",
  recu: "",
  vide: "Aucune réponse n'a été saisie. Remplissez au moins une question.",
  "sans-nom": "Indiquez votre nom : nous devons savoir qui a répondu quoi.",
  refuse: "Ce lien n'est plus valable. Demandez-en un nouveau.",
  indisponible: "L'enregistrement a échoué. Réessayez dans quelques minutes.",
};

export function FormulaireCollecte({ cle }: { cle: string }) {
  const [etat, envoyer, enCours] = useActionState<EtatCollecte, FormData>(
    envoyerCollecte,
    { type: "repos" },
  );

  // React remet le formulaire à zéro après chaque action, refus compris : on
  // réécrit donc ce qui avait été tapé.
  const saisies = "saisies" in etat ? etat.saisies : {};

  if (etat.type === "recu") {
    return (
      <div className="filet" role="status">
        <p className="filet-titre">Reçu. Merci.</p>
        <p className="filet-texte">
          {etat.combien === 1
            ? "Votre réponse est enregistrée."
            : `Vos ${String(etat.combien)} réponses sont enregistrées.`}{" "}
          Elles seront relues avant d'apparaître sur le site. Vous pouvez revenir
          compléter le reste avec le même lien, quand vous voulez.
        </p>
      </div>
    );
  }

  return (
    <form action={envoyer}>
      <input type="hidden" name="cle" value={cle} />

      <div className="groupe-admin">
        <label className="libelle-admin" htmlFor="auteur">
          Votre nom
        </label>
        <input
          className="champ-admin"
          id="auteur"
          name="auteur"
          defaultValue={saisies["auteur"] ?? ""}
          required
        />
      </div>

      <div className="groupe-admin">
        <label className="libelle-admin" htmlFor="contact">
          Votre courriel ou téléphone (facultatif)
        </label>
        <input
          className="champ-admin"
          id="contact"
          name="contact"
          defaultValue={saisies["contact"] ?? ""}
        />
        <p className="aide-admin">
          Pour vous recontacter si une réponse demande une précision.
        </p>
      </div>

      {QUESTIONS.map((question) => (
        <div key={question.cle} className="groupe-admin">
          <label className="libelle-admin" htmlFor={question.cle}>
            {question.libelle}
          </label>
          {question.long === true ? (
            <textarea
              className="champ-admin"
              id={question.cle}
              name={question.cle}
              defaultValue={saisies[question.cle] ?? ""}
              rows={4}
            />
          ) : (
            <input
              className="champ-admin"
              id={question.cle}
              name={question.cle}
              defaultValue={saisies[question.cle] ?? ""}
            />
          )}
          <p className="aide-admin">{question.aide}</p>
        </div>
      ))}

      {MESSAGES[etat.type] === "" ? null : (
        <div className="filet filet-alerte" role="alert">
          <p className="filet-texte">{MESSAGES[etat.type]}</p>
        </div>
      )}

      <button type="submit" className="bouton" disabled={enCours}>
        Envoyer mes réponses
      </button>
    </form>
  );
}
