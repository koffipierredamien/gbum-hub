import { StockageDisque } from "./stockage-disque";
import type { Stockage } from "./stockage";

/**
 * Le seul endroit du projet qui décide OÙ vont les fichiers.
 *
 * S2 et S5 (ADR-012) : la décision est lue dans l'environnement, jamais écrite
 * dans le code. C'est ce qui rend le déménagement possible — et c'est ce que la
 * répétition de déménagement, une fois par lot, vient vérifier.
 */
export interface ConfigurationStockage {
  readonly pilote: string | undefined;
  readonly racineDisque: string | undefined;
  readonly urlPublique: string | undefined;
}

export function construireStockage(config: ConfigurationStockage): Stockage {
  const pilote = config.pilote ?? "disque";

  switch (pilote) {
    case "disque":
      return new StockageDisque(
        config.racineDisque ?? "./.donnees/fichiers",
        config.urlPublique ?? "http://localhost:3000/fichiers",
      );
    case "s3":
      // Écrite le jour où le mouvement paie. L'interface étant fixée, ce sera
      // un fichier de plus et une ligne ici — rien d'autre dans le projet ne
      // change. Échouer bruyamment vaut mieux que retomber sur le disque en
      // silence : un stockage qui n'est pas celui qu'on croit est une perte de
      // données qu'on découvre trop tard.
      throw new Error(
        "STOCKAGE_PILOTE=s3 : l'implémentation S3 n'est pas encore écrite (ADR-013).",
      );
    default:
      throw new Error(
        `STOCKAGE_PILOTE inconnu : « ${pilote} ». Valeurs acceptées : disque, s3.`,
      );
  }
}
