"use server";

import { z } from "zod";
import { enregistrerDemande } from "@gbum/db";

/**
 * La frontière (R4) : tout ce qui entre est validé par un schéma, et devient
 * un type sûr. Le cœur ne re-vérifie pas — il sait.
 */
const Demande = z.object({
  sujet: z.enum(["rejoindre", "soutenir", "question", "autre", "souvenir"]),
  nom: z.string().trim().min(1).max(120),
  contact: z.string().trim().min(3).max(200),
  villeId: z.uuid().nullable(),
  villeLibre: z.string().trim().max(120).nullable(),
  message: z.string().trim().min(1).max(4000),
  // Le piège à robots : un champ que personne ne voit et que personne ne
  // remplit. S'il est rempli, c'est une machine — et on répond « envoyé »
  // sans rien écrire, parce qu'un robot à qui l'on dit non revient.
  piege: z.string().max(0).optional().or(z.string()),
});

export type EtatEnvoi =
  | { readonly type: "repos" }
  | { readonly type: "envoye" }
  | { readonly type: "refuse"; readonly cause: "champs" | "indisponible" };

export async function envoyerDemande(
  _precedent: EtatEnvoi,
  donnees: FormData,
): Promise<EtatEnvoi> {
  const brut = {
    sujet: donnees.get("sujet"),
    nom: donnees.get("nom"),
    contact: donnees.get("contact"),
    villeId: donnees.get("villeId") === "" ? null : donnees.get("villeId"),
    villeLibre: donnees.get("villeLibre") === "" ? null : donnees.get("villeLibre"),
    message: donnees.get("message"),
    piege: donnees.get("piege") ?? "",
  };

  const analyse = Demande.safeParse(brut);
  if (!analyse.success) {
    return { type: "refuse", cause: "champs" };
  }
  if (analyse.data.piege !== undefined && analyse.data.piege !== "") {
    return { type: "envoye" };
  }

  try {
    await enregistrerDemande({
      sujet: analyse.data.sujet,
      nom: analyse.data.nom,
      contact: analyse.data.contact,
      villeId: analyse.data.villeId,
      villeLibre: analyse.data.villeLibre,
      message: analyse.data.message,
    });
    return { type: "envoye" };
  } catch (cause) {
    // R2 — on journalise avec le contexte et on le DIT à l'utilisateur.
    // Répondre « envoyé » alors que rien n'est parti est la pire des
    // réponses : la personne attend une réponse qui ne viendra jamais.
    console.error("enregistrement d'une demande", { sujet: analyse.data.sujet, cause });
    return { type: "refuse", cause: "indisponible" };
  }
}
