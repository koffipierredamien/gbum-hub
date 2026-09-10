import { createInterface } from "node:readline/promises";
import process, { stdin, stdout } from "node:process";
import { creerCompte } from "@gbum/db";
import { hacher } from "@gbum/identite";

/**
 * Créer un compte d'administration, en ligne de commande.
 *
 * Il n'y a PAS d'inscription dans l'espace d'administration, et il n'y en aura
 * pas : un espace d'administration où l'on peut s'inscrire soi-même n'est pas
 * un espace d'administration. Les comptes sont créés par quelqu'un qui a déjà
 * accès au serveur — c'est-à-dire par l'administrateur technique.
 *
 *   pnpm compte:creer
 *
 * Sur un serveur qu'on installe, où il n'y a personne devant l'écran :
 *
 *   COMPTE_COURRIEL=… COMPTE_NOM=… COMPTE_MOT_DE_PASSE=… pnpm compte:creer
 */
async function principal(): Promise<void> {
  // Deux manières d'entrer les valeurs. Au clavier, pour l'usage courant ; par
  // l'environnement, pour le premier compte d'un serveur qu'on installe — où
  // il n'y a personne devant l'écran, et où un script doit pouvoir le faire.
  const parEnvironnement = process.env["COMPTE_COURRIEL"] !== undefined;
  const lecture = parEnvironnement
    ? undefined
    : createInterface({ input: stdin, output: stdout });

  try {
    const demander = async (invite: string, variable: string): Promise<string> =>
      lecture === undefined
        ? (process.env[variable] ?? "")
        : await lecture.question(invite);

    const courriel = (await demander("Courriel : ", "COMPTE_COURRIEL")).trim();
    const nom = (await demander("Nom : ", "COMPTE_NOM")).trim();
    const motDePasse = await demander("Mot de passe : ", "COMPTE_MOT_DE_PASSE");
    const role =
      (
        await demander("Rôle [secretariat / technique] (secretariat) : ", "COMPTE_ROLE")
      ).trim() || "secretariat";

    if (courriel === "" || nom === "" || motDePasse.length < 12) {
      // Douze caractères : ce n'est pas une politique de mot de passe, c'est
      // le minimum en dessous duquel une attaque hors ligne aboutit vite,
      // même avec scrypt.
      throw new Error(
        "Courriel et nom obligatoires, mot de passe d'au moins 12 caractères.",
      );
    }
    if (role !== "secretariat" && role !== "technique") {
      throw new Error(`Rôle inconnu : « ${role} ».`);
    }

    const compte = await creerCompte({
      courriel,
      nom,
      motDePasseHache: await hacher(motDePasse),
      role,
    });
    console.info(`\nCompte créé : ${compte.nom} <${compte.courriel}> — ${compte.role}`);
  } finally {
    lecture?.close();
  }
}

await principal();
