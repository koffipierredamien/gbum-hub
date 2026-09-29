import { z } from "zod";

/**
 * Ce que le site public remet au hub privé — version 1 du contrat (ADR-014).
 *
 * Une demande est d'abord enregistrée par le site (C6), puis remise : `id` est
 * l'identifiant qu'elle porte sur le site, et c'est ce qui permet au hub privé
 * de reconnaître une remise répétée après une panne au lieu de la compter deux
 * fois.
 *
 * La ville est désignée par son NOM : les deux bases numérotent leurs villes
 * chacune à sa façon, et le nom est la seule chose qu'elles partagent.
 */

/** Les sujets du formulaire du site, tels quels. */
export const SUJETS = [
  "rejoindre",
  "soutenir",
  "question",
  "autre",
  "souvenir",
] as const;

export const Demande = z.strictObject({
  version: z.literal("1"),
  id: z.uuid(),
  /** L'instant où le visiteur a envoyé le formulaire (ISO 8601, UTC). */
  creeLe: z.iso.datetime(),
  sujet: z.enum(SUJETS),
  nom: z.string().min(1).max(120),
  contact: z.string().min(3).max(200),
  /** Une ville connue du hub privé, ou null quand le visiteur l'a écrite. */
  ville: z.string().min(1).max(140).nullable(),
  villeLibre: z.string().max(120).nullable(),
  message: z.string().min(1).max(4000),
});

export type Demande = z.infer<typeof Demande>;
