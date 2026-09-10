import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["packages/*/src/**/*.test.ts"],
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
