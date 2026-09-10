import Link from "next/link";
import { lireSectionsPubliees } from "@gbum/db";
import { exigerCompte } from "../../../../auth/garde";
import { PAGES_EDITABLES, T } from "../textes";

export const dynamic = "force-dynamic";

export default async function ListeDesPages() {
  await exigerCompte();
  const sections = await lireSectionsPubliees().catch((cause: unknown) => {
    console.error("lecture des sections publiées", { cause });
    return [];
  });

  const publiees = new Set(
    sections
      .filter((section) => section.publie !== null && section.publie.trim() !== "")
      .map((section) => `${section.page}:${section.cle}:${section.langue}`),
  );

  return (
    <main className="corps-admin">
      <h1 className="titre-admin">{T.pages.titre}</h1>
      <p className="accroche-admin">{T.pages.accroche}</p>

      <div className="grille-admin grille-2-admin">
        {PAGES_EDITABLES.map((page) => {
          const manquantes = page.sections.filter(
            (section) => !publiees.has(`${page.espace}:${section.cle}:fr`),
          ).length;
          return (
            <div className="carte-admin" key={page.espace}>
              <p className="etiquette-admin">
                {manquantes > 0
                  ? `${String(manquantes)} ${T.pages.sectionsVides}`
                  : T.pages.aJour}
              </p>
              <h2
                className="titre-admin"
                style={{ fontSize: "1.5rem", marginBottom: 14 }}
              >
                {page.titre}
              </h2>
              <Link
                href={`/admin/pages/${page.espace}`}
                className="bouton bouton-second"
              >
                {T.pages.modifier}
              </Link>
            </div>
          );
        })}
      </div>
    </main>
  );
}
