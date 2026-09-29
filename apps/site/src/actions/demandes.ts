"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { marquerDemande } from "@gbum/db";
import { exigerCompte } from "../auth/garde";
import { remettreLesDemandes } from "../contrat/remettre";

export async function basculerDemande(donnees: FormData): Promise<void> {
  await exigerCompte();
  const id = donnees.get("id");
  const traitee = donnees.get("traitee") === "oui";
  if (typeof id !== "string") return;
  await marquerDemande(id, traitee);
  revalidatePath("/admin/demandes");
  revalidatePath("/admin");
}

/** Relance à la main la remise au hub privé, et dit ce qu'il en est. */
export async function remettreMaintenant(): Promise<void> {
  await exigerCompte();
  const bilan = await remettreLesDemandes();
  revalidatePath("/admin/demandes");
  redirect(
    `/admin/demandes?remises=${String(bilan.remises)}&attente=${String(bilan.enAttente)}`,
  );
}
