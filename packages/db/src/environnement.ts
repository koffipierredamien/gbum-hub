import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

/**
 * Charge le fichier `.env` de la racine du dépôt.
 *
 * **Pourquoi ce fichier existe.** Le projet documente un `.env` à la racine,
 * et rien ne le lisait : les commandes échouaient sur « DATABASE_URL n'est pas
 * définie » alors que la ligne était bien là, sous les yeux. Next, lui, ne lit
 * que le `.env` de `apps/site` — pas celui de la racine. Trouvé le
 * 10 septembre 2026 en jouant la mise en route depuis zéro, ce qui est
 * exactement à quoi sert de la jouer depuis zéro.
 *
 * Ce n'est PAS un remplaçant de la configuration par l'environnement (S2,
 * ADR-012) : une variable déjà présente n'est jamais écrasée. En production,
 * l'hébergeur fournit les valeurs et ce fichier n'existe pas.
 */
let dejaCharge = false;

export function chargerEnvironnement(): void {
  if (dejaCharge) return;
  dejaCharge = true;

  const fichier = trouverEnv();
  if (fichier === null) return;

  for (const ligne of readFileSync(fichier, "utf8").split("\n")) {
    const paire = lireLigne(ligne);
    // Une valeur déjà définie gagne toujours : c'est ce qui permet de lancer
    // une commande avec une autre base sans toucher au fichier.
    if (paire === null || process.env[paire.nom] !== undefined) continue;
    process.env[paire.nom] = paire.valeur;
  }
}

/** `NOM=valeur`, guillemets facultatifs. Le reste est ignoré. */
function lireLigne(ligne: string): { nom: string; valeur: string } | null {
  const nette = ligne.trim();
  if (nette === "" || nette.startsWith("#")) return null;

  const separateur = nette.indexOf("=");
  if (separateur <= 0) return null;

  let valeur = nette.slice(separateur + 1).trim();
  const encadre =
    (valeur.startsWith('"') && valeur.endsWith('"')) ||
    (valeur.startsWith("'") && valeur.endsWith("'"));
  if (encadre) valeur = valeur.slice(1, -1);

  return { nom: nette.slice(0, separateur).trim(), valeur };
}

/**
 * Remonte les dossiers jusqu'à trouver un `.env`. On ne peut pas se fier au
 * dossier courant : les commandes sont lancées depuis la racine, depuis un
 * paquet, ou par Next depuis `apps/site`.
 */
function trouverEnv(): string | null {
  // fileURLToPath, et non « .pathname » : sous Windows, pathname rend
  // « /C:/Users/... », que Node relit ensuite comme « C:\C:\Users\... ».
  let dossier = dirname(fileURLToPath(import.meta.url));
  for (let remontee = 0; remontee < 8; remontee += 1) {
    const candidat = join(dossier, ".env");
    if (existsSync(candidat)) return candidat;
    const parent = dirname(dossier);
    if (parent === dossier) break;
    dossier = parent;
  }
  return null;
}
