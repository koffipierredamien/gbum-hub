import process from "node:process";
import { creerCompte } from "@gbum/db";
import { hacher } from "@gbum/identite";
import { demanderIdentifiants } from "./identifiants";

/**
 * Créer un compte d'administration, en ligne de commande.
 *
 * Il n'y a PAS d'inscription dans l'espace d'administration, et il n'y en aura
 * pas : un espace d'administration où l'on peut s'inscrire soi-même n'est pas
 * un espace d'administration. Les comptes sont créés par quelqu'un qui a déjà
 * accès au serveur.
 *
 *   pnpm compte:creer
 *
 * Sur un serveur qu'on installe, où il n'y a personne devant l'écran :
 *
 *   COMPTE_COURRIEL=… COMPTE_NOM=… COMPTE_MOT_DE_PASSE=… pnpm compte:creer
 */
const identifiants = await demanderIdentifiants("secretariat", {
  courriel: "Courriel : ",
  nom: "Nom : ",
  motDePasse: "Mot de passe : ",
  role: "Rôle [secretariat / technique] (secretariat) : ",
});

if ("probleme" in identifiants) {
  console.error(`\n${identifiants.probleme}`);
  process.exit(1);
}

const compte = await creerCompte({
  courriel: identifiants.courriel,
  nom: identifiants.nom,
  motDePasseHache: await hacher(identifiants.motDePasse),
  role: identifiants.role,
});
console.info(`\nCompte créé : ${compte.nom} <${compte.courriel}> — ${compte.role}`);
