import { describe, expect, it } from "vitest";
import { estUnRole, retirerLAcces } from "./acces";

describe("les rôles", () => {
  it("reconnaît les deux rôles, et rien d'autre", () => {
    expect(estUnRole("technique")).toBe(true);
    expect(estUnRole("secretariat")).toBe(true);
    expect(estUnRole("administrateur")).toBe(false);
    expect(estUnRole("")).toBe(false);
  });
});

describe("retirer l'accès", () => {
  const technique = { role: "technique", actif: true } as const;
  const secretariat = { role: "secretariat", actif: true } as const;

  it("refuse de retirer le DERNIER compte technique actif", () => {
    const resultat = retirerLAcces(technique, 1);
    expect(resultat.ok).toBe(false);
    if (!resultat.ok) expect(resultat.erreur).toBe("dernier-technique");
  });

  it("accepte dès qu'il en reste un autre", () => {
    expect(retirerLAcces(technique, 2).ok).toBe(true);
  });

  it("ne protège pas le secrétariat : il n'ouvre aucune porte", () => {
    expect(retirerLAcces(secretariat, 1).ok).toBe(true);
  });

  it("laisse réactiver un compte technique déjà inactif", () => {
    expect(retirerLAcces({ role: "technique", actif: false }, 1).ok).toBe(true);
  });
});
