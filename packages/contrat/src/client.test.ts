import { describe, expect, it } from "vitest";
import { lirePublications, remettreDemande, type Hub } from "./client";
import type { Demande } from "./demandes";
import { EN_TETE_HORODATAGE, EN_TETE_SIGNATURE, signer } from "./signature";

const CLE = "cle-des-tests-du-client";
const MAINTENANT = 1_790_000_000;

const PUBLICATIONS = {
  version: "1",
  emisLe: "2026-09-29T08:00:00Z",
  villes: [
    { nom: "Ville d'essai", rang: 1, cellules: [{ nom: "A", nombreDeMembres: 4 }] },
  ],
};

/** Un hub privé en mémoire, qui signe (ou non) ce qu'il rend. */
function hubRepondant(
  corps: string,
  options: { statut?: number; cle?: string; horodatage?: number } = {},
): Hub {
  const horodatage = options.horodatage ?? MAINTENANT;
  return {
    adresse: "https://hub.exemple",
    cle: CLE,
    maintenant: () => MAINTENANT,
    appeler: () =>
      Promise.resolve(
        new Response(corps, {
          status: options.statut ?? 200,
          headers: {
            [EN_TETE_HORODATAGE]: String(horodatage),
            [EN_TETE_SIGNATURE]: signer(options.cle ?? CLE, horodatage, corps),
          },
        }),
      ),
  };
}

describe("lire les publications du hub privé", () => {
  it("accepte une publication signée et conforme", async () => {
    const lecture = await lirePublications(hubRepondant(JSON.stringify(PUBLICATIONS)));
    expect(lecture).toEqual({ ok: true, valeur: PUBLICATIONS });
  });

  it("refuse une réponse signée avec une autre clé", async () => {
    const lecture = await lirePublications(
      hubRepondant(JSON.stringify(PUBLICATIONS), { cle: "une-autre" }),
    );
    expect(lecture).toEqual({
      ok: false,
      erreur: { type: "signature", raison: "signature-invalide" },
    });
  });

  it("refuse une réponse trop ancienne", async () => {
    const lecture = await lirePublications(
      hubRepondant(JSON.stringify(PUBLICATIONS), { horodatage: MAINTENANT - 600 }),
    );
    expect(lecture.ok).toBe(false);
  });

  it("refuse une cellule qui porte un lieu, même bien signée (ADR-011)", async () => {
    const fautive = structuredClone(PUBLICATIONS) as {
      villes: { cellules: Record<string, unknown>[] }[];
    };
    const cellule = fautive.villes[0]?.cellules[0];
    if (cellule !== undefined) cellule["lieu"] = "Chez quelqu'un";
    const lecture = await lirePublications(hubRepondant(JSON.stringify(fautive)));
    expect(lecture.ok || lecture.erreur.type).toBe("hors-contrat");
  });

  it("dit que le hub est injoignable, sans lever d'exception", async () => {
    const hub: Hub = {
      ...hubRepondant(""),
      appeler: () => Promise.reject(new Error("réseau coupé")),
    };
    const lecture = await lirePublications(hub);
    expect(lecture.ok || lecture.erreur.type).toBe("injoignable");
  });

  it("dit que le hub a refusé, avec son statut", async () => {
    const lecture = await lirePublications(hubRepondant("", { statut: 404 }));
    expect(lecture).toEqual({ ok: false, erreur: { type: "refuse", statut: 404 } });
  });
});

describe("remettre une demande au hub privé", () => {
  const DEMANDE: Demande = {
    version: "1",
    id: "0b1c2d3e-4f50-4a6b-8c7d-9e0f1a2b3c4d",
    creeLe: "2026-09-29T08:00:00Z",
    sujet: "rejoindre",
    nom: "Visiteur d'essai",
    contact: "visiteur@exemple.org",
    ville: "Ville d'essai",
    villeLibre: null,
    message: "Bonjour.",
  };

  it("signe exactement le corps qu'elle envoie", async () => {
    let recu: { corps: string; entetes: Headers } | undefined;
    const hub: Hub = {
      ...hubRepondant(""),
      appeler: (_adresse, init) => {
        recu = {
          corps: typeof init?.body === "string" ? init.body : "",
          entetes: new Headers(init?.headers),
        };
        return Promise.resolve(new Response("{}", { status: 201 }));
      },
    };
    expect((await remettreDemande(hub, DEMANDE)).ok).toBe(true);
    expect(recu?.entetes.get(EN_TETE_SIGNATURE)).toBe(
      signer(CLE, MAINTENANT, recu?.corps ?? ""),
    );
    expect(JSON.parse(recu?.corps ?? "{}")).toEqual(DEMANDE);
  });

  it("une remise répétée (200) compte comme arrivée", async () => {
    const hub: Hub = {
      ...hubRepondant(""),
      appeler: () => Promise.resolve(new Response("{}", { status: 200 })),
    };
    expect((await remettreDemande(hub, DEMANDE)).ok).toBe(true);
  });

  it("un refus (401) reste un échec, pour être retenté", async () => {
    const hub: Hub = {
      ...hubRepondant(""),
      appeler: () => Promise.resolve(new Response("{}", { status: 401 })),
    };
    expect(await remettreDemande(hub, DEMANDE)).toEqual({
      ok: false,
      erreur: { type: "refuse", statut: 401 },
    });
  });
});
