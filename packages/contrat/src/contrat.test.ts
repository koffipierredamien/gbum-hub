import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { Demande } from "./demandes";
import { Publications } from "./publications";
import { enJsonSchema, SCHEMAS_V1 } from "./schemas";
import { signer, verifier } from "./signature";

const V1 = join(dirname(fileURLToPath(import.meta.url)), "../../../contrat/v1");
const lire = (chemin: string): unknown =>
  JSON.parse(readFileSync(join(V1, chemin), "utf8"));

describe("le contrat versionné", () => {
  it.each(Object.entries(SCHEMAS_V1))(
    "contrat/v1/%s est la traduction exacte de la source",
    (nom, schema) => {
      // Si ce test échoue : `pnpm --filter @gbum/contrat generer`, puis
      // relire le changement — il sera aussi celui du hub privé.
      expect(lire(nom)).toEqual(enJsonSchema(schema));
    },
  );
});

describe("les exemples de référence, rejoués aussi par le hub privé", () => {
  it("une publication conforme est acceptée", () => {
    expect(
      Publications.safeParse(lire("exemples/publications-valide.json")).success,
    ).toBe(true);
  });

  it("une cellule qui porte un lieu fait refuser toute la publication (ADR-011)", () => {
    expect(
      Publications.safeParse(lire("exemples/publications-refusee-lieu.json")).success,
    ).toBe(false);
  });

  it("une demande conforme est acceptée", () => {
    expect(Demande.safeParse(lire("exemples/demandes-valide.json")).success).toBe(true);
  });

  it("un sujet hors du contrat est refusé", () => {
    expect(
      Demande.safeParse(lire("exemples/demandes-refusee-sujet.json")).success,
    ).toBe(false);
  });
});

describe("la signature", () => {
  const vecteur = lire("exemples/signature.json") as {
    cle: string;
    horodatage: number;
    corps: string;
    signature: string;
  };
  const requete = { ...vecteur, maintenant: vecteur.horodatage + 10 };

  it("retrouve le vecteur de référence, calculé une fois pour les deux hubs", () => {
    expect(signer(vecteur.cle, vecteur.horodatage, vecteur.corps)).toBe(
      vecteur.signature,
    );
  });

  it("accepte le message intact", () => {
    expect(verifier(requete).ok).toBe(true);
  });

  it("refuse un corps modifié", () => {
    expect(verifier({ ...requete, corps: `${vecteur.corps} ` })).toEqual({
      ok: false,
      erreur: "signature-invalide",
    });
  });

  it("refuse une autre clé", () => {
    expect(verifier({ ...requete, cle: "une-autre-cle" })).toEqual({
      ok: false,
      erreur: "signature-invalide",
    });
  });

  it("refuse un message rejoué plus de cinq minutes après", () => {
    expect(verifier({ ...requete, maintenant: vecteur.horodatage + 301 })).toEqual({
      ok: false,
      erreur: "horodatage-hors-delai",
    });
  });

  it("refuse une signature de longueur différente sans lever d'erreur", () => {
    expect(verifier({ ...requete, signature: "sha256=court" }).ok).toBe(false);
  });
});
