import "server-only";
import { revalidatePath } from "next/cache";
import { remplacerParLeHub, type BilanDuMiroir } from "@gbum/db";
import { echec, reussite, type Resultat } from "@gbum/core";
import { lirePublications, type ErreurHub } from "@gbum/contrat";
import { hubPrive } from "./hub";

export type ErreurSynchronisation = ErreurHub | { readonly type: "non-configure" };

/**
 * Remplace le miroir des villes par ce que publie le hub privé, puis
 * refabrique les pages publiques.
 *
 * En cas d'échec, rien n'est touché : le site garde sa dernière copie (C6).
 * L'échec est journalisé ET rendu — c'est l'appelant qui le dit à l'écran.
 */
export async function synchroniserVilles(): Promise<
  Resultat<BilanDuMiroir, ErreurSynchronisation>
> {
  const hub = hubPrive();
  if (hub === null) return echec({ type: "non-configure" });

  const lecture = await lirePublications(hub);
  if (!lecture.ok) {
    console.error("synchronisation des villes avec le hub privé", {
      erreur: lecture.erreur,
    });
    return lecture;
  }
  const bilan = await remplacerParLeHub(lecture.valeur.villes);
  revalidatePath("/", "layout");
  revalidatePath("/admin/villes");
  return reussite(bilan);
}
