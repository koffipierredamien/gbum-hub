import { notFound } from "next/navigation";
import { lireSectionsDePage, type Section } from "@gbum/db";
import { exigerCompte } from "../../../../../auth/garde";
import { trouverPageEditable, type PageEditable } from "../../textes";
import { Editeur } from "./editeur";
import type { ValeurSection } from "./champ-section";
import frMessages from "../../../../../../messages/fr.json";
import enMessages from "../../../../../../messages/en.json";

export const dynamic = "force-dynamic";

type Catalogue = Record<string, Record<string, string>>;
const LIVRE: Record<string, Catalogue> = {
  fr: frMessages as unknown as Catalogue,
  en: enMessages as unknown as Catalogue,
};

/**
 * L'écran d'édition d'une page.
 *
 * Chaque section arrive avec TROIS états possibles, et l'écran les distingue :
 * le texte livré avec le site (aucune ligne en base), un brouillon en cours
 * (une ligne dont `publie` est vide ou différent), et le texte en ligne.
 * Confondre les trois ferait publier par erreur, ou croire qu'on a publié.
 */
export default async function EditionDePage({
  params,
}: {
  params: Promise<{ espace: string }>;
}) {
  await exigerCompte();
  const { espace } = await params;
  const page = trouverPageEditable(espace);
  if (page === undefined) notFound();

  const enregistrees = await lireSectionsDePage(espace).catch((cause: unknown) => {
    console.error("lecture des sections d'une page", { espace, cause });
    return [];
  });

  return <Editeur page={page} valeurs={rassembler(page, espace, enregistrees)} />;
}

/**
 * Assemble, pour chaque section et chaque langue, les trois états possibles :
 * le brouillon en cours, le texte en ligne, et le texte livré avec le site.
 *
 * Séparé de la page parce que c'est la seule chose un peu subtile ici, et
 * qu'elle mérite d'être lisible d'un bloc.
 */
function rassembler(
  page: PageEditable,
  espace: string,
  enregistrees: readonly Section[],
): Record<string, ValeurSection> {
  const valeurs: Record<string, ValeurSection> = {};
  for (const langue of ["fr", "en"] as const) {
    for (const section of page.sections) {
      const ligne = enregistrees.find(
        (candidate) => candidate.cle === section.cle && candidate.langue === langue,
      );
      valeurs[`${langue}:${section.cle}`] = {
        brouillon: ligne?.brouillon ?? "",
        publie: ligne?.publie ?? "",
        livre: LIVRE[langue]?.[espace]?.[section.cle] ?? "",
      };
    }
  }
  return valeurs;
}
