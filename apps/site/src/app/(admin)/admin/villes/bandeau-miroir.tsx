import { synchroniserDepuisLeHub } from "../../../../actions/villes";
import { T } from "../textes";

/**
 * Le hub privé est branché : l'écran le dit, dit ce qui ne se saisit plus
 * ici, et dit le résultat de la dernière synchronisation — réussie, ou
 * pourquoi pas. Un bouton qui ne rend compte de rien fait cliquer deux fois.
 */
export function BandeauMiroir({ synchro }: { synchro: string | undefined }) {
  const message =
    synchro === undefined
      ? null
      : synchro === "ok"
        ? T.villes.synchroOk
        : (T.villes.synchroEchec[synchro] ?? synchro);
  return (
    <div className="carte-admin" style={{ marginBottom: 26 }}>
      <p className="etiquette-admin">{T.villes.miroirTitre}</p>
      <p className="aide-admin">{T.villes.miroirTexte}</p>
      {message === null ? null : (
        <p role="status" className="filet-texte">
          {message}
        </p>
      )}
      <form action={synchroniserDepuisLeHub}>
        <button type="submit" className="bouton">
          {T.villes.synchroniser}
        </button>
      </form>
    </div>
  );
}
