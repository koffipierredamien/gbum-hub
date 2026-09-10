import { describe, expect, it } from "vitest";
import { hacher, verifier } from "./mot-de-passe";
import { creerJeton, empreinte } from "./session";

describe("le hachage des mots de passe", () => {
  it("accepte le bon mot de passe", async () => {
    const stocke = await hacher("un mot de passe correct");
    expect(await verifier("un mot de passe correct", stocke)).toBe(true);
  });

  it("refuse un mot de passe différent", async () => {
    const stocke = await hacher("un mot de passe correct");
    expect(await verifier("un mot de passe corrects", stocke)).toBe(false);
  });

  it("produit un condensat différent à chaque fois, pour le même mot de passe", async () => {
    // Le sel est tiré au sort : deux comptes qui partagent un mot de passe ne
    // se reconnaissent pas dans la base, et une table pré-calculée ne sert à
    // rien.
    const a = await hacher("identique");
    const b = await hacher("identique");
    expect(a).not.toBe(b);
    expect(await verifier("identique", a)).toBe(true);
    expect(await verifier("identique", b)).toBe(true);
  });

  it("écrit ses paramètres dans le condensat", async () => {
    // Pour qu'on puisse les durcir plus tard sans invalider ce qui existe.
    expect(await hacher("x")).toMatch(/^scrypt\$16384\$8\$1\$[\w-]+\$[\w-]+$/);
  });

  it("refuse une chaîne stockée qui n'a pas le bon format", async () => {
    for (const mauvais of ["", "x", "scrypt$1$2$3", "bcrypt$16384$8$1$c2Vs$aGFzaA"]) {
      expect(await verifier("peu importe", mauvais)).toBe(false);
    }
  });

  it("traite deux écritures Unicode du même mot de passe comme le même", async () => {
    // « é » s'écrit d'un seul caractère ou de deux (e + accent). Sans
    // normalisation, un mot de passe saisi sur un téléphone et le même saisi
    // sur un ordinateur peuvent ne pas se reconnaître.
    const compose = "Prénom2026";
    const decompose = "Prénom2026";
    expect(compose).not.toBe(decompose);
    const stocke = await hacher(compose);
    expect(await verifier(decompose, stocke)).toBe(true);
  });
});

describe("les jetons de session", () => {
  it("n'en tire jamais deux fois le même", () => {
    const jetons = new Set(Array.from({ length: 200 }, () => creerJeton()));
    expect(jetons.size).toBe(200);
  });

  it("range une empreinte, jamais le jeton", () => {
    const jeton = creerJeton();
    const trace = empreinte(jeton);
    expect(trace).not.toBe(jeton);
    expect(empreinte(jeton)).toBe(trace);
  });
});
