"use client";

import { useActionState } from "react";
import { changerMonMotDePasse, type EtatMotDePasse } from "../../../../actions/comptes";
import { T } from "../textes";

const MESSAGES: Record<EtatMotDePasse["type"], string | null> = {
  repos: null,
  change: T.comptes.change,
  "ancien-faux": T.comptes.ancienFaux,
  "trop-court": T.comptes.tropCourt,
  "sans-confirmation": T.comptes.sansConfirmation,
  indisponible: T.comptes.indisponible,
};

export function MonMotDePasse() {
  const [etat, envoyer, enCours] = useActionState<EtatMotDePasse, FormData>(
    changerMonMotDePasse,
    { type: "repos" },
  );
  const message = MESSAGES[etat.type];

  return (
    <form action={envoyer} className="carte-admin">
      <p className="etiquette-admin">{T.comptes.monMotDePasse}</p>
      <p className="aide-admin">{T.comptes.monMotDePasseAide}</p>

      <div className="groupe-admin">
        <label className="libelle-admin" htmlFor="ancien">
          {T.comptes.ancien}
        </label>
        <input
          className="champ-admin"
          id="ancien"
          name="ancien"
          type="password"
          autoComplete="current-password"
          required
        />
      </div>

      <div className="groupe-admin">
        <label className="libelle-admin" htmlFor="nouveau">
          {T.comptes.nouveau}
        </label>
        <input
          className="champ-admin"
          id="nouveau"
          name="nouveau"
          type="password"
          autoComplete="new-password"
          required
        />
      </div>

      <div className="groupe-admin">
        <label className="libelle-admin" htmlFor="confirmation">
          {T.comptes.confirmation}
        </label>
        <input
          className="champ-admin"
          id="confirmation"
          name="confirmation"
          type="password"
          autoComplete="new-password"
          required
        />
      </div>

      {message === null ? null : (
        <div
          className={etat.type === "change" ? "filet" : "filet filet-alerte"}
          role="status"
        >
          <p className="filet-texte">{message}</p>
        </div>
      )}

      <button type="submit" className="bouton" disabled={enCours}>
        {T.comptes.changer}
      </button>
    </form>
  );
}
