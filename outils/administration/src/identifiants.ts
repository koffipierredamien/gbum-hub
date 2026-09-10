import { createInterface } from "node:readline/promises";
import process, { stdin, stdout } from "node:process";

/**
 * Recueille les identifiants d'un compte, au clavier ou par l'environnement.
 *
 * Deux entrées, une seule règle (R5). Au clavier pour l'usage courant ; par
 * l'environnement pour le premier compte d'un serveur qu'on installe — où il
 * n'y a personne devant l'écran — et pour la vérification automatique, qui
 * doit pouvoir jouer le parcours sans main humaine.
 */
export interface Identifiants {
  readonly courriel: string;
  readonly nom: string;
  readonly motDePasse: string;
  readonly role: "secretariat" | "technique";
}

/** Douze caractères : en dessous, une attaque hors ligne aboutit vite. */
export const LONGUEUR_MINIMALE = 12;

export async function demanderIdentifiants(
  roleParDefaut: "secretariat" | "technique",
  invites: { courriel: string; nom: string; motDePasse: string; role?: string },
): Promise<Identifiants | { readonly probleme: string }> {
  const parEnvironnement = process.env["COMPTE_COURRIEL"] !== undefined;
  const lecture = parEnvironnement
    ? undefined
    : createInterface({ input: stdin, output: stdout });

  try {
    const demander = async (invite: string, variable: string): Promise<string> =>
      lecture === undefined
        ? (process.env[variable] ?? "")
        : await lecture.question(invite);

    const courriel = (await demander(invites.courriel, "COMPTE_COURRIEL")).trim();
    const nom = (await demander(invites.nom, "COMPTE_NOM")).trim();
    const motDePasse = await demander(invites.motDePasse, "COMPTE_MOT_DE_PASSE");
    const role =
      invites.role === undefined
        ? roleParDefaut
        : (await demander(invites.role, "COMPTE_ROLE")).trim() || roleParDefaut;

    if (courriel === "" || nom === "") {
      return { probleme: "Le courriel et le nom sont obligatoires." };
    }
    if (motDePasse.length < LONGUEUR_MINIMALE) {
      return {
        probleme: `Le mot de passe doit faire au moins ${String(LONGUEUR_MINIMALE)} caractères.`,
      };
    }
    if (role !== "secretariat" && role !== "technique") {
      return { probleme: `Rôle inconnu : « ${role} ».` };
    }

    return { courriel, nom, motDePasse, role };
  } finally {
    lecture?.close();
  }
}
