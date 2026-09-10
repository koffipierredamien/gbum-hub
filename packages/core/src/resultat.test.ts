import { describe, expect, it } from "vitest";
import { echec, reussite, type Resultat } from "./resultat";

describe("Resultat (R2, R3)", () => {
  it("une réussite porte une valeur", () => {
    const r = reussite(3);
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.valeur).toBe(3);
  });

  it("un échec porte une cause", () => {
    const r = echec("ville inconnue");
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.erreur).toBe("ville inconnue");
  });

  it("oblige l'appelant à distinguer les deux cas", () => {
    // La valeur n'est atteignable qu'après avoir traité le cas d'échec :
    // c'est ce que le compilateur impose, et ce test le rend visible.
    const lire = (r: Resultat<number, string>): number => (r.ok ? r.valeur : -1);
    expect(lire(reussite(7))).toBe(7);
    expect(lire(echec("absent"))).toBe(-1);
  });
});
