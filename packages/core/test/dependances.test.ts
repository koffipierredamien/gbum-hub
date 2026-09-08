import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

/**
 * La règle qui rend le domaine transportable (ADR / principe P3).
 *
 * `packages/core` dit les règles du GBUM. S'il importait Next, React, un
 * pilote de base ou le réseau, il faudrait monter tout cela pour tester
 * « un budget validé ne bouge plus ». Cette règle n'est pas une discipline :
 * elle est vérifiée.
 */
const INTERDITS = [
  "next", "react", "drizzle", "pg", "postgres", "node:fs", "node:http",
  "node:net", "node:child_process", "fetch(", "axios", "livekit",
];

function fichiers(dossier: string): string[] {
  return readdirSync(dossier).flatMap((nom) => {
    const chemin = join(dossier, nom);
    return statSync(chemin).isDirectory() ? fichiers(chemin) : [chemin];
  });
}

describe("le domaine ne dépend d'aucune technique", () => {
  it("aucun import interdit dans src/", () => {
    const fautes: string[] = [];
    for (const f of fichiers("src")) {
      const contenu = readFileSync(f, "utf8");
      for (const interdit of INTERDITS) {
        if (contenu.includes(`"${interdit}`) || contenu.includes(`from "${interdit}`)) {
          fautes.push(`${f} → ${interdit}`);
        }
        if (interdit === "fetch(" && contenu.includes("fetch(")) fautes.push(`${f} → fetch`);
      }
    }
    expect(fautes).toEqual([]);
  });

  it("aucun accès direct à l'horloge : l'instant est injecté", () => {
    const fautes = fichiers("src").filter((f) => {
      const c = readFileSync(f, "utf8");
      return c.includes("Date.now()") || c.includes("new Date()");
    });
    expect(fautes).toEqual([]);
  });

  it("aucun fichier de plus de 400 lignes", () => {
    const trop = fichiers("src")
      .map((f) => [f, readFileSync(f, "utf8").split("\n").length] as const)
      .filter(([, n]) => n > 400);
    expect(trop).toEqual([]);
  });
});
