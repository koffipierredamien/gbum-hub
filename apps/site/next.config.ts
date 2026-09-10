import type { NextConfig } from "next";
import creerPluginIntl from "next-intl/plugin";
import { chargerEnvironnement } from "@gbum/db";

// Next ne lit que le `.env` de ce dossier ; le nôtre est à la racine du dépôt,
// là où le projet le documente. On le charge donc ici, avant tout le reste :
// ce fichier est évalué au démarrage du serveur comme à la construction.
chargerEnvironnement();

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
