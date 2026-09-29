import { z } from "zod";
import { Demande } from "./demandes";
import { Publications } from "./publications";

/**
 * Le contrat sous sa forme neutre : du JSON Schema, que le hub privé lit en
 * Python sans rien savoir de TypeScript (ADR-014, C2).
 *
 * La source reste le schéma zod — une seule écriture de la règle (R5) — et
 * `contrat/v1/*.schema.json` en est la traduction, régénérée par
 * `pnpm --filter @gbum/contrat generer`. Un test échoue si le fichier versionné
 * s'écarte de la source : on ne peut pas changer le contrat d'un côté sans que
 * l'autre le voie.
 */
export const SCHEMAS_V1 = {
  "publications.schema.json": Publications,
  "demandes.schema.json": Demande,
} as const;

export function enJsonSchema(schema: z.ZodType): unknown {
  return z.toJSONSchema(schema, { target: "draft-2020-12" });
}
