import { appliquerMigrations } from "./migrations";

/** La même chose, en ligne de commande : `pnpm base:migrer`. */
await appliquerMigrations();
console.info("migrations appliquées");
