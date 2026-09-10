"use client";

import { useActionState } from "react";
import { seConnecter, type EtatConnexion } from "../../../../actions/connexion";
import { T } from "../textes";

export function FormulaireConnexion() {
  const [etat, envoyer, enCours] = useActionState<EtatConnexion, FormData>(
    seConnecter,
    {
      type: "repos",
    },
  );

  return (
    <form action={envoyer}>
      <div className="groupe-admin">
        <label className="libelle-admin" htmlFor="courriel">
          {T.connexion.courriel}
        </label>
        <input
          className="champ-admin"
          id="courriel"
          name="courriel"
          type="email"
          autoComplete="username"
          defaultValue={etat.courriel ?? ""}
          required
        />
      </div>

      <div className="groupe-admin">
        <label className="libelle-admin" htmlFor="motDePasse">
          {T.connexion.motDePasse}
        </label>
        <input
          className="champ-admin"
          id="motDePasse"
          name="motDePasse"
          type="password"
          autoComplete="current-password"
          required
        />
      </div>

      {etat.type === "repos" ? null : (
        <div className="filet filet-alerte" role="alert">
          <p className="filet-texte">
            {etat.type === "refuse" ? T.connexion.refuse : T.connexion.indisponible}
          </p>
        </div>
      )}

      <button type="submit" className="bouton" disabled={enCours}>
        {T.connexion.entrer}
      </button>
    </form>
  );
}
