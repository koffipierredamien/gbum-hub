"use client";

import { useActionState } from "react";
import { ajouterUnCompte, type EtatCompte } from "../../../../actions/comptes";
import { T } from "../textes";

const REFUS: Record<string, string> = {
  saisie: T.comptes.saisieIncomplete,
  role: T.comptes.roleInconnu,
  "trop-court": T.comptes.tropCourt,
  existe: T.comptes.dejaPris,
  "role-insuffisant": T.comptes.roleInsuffisant,
};

export function NouveauCompte() {
  const [etat, envoyer, enCours] = useActionState<EtatCompte, FormData>(
    ajouterUnCompte,
    {
      type: "repos",
    },
  );

  return (
    <form action={envoyer} className="carte-admin">
      <p className="etiquette-admin">{T.comptes.ajouter}</p>
      <p className="aide-admin">{T.comptes.ajouterAide}</p>

      <div className="groupe-admin">
        <label className="libelle-admin" htmlFor="nom">
          {T.comptes.nom}
        </label>
        <input className="champ-admin" id="nom" name="nom" required />
      </div>

      <div className="groupe-admin">
        <label className="libelle-admin" htmlFor="courriel">
          {T.comptes.courriel}
        </label>
        <input
          className="champ-admin"
          id="courriel"
          name="courriel"
          type="email"
          required
        />
      </div>

      <div className="groupe-admin">
        <label className="libelle-admin" htmlFor="motDePasse">
          {T.comptes.motDePasseInitial}
        </label>
        <input
          className="champ-admin"
          id="motDePasse"
          name="motDePasse"
          type="password"
          autoComplete="new-password"
          required
        />
      </div>

      <div className="groupe-admin">
        <label className="libelle-admin" htmlFor="role">
          {T.comptes.role}
        </label>
        <select
          className="champ-admin"
          id="role"
          name="role"
          defaultValue="secretariat"
        >
          <option value="secretariat">{T.comptes.roleSecretariat}</option>
          <option value="technique">{T.comptes.roleTechnique}</option>
        </select>
      </div>

      {etat.type === "repos" ? null : (
        <div
          className={etat.type === "cree" ? "filet" : "filet filet-alerte"}
          role="status"
        >
          <p className="filet-texte">
            {etat.type === "cree"
              ? `${T.comptes.cree} ${etat.courriel}`
              : (REFUS[etat.raison] ?? T.comptes.indisponible)}
          </p>
        </div>
      )}

      <button type="submit" className="bouton" disabled={enCours}>
        {T.comptes.creer}
      </button>
    </form>
  );
}
