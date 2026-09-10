import { lireDemandes } from "@gbum/db";
import { exigerCompte } from "../../../../auth/garde";
import { basculerDemande } from "../../../../actions/demandes";
import { T } from "../textes";

export const dynamic = "force-dynamic";

const DATE = new Intl.DateTimeFormat("fr-MA", {
  dateStyle: "long",
  timeStyle: "short",
  timeZone: "Africa/Casablanca",
});

/**
 * La boîte de réception des formulaires publics.
 *
 * Les non traitées d'abord — c'est le seul tri qui compte pour quelqu'un qui
 * ouvre cet écran entre deux cours. Et l'état se bascule dans les deux sens :
 * une demande marquée traitée par erreur doit pouvoir revenir, sans quoi on
 * hésite à cliquer et l'écran cesse de servir.
 */
export default async function Demandes() {
  await exigerCompte();
  const demandes = await lireDemandes().catch((cause: unknown) => {
    console.error("lecture des demandes", { cause });
    return [];
  });

  return (
    <main className="corps-admin">
      <h1 className="titre-admin">{T.demandes.titre}</h1>
      <p className="accroche-admin">{T.demandes.accroche}</p>

      {demandes.length === 0 ? (
        <div className="filet">
          <p className="filet-texte">{T.demandes.aucune}</p>
        </div>
      ) : null}

      {demandes.map((demande) => (
        <article
          className="carte-admin"
          key={demande.id}
          style={{ marginBottom: 14, opacity: demande.traitee ? 0.62 : 1 }}
        >
          <p className="etiquette-admin">
            {T.demandes.sujets[demande.sujet] ?? demande.sujet}
            {" · "}
            {DATE.format(demande.creeLe)}
            {demande.traitee ? ` · ${T.demandes.traitee}` : ""}
          </p>
          <p style={{ fontSize: "1.125rem", fontWeight: 600, margin: "0 0 4px" }}>
            {demande.nom}
            {demande.villeNom === null ? "" : ` — ${demande.villeNom}`}
            {demande.villeLibre === null || demande.villeLibre === ""
              ? ""
              : ` — ${demande.villeLibre}`}
          </p>
          <p className="filet-texte" style={{ marginBottom: 12 }}>
            {demande.contact}
          </p>
          <p
            style={{ fontSize: "0.96875rem", lineHeight: 1.6, whiteSpace: "pre-wrap" }}
          >
            {demande.message}
          </p>
          <form action={basculerDemande}>
            <input type="hidden" name="id" value={demande.id} />
            <input
              type="hidden"
              name="traitee"
              value={demande.traitee ? "non" : "oui"}
            />
            <button type="submit" className="bouton bouton-second">
              {demande.traitee ? T.demandes.rouvrir : T.demandes.traiter}
            </button>
          </form>
        </article>
      ))}
    </main>
  );
}
