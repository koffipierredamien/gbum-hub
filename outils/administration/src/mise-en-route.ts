import { execFile } from "node:child_process";
import { copyFile, readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import process from "node:process";
import { setTimeout as patienter } from "node:timers/promises";
import { promisify } from "node:util";
import { baseJoignable, compterComptes, creerCompte, joindreLaBase } from "@gbum/db";
import { hacher } from "@gbum/identite";
import { demanderIdentifiants } from "./identifiants";

/**
 * La mise en route, en une commande.
 *
 * Elle fait ce qu'on ferait à la main, dans l'ordre, en disant ce qu'elle
 * fait : le fichier de configuration, la base, sa structure, un premier
 * compte. Chaque étape est **sans effet si elle est déjà faite** — on peut la
 * relancer autant de fois qu'on veut.
 *
 * Elle existe pour une raison précise : la première demi-heure sur un projet
 * qu'on n'a pas écrit décide si on y revient. Une suite de sept commandes
 * dont la quatrième échoue en silence suffit à décourager.
 */

const executer = promisify(execFile);
const RACINE = new URL("../../../", import.meta.url).pathname;

function dire(etape: string, message: string): void {
  console.info(`\n${etape}  ${message}`);
}

function conseil(message: string): void {
  console.info(`      ${message}`);
}

async function principal(): Promise<void> {
  console.info("\n─── Mise en route du hub du GBUM ───");

  await etapeConfiguration();
  const url = await lireAdresseDeLaBase();
  await etapeBase(url);
  await etapeMigrations();
  await etapeCompte();

  console.info("\n─── Prêt ───\n");
  console.info("  pnpm dev        puis  http://localhost:3000/fr");
  console.info("                        http://localhost:3000/admin\n");
}

/** 1. Le fichier de configuration, copié du modèle s'il n'existe pas. */
async function etapeConfiguration(): Promise<void> {
  const cible = `${RACINE}.env`;
  if (existsSync(cible)) {
    dire("1/4", "Configuration : .env existe déjà, on n'y touche pas.");
    return;
  }
  await copyFile(`${RACINE}.env.example`, cible);
  dire("1/4", "Configuration : .env créé à partir de .env.example.");
  conseil("Aucune valeur secrète dedans — il n'est pas versionné.");
}

async function lireAdresseDeLaBase(): Promise<string> {
  const contenu = await readFile(`${RACINE}.env`, "utf8");
  const ligne = contenu.split("\n").find((l) => l.startsWith("DATABASE_URL="));
  const url = ligne?.slice("DATABASE_URL=".length).trim() ?? "";
  if (url === "") throw new Error("DATABASE_URL est absente de .env.");
  return url;
}

/** 2. La base : déjà là, ou démarrée par Docker, ou expliquée. */
async function etapeBase(url: string): Promise<void> {
  const etat = await joindreLaBase(url);
  if (etat.ok) {
    dire("2/4", "Base de données : elle répond déjà.");
    return;
  }

  // Une base qui refuse les identifiants est LANCÉE : la démarrer n'y changera
  // rien, et l'utilisateur chercherait du côté de Docker pendant une heure.
  if (identifiantsRefuses(etat.cause)) {
    dire("2/4", "Base de données : elle répond, mais elle refuse les identifiants.");
    conseil("Ce n'est pas Docker : la base tourne. C'est DATABASE_URL, dans .env.");
    conseil(`Adresse essayée : ${url}`);
    process.exit(1);
  }

  dire("2/4", "Base de données : elle ne répond pas, on essaie de la démarrer…");
  try {
    await executer("docker", ["compose", "up", "-d"], { cwd: RACINE });
  } catch (cause) {
    conseil(`Docker a répondu : ${raison(cause)}`);
    expliquerSansDocker(url);
    process.exit(1);
  }

  // PostgreSQL accepte les connexions quelques secondes après le démarrage du
  // conteneur. On attend qu'il réponde vraiment plutôt que de deviner.
  for (let essai = 0; essai < 30; essai += 1) {
    if (await baseJoignable(url)) {
      conseil("Elle répond. (PostgreSQL 16, dans un conteneur, port 5433.)");
      return;
    }
    await patienter(1000);
  }
  conseil("Elle ne répond toujours pas après trente secondes.");
  conseil("Regardez : docker compose logs base");
  process.exit(1);
}

/** Le message d'une erreur, quelle que soit sa forme, sans jamais le perdre. */
function raison(cause: unknown): string {
  return cause instanceof Error ? (cause.message.split("\n")[0] ?? "") : String(cause);
}

function expliquerSansDocker(url: string): void {
  conseil("Docker n'est pas disponible. Deux manières de continuer :");
  conseil("");
  conseil("  A. Installer Docker Desktop, puis relancer  pnpm mise-en-route");
  conseil("     https://www.docker.com/products/docker-desktop/");
  conseil("");
  conseil("  B. Installer PostgreSQL 16 vous-même, créer une base « gbum »,");
  conseil("     puis corriger DATABASE_URL dans .env — le port par défaut de");
  conseil("     PostgreSQL est 5432, celui du conteneur 5433.");
  conseil(`     Adresse actuellement attendue : ${url}`);
}

/** 3. La structure de la base, rejouée. Sans effet si elle est à jour. */
async function etapeMigrations(): Promise<void> {
  dire("3/4", "Structure de la base : on rejoue les migrations…");
  await executer("pnpm", ["base:migrer"], { cwd: RACINE });
  conseil("À jour.");
}

/** 4. Un premier compte, s'il n'y en a aucun. */
async function etapeCompte(): Promise<void> {
  const combien = await compterComptes();
  if (combien > 0) {
    dire("4/4", `Comptes d'administration : ${String(combien)} déjà créé(s).`);
    conseil("Pour en ajouter un : pnpm compte:creer");
    return;
  }

  dire("4/4", "Comptes d'administration : aucun. Créons le premier.");
  conseil("Il n'y a pas d'inscription dans l'espace d'administration.\n");

  const identifiants = await demanderIdentifiants("technique", {
    courriel: "      Courriel : ",
    nom: "      Nom : ",
    motDePasse: "      Mot de passe (12 caractères au moins) : ",
  });

  if ("probleme" in identifiants) {
    conseil(identifiants.probleme);
    conseil("Rien n'a été créé. Vous pourrez le faire avec  pnpm compte:creer");
    return;
  }

  await creerCompte({
    courriel: identifiants.courriel,
    nom: identifiants.nom,
    motDePasseHache: await hacher(identifiants.motDePasse),
    role: identifiants.role,
  });
  conseil(`Compte créé : ${identifiants.nom} <${identifiants.courriel}>`);
}

await principal();

/** PostgreSQL répond « 28P01 » quand le mot de passe est faux, « 28000 » quand
 *  l'utilisateur ou la règle d'accès ne convient pas. Dans les deux cas la
 *  base est bien là. */
function identifiantsRefuses(cause: unknown): boolean {
  return (
    typeof cause === "object" &&
    cause !== null &&
    "code" in cause &&
    (cause.code === "28P01" || cause.code === "28000")
  );
}
