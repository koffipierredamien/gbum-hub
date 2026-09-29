"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import {
  creerCellule,
  creerVille,
  modifierCellule,
  modifierContactVille,
  modifierVille,
  supprimerCellule,
  supprimerVille,
} from "@gbum/db";
import { exigerCompte } from "../auth/garde";
import { hubPrive } from "../contrat/hub";
import { synchroniserVilles } from "../contrat/synchroniser";

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
 *
 * Quand le hub privé est branché (ADR-014, C1), il est le propriétaire des
 * villes et des cellules : les actions qui les créent, les renomment ou les
 * suppriment REFUSENT, au lieu de compter sur un bouton caché. Seul le
 * contact du bureau reste écrit ici — le hub ne le publie pas en version 1.
 */

/** Le hub est propriétaire : une écriture ici serait effacée au prochain miroir. */
function miroir(): boolean {
  return hubPrive() !== null;
}

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
  if (miroir()) return;
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

  const contact = {
    bureauCourriel:
      analyse.data.bureauCourriel === "" ? null : analyse.data.bureauCourriel,
    bureauMandatDebut: dateOuNull(analyse.data.bureauMandatDebut),
    bureauMandatFin: dateOuNull(analyse.data.bureauMandatFin),
  };
  if (miroir()) await modifierContactVille(id, contact);
  else
    await modifierVille(id, {
      nom: analyse.data.nom,
      rang: analyse.data.rang,
      ...contact,
    });
  revalidatePath("/", "layout");
  revalidatePath("/admin/villes");
}

export async function retirerVille(donnees: FormData): Promise<void> {
  await exigerCompte();
  if (miroir()) return;
  const id = donnees.get("id");
  if (typeof id !== "string") return;
  await supprimerVille(id);
  revalidatePath("/", "layout");
  revalidatePath("/admin/villes");
}

export async function ajouterCellule(donnees: FormData): Promise<void> {
  await exigerCompte();
  if (miroir()) return;
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
  if (miroir()) return;
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
  if (miroir()) return;
  const id = donnees.get("id");
  if (typeof id !== "string") return;
  await supprimerCellule(id);
  revalidatePath("/", "layout");
  revalidatePath("/admin/villes");
}

/**
 * « Synchroniser maintenant » : relit le hub privé et remplace le miroir. Le
 * résultat revient dans l'adresse, pour que l'écran le DISE — réussi, ou
 * pourquoi pas — sans JavaScript.
 */
export async function synchroniserDepuisLeHub(): Promise<void> {
  await exigerCompte();
  const resultat = await synchroniserVilles();
  redirect(
    resultat.ok
      ? `/admin/villes?synchro=ok&villes=${String(resultat.valeur.villes)}`
      : `/admin/villes?synchro=${resultat.erreur.type}`,
  );
}
