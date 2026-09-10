import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { dirname, join, resolve, sep } from "node:path";
import { exigerCheminValide, ProblemeDeStockage, type Stockage } from "./stockage";

/**
 * L'implémentation d'aujourd'hui : un dossier sur le serveur.
 *
 * Elle n'a rien de provisoire — elle est simplement la moins chère. Le jour où
 * le mouvement paie un stockage objet, on remplace cette classe par
 * `StockageS3` dans la fabrique, et pas une ligne d'ailleurs ne bouge.
 */
export class StockageDisque implements Stockage {
  readonly #racine: string;
  readonly #urlPublique: string;

  constructor(racine: string, urlPublique: string) {
    this.#racine = resolve(racine);
    this.#urlPublique = urlPublique.replace(/\/+$/, "");
  }

  /**
   * Double garde. `exigerCheminValide` refuse déjà `..`, mais un chemin qui
   * sortirait de la racine par un autre moyen (un lien symbolique posé à la
   * main, une normalisation surprenante) doit échouer ici aussi. Une seule
   * barrière est une barrière qu'on finit par contourner.
   */
  #absolu(chemin: string): string {
    exigerCheminValide(chemin);
    const complet = resolve(join(this.#racine, chemin));
    if (complet !== this.#racine && !complet.startsWith(this.#racine + sep)) {
      throw new ProblemeDeStockage({ type: "chemin-refuse", chemin });
    }
    return complet;
  }

  async ecrire(chemin: string, contenu: Uint8Array): Promise<void> {
    const complet = this.#absolu(chemin);
    await mkdir(dirname(complet), { recursive: true });
    await writeFile(complet, contenu);
  }

  async lire(chemin: string): Promise<Uint8Array> {
    const complet = this.#absolu(chemin);
    try {
      // `readFile` rend un Buffer, pas un Uint8Array. Les deux se ressemblent,
      // mais le Buffer est une invention de Node : le laisser sortir d'ici
      // ferait dépendre les appelants de méthodes que le stockage objet ne
      // rendra jamais — et le jour du basculement vers S3, la panne serait
      // ailleurs que dans le code changé. On rend le type promis par
      // l'interface, et lui seul.
      return new Uint8Array(await readFile(complet));
    } catch (cause) {
      // R2 : on ne rend pas un tableau vide en silence. L'appelant doit
      // pouvoir distinguer « ce fichier n'existe pas » de « le disque est
      // plein » — c'est exactement ce que l'application actuelle ne sait pas
      // faire, avec ses 57 blocs `except: pass`.
      if (estIntrouvable(cause)) {
        throw new ProblemeDeStockage({ type: "introuvable", chemin });
      }
      throw new ProblemeDeStockage({ type: "illisible", chemin, cause });
    }
  }

  async supprimer(chemin: string): Promise<void> {
    await rm(this.#absolu(chemin), { force: true });
  }

  url(chemin: string): string {
    exigerCheminValide(chemin);
    return `${this.#urlPublique}/${chemin}`;
  }
}

function estIntrouvable(cause: unknown): boolean {
  return (
    typeof cause === "object" &&
    cause !== null &&
    "code" in cause &&
    cause.code === "ENOENT"
  );
}
