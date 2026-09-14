import { echec, reussite, type Resultat } from "./resultat";

/**
 * Qui peut entrer dans l'espace d'administration, et ce qu'on n'a pas le droit
 * de lui retirer.
 *
 * Deux rôles, pas plus. Le modèle d'accès complet (ADR-005) viendra avec
 * l'espace de travail, où il y a des niveaux à cloisonner ; ici, il n'y en a
 * pas, et inventer une hiérarchie avant d'en avoir besoin serait inventer.
 */
export type Role = "technique" | "secretariat";

export const ROLES: readonly Role[] = ["technique", "secretariat"];

export function estUnRole(valeur: string): valeur is Role {
  return ROLES.includes(valeur as Role);
}

export type RefusDeRetrait = "dernier-technique";

/**
 * Peut-on retirer l'accès à ce compte ?
 *
 * **L'invariant : il reste toujours au moins un compte technique actif.**
 * Sans lui, une désactivation de trop ferme la porte de l'intérieur : plus
 * personne ne peut créer de compte, et le seul recours est la ligne de
 * commande sur le serveur — c'est-à-dire moi, un soir, au téléphone.
 *
 * La règle est ici, dans le domaine, et non dans l'écran qui affiche le
 * bouton : un second écran, une commande, ou une interface d'administration
 * future poseraient la même question et doivent recevoir la même réponse.
 */
export function retirerLAcces(
  compte: { readonly role: Role; readonly actif: boolean },
  techniquesActifs: number,
): Resultat<void, RefusDeRetrait> {
  const dernierGardien =
    compte.role === "technique" && compte.actif && techniquesActifs <= 1;

  return dernierGardien ? echec("dernier-technique") : reussite(undefined);
}
