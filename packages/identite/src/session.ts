import { createHash, randomBytes } from "node:crypto";

/**
 * Les sessions.
 *
 * Le jeton est tiré au sort et remis au navigateur dans un cookie ; c'est son
 * EMPREINTE qui est rangée en base. Une fuite de la base ne donne donc aucune
 * session utilisable — exactement comme pour les mots de passe, et pour la
 * même raison.
 */

export const NOM_DU_COOKIE = "gbum_session";

/** 32 octets tirés au sort : deviner un jeton n'est pas une stratégie. */
export function creerJeton(): string {
  return randomBytes(32).toString("base64url");
}

/**
 * SHA-256 suffit ici, là où les mots de passe exigent scrypt : un jeton est
 * déjà 256 bits d'aléa, il n'y a rien à deviner par force brute. Un mot de
 * passe, lui, est court et choisi par un humain.
 */
export function empreinte(jeton: string): string {
  return createHash("sha256").update(jeton).digest("base64url");
}

/** Trente jours. Au-delà, il faut se reconnecter. */
export const DUREE_MS = 30 * 24 * 60 * 60 * 1000;
