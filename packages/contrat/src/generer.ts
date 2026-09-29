import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { enJsonSchema, SCHEMAS_V1 } from "./schemas";

/**
 * Réécrit `contrat/v1/*.schema.json` depuis les schémas zod. À lancer après
 * toute modification du contrat, puis `pnpm format` : le fichier est relu en
 * revue comme du code, et copié tel quel dans le hub privé.
 */
const dossier = join(dirname(fileURLToPath(import.meta.url)), "../../../contrat/v1");

for (const [nom, schema] of Object.entries(SCHEMAS_V1)) {
  writeFileSync(
    join(dossier, nom),
    `${JSON.stringify(enJsonSchema(schema), null, 2)}\n`,
  );
  console.log(`contrat/v1/${nom}`);
}
