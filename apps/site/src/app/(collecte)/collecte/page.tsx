import { cleValide } from "../../../auth/collecte";
import { FormulaireCollecte } from "./formulaire";

export const dynamic = "force-dynamic";

export const metadata = { title: "Renseigner le site du GBUM" };

/**
 * Le formulaire que le Secrétariat National remplit, sans compte.
 *
 * Il s'ouvre par un lien secret : `/collecte?cle=…`. Demander à des
 * responsables bénévoles de créer un compte, de le retenir et de comprendre un
 * espace d'administration pour donner sept informations, c'est ne jamais les
 * recevoir.
 *
 * Ce que le formulaire enregistre n'apparaît PAS sur le site : les réponses
 * attendent dans l'administration, où elles sont relues puis recopiées. Le
 * chemin brouillon → publié reste le seul par lequel un texte devient public.
 */
export default async function Collecte({
  searchParams,
}: {
  searchParams: Promise<{ cle?: string }>;
}) {
  const { cle } = await searchParams;

  if (cle === undefined || !cleValide(cle)) {
    return (
      <main className="corps-admin">
        <h1 className="titre-admin">Ce lien n'est pas valable.</h1>
        <p className="accroche-admin">
          Le formulaire du GBUM s'ouvre par un lien personnel. Demandez-le à la personne
          qui vous a écrit.
        </p>
      </main>
    );
  }

  return (
    <main className="corps-admin">
      <h1 className="titre-admin">Ce que le site attend de vous.</h1>
      <p className="accroche-admin">
        Chaque réponse fait disparaître un encadré « en attente » du site public.
        Répondez à ce que vous savez et laissez le reste vide : rien ne sera inventé à
        la place. Vous pouvez revenir compléter plus tard, avec le même lien.
      </p>
      <FormulaireCollecte cle={cle} />
    </main>
  );
}
