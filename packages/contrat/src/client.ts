import { echec, reussite, type Resultat } from "@gbum/core";
import type { Demande } from "./demandes";
import { Publications } from "./publications";
import { EN_TETE_HORODATAGE, EN_TETE_SIGNATURE, signer, verifier } from "./signature";

/**
 * Le côté site public du contrat : lire les publications du hub privé, lui
 * remettre une demande (ADR-014).
 *
 * L'appel réseau est PASSÉ en paramètre (`appeler`) : c'est `fetch` en
 * service, une fonction en mémoire dans les tests. Les règles — la signature
 * vérifiée avant d'en croire un mot, le schéma appliqué à la frontière — se
 * testent ainsi sans hub privé ni réseau.
 *
 * Aucune erreur n'est avalée (R2) : chaque issue a son nom, et c'est
 * l'appelant qui décide — garder sa dernière copie, retenter plus tard.
 */

export interface Hub {
  /** L'adresse du hub privé, sans « / » final — HUB_PRIVE_URL. */
  readonly adresse: string;
  /** La clé partagée — CONTRAT_CLE. */
  readonly cle: string;
  readonly appeler: typeof fetch;
  /** Secondes depuis 1970 : l'instant est injecté (R8). */
  readonly maintenant: () => number;
}

export type ErreurHub =
  | { readonly type: "injoignable"; readonly cause: unknown }
  | { readonly type: "refuse"; readonly statut: number }
  | { readonly type: "signature"; readonly raison: string }
  | { readonly type: "hors-contrat"; readonly ecarts: readonly string[] };

/** Au-delà, on n'attend plus : le site garde sa copie, ou retentera. */
const DELAI_MS = 8000;

export async function lirePublications(
  hub: Hub,
): Promise<Resultat<Publications, ErreurHub>> {
  const reponse = await appelerSansLever(
    hub,
    `${hub.adresse}/contrat/v1/publications`,
    {
      method: "GET",
    },
  );
  if (!reponse.ok) return reponse;
  const { statut, corps, entetes } = reponse.valeur;
  if (statut !== 200) return echec({ type: "refuse", statut });

  const signature = verifier({
    cle: hub.cle,
    horodatage: Number(entetes.get(EN_TETE_HORODATAGE)),
    corps,
    signature: entetes.get(EN_TETE_SIGNATURE) ?? "",
    maintenant: hub.maintenant(),
  });
  if (!signature.ok) return echec({ type: "signature", raison: signature.erreur });

  return analyser(corps);
}

export async function remettreDemande(
  hub: Hub,
  demande: Demande,
): Promise<Resultat<void, ErreurHub>> {
  const corps = JSON.stringify(demande);
  const horodatage = hub.maintenant();
  const reponse = await appelerSansLever(hub, `${hub.adresse}/contrat/v1/demandes`, {
    method: "POST",
    body: corps,
    headers: {
      "Content-Type": "application/json",
      [EN_TETE_HORODATAGE]: String(horodatage),
      [EN_TETE_SIGNATURE]: signer(hub.cle, horodatage, corps),
    },
  });
  if (!reponse.ok) return reponse;
  // 201 à la première remise, 200 à une remise répétée : dans les deux cas
  // la demande est arrivée, et on peut cesser de la renvoyer.
  const { statut } = reponse.valeur;
  return statut === 200 || statut === 201
    ? reussite(undefined)
    : echec({ type: "refuse", statut });
}

function analyser(corps: string): Resultat<Publications, ErreurHub> {
  let brut: unknown;
  try {
    brut = JSON.parse(corps);
  } catch (cause) {
    // Transformée en erreur typée, avec sa cause : un corps qui ne se lit pas
    // est une réponse hors contrat, pas une panne silencieuse (R2).
    return echec({
      type: "hors-contrat",
      ecarts: [`corps illisible : ${String(cause)}`],
    });
  }
  const lecture = Publications.safeParse(brut);
  return lecture.success
    ? reussite(lecture.data)
    : echec({
        type: "hors-contrat",
        ecarts: lecture.error.issues.map((i) => `${i.path.join(".")} : ${i.message}`),
      });
}

interface ReponseBrute {
  readonly statut: number;
  readonly corps: string;
  readonly entetes: Headers;
}

async function appelerSansLever(
  hub: Hub,
  adresse: string,
  options: RequestInit,
): Promise<Resultat<ReponseBrute, ErreurHub>> {
  try {
    const reponse = await hub.appeler(adresse, {
      ...options,
      signal: AbortSignal.timeout(DELAI_MS),
    });
    return reussite({
      statut: reponse.status,
      corps: await reponse.text(),
      entetes: reponse.headers,
    });
  } catch (cause) {
    return echec({ type: "injoignable", cause });
  }
}
