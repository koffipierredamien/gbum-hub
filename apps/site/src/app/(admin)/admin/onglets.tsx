"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { T } from "./textes";

const ONGLETS = [
  { chemin: "/admin", cle: "tableau" },
  { chemin: "/admin/pages", cle: "pages" },
  { chemin: "/admin/villes", cle: "villes" },
  { chemin: "/admin/demandes", cle: "demandes" },
] as const;

/**
 * Le compteur des demandes non traitées est passé en propriété plutôt que lu
 * ici : une boîte de réception qui n'affiche pas ce qui reste à faire se
 * remplit et n'est plus lue.
 */
export function Onglets({ demandesNonTraitees = 0 }: { demandesNonTraitees?: number }) {
  const chemin = usePathname();

  return (
    <nav className="onglets" aria-label="Sections de l'administration">
      {ONGLETS.map((onglet) => {
        const actif =
          onglet.chemin === "/admin"
            ? chemin === "/admin"
            : chemin.startsWith(onglet.chemin);
        return (
          <Link
            key={onglet.chemin}
            href={onglet.chemin}
            className="onglet"
            aria-current={actif ? "page" : undefined}
          >
            {T.onglets[onglet.cle]}
            {onglet.cle === "demandes" && demandesNonTraitees > 0 ? (
              <span className="pastille-compteur">{demandesNonTraitees}</span>
            ) : null}
          </Link>
        );
      })}
    </nav>
  );
}
