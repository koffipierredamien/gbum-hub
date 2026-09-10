import type { Surface } from "./bande";

/**
 * D10 — le vide invite, il ne s'excuse pas.
 *
 * Un filet plein ouvert vers la page, jamais un cadre pointillé : le cadre
 * fermé est la forme visuelle d'un formulaire incomplet. Ici, le marqueur dit
 * QUI doit fournir QUOI, et propose souvent au lecteur de le fournir.
 *
 * C'est l'exigence A1.3 : une page qui attend son contenu l'ANNONCE. Elle ne
 * se meuble pas, et ne reste pas blanche.
 */
export function Attente({
  titre,
  texte,
  lien,
  surface = "creme",
}: {
  titre: string;
  texte: string;
  lien?: { texte: string; href: string };
  surface?: Surface | "photo";
}) {
  const variante =
    surface === "creme" || surface === "sable" ? "" : ` attente-${surface}`;

  return (
    <div className={`attente${variante}`}>
      <p className="attente-titre">{titre}</p>
      <p className="attente-texte">{texte}</p>
      {lien === undefined ? null : (
        <a className="attente-lien" href={lien.href}>
          {lien.texte}
        </a>
      )}
    </div>
  );
}
