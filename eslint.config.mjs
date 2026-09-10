import js from "@eslint/js";
import ts from "typescript-eslint";
import gbum from "@gbum/eslint-regles";

/**
 * La chaîne de qualité. Ce qui peut être vérifié par une machine l'est ici ;
 * le reste est vérifié en revue.
 *
 * Voir docs/03-CONVENTIONS-ET-QUALITE.md — ce fichier en est l'exécution.
 */
export default ts.config(
  {
    ignores: [
      "**/node_modules/**",
      "**/dist/**",
      "**/.next/**",
      "maquettes/**",
      "coverage/**",
      "outils/eslint-regles/index.js",
      // Engendré par Next à chaque construction ; le corriger n'a pas de sens.
      "**/next-env.d.ts",
    ],
  },

  js.configs.recommended,
  ...ts.configs.strictTypeChecked,

  {
    languageOptions: {
      parserOptions: { projectService: true, tsconfigRootDir: import.meta.dirname },
    },
    plugins: { gbum },
    rules: {
      // --- §2 Les limites dures -------------------------------------------
      // Les lignes vides et les commentaires ne comptent pas : R6 demande des
      // commentaires qui racontent les incidents, et il ne faut pas que bien
      // documenter pousse le code hors de la limite.
      "max-lines": ["error", { max: 400, skipBlankLines: true, skipComments: true }],
      "max-lines-per-function": [
        "error",
        { max: 50, skipBlankLines: true, skipComments: true },
      ],
      "max-params": ["error", 4],
      complexity: ["error", 10],
      "max-depth": ["error", 3],
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/ban-ts-comment": [
        "error",
        { "ts-ignore": true, "ts-expect-error": "allow-with-description" },
      ],

      // --- R2 Aucune erreur n'est avalée ----------------------------------
      "gbum/aucune-erreur-avalee": "error",
      "no-empty": ["error", { allowEmptyCatch: false }],
      "no-useless-catch": "error",

      // --- R7 L'immuabilité par défaut ------------------------------------
      "prefer-const": "error",
      "no-param-reassign": ["error", { props: true }],

      // --- R3 Les états impossibles doivent être impossibles ---------------
      "@typescript-eslint/switch-exhaustiveness-check": "error",
    },
  },

  {
    // --- R1 Le domaine ne connaît pas la technique -----------------------
    // `packages/core` n'importe RIEN : ni next, ni react, ni drizzle, ni le
    // réseau. L'expression refuse tout import qui ne commence pas par un point,
    // c'est-à-dire tout paquet ; seuls les chemins relatifs passent, donc le
    // domaine ne peut importer que lui-même. Une règle du GBUM se teste ainsi
    // en mémoire, en millisecondes — et la garantie est mécanique, pas morale.
    files: ["packages/core/**/*.ts"],
    ignores: ["packages/core/**/*.test.ts"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              regex: "^[^.]",
              message:
                "R1 — le domaine ne dépend de rien. Aucun import hors de packages/core.",
            },
          ],
        },
      ],
    },
  },

  {
    // Les tests du domaine ont besoin d'un lanceur, et de lui seul. Autoriser
    // « vitest » sans autoriser le reste garde la garantie R1 : un test qui
    // aurait besoin de drizzle prouverait que la règle testée n'est plus dans
    // le domaine.
    files: ["packages/core/**/*.test.ts"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              regex: "^(?!vitest$)[^.]",
              message:
                "R1 — dans le domaine, un test n'importe que « vitest ». Le reste " +
                "signale une règle qui n'appartient plus à packages/core.",
            },
          ],
        },
      ],
    },
  },

  {
    // Les tests décrivent des cas ; une longue table de cas est une qualité,
    // pas un défaut.
    files: ["**/*.test.ts"],
    rules: { "max-lines-per-function": "off", "max-lines": "off" },
  },

  {
    // Un composant React a son propre budget : 150 lignes, et non 50.
    // C'est ce que fixe docs/03-CONVENTIONS-ET-QUALITE.md §2 — une fonction de
    // 50 lignes qui fait une seule chose et un composant de 120 lignes qui
    // décrit une seule section sont deux objets différents. Au-delà de 150,
    // la règle reste la même : extraire un sous-composant.
    files: ["**/*.tsx"],
    rules: {
      "max-lines-per-function": [
        "error",
        { max: 150, skipBlankLines: true, skipComments: true },
      ],
    },
  },

  {
    // Les fichiers de configuration et les outils en JavaScript ne sont dans
    // aucun tsconfig — le linter typé ne peut donc pas les analyser. On les
    // vérifie sans types plutôt que de les exclure : un fichier non lu est un
    // fichier où tout est permis.
    files: ["**/*.config.mjs", "**/*.config.ts", "outils/**/*.mjs"],
    extends: [ts.configs.disableTypeChecked],
    languageOptions: {
      globals: {
        process: "readonly",
        console: "readonly",
        // `document` et `window` n'existent pas dans Node : ils apparaissent
        // dans les fonctions passées à `page.evaluate`, qui sont sérialisées
        // et exécutées DANS le navigateur. Le linter, lui, lit le fichier
        // depuis Node — d'où cette déclaration.
        document: "readonly",
        window: "readonly",
      },
    },
  },
);
