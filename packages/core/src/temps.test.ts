import { describe, expect, it } from "vitest";
import { contient, horlogeFigee, instantDepuisIso, type Periode } from "./temps";

const periode: Periode = {
  debut: instantDepuisIso("2026-09-01T00:00:00Z"),
  fin: instantDepuisIso("2027-09-01T00:00:00Z"),
};

describe("une période est bornée à gauche, ouverte à droite", () => {
  it("contient son instant de début", () => {
    expect(contient(periode, periode.debut)).toBe(true);
  });

  it("ne contient pas son instant de fin", () => {
    expect(contient(periode, periode.fin)).toBe(false);
  });

  it("ne contient pas l'instant qui précède le début", () => {
    expect(contient(periode, instantDepuisIso("2026-08-31T23:59:59Z"))).toBe(false);
  });
});

describe("l'horloge figée (R8)", () => {
  it("rend toujours le même instant", () => {
    const a = instantDepuisIso("2026-09-10T08:00:00Z");
    const horloge = horlogeFigee(a);
    expect(horloge.maintenant()).toBe(a);
    expect(horloge.maintenant()).toBe(a);
  });
});
