import { fileURLToPath } from "node:url";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { adresseDeLaBase, ouvrirBase } from "./connexion";

/**
 * Rejoue les migrations manquantes, dans l'ordre.
 *
 * C'est l'outil de la répétition de déménagement (ADR-012) : sur une base
 * vide, où qu'elle soit, cette commande reconstruit la structure à neuf. Si
 * elle cesse un jour de suffire, c'est qu'on a modifié une base à la main —
 * et c'est précisément ce que S4 interdit.
 */
async function principal(): Promise<void> {
  const url = adresseDeLaBase();
  const { base, fermer } = ouvrirBase(url);
  try {
    await migrate(base, {
      // fileURLToPath : « .pathname » donne « /C:/... » sous Windows.
      migrationsFolder: fileURLToPath(new URL("../migrations", import.meta.url)),
    });
    console.info("migrations appliquées");
  } finally {
    await fermer();
  }
}

await principal();
