"use client";

import { useActionState } from "react";
import { useTranslations } from "next-intl";
import { envoyerDemande, type EtatEnvoi } from "../actions/demande";
import { Attente } from "./attente";
import { Fleche } from "./fleche";

export interface ChampTexte {
  readonly nom: string;
  readonly etiquette: string;
  readonly indice: string;
  readonly zone?: boolean;
}

/**
 * Le formulaire des deux pages qui en ont un — « Nous écrire » et la
 * troisième étape de « Rejoindre ».
 *
 * Un seul composant, donc une seule règle de validation, un seul piège à
 * robots, et un seul endroit où corriger le jour où quelque chose cloche
 * (R5). Deux formulaires recopiés finissent toujours par diverger.
 *
 * L'état de l'envoi est DIT, dans les trois cas : envoyé, champs incomplets,
 * base injoignable. Répondre « envoyé » quand rien n'est parti serait la pire
 * des réponses — la personne attendrait une réponse qui ne viendrait jamais.
 */
export function FormulaireDemande({
  sujet,
  champs,
  villes,
  action,
}: {
  sujet: string;
  champs: readonly ChampTexte[];
  villes?: readonly { id: string; nom: string }[] | undefined;
  action: string;
}) {
  const c = useTranslations("commun");
  const [etat, envoyer, enCours] = useActionState<EtatEnvoi, FormData>(envoyerDemande, {
    type: "repos",
  });

  if (etat.type === "envoye") {
    return (
      <div role="status">
        <p className="titre-serif" style={{ marginBottom: 8 }}>
          {c("envoiReussiTitre")}
        </p>
        <p className="petit second" style={{ maxWidth: "var(--largeur-texte)" }}>
          {c("envoiReussiTexte")}
        </p>
        <Attente titre={c("notificationTitre")} texte={c("notificationTexte")} />
      </div>
    );
  }

  return (
    <form action={envoyer}>
      <input type="hidden" name="sujet" value={sujet} />

      {/* Le piège à robots : hors de l'ordre de tabulation, annoncé comme
          décoratif aux lecteurs d'écran, et invisible à l'œil. Un humain ne le
          voit jamais ; une machine le remplit. */}
      <input
        type="text"
        name="piege"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="piege"
      />

      {villes === undefined || villes.length === 0 ? null : (
        <div className="champ-groupe">
          <label className="etiquette-champ" htmlFor="villeId">
            {c("villeChoix")}
          </label>
          <select className="champ" id="villeId" name="villeId" defaultValue="">
            <option value="">—</option>
            {villes.map((ville) => (
              <option key={ville.id} value={ville.id}>
                {ville.nom}
              </option>
            ))}
          </select>
        </div>
      )}

      {champs.map((champ) => (
        <div className="champ-groupe" key={champ.nom}>
          <label className="etiquette-champ" htmlFor={champ.nom}>
            {champ.etiquette}
          </label>
          {champ.zone === true ? (
            <textarea
              className="champ"
              id={champ.nom}
              name={champ.nom}
              placeholder={champ.indice}
              required
            />
          ) : (
            <input
              className="champ"
              id={champ.nom}
              name={champ.nom}
              placeholder={champ.indice}
              required={champ.nom !== "villeLibre"}
            />
          )}
        </div>
      ))}

      {etat.type === "refuse" ? (
        <p className="erreur" role="alert">
          {etat.cause === "champs"
            ? c("envoiRefuseChamps")
            : c("envoiRefuseIndisponible")}
        </p>
      ) : null}

      <button type="submit" className="cta" disabled={enCours}>
        {action} <Fleche />
      </button>
    </form>
  );
}
