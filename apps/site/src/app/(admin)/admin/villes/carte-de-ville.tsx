import type { LigneCellule, LigneVille } from "@gbum/db";
import {
  ajouterCellule,
  enregistrerVille,
  retirerVille,
} from "../../../../actions/villes";
import { CellulesDeVille } from "./cellules-de-ville";
import { T } from "../textes";

/** Les dates viennent de PostgreSQL ; le champ HTML veut « AAAA-MM-JJ ». */
function pourChamp(date: Date | null): string {
  return date === null ? "" : date.toISOString().slice(0, 10);
}

/**
 * Une ville et ses cellules.
 *
 * Tout est en formulaires ordinaires, sans JavaScript : chaque ligne est un
 * `<form>` qui poste vers une action de serveur. C'est plus fruste qu'un
 * tableau qui s'enregistre tout seul — et c'est plus sûr : le bureau d'une
 * ville se met à jour une fois l'an, souvent sur une connexion qui n'est pas
 * bonne, et un formulaire qui a été soumis a été soumis.
 */
export function CarteDeVille({
  ville,
  rang,
  cellules,
}: {
  ville: LigneVille;
  rang: number;
  cellules: readonly LigneCellule[];
}) {
  return (
    <section className="carte-admin" style={{ marginBottom: 18 }}>
      <form action={enregistrerVille}>
        <input type="hidden" name="id" value={ville.id} />
        <div className="grille-admin grille-2-admin">
          <div>
            <label className="libelle-admin" htmlFor={`nom-${ville.id}`}>
              {T.villes.nom}
            </label>
            <input
              className="champ-admin"
              id={`nom-${ville.id}`}
              name="nom"
              defaultValue={ville.nom}
              required
            />
          </div>
          <div>
            <label className="libelle-admin" htmlFor={`rang-${ville.id}`}>
              {T.villes.rang}
            </label>
            <input
              className="champ-admin"
              id={`rang-${ville.id}`}
              name="rang"
              type="number"
              min={0}
              defaultValue={rang}
            />
            <p className="aide-admin">{T.villes.rangIndice}</p>
          </div>
          <div>
            <label className="libelle-admin" htmlFor={`courriel-${ville.id}`}>
              {T.villes.courriel}
            </label>
            <input
              className="champ-admin"
              id={`courriel-${ville.id}`}
              name="bureauCourriel"
              type="email"
              defaultValue={ville.bureauCourriel ?? ""}
            />
          </div>
          <div className="grille-admin grille-2-admin">
            <div>
              <label className="libelle-admin" htmlFor={`debut-${ville.id}`}>
                {T.villes.mandatDebut}
              </label>
              <input
                className="champ-admin"
                id={`debut-${ville.id}`}
                name="bureauMandatDebut"
                type="date"
                defaultValue={pourChamp(ville.bureauMandatDebut)}
              />
            </div>
            <div>
              <label className="libelle-admin" htmlFor={`fin-${ville.id}`}>
                {T.villes.mandatFin}
              </label>
              <input
                className="champ-admin"
                id={`fin-${ville.id}`}
                name="bureauMandatFin"
                type="date"
                defaultValue={pourChamp(ville.bureauMandatFin)}
              />
            </div>
          </div>
        </div>
        <p className="aide-admin">{T.villes.mandatIndice}</p>
        <button type="submit" className="bouton">
          {T.villes.enregistrer}
        </button>
      </form>

      <p className="etiquette-admin" style={{ marginTop: 26 }}>
        {T.villes.cellules}
      </p>

      <CellulesDeVille villeId={ville.id} cellules={cellules} />

      <form action={ajouterCellule} className="barre-boutons" style={{ marginTop: 14 }}>
        <input type="hidden" name="villeId" value={ville.id} />
        <input type="hidden" name="rang" value={cellules.length + 1} />
        <input
          className="champ-admin"
          name="nom"
          placeholder={T.villes.ajouterCellule}
          required
          style={{ maxWidth: 240 }}
        />
        <input
          className="champ-admin"
          name="nombreDeMembres"
          type="number"
          min={0}
          placeholder={T.villes.membres}
          aria-label={T.villes.membres}
          style={{ maxWidth: 110 }}
        />
        <button type="submit" className="bouton bouton-second">
          {T.villes.ajouterCellule}
        </button>
      </form>

      <form action={retirerVille} style={{ marginTop: 20 }}>
        <input type="hidden" name="id" value={ville.id} />
        <button type="submit" className="bouton bouton-danger">
          {T.villes.supprimerVille}
        </button>
      </form>
    </section>
  );
}
