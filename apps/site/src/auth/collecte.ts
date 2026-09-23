import "server-only";
import { timingSafeEqual } from "node:crypto";

/**
 * La clé du lien de collecte.
 *
 * Elle vient de l'environnement (S2). Tant qu'elle n'est pas définie, le
 * formulaire est FERMÉ — et non ouvert à tous : une garde qui s'annule quand
 * on oublie de la configurer ne garde rien.
 *
 * Ce fichier n'est PAS un module d'actions : exporter cette fonction depuis un
 * fichier « use server » en ferait une adresse publique, qu'on pourrait
 * interroger clé après clé.
 */
export function cleValide(cle: string): boolean {
  const attendue = process.env["CLE_COLLECTE"];
  if (attendue === undefined || attendue === "") return false;

  // Comparaison à temps constant, comme pour les mots de passe : le temps de
  // réponse ne doit pas dire combien de caractères étaient justes.
  const a = Buffer.from(cle);
  const b = Buffer.from(attendue);
  return a.length === b.length && timingSafeEqual(a, b);
}
