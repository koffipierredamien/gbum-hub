"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { lireCompteParCourriel } from "@gbum/db";
import { verifier } from "@gbum/identite";
import { fermerLaSession, ouvrirLaSession } from "../auth/session";

const Connexion = z.object({
  courriel: z.string().trim().min(3).max(200),
  motDePasse: z.string().min(1).max(400),
});

export type EtatConnexion =
  | { readonly type: "repos"; readonly courriel?: string }
  | { readonly type: "refuse"; readonly courriel: string }
  | { readonly type: "indisponible"; readonly courriel: string };

export async function seConnecter(
  _precedent: EtatConnexion,
  donnees: FormData,
): Promise<EtatConnexion> {
  const saisi = donnees.get("courriel");
  const courriel = typeof saisi === "string" ? saisi : "";

  const analyse = Connexion.safeParse({
    courriel,
    motDePasse: donnees.get("motDePasse"),
  });
  if (!analyse.success) return { type: "refuse", courriel };

  let compteId: string;
  try {
    const compte = await lireCompteParCourriel(analyse.data.courriel);

    // Un compte inconnu et un mot de passe faux donnent LE MÊME message, et
    // prennent à peu près le même temps : on vérifie le mot de passe même
    // quand le compte n'existe pas, contre un condensat factice. Sans cela,
    // la vitesse de la réponse dirait qui a un compte ici.
    const condensat = compte?.motDePasse ?? CONDENSAT_FACTICE;
    const juste = await verifier(analyse.data.motDePasse, condensat);

    if (compte === null || !compte.actif || !juste) return { type: "refuse", courriel };
    compteId = compte.id;
  } catch (cause) {
    console.error("tentative de connexion", { cause });
    return { type: "indisponible", courriel };
  }

  await ouvrirLaSession(compteId);
  redirect("/admin");
}

export async function seDeconnecter(): Promise<void> {
  await fermerLaSession();
  redirect("/admin/connexion");
}

/**
 * Un condensat valide, dont personne ne connaît le mot de passe. Il ne sert
 * qu'à faire travailler `verifier` pendant le même temps lorsque le compte
 * n'existe pas.
 */
const CONDENSAT_FACTICE =
  "scrypt$16384$8$1$AAAAAAAAAAAAAAAAAAAAAA$" +
  "Ym9uam91ci1jZS1jb25kZW5zYXQtbmUtY29ycmVzcG9uZC1hLXJpZW4tZHUtdG91dC1qYW1haXM";
