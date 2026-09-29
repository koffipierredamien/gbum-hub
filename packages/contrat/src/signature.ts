import { createHmac, timingSafeEqual } from "node:crypto";
import { echec, reussite, type Resultat } from "@gbum/core";

/**
 * La signature des échanges entre les deux hubs (ADR-014, C4).
 *
 * Qui émet signe `horodatage + "." + corps` avec la clé partagée
 * (HMAC-SHA256), et envoie deux en-têtes :
 *
 *   X-GBUM-Horodatage: 1790000000          (secondes depuis 1970, UTC)
 *   X-GBUM-Signature:  sha256=<hexadécimal>
 *
 * L'horodatage est DANS ce qui est signé : sans lui, un message intercepté se
 * rejouerait indéfiniment. Avec lui, il meurt au bout de cinq minutes.
 *
 * Même règle des deux côtés, en Python comme ici — et le vecteur de
 * `contrat/v1/exemples/signature.json` le prouve dans les deux intégrations
 * continues.
 */

export const EN_TETE_HORODATAGE = "X-GBUM-Horodatage";
export const EN_TETE_SIGNATURE = "X-GBUM-Signature";

/** Au-delà, un message est refusé : il a traîné, ou il est rejoué. */
export const TOLERANCE_SECONDES = 300;

export type RefusDeSignature = "signature-invalide" | "horodatage-hors-delai";

export function signer(cle: string, horodatage: number, corps: string): string {
  const empreinte = createHmac("sha256", cle)
    .update(`${String(horodatage)}.${corps}`)
    .digest("hex");
  return `sha256=${empreinte}`;
}

/**
 * La comparaison est à temps constant : comparer caractère par caractère et
 * s'arrêter au premier écart dirait, par la durée de la réponse, combien de
 * caractères étaient justes.
 */
export function verifier(requete: {
  readonly cle: string;
  readonly horodatage: number;
  readonly corps: string;
  readonly signature: string;
  readonly maintenant: number;
}): Resultat<void, RefusDeSignature> {
  const ecart = Math.abs(requete.maintenant - requete.horodatage);
  if (!Number.isInteger(requete.horodatage) || ecart > TOLERANCE_SECONDES) {
    return echec("horodatage-hors-delai");
  }
  const attendue = Buffer.from(signer(requete.cle, requete.horodatage, requete.corps));
  const recue = Buffer.from(requete.signature);
  const egales = attendue.length === recue.length && timingSafeEqual(attendue, recue);
  return egales ? reussite(undefined) : echec("signature-invalide");
}
