import { lireVillesEtCellules } from "@gbum/db";
import { exigerCompte } from "../../../../auth/garde";
import { ajouterVille } from "../../../../actions/villes";
import { CarteDeVille } from "./carte-de-ville";
import { T } from "../textes";

export const dynamic = "force-dynamic";

export default async function Villes() {
  await exigerCompte();
  const structure = await lireVillesEtCellules().catch((cause: unknown) => {
    console.error("lecture des villes", { cause });
    return { villes: [], cellules: [] };
  });

  return (
    <main className="corps-admin">
      <h1 className="titre-admin">{T.villes.titre}</h1>
      <p className="accroche-admin">{T.villes.accroche}</p>

      <div className="carte-admin" style={{ marginBottom: 26 }}>
        <p className="etiquette-admin">{T.villes.ajouterVille}</p>
        <form action={ajouterVille} className="barre-boutons">
          <input
            className="champ-admin"
            name="nom"
            placeholder={T.villes.nom}
            required
            style={{ maxWidth: 260 }}
          />
          <input
            className="champ-admin"
            name="rang"
            type="number"
            min={0}
            defaultValue={structure.villes.length + 1}
            aria-label={T.villes.rang}
            style={{ maxWidth: 100 }}
          />
          <input type="hidden" name="bureauCourriel" value="" />
          <input type="hidden" name="bureauMandatDebut" value="" />
          <input type="hidden" name="bureauMandatFin" value="" />
          <button type="submit" className="bouton">
            {T.villes.enregistrer}
          </button>
        </form>
      </div>

      {structure.villes.length === 0 ? (
        <div className="filet">
          <p className="filet-texte">{T.villes.aucuneVille}</p>
        </div>
      ) : null}

      {structure.villes.map((ville, position) => (
        <CarteDeVille
          key={ville.id}
          ville={ville}
          rang={position + 1}
          cellules={structure.cellules.filter(
            (cellule) => cellule.villeId === ville.id,
          )}
        />
      ))}
    </main>
  );
}
