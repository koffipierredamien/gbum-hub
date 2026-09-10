import type { ReactNode } from "react";

/**
 * D3 — la photographie porte la page, elle ne l'illustre pas.
 *
 * Pleine largeur, jamais dans une carte, jamais moins de 240 px de haut. Le
 * voile encre à 66 % est dans la feuille de style : sur l'image la plus claire
 * concevable, la crème y mesure 4,81:1.
 *
 * Tant qu'aucune photographie n'est fournie (demande N1), le dégradé tient la
 * place — et le marqueur d'attente dit à quoi elle est destinée.
 */
export function Photo({
  hauteur = 250,
  children,
}: {
  hauteur?: number;
  children?: ReactNode;
}) {
  return (
    <div className="photo" style={{ minHeight: hauteur }}>
      <div
        style={{
          minHeight: hauteur,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "18px var(--gouttiere)",
        }}
      >
        {children}
      </div>
    </div>
  );
}
