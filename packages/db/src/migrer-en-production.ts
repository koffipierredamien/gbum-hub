import { appliquerMigrations } from "./migrations";

/**
 * Appelé par la construction du site, avant `next build`.
 *
 * Sur Vercel, la base de PRODUCTION reçoit ses migrations à chaque mise en
 * ligne : le 29/09/2026, une migration fusionnée (0004) n'avait été appliquée
 * nulle part, et le formulaire « Rejoindre » échouait sur une colonne
 * absente. Le geste à la main (`pnpm base:migrer`) supposait d'avoir la
 * chaîne de la base sous la main ; la construction, elle, l'a toujours.
 *
 * Nulle part ailleurs : les aperçus de Vercel partagent la base de production
 * (docs/DEPLOIEMENT-VERCEL.md), et une pull request non fusionnée ne doit pas
 * la modifier. En local, en intégration continue et dans l'image Docker,
 * `VERCEL_ENV` n'existe pas : rien ne se passe, et `pnpm base:migrer` reste
 * le geste.
 *
 * Si la base ne répond pas, l'erreur fait échouer la construction : Vercel
 * garde alors en ligne la version précédente, qui fonctionne avec la base
 * telle qu'elle est.
 */
const environnement = process.env["VERCEL_ENV"];

if (environnement === "production") {
  await appliquerMigrations();
  console.info("migrations appliquées à la base de production");
} else {
  console.info(
    `migrations laissées de côté (environnement : ${environnement ?? "hors Vercel"})`,
  );
}
