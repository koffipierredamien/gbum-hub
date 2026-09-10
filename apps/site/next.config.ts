import type { NextConfig } from "next";
import creerPluginIntl from "next-intl/plugin";

const avecIntl = creerPluginIntl("./src/i18n/requete.ts");

const config: NextConfig = {
  // Les paquets de l'atelier sont livrés en TypeScript source, sans étape de
  // compilation : c'est Next qui les transpile. Un paquet de moins à construire
  // est une commande de moins à oublier.
  transpilePackages: ["@gbum/core", "@gbum/db", "@gbum/identite", "@gbum/stockage"],
  reactStrictMode: true,
  eslint: {
    // Le linter tourne une fois, dans `pnpm verifier` et en intégration
    // continue, sur TOUT l'atelier et avec la configuration du dépôt. Le
    // relancer ici, sur le seul dossier du site, ne trouverait rien de plus et
    // doublerait le temps de construction.
    ignoreDuringBuilds: true,
  },
};

export default avecIntl(config);
