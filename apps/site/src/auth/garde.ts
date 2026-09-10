import "server-only";
import { redirect } from "next/navigation";
import type { Compte } from "@gbum/db";
import { compteConnecte } from "./session";

/**
 * Le premier geste de chaque écran d'administration.
 *
 * La garde est posée PAR ÉCRAN et non dans la disposition : la page de
 * connexion partage cette disposition, et une garde qui s'y appliquerait
 * enverrait vers la page de connexion… depuis la page de connexion.
 */
export async function exigerCompte(): Promise<Compte> {
  const compte = await compteConnecte();
  if (compte === null) redirect("/admin/connexion");
  return compte;
}
