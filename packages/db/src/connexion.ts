import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";
import { chargerEnvironnement } from "./environnement";

/**
 * La seule porte vers PostgreSQL (S3, ADR-012).
 *
 * L'adresse vient de l'environnement et de nulle part ailleurs (S2). C'est
 * cette ligne, et elle seule, qui change le jour où le mouvement paie une base
 * gérée : le reste du projet ne sait pas où la base se trouve, et n'a pas à le
 * savoir.
 */
export function adresseDeLaBase(): string {
  chargerEnvironnement();
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

/**
 * La base répond-elle, et sinon pourquoi ?
 *
 * Sert au démarrage. Distinguer « elle n'est pas lancée » de « elle refuse mes
 * identifiants » est la différence entre un message utile et une heure
 * perdue — alors on ne rend pas un simple oui/non : on rend la cause, et
 * l'appelant en fait un message.
 */
export type EtatDeLaBase =
  { readonly ok: true } | { readonly ok: false; readonly cause: unknown };

export async function joindreLaBase(url: string): Promise<EtatDeLaBase> {
  const client = postgres(url, {
    max: 1,
    connect_timeout: 3,
    onnotice: () => undefined,
  });
  try {
    await client`select 1`;
    return { ok: true };
  } catch (cause) {
    return { ok: false, cause };
  } finally {
    await client.end({ timeout: 1 });
  }
}

/**
 * Vrai si la base a répondu. Raccourci pour les appelants qui n'ont pas besoin
 * de la cause — mais la cause reste disponible juste au-dessus.
 */
export async function baseJoignable(url: string): Promise<boolean> {
  return (await joindreLaBase(url)).ok;
}
