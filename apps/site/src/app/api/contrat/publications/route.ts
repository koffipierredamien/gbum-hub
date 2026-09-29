import { EN_TETE_HORODATAGE, EN_TETE_SIGNATURE, verifier } from "@gbum/contrat";
import { hubPrive } from "../../../../contrat/hub";
import { synchroniserVilles } from "../../../../contrat/synchroniser";

/**
 * Le hub privé prévient le site qu'une publication a changé (ADR-014).
 *
 * Il n'envoie PAS les villes : il signale, et le site va les chercher lui-même
 * par la porte signée. Un message forgé ne peut donc rien écrire ici — au pire
 * provoquerait-il une relecture, et il ne le peut pas sans la clé.
 *
 * Sans hub configuré, la porte n'existe pas (404) : fermée par défaut.
 */
export async function POST(requete: Request): Promise<Response> {
  const hub = hubPrive();
  if (hub === null) return new Response(null, { status: 404 });

  const corps = await requete.text();
  const signature = verifier({
    cle: hub.cle,
    horodatage: Number(requete.headers.get(EN_TETE_HORODATAGE)),
    corps,
    signature: requete.headers.get(EN_TETE_SIGNATURE) ?? "",
    maintenant: hub.maintenant(),
  });
  if (!signature.ok) return Response.json({ refus: signature.erreur }, { status: 401 });

  const resultat = await synchroniserVilles();
  return resultat.ok
    ? Response.json({ synchronise: true, ...resultat.valeur })
    : Response.json({ refus: resultat.erreur.type }, { status: 502 });
}
