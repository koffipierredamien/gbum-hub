"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { enregistrerBrouillon, publierPage } from "@gbum/db";
import { exigerCompte } from "../auth/garde";
import { LANGUES } from "../i18n/routage";

const Brouillon = z.object({
  espace: z.string().min(1).max(60),
  langue: z.enum(LANGUES),
  sections: z.record(z.string().max(80), z.string().max(8000)),
});

export type EtatEditeur =
  | { readonly type: "repos" }
  | { readonly type: "enregistre" }
  | { readonly type: "publiee" }
  | { readonly type: "echec" };

/**
 * Enregistre un brouillon. Ne touche PAS à ce que le site public affiche.
 *
 * C'est la promesse faite au Secrétariat National sur son écran, et elle doit
 * être vraie dans le code avant d'être écrite à l'écran.
 */
export async function enregistrerSections(
  _precedent: EtatEditeur,
  donnees: FormData,
): Promise<EtatEditeur> {
  const compte = await exigerCompte();

  // On n'enregistre QUE ce qui a changé.
  //
  // Sans ce tri, enregistrer une seule correction marquait les cinq sections
  // du formulaire comme « brouillon », y compris celles qu'on n'avait pas
  // touchées — et la colonne d'état, qui est la seule manière de savoir ce
  // qu'on a réellement écrit, cessait de dire la vérité. Le formulaire
  // renvoie donc la valeur d'origine à côté de la nouvelle.
  const sections: Record<string, string> = {};
  for (const [nom, valeur] of donnees.entries()) {
    if (!nom.startsWith("section:") || typeof valeur !== "string") continue;
    const cle = nom.slice("section:".length);
    if (donnees.get(`origine:${cle}`) === valeur) continue;
    sections[cle] = valeur;
  }
  if (Object.keys(sections).length === 0) return { type: "repos" };

  const analyse = Brouillon.safeParse({
    espace: donnees.get("espace"),
    langue: donnees.get("langue"),
    sections,
  });
  if (!analyse.success) return { type: "echec" };

  try {
    for (const [cle, brouillon] of Object.entries(analyse.data.sections)) {
      await enregistrerBrouillon({
        page: analyse.data.espace,
        cle,
        langue: analyse.data.langue,
        brouillon,
        compteId: compte.id,
      });
    }
    // L'écran d'édition lit l'état des sections depuis la base : sans ce
    // rafraîchissement, il garderait celui d'avant l'enregistrement, le
    // panneau continuerait d'annoncer « tout est publié » et le bouton
    // « Publier » resterait grisé. On aurait enregistré, et le seul geste qui
    // met le texte en ligne serait devenu impossible.
    revalidatePath(`/admin/pages/${analyse.data.espace}`);
    revalidatePath("/admin/pages");
    revalidatePath("/admin");
    return { type: "enregistre" };
  } catch (cause) {
    console.error("enregistrement d'un brouillon", {
      espace: analyse.data.espace,
      cause,
    });
    return { type: "echec" };
  }
}

/**
 * Publie une page : ses brouillons deviennent le texte en ligne.
 *
 * Et le site public le montre TOUT DE SUITE. Sans `revalidatePath`, les pages
 * mises en cache garderaient l'ancien texte jusqu'à cinq minutes — et le
 * Secrétariat National, ne voyant rien changer, publierait une seconde fois en
 * croyant que ça n'a pas marché.
 */
export async function publierSections(
  _precedent: EtatEditeur,
  donnees: FormData,
): Promise<EtatEditeur> {
  await exigerCompte();
  const espace = donnees.get("espace");
  if (typeof espace !== "string" || espace === "") return { type: "echec" };

  try {
    await publierPage(espace);
    revalidatePath("/", "layout");
    revalidatePath(`/admin/pages/${espace}`);
    revalidatePath("/admin/pages");
    revalidatePath("/admin");
    return { type: "publiee" };
  } catch (cause) {
    console.error("publication d'une page", { espace, cause });
    return { type: "echec" };
  }
}
