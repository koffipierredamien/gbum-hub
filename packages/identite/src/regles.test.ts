import { describe, expect, it } from "vitest";
import { LONGUEUR_MINIMALE, motDePasseAcceptable } from "./regles";

describe("la règle du mot de passe", () => {
  it("refuse plus court que la longueur minimale", () => {
    expect(motDePasseAcceptable("a".repeat(LONGUEUR_MINIMALE - 1))).toBe(false);
  });

  it("accepte exactement la longueur minimale", () => {
    expect(motDePasseAcceptable("a".repeat(LONGUEUR_MINIMALE))).toBe(true);
  });

  it("n'impose ni majuscule, ni chiffre, ni symbole", () => {
    expect(motDePasseAcceptable("les gbussiens de rabat")).toBe(true);
  });

  it("compte comme le hachage, après normalisation", () => {
    // « é » écrit en deux points de code occupe deux cases avant
    // normalisation, une seule après. Les douze caractères doivent se compter
    // de la même manière ici et dans `hacher`.
    const compose = "é".repeat(LONGUEUR_MINIMALE - 1);
    expect(compose.length).toBeGreaterThanOrEqual(LONGUEUR_MINIMALE);
    expect(motDePasseAcceptable(compose)).toBe(false);
  });
});
