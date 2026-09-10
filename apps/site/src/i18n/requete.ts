import { getRequestConfig } from "next-intl/server";
import { hasLocale } from "next-intl";
import { LANGUES, routage } from "./routage";
import fr from "../../messages/fr.json";
import en from "../../messages/en.json";
import { chargerEnvironnement, lireSectionsPubliees } from "@gbum/db";

const MESSAGES = { fr, en } as const;

// `requestLocale` est marquée dépréciée au profit de `next/root-params`, qui
// demande aujourd'hui un drapeau expérimental de Next. On garde donc l'API
// stable et documentée, en connaissance de cause : la migration se fera quand
// `next/root-params` sortira de l'expérimental, et ce commentaire est là pour
// qu'on n'oublie pas qu'elle est due.
// eslint-disable-next-line @typescript-eslint/no-deprecated
export default getRequestConfig(async ({ requestLocale }) => {
  const demandee = await requestLocale;
  const langue = hasLocale(LANGUES, demandee) ? demandee : routage.defaultLocale;

  return {
    locale: langue,
    // Trois couches, de la plus générale à la plus précise : le français livré
    // avec le site, la traduction de la langue demandée, puis ce que le
    // Secrétariat National a PUBLIÉ depuis l'espace d'administration.
    messages: await recouvrir({ ...MESSAGES.fr, ...MESSAGES[langue] }, langue),

    /**
     * Quand une traduction anglaise manque, on affiche le français plutôt
     * qu'une clé technique ou un vide. C'est ce que montre la planche 11 des
     * maquettes — « Anglais absent : le français s'affichera à sa place ».
     *
     * Une clé qui manque DANS LES DEUX langues est une faute de frappe, pas un
     * contenu qui attend : on la rend visible au lieu de la masquer.
     */
    getMessageFallback: ({ key, namespace }) => {
      const chemin = namespace === undefined ? key : `${namespace}.${key}`;
      return `[texte manquant : ${chemin}]`;
    },

    timeZone: "Africa/Casablanca",
  };
});

type Catalogue = Record<string, Record<string, unknown>>;

/**
 * Recouvre le texte livré avec le site par celui que le mouvement a publié.
 *
 * Seul `publie` est lu — jamais `brouillon`. C'est ce qui rend vraie la
 * promesse faite au Secrétariat National sur son écran : rien ne change en
 * ligne tant qu'il n'a pas publié.
 *
 * Une section absente d'ici n'est pas un trou : le texte livré s'affiche. Le
 * mouvement ne remplit donc que ce qu'il veut changer.
 *
 * R2 — si la base ne répond pas, on journalise et on rend le catalogue livré.
 * Un site public qui refuse de s'afficher parce qu'une surcharge de texte est
 * inaccessible serait une panne bien pire que le texte d'origine.
 */
async function recouvrir(catalogue: Catalogue, langue: string): Promise<Catalogue> {
  chargerEnvironnement();
  if (process.env["DATABASE_URL"] === undefined) return catalogue;

  try {
    const sections = await lireSectionsPubliees();
    const recouvert: Catalogue = { ...catalogue };
    for (const section of sections) {
      if (section.langue !== langue || section.publie === null) continue;
      const espace = recouvert[section.page];
      if (espace === undefined) continue;
      recouvert[section.page] = { ...espace, [section.cle]: section.publie };
    }
    return recouvert;
  } catch (cause) {
    console.error("lecture du contenu éditorial publié", { langue, cause });
    return catalogue;
  }
}
