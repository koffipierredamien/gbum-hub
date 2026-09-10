"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import {
  creerCellule,
  creerVille,
  modifierCellule,
  modifierVille,
  supprimerCellule,
  supprimerVille,
} from "@gbum/db";
import { exigerCompte } from "../auth/garde";

/**
 * Les écritures sur les villes et les cellules.
 *
 * Chaque action vérifie la session AVANT de faire quoi que ce soit : une
 * action de serveur est une adresse publique, et le formulaire qui la déclenche
 * n'est pas une preuve. Ne s'en remettre qu'à la page qui l'affiche serait
 * confondre une porte fermée et une porte cachée.
 *
 * Chaque écriture rafraîchit le site public : sans cela, la ville ajoutée
 * n'apparaîtrait qu'au bout de cinq minutes, et on douterait d'avoir cliqué.
 */

const Ville = z.object({
  nom: z.string().trim().min(1).max(120),
  rang: z.coerce.number().int().min(0).max(999),
  bureauCourriel: z.string().trim().max(200),
  bureauMandatDebut: z.string().trim().max(20),
  bureauMandatFin: z.string().trim().max(20),
});

const Cellule = z.object({
  villeId: z.uuid(),
  nom: z.string().trim().min(1).max(120),
  nombreDeMembres: z.string().trim().max(6),
  rang: z.coerce.number().int().min(0).max(999),
});

function dateOuNull(valeur: string): Date | null {
  if (valeur === "") return null;
  const date = new Date(valeur);
  return Number.isNaN(date.getTime()) ? null : date;
}

function nombreOuNull(valeur: string): number | null {
  if (valeur === "") return null;
  const nombre = Number(valeur);
  return Number.isInteger(nombre) && nombre >= 0 ? nombre : null;
}

export async function ajouterVille(donnees: FormData): Promise<void> {
  await exigerCompte();
  const analyse = Ville.safeParse(Object.fromEntries(donnees));
  if (!analyse.success) return;
  await creerVille({ nom: analyse.data.nom, rang: analyse.data.rang });
  revalidatePath("/", "layout");
  revalidatePath("/admin/villes");
}

export async function enregistrerVille(donnees: FormData): Promise<void> {
  await exigerCompte();
  const id = donnees.get("id");
  const analyse = Ville.safeParse(Object.fromEntries(donnees));
  if (typeof id !== "string" || !analyse.success) return;

  await modifierVille(id, {
    nom: analyse.data.nom,
    rang: analyse.data.rang,
    bureauCourriel:
      analyse.data.bureauCourriel === "" ? null : analyse.data.bureauCourriel,
    bureauMandatDebut: dateOuNull(analyse.data.bureauMandatDebut),
    bureauMandatFin: dateOuNull(analyse.data.bureauMandatFin),
  });
  revalidatePath("/", "layout");
  revalidatePath("/admin/villes");
}

export async function retirerVille(donnees: FormData): Promise<void> {
  await exigerCompte();
  const id = donnees.get("id");
  if (typeof id !== "string") return;
  await supprimerVille(id);
  revalidatePath("/", "layout");
  revalidatePath("/admin/villes");
}

export async function ajouterCellule(donnees: FormData): Promise<void> {
  await exigerCompte();
  const analyse = Cellule.safeParse(Object.fromEntries(donnees));
  if (!analyse.success) return;
  await creerCellule({
    villeId: analyse.data.villeId,
    nom: analyse.data.nom,
    nombreDeMembres: nombreOuNull(analyse.data.nombreDeMembres),
    rang: analyse.data.rang,
  });
  revalidatePath("/", "layout");
  revalidatePath("/admin/villes");
}

export async function enregistrerCellule(donnees: FormData): Promise<void> {
  await exigerCompte();
  const id = donnees.get("id");
  const analyse = Cellule.safeParse(Object.fromEntries(donnees));
  if (typeof id !== "string" || !analyse.success) return;
  await modifierCellule(id, {
    nom: analyse.data.nom,
    nombreDeMembres: nombreOuNull(analyse.data.nombreDeMembres),
    rang: analyse.data.rang,
  });
  revalidatePath("/", "layout");
  revalidatePath("/admin/villes");
}

export async function retirerCellule(donnees: FormData): Promise<void> {
  await exigerCompte();
  const id = donnees.get("id");
  if (typeof id !== "string") return;
  await supprimerCellule(id);
  revalidatePath("/", "layout");
  revalidatePath("/admin/villes");
}
