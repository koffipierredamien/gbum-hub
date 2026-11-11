import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // Le domaine, et les quelques gardes-fous du site qui se vérifient sans
    // navigateur ni base — par exemple que l'administration ne propose pas
    // d'écrire un texte que plus aucune page n'affiche.
    include: ["packages/*/src/**/*.test.ts", "apps/site/src/**/*.test.ts"],
    coverage: {
      // Le domaine est le seul endroit où une couverture chiffrée veut dire
      // quelque chose : ses règles se testent en mémoire, sans base et sans
      // réseau. Le seuil de 80 % vient de docs/03-CONVENTIONS-ET-QUALITE.md.
      include: ["packages/core/src/**/*.ts"],
      exclude: ["**/*.test.ts", "**/index.ts"],
      thresholds: { lines: 80, functions: 80, branches: 80, statements: 80 },
    },
  },
});
