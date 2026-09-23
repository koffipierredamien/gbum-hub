"use server";

import { z } from "zod";
import { enregistrerContributions } from "@gbum/db";
import { QUESTIONS } from "../app/(collecte)/questions";
import { cleValide } from "../auth/collecte";

/**
 * L'envoi du formulaire de collecte.
 *
 * Il n'y a PAS de session ici : c'est un lien secret, pas un compte. Deux
 * gardes le protègent donc, et elles sont dans cet ordre :
 *
 *   1. la clé du lien est comparée à celle de l'environnement ;
 *   2. seules les questions connues sont enregistrées — une clé inventée par
 *      un formulaire trafiqué ne crée rien.
 *
 * Sans la première, n'importe qui remplit la base ; sans la seconde, la table
 * devient un dépotoir de champs arbitraires.
 */
/**
 * Les saisies repartent avec l'état, et ce n'est pas un confort.
 *
 * React 19 REMET LE FORMULAIRE À ZÉRO quand une action se termine, y compris
 * quand elle refuse. Sans ce renvoi, une personne qui a écrit dix lignes sur
 * l'histoire du mouvement et oublié son nom perdait tout. Trouvé le
 * 23 septembre 2026 en jouant le formulaire dans un navigateur — le refus
 * s'affichait bien, et la réponse déjà tapée n'était plus là.
 */
export type Saisies = Readonly<Record<string, string>>;

export type EtatCollecte =
  | { readonly type: "repos" }
  | { readonly type: "recu"; readonly combien: number }
  | { readonly type: "vide"; readonly saisies: Saisies }
  | { readonly type: "sans-nom"; readonly saisies: Saisies }
  | { readonly type: "refuse"; readonly saisies: Saisies }
  | { readonly type: "indisponible"; readonly saisies: Saisies };

const Envoi = z.object({
  cle: z.string().min(1).max(200),
  auteur: z.string().trim().min(2).max(120),
  contact: z.string().trim().max(200),
});

const CLES_CONNUES = new Set(QUESTIONS.map((question) => question.cle));

export async function envoyerCollecte(
  _precedent: EtatCollecte,
  donnees: FormData,
): Promise<EtatCollecte> {
  const saisies = relireSaisies(donnees);

  const enTete = Envoi.safeParse({
    cle: donnees.get("cle"),
    auteur: donnees.get("auteur"),
    contact: donnees.get("contact") ?? "",
  });
  if (!enTete.success) return { type: "sans-nom", saisies };
  if (!cleValide(enTete.data.cle)) return { type: "refuse", saisies };

  // `typeof valeur === "string"` n'est pas une politesse envers le typeur :
  // un formulaire trafiqué peut envoyer un FICHIER sous le nom d'une question,
  // et il finirait en base sous la forme « [object File] ».
  const reponses = [...donnees.entries()].flatMap(([champ, valeur]) => {
    if (!CLES_CONNUES.has(champ) || typeof valeur !== "string") return [];
    const propre = valeur.trim();
    if (propre === "") return [];
    return [
      {
        champ,
        valeur: propre,
        auteur: enTete.data.auteur,
        contact: enTete.data.contact === "" ? null : enTete.data.contact,
      },
    ];
  });

  if (reponses.length === 0) return { type: "vide", saisies };

  try {
    await enregistrerContributions(reponses);
  } catch (cause) {
    console.error("envoi du formulaire de collecte", { cause });
    return { type: "indisponible", saisies };
  }

  return { type: "recu", combien: reponses.length };
}

/** Tout ce qui a été tapé, pour le remettre dans le formulaire en cas de refus. */
function relireSaisies(donnees: FormData): Saisies {
  const saisies: Record<string, string> = {};
  for (const [champ, valeur] of donnees.entries()) {
    if (champ === "cle" || typeof valeur !== "string") continue;
    if (champ === "auteur" || champ === "contact" || CLES_CONNUES.has(champ)) {
      saisies[champ] = valeur;
    }
  }
  return saisies;
}
