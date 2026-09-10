import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

/**
 * La seule porte vers PostgreSQL (S3, ADR-012).
 *
 * L'adresse vient de l'environnement et de nulle part ailleurs (S2). C'est
 * cette ligne, et elle seule, qui change le jour où le mouvement paie une base
 * gérée : le reste du projet ne sait pas où la base se trouve, et n'a pas à le
 * savoir.
 */
export function adresseDeLaBase(): string {
  const url = process.env["DATABASE_URL"];
  if (url === undefined || url === "") {
    // Échouer au démarrage, avec la cause. Une application qui démarre sans
    // base et tombe à la première requête coûte une heure de recherche.
    throw new Error(
      "DATABASE_URL n'est pas définie. Voir .env.example — c'est la seule " +
        "chose à changer pour pointer vers une autre base (ADR-012, S2).",
    );
  }
  return url;
}

export function ouvrirBase(url: string = adresseDeLaBase()) {
  const client = postgres(url, { max: 5 });
  return { base: drizzle(client, { schema }), fermer: () => client.end() };
}
