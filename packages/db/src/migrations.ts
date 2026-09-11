import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { adresseDeLaBase, ouvrirBase } from "./connexion";

/**
 * Rejoue les migrations manquantes, dans l'ordre.
 *
 * C'est le geste de la répétition de déménagement (ADR-012) : sur une base
 * vide, où qu'elle soit, il reconstruit la structure à neuf. S'il cesse un
 * jour de suffire, c'est qu'on a modifié une base à la main — et c'est
 * précisément ce que S4 interdit.
 *
 * Il vit ici, et non dans un script, pour que la mise en route puisse
 * l'appeler **dans son propre processus**. Lancer « pnpm base:migrer » depuis
 * un programme obligeait à passer par l'interpréteur de commandes sous
 * Windows (un `.cmd` ne se lance pas autrement), ce que Node signale comme
 * un risque — DEP0190, vu sur une vraie machine le 11 septembre 2026. Une
 * fonction appelée directement n'a ni interpréteur, ni guillemets, ni
 * avertissement.
 */
/**
 * `join(dirname(…))` plutôt que `new URL("../migrations", import.meta.url)` :
 * webpack traite cette seconde forme comme une ressource à empaqueter, et la
 * construction du site échouait sur « Can't resolve '../migrations' » le jour
 * où ce fichier est entré dans le barillet. Assembler le chemin à la main ne
 * lui donne rien à résoudre.
 */
const DOSSIER_DES_MIGRATIONS = join(
  dirname(fileURLToPath(import.meta.url)),
  "..",
  "migrations",
);

export async function appliquerMigrations(
  url: string = adresseDeLaBase(),
): Promise<void> {
  const { base, fermer } = ouvrirBase(url);
  try {
    await migrate(base, { migrationsFolder: DOSSIER_DES_MIGRATIONS });
  } finally {
    await fermer();
  }
}
