/**
 * ADR-013 — les fichiers vivent hors de la base, derrière cette interface.
 *
 * Quatre méthodes, et rien d'autre du code ne sait où les fichiers se trouvent
 * réellement. Aujourd'hui un dossier sur le serveur ; le jour où le mouvement
 * paie un cloud, un stockage objet compatible S3. Le passage de l'un à l'autre
 * est un changement de variable d'environnement, pas de code — c'est le
 * facteur IV, et c'est la contrainte que le mouvement a posée le 9 septembre
 * 2026 avant que la première ligne soit écrite.
 */

export interface Stockage {
  ecrire(chemin: string, contenu: Uint8Array): Promise<void>;
  lire(chemin: string): Promise<Uint8Array>;
  supprimer(chemin: string): Promise<void>;
  url(chemin: string): string;
}

/** Les pannes du stockage sont typées : R2 interdit de les avaler. */
export type ErreurStockage =
  | { readonly type: "chemin-refuse"; readonly chemin: string }
  | { readonly type: "introuvable"; readonly chemin: string }
  | { readonly type: "illisible"; readonly chemin: string; readonly cause: unknown };

export class ProblemeDeStockage extends Error {
  constructor(readonly probleme: ErreurStockage) {
    super(`stockage : ${probleme.type} (${probleme.chemin})`);
    this.name = "ProblemeDeStockage";
  }
}

/**
 * Un chemin de fichier est fourni par l'extérieur — un nom de photo, une clé
 * d'archive. Il est donc validé à la frontière (R4).
 *
 * Refuser `..` n'est pas une précaution théorique : sans cela, `../../.env`
 * est un chemin valide, et l'implémentation disque le sert. Le stockage objet
 * n'a pas ce défaut ; le disque l'a. La règle vaut pour les deux, pour qu'on
 * ne l'oublie pas en changeant d'implémentation.
 */
export function cheminValide(chemin: string): boolean {
  if (chemin.length === 0 || chemin.length > 512) return false;
  if (chemin.startsWith("/") || chemin.includes("\\")) return false;
  if (
    chemin
      .split("/")
      .some((partie) => partie === "" || partie === "." || partie === "..")
  )
    return false;
  return /^[A-Za-z0-9._/-]+$/.test(chemin);
}

export function exigerCheminValide(chemin: string): void {
  if (!cheminValide(chemin)) {
    throw new ProblemeDeStockage({ type: "chemin-refuse", chemin });
  }
}
