import js from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config(
  { ignores: ["**/node_modules/**", "**/dist/**", "**/.next/**", "**/coverage/**"] },
  js.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  {
    languageOptions: {
      parserOptions: { projectService: true, tsconfigRootDir: import.meta.dirname },
    },
    rules: {
      // Le domaine n'a pas le droit au type dynamique : c'est P4 — l'erreur
      // devient impossible, pas seulement improbable.
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-unsafe-assignment": "error",
      "@typescript-eslint/consistent-type-imports": "error",
      "@typescript-eslint/switch-exhaustiveness-check": "error",
      // Une erreur avalée est indiscernable d'une panne (règle R2).
      "no-empty": ["error", { "allowEmptyCatch": false }],
      complexity: ["error", 10],
      "max-depth": ["error", 3],
      "max-lines": ["error", { max: 400, skipBlankLines: false, skipComments: false }],
      "max-lines-per-function": ["error", { max: 50, skipBlankLines: true, skipComments: true }],
      "max-params": ["error", 4],
    },
  },
  // Les fichiers de configuration ne sont pas du code produit.
  { files: ["**/*.js"], ...tseslint.configs.disableTypeChecked },
  {
    // Un test génératif ÉNUMÈRE : rôle x portée x action x ressource. C'est
    // quatre boucles, et c'est précisément ce qui fait sa valeur.
    files: ["**/*.test.ts", "**/fixtures.ts"],
    rules: {
      "max-lines": "off",
      "max-lines-per-function": "off",
      "max-depth": "off",
      complexity: "off",
    },
  },
);
