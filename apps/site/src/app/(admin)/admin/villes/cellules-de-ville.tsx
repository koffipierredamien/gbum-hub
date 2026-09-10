import type { LigneCellule } from "@gbum/db";
import { enregistrerCellule, retirerCellule } from "../../../../actions/villes";
import { T } from "../textes";

/**
 * Les cellules d'une ville : le nom, l'effectif, et rien d'autre.
 *
 * Ni jour, ni heure, ni lieu, ni responsable — et ce n'est pas un choix
 * d'écran : ces colonnes n'existent pas dans la base. Un espace
 * d'administration ne peut pas saisir ce que le schéma ne peut pas ranger, et
 * c'est exactement la garantie qu'ADR-011 demandait.
 */
export function CellulesDeVille({
  villeId,
  cellules,
}: {
  villeId: string;
  cellules: readonly LigneCellule[];
}) {
  return (
    <>
      {cellules.map((cellule, position) => (
        <form action={enregistrerCellule} className="rang-admin" key={cellule.id}>
          <input type="hidden" name="id" value={cellule.id} />
          <input type="hidden" name="villeId" value={villeId} />
          <input type="hidden" name="rang" value={position + 1} />
          <input
            className="champ-admin"
            name="nom"
            defaultValue={cellule.nom}
            aria-label={T.villes.nom}
          />
          <input
            className="champ-admin"
            name="nombreDeMembres"
            type="number"
            min={0}
            defaultValue={cellule.nombreDeMembres ?? ""}
            aria-label={T.villes.membres}
            style={{ maxWidth: 110 }}
          />
          <button type="submit" className="bouton bouton-second">
            {T.villes.enregistrer}
          </button>
          <button
            type="submit"
            className="bouton bouton-danger"
            formAction={retirerCellule}
          >
            {T.villes.supprimer}
          </button>
        </form>
      ))}
    </>
  );
}
