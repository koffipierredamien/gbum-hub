import { and, eq, isNotNull, sql } from "drizzle-orm";
import { ouvrirBase } from "./connexion";
import { sectionsEditoriales } from "./schema";

/**
 * Le contenu éditorial : ce que le Secrétariat National écrit, et ce que le
 * site montre.
 *
 * Les deux ne sont pas la même chose, et c'est tout l'enjeu de cet écran :
 * `brouillon` est en cours d'écriture, `publie` est en ligne. Publier recopie
 * l'un dans l'autre. Rien ne change en ligne tant qu'on n'a pas publié.
 */

export interface Section {
  readonly page: string;
  readonly cle: string;
  readonly langue: string;
  readonly brouillon: string | null;
  readonly publie: string | null;
  readonly modifieLe: Date;
}

/** Ce que le site public affiche. Rien d'autre ne sort d'ici vers le public. */
export async function lireSectionsPubliees(): Promise<readonly Section[]> {
  const { base, fermer } = ouvrirBase();
  try {
    return await base
      .select()
      .from(sectionsEditoriales)
      .where(isNotNull(sectionsEditoriales.publie));
  } finally {
    await fermer();
  }
}

export async function lireSectionsDePage(page: string): Promise<readonly Section[]> {
  const { base, fermer } = ouvrirBase();
  try {
    return await base
      .select()
      .from(sectionsEditoriales)
      .where(eq(sectionsEditoriales.page, page));
  } finally {
    await fermer();
  }
}

/**
 * Écrit un brouillon, sans toucher à ce qui est publié.
 *
 * `onConflictDoUpdate` plutôt qu'un « lire puis écrire » : deux personnes qui
 * enregistrent au même instant ne créent pas deux lignes, et la contrainte
 * d'unicité fait le travail à notre place. L'application actuelle a connu
 * l'inverse — deux requêtes concurrentes chargeaient le même état, la seconde
 * écrasait la première.
 */
export async function enregistrerBrouillon(entree: {
  page: string;
  cle: string;
  langue: string;
  brouillon: string;
  compteId: string;
}): Promise<void> {
  const { base, fermer } = ouvrirBase();
  try {
    await base
      .insert(sectionsEditoriales)
      .values({
        page: entree.page,
        cle: entree.cle,
        langue: entree.langue,
        brouillon: entree.brouillon,
        modifiePar: entree.compteId,
      })
      .onConflictDoUpdate({
        target: [
          sectionsEditoriales.page,
          sectionsEditoriales.cle,
          sectionsEditoriales.langue,
        ],
        set: {
          brouillon: entree.brouillon,
          modifieLe: new Date(),
          modifiePar: entree.compteId,
        },
      });
  } finally {
    await fermer();
  }
}

/**
 * Publie une page entière : tous ses brouillons deviennent le texte en ligne,
 * d'un coup.
 *
 * Page par page et non section par section, à dessein : une page à moitié
 * publiée, dont un paragraphe parle de la nouvelle année et le suivant de
 * l'ancienne, est pire que la page d'avant.
 */
export async function publierPage(page: string): Promise<number> {
  const { base, fermer } = ouvrirBase();
  try {
    const lignes = await base
      .update(sectionsEditoriales)
      .set({ publie: sql`${sectionsEditoriales.brouillon}` })
      .where(
        and(
          eq(sectionsEditoriales.page, page),
          isNotNull(sectionsEditoriales.brouillon),
        ),
      )
      .returning({ cle: sectionsEditoriales.cle });
    return lignes.length;
  } finally {
    await fermer();
  }
}
