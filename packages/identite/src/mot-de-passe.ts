import { randomBytes, scrypt, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

const derive = promisify(scrypt) as (
  motDePasse: string,
  sel: Buffer,
  longueur: number,
  options: { N: number; r: number; p: number; maxmem: number },
) => Promise<Buffer>;

/**
 * Le hachage des mots de passe, avec `scrypt` — celui de Node, sans
 * dépendance.
 *
 * S6 (ADR-012) : on ne prend d'une plateforme ni son système de comptes ni sa
 * bibliothèque maison. Un mot de passe haché ici se vérifie partout où tourne
 * Node, aujourd'hui comme dans cinq ans, et ne rend le mouvement dépendant de
 * personne.
 *
 * Pourquoi scrypt et pas un simple SHA : un condensat rapide se casse à la
 * force brute sur du matériel ordinaire. scrypt est LENT et gourmand en
 * mémoire à dessein — c'est ce qui rend une attaque coûteuse même quand la
 * base a fuité.
 */

// Paramètres recommandés pour un usage interactif : environ 100 ms et 64 Mio
// par vérification sur une machine ordinaire. Ils sont ÉCRITS DANS LE
// CONDENSAT (voir le format ci-dessous), pour qu'on puisse les durcir plus
// tard sans invalider les mots de passe existants.
const N = 16384;
const R = 8;
const P = 1;
const LONGUEUR = 64;
const MAXMEM = 128 * N * R * 2;

/**
 * Format : `scrypt$N$r$p$sel$condensat`, le sel et le condensat en base64url.
 * Tout ce qu'il faut pour vérifier tient dans la chaîne — la base n'a qu'une
 * colonne, et un changement de paramètres n'oblige à migrer personne.
 */
export async function hacher(motDePasse: string): Promise<string> {
  const sel = randomBytes(16);
  const condensat = await derive(motDePasse.normalize("NFKC"), sel, LONGUEUR, {
    N,
    r: R,
    p: P,
    maxmem: MAXMEM,
  });
  return [
    "scrypt",
    N,
    R,
    P,
    sel.toString("base64url"),
    condensat.toString("base64url"),
  ].join("$");
}

interface Condensat {
  readonly n: number;
  readonly r: number;
  readonly p: number;
  readonly sel: Buffer;
  readonly attendu: Buffer;
}

/**
 * Relit le format `scrypt$N$r$p$sel$condensat`.
 *
 * Séparé de la vérification : une chaîne stockée vient de la base, donc de
 * l'extérieur, et tout ce qui vient de l'extérieur peut être n'importe quoi.
 * Mêler cette lecture défensive au calcul rendait la fonction trop touffue
 * pour être relue d'un coup d'œil — c'est le linter qui l'a fait remarquer.
 */
function analyser(stocke: string): Condensat | null {
  const parties = stocke.split("$");
  if (parties.length !== 6 || parties[0] !== "scrypt") return null;

  const n = Number(parties[1]);
  const r = Number(parties[2]);
  const p = Number(parties[3]);
  if (!Number.isInteger(n) || !Number.isInteger(r) || !Number.isInteger(p)) return null;

  const sel = Buffer.from(parties[4] ?? "", "base64url");
  const attendu = Buffer.from(parties[5] ?? "", "base64url");
  if (sel.length === 0 || attendu.length === 0) return null;

  return { n, r, p, sel, attendu };
}

export async function verifier(motDePasse: string, stocke: string): Promise<boolean> {
  const condensat = analyser(stocke);
  if (condensat === null) return false;
  const { n, r, p, sel, attendu } = condensat;

  const obtenu = await derive(motDePasse.normalize("NFKC"), sel, attendu.length, {
    N: n,
    r,
    p,
    maxmem: 128 * n * r * 2,
  });

  // Comparaison à temps constant : une comparaison ordinaire s'arrête au
  // premier octet différent, et le temps qu'elle met révèle combien d'octets
  // étaient justes. C'est peu, et c'est assez pour deviner un condensat.
  if (obtenu.length !== attendu.length) return false;
  return timingSafeEqual(obtenu, attendu);
}
