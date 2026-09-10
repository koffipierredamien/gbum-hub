import type { NextConfig } from "next";

const config: NextConfig = {
  // Les paquets de l'atelier sont livrés en TypeScript source, sans étape de
  // compilation : c'est Next qui les transpile. Un paquet de moins à construire
  // est une commande de moins à oublier.
  transpilePackages: ["@gbum/core", "@gbum/stockage"],
  reactStrictMode: true,
};

export default config;
