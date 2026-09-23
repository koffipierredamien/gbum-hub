import { lireContributions, type Contribution } from "@gbum/db";
import { exigerCompte } from "../../../../auth/garde";
import { QUESTIONS } from "../../../(collecte)/questions";
import { T } from "../textes";

export const dynamic = "force-dynamic";

/**
 * Les réponses au formulaire de collecte, groupées par question.
 *
 * Groupées, et non listées par envoi : ce qu'on cherche ici, c'est « a-t-on
 * enfin le thème de l'année ? » — pas « qu'a envoyé Untel mardi ». La plus
 * récente vient en premier, les précédentes restent dessous : on garde tout,
 * c'est l'administration qui choisit.
 *
 * Rien n'est recopié automatiquement vers le site : une réponse se relit, puis
 * se colle dans « Les pages », et se publie. Le chemin brouillon → publié
 * reste le seul.
 */
export default async function Reponses() {
  await exigerCompte();

  const contributions = await lireContributions().catch((cause: unknown) => {
    console.error("lecture des contributions", { cause });
    return [] as readonly Contribution[];
  });

  return (
    <main className="corps-admin">
      <h1 className="titre-admin">{T.reponses.titre}</h1>
      <p className="accroche-admin">{T.reponses.accroche}</p>

      {contributions.length === 0 ? (
        <div className="filet">
          <p className="filet-texte">{T.reponses.aucune}</p>
        </div>
      ) : null}

      {QUESTIONS.map((question) => (
        <BlocQuestion
          key={question.cle}
          libelle={question.libelle}
          reponses={contributions.filter((c) => c.champ === question.cle)}
        />
      ))}
    </main>
  );
}

function BlocQuestion({
  libelle,
  reponses,
}: {
  libelle: string;
  reponses: readonly Contribution[];
}) {
  if (reponses.length === 0) return null;

  return (
    <div className="carte-admin">
      <p className="etiquette-admin">{libelle}</p>
      {reponses.map((reponse, rang) => (
        <div key={reponse.id} style={{ marginTop: rang === 0 ? 8 : 18 }}>
          <p style={{ whiteSpace: "pre-wrap", margin: 0 }}>{reponse.valeur}</p>
          <p className="aide-admin" style={{ marginTop: 6 }}>
            {reponse.auteur}
            {reponse.contact === null ? "" : ` · ${reponse.contact}`} ·{" "}
            {new Date(reponse.creeLe).toLocaleDateString("fr-FR", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
            {rang === 0 ? "" : ` · ${T.reponses.precedente}`}
          </p>
        </div>
      ))}
    </div>
  );
}
