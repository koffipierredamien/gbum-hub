/**
 * Ce qu'on exige d'un mot de passe, et rien de plus.
 *
 * **Douze caractères, sans autre contrainte.** Pas de majuscule obligatoire,
 * pas de chiffre imposé, pas de symbole : ces règles-là produisent
 * « Rabat2026! » sur toutes les machines du mouvement, et poussent à écrire le
 * mot de passe sur un papier collé à l'écran. La longueur, elle, augmente
 * réellement le coût d'une attaque.
 *
 * C'est la recommandation des organismes qui ont mesuré la chose (NIST
 * SP 800-63B, et l'OWASP à sa suite) : exiger de la longueur, vérifier que le
 * mot de passe n'est pas déjà connu des attaquants, et laisser tomber les
 * règles de composition.
 */
export const LONGUEUR_MINIMALE = 12;

/**
 * La longueur se mesure APRÈS normalisation, comme le hachage : sans cela,
 * deux écritures Unicode du même mot ne donneraient pas le même compte, et
 * un mot de passe accepté à la création pourrait être refusé à la connexion.
 */
export function motDePasseAcceptable(motDePasse: string): boolean {
  return motDePasse.normalize("NFKC").length >= LONGUEUR_MINIMALE;
}
