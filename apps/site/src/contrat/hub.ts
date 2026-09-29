import "server-only";
import { chargerEnvironnement } from "@gbum/db";
import type { Hub } from "@gbum/contrat";

/**
 * Le hub privé, s'il est configuré (ADR-014, C5).
 *
 * Deux variables d'environnement, et rien dans le code : `HUB_PRIVE_URL` et
 * `CONTRAT_CLE`. Tant que l'une manque, le site fonctionne comme avant — ses
 * villes se saisissent dans l'administration, ses demandes restent chez lui.
 * Brancher le contrat, c'est poser deux variables, pas redéployer du code.
 */
export function hubPrive(): Hub | null {
  chargerEnvironnement();
  const adresse = (process.env["HUB_PRIVE_URL"] ?? "").trim().replace(/\/+$/, "");
  const cle = (process.env["CONTRAT_CLE"] ?? "").trim();
  if (adresse === "" || cle === "") return null;
  return {
    adresse,
    cle,
    appeler: fetch,
    maintenant: () => Math.floor(Date.now() / 1000),
  };
}
