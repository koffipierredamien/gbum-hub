/**
 * Le domaine du GBUM.
 *
 * R1 — ce paquet n'importe rien : ni next, ni react, ni drizzle, ni le réseau.
 * La règle est tenue mécaniquement par ESLint (`no-restricted-imports` sur
 * `packages/core`), pas par la bonne volonté. Une règle du GBUM se teste donc
 * en mémoire, en millisecondes.
 */
export * from "./resultat";
export * from "./identifiants";
export * from "./temps";
export * from "./publication";
