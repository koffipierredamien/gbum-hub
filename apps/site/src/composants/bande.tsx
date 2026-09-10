import type { ReactNode } from "react";

export type Surface = "creme" | "sable" | "encre" | "terre" | "foret";

/**
 * D1 — une bande va d'un bord à l'autre ; la gouttière est INTÉRIEURE.
 *
 * Deux bandes sombres ne se suivent jamais : c'est une règle de composition
 * de page, qu'aucun composant ne peut faire respecter à la place de celui qui
 * assemble. Elle est vérifiée à la relecture des planches.
 */
export function Bande({
  surface = "creme",
  children,
  id,
}: {
  surface?: Surface;
  children: ReactNode;
  id?: string;
}) {
  return (
    <section className={`bande bande-${surface}`} {...(id === undefined ? {} : { id })}>
      <div>{children}</div>
    </section>
  );
}
