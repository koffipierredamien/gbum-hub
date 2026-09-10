import type { ReactNode } from "react";
import "./global.css";

export const metadata = {
  title: "GBU Maroc",
  description: "Groupe Biblique Universitaire au Maroc",
};

export default function Racine({ children }: { children: ReactNode }) {
  // La langue par défaut est le français ; l'anglais viendra avec next-intl
  // (ADR-008 amendée : français et anglais, sans RTL).
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
