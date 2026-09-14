"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import {
  compterTechniquesActifs,
  creerCompte,
  definirActivite,
  definirMotDePasse,
  lireCompteParId,
} from "@gbum/db";
import { estUnRole, retirerLAcces, type Role } from "@gbum/core";
import { hacher, motDePasseAcceptable, verifier } from "@gbum/identite";
import { exigerCompte } from "../auth/garde";
import { ouvrirLaSession } from "../auth/session";

/**
 * La gestion des comptes.
 *
 * Elle manquait, et c'était le trou le plus gênant de l'espace : un mot de
 * passe oublié n'avait aucune issue, et donner un accès au Secrétariat
 * National demandait une ligne de commande sur la machine du développeur.
 *
 * Deux niveaux de garde, et ils ne se confondent pas :
 *   — **tout compte connecté** peut changer SON mot de passe ;
 *   — **le rôle technique seul** crée un compte ou retire un accès.
 * La vérification se fait ici, dans l'action, et pas seulement dans l'écran
 * qui affiche le bouton : une action de serveur est une adresse publique.
 */

export type EtatMotDePasse =
  | { readonly type: "repos" }
  | { readonly type: "change" }
  | { readonly type: "ancien-faux" }
  | { readonly type: "trop-court" }
  | { readonly type: "sans-confirmation" }
  | { readonly type: "indisponible" };

const Changement = z.object({
  ancien: z.string().min(1).max(400),
  nouveau: z.string().min(1).max(400),
  confirmation: z.string().min(1).max(400),
});

export async function changerMonMotDePasse(
  _precedent: EtatMotDePasse,
  donnees: FormData,
): Promise<EtatMotDePasse> {
  const moi = await exigerCompte();

  const analyse = Changement.safeParse(Object.fromEntries(donnees));
  if (!analyse.success) return { type: "sans-confirmation" };
  const { ancien, nouveau, confirmation } = analyse.data;

  if (nouveau !== confirmation) return { type: "sans-confirmation" };
  if (!motDePasseAcceptable(nouveau)) return { type: "trop-court" };

  try {
    const compte = await lireCompteParId(moi.id);
    if (compte === null) return { type: "indisponible" };

    // L'ancien mot de passe est exigé même si la session est ouverte : sans
    // cela, un navigateur laissé sans surveillance suffirait à s'emparer du
    // compte pour de bon.
    if (!(await verifier(ancien, compte.motDePasse))) return { type: "ancien-faux" };

    await definirMotDePasse(moi.id, await hacher(nouveau));
    // `definirMotDePasse` a fermé TOUTES les sessions, y compris celle-ci :
    // on en rouvre une pour ce navigateur, et les autres se reconnecteront.
    await ouvrirLaSession(moi.id);
  } catch (cause) {
    console.error("changement de mot de passe", { cause });
    return { type: "indisponible" };
  }

  revalidatePath("/admin/comptes");
  return { type: "change" };
}

export type EtatCompte =
  | { readonly type: "repos" }
  | { readonly type: "cree"; readonly courriel: string }
  | { readonly type: "refuse"; readonly raison: string };

const Nouveau = z.object({
  courriel: z.email().max(200),
  nom: z.string().trim().min(1).max(120),
  motDePasse: z.string().min(1).max(400),
  role: z.string().trim(),
});

export async function ajouterUnCompte(
  _precedent: EtatCompte,
  donnees: FormData,
): Promise<EtatCompte> {
  const refus = await exigerTechnique();
  if (refus !== null) return refus;

  const analyse = Nouveau.safeParse(Object.fromEntries(donnees));
  if (!analyse.success) return { type: "refuse", raison: "saisie" };
  const { courriel, nom, motDePasse, role } = analyse.data;

  if (!estUnRole(role)) return { type: "refuse", raison: "role" };
  if (!motDePasseAcceptable(motDePasse))
    return { type: "refuse", raison: "trop-court" };

  try {
    await creerCompte({
      courriel,
      nom,
      motDePasseHache: await hacher(motDePasse),
      role,
    });
  } catch (cause) {
    // Le courriel est unique en base : une adresse déjà prise arrive ici, et
    // ce n'est pas une panne — c'est une information à rendre à l'écran.
    console.error("création d'un compte", { cause });
    return { type: "refuse", raison: "existe" };
  }

  revalidatePath("/admin/comptes");
  return { type: "cree", courriel };
}

export type EtatAcces =
  | { readonly type: "repos" }
  | { readonly type: "fait" }
  | { readonly type: "dernier-technique" }
  | { readonly type: "refuse" };

export async function basculerLAcces(
  _precedent: EtatAcces,
  donnees: FormData,
): Promise<EtatAcces> {
  const refus = await exigerTechnique();
  if (refus !== null) return { type: "refuse" };

  const id = donnees.get("id");
  const actifVoulu = donnees.get("actif") === "oui";
  if (typeof id !== "string") return { type: "refuse" };

  try {
    const compte = await lireCompteParId(id);
    if (compte === null) return { type: "refuse" };

    if (!actifVoulu) {
      const role: Role = estUnRole(compte.role) ? compte.role : "secretariat";
      const verdict = retirerLAcces(
        { role, actif: compte.actif },
        await compterTechniquesActifs(),
      );
      if (!verdict.ok) return { type: "dernier-technique" };
    }

    await definirActivite(id, actifVoulu);
  } catch (cause) {
    console.error("changement d'accès", { cause });
    return { type: "refuse" };
  }

  revalidatePath("/admin/comptes");
  return { type: "fait" };
}

/** Rend un refus typé plutôt que de lever : l'écran doit pouvoir l'afficher. */
async function exigerTechnique(): Promise<EtatCompte | null> {
  const moi = await exigerCompte();
  return moi.role === "technique"
    ? null
    : { type: "refuse", raison: "role-insuffisant" };
}
