"use client";

import { useActionState } from "react";
import type { CompteDetaille } from "@gbum/db";
import { basculerLAcces, type EtatAcces } from "../../../../actions/comptes";
import { T } from "../textes";

function quand(date: Date | null): string {
  return date === null
    ? T.comptes.jamais
    : new Date(date).toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
}

/** Une ligne d'identité : qui, quel rôle, quel état, vu quand. */
function Identite({ compte, cestMoi }: { compte: CompteDetaille; cestMoi: boolean }) {
  return (
    <div>
      <p className="etiquette-admin">
        {compte.nom}
        {cestMoi ? ` · ${T.comptes.vous}` : ""}
      </p>
      <p className="aide-admin" style={{ margin: 0 }}>
        {compte.courriel} · {T.comptes.roles[compte.role] ?? compte.role} ·{" "}
        {compte.actif ? T.comptes.actif : T.comptes.retire} · {T.comptes.derniereVenue}{" "}
        {quand(compte.derniereConnexion)}
      </p>
    </div>
  );
}

/** Le refus, dit en clair. Un bouton qui ne fait rien sans explication est pire
 *  qu'un bouton absent. */
function Refus({ etat }: { etat: EtatAcces }) {
  if (etat.type !== "dernier-technique" && etat.type !== "refuse") return null;
  const texte =
    etat.type === "dernier-technique"
      ? T.comptes.dernierTechnique
      : T.comptes.indisponible;
  return (
    <div className="filet filet-alerte" role="alert">
      <p className="filet-texte">{texte}</p>
    </div>
  );
}

export function LigneDeCompte({
  compte,
  cestMoi,
  jePeuxGerer,
}: {
  compte: CompteDetaille;
  cestMoi: boolean;
  jePeuxGerer: boolean;
}) {
  const [etat, envoyer, enCours] = useActionState<EtatAcces, FormData>(basculerLAcces, {
    type: "repos",
  });

  return (
    <div className="carte-admin">
      <div className="barre-boutons" style={{ justifyContent: "space-between" }}>
        <Identite compte={compte} cestMoi={cestMoi} />

        {jePeuxGerer && !cestMoi ? (
          <form action={envoyer}>
            <input type="hidden" name="id" value={compte.id} />
            <input type="hidden" name="actif" value={compte.actif ? "non" : "oui"} />
            <button
              type="submit"
              className={compte.actif ? "bouton-danger" : "bouton-second"}
              disabled={enCours}
            >
              {compte.actif ? T.comptes.retirer : T.comptes.rendre}
            </button>
          </form>
        ) : null}
      </div>

      <Refus etat={etat} />
    </div>
  );
}
