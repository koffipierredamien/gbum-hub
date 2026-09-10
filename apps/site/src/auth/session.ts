import "server-only";
import { cookies, headers } from "next/headers";
import { fermerSession, lireSession, ouvrirSession, type Compte } from "@gbum/db";
import { creerJeton, empreinte, DUREE_MS, NOM_DU_COOKIE } from "@gbum/identite";

/**
 * La session de l'espace d'administration, côté site.
 *
 * Le cookie ne contient que le jeton ; c'est son empreinte qui est rangée en
 * base. Une fuite de la base ne donne aucune session utilisable.
 */

export async function ouvrirLaSession(compteId: string): Promise<void> {
  const hote = (await headers()).get("host") ?? "";
  const surLocalhost = hote.startsWith("localhost") || hote.startsWith("127.0.0.1");

  const jeton = creerJeton();
  const expireLe = new Date(Date.now() + DUREE_MS);
  await ouvrirSession({ empreinte: empreinte(jeton), compteId, expireLe });

  const boite = await cookies();
  boite.set(NOM_DU_COOKIE, jeton, {
    // `httpOnly` : le jeton n'est jamais lisible par du JavaScript, donc une
    // faille d'injection de script ne l'emporte pas.
    httpOnly: true,
    // `sameSite: lax` : un autre site ne peut pas déclencher d'action
    // authentifiée en notre nom (CSRF) tout en gardant la navigation normale.
    sameSite: "lax",
    // `secure` partout, SAUF sur localhost.
    //
    // La première version disait « secure en production » — et `next start`
    // met NODE_ENV à « production ». Le cookie était donc marqué secure sur
    // http://localhost, le navigateur le refusait sans rien dire, et la
    // connexion tournait en rond : le mot de passe était bon, la session
    // s'ouvrait en base, et l'écran revenait à la case départ. Trouvé le
    // 10 septembre 2026 en jouant le parcours complet dans un navigateur.
    //
    // L'hôte est la bonne source : un serveur réel ne s'appelle jamais
    // localhost, donc on ne peut pas relâcher la garde par accident.
    secure: !surLocalhost,
    path: "/admin",
    expires: expireLe,
  });
}

export async function fermerLaSession(): Promise<void> {
  const boite = await cookies();
  const jeton = boite.get(NOM_DU_COOKIE)?.value;
  if (jeton !== undefined) await fermerSession(empreinte(jeton));
  boite.delete(NOM_DU_COOKIE);
}

/**
 * Le compte connecté, ou `null`.
 *
 * R2 — si la base est injoignable, on ne rend PAS « non connecté » en
 * silence : on remonte. Confondre « personne n'est connecté » et « la base ne
 * répond pas » enverrait le Secrétariat National sur un écran de connexion
 * qui ne pourrait jamais aboutir, sans qu'il sache pourquoi.
 */
export async function compteConnecte(): Promise<Compte | null> {
  const boite = await cookies();
  const jeton = boite.get(NOM_DU_COOKIE)?.value;
  if (jeton === undefined || jeton === "") return null;
  return await lireSession(empreinte(jeton), new Date());
}
