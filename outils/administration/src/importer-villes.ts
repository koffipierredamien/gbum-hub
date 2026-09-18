import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import {
  creerCellule,
  creerVille,
  lireVillesEtCellules,
  modifierCellule,
  modifierVille,
} from "@gbum/db";

/**
 * Importe les villes et leurs cellules depuis `donnees/villes.txt`.
 *
 * **Rejouable, et sans destruction.** Elle met à jour ce qui existe, ajoute ce
 * qui manque, et ne supprime jamais rien : une ville retirée du fichier reste
 * en base, où l'écran d'administration permet de la supprimer en connaissance
 * de cause. Un import qui efface est un import qu'on n'ose plus lancer.
 *
 * Elle existe parce que saisir neuf cellules à la main dans un formulaire, sur
 * la machine de développement PUIS sur le serveur, est le genre de corvée
 * qu'on fait mal la seconde fois.
 */
const RACINE = fileURLToPath(new URL("../../../", import.meta.url));

interface VilleLue {
  readonly nom: string;
  readonly cellules: readonly { nom: string; effectif: number | null }[];
}

function analyser(contenu: string): readonly VilleLue[] {
  const villes: {
    nom: string;
    cellules: { nom: string; effectif: number | null }[];
  }[] = [];

  for (const brute of contenu.split("\n")) {
    const ligne = brute.trimEnd();
    if (ligne.trim() === "" || ligne.trim().startsWith("#")) continue;

    if (!/^\s/.test(ligne)) {
      villes.push({ nom: ligne.trim(), cellules: [] });
      continue;
    }

    const ville = villes.at(-1);
    if (ville === undefined) continue;

    // « Nom de cellule    18 » — le nombre final, s'il y en a un, est
    // l'effectif ; le reste est le nom, espaces intérieurs compris.
    const trouve = /^(.*?)\s+(\d+)$/.exec(ligne.trim());
    ville.cellules.push(
      trouve === null
        ? { nom: ligne.trim(), effectif: null }
        : { nom: (trouve[1] ?? "").trim(), effectif: Number(trouve[2]) },
    );
  }

  return villes;
}

async function importer(lues: readonly VilleLue[]): Promise<void> {
  const existant = await lireVillesEtCellules();

  for (const [position, lue] of lues.entries()) {
    const rang = position + 1;
    const dejaLa = existant.villes.find((v) => v.nom === lue.nom);

    const villeId =
      dejaLa === undefined
        ? await creerVille({ nom: lue.nom, rang })
        : await conserver(dejaLa, rang);

    await importerCellules(villeId, lue, existant.cellules);
    console.info(`  ${lue.nom} — ${String(lue.cellules.length)} cellule(s)`);
  }
}

/** Met le rang à jour sans toucher au contact du bureau, saisi ailleurs. */
async function conserver(
  ville: {
    id: string;
    nom: string;
    bureauCourriel: string | null;
    bureauMandatDebut: Date | null;
    bureauMandatFin: Date | null;
  },
  rang: number,
): Promise<string> {
  await modifierVille(ville.id, {
    nom: ville.nom,
    rang,
    bureauCourriel: ville.bureauCourriel,
    bureauMandatDebut: ville.bureauMandatDebut,
    bureauMandatFin: ville.bureauMandatFin,
  });
  return ville.id;
}

async function importerCellules(
  villeId: string,
  lue: VilleLue,
  existantes: readonly { id: string; villeId: string; nom: string }[],
): Promise<void> {
  for (const [position, cellule] of lue.cellules.entries()) {
    const rang = position + 1;
    const dejaLa = existantes.find(
      (c) => c.villeId === villeId && c.nom === cellule.nom,
    );

    if (dejaLa === undefined) {
      await creerCellule({
        villeId,
        nom: cellule.nom,
        nombreDeMembres: cellule.effectif,
        rang,
      });
    } else {
      await modifierCellule(dejaLa.id, {
        nom: cellule.nom,
        nombreDeMembres: cellule.effectif,
        rang,
      });
    }
  }
}

const fichier = process.argv[2] ?? join(RACINE, "donnees", "villes.txt");
console.info(`\nImport depuis ${fichier}\n`);

const lues = analyser(await readFile(fichier, "utf8"));
if (lues.length === 0) {
  console.info("Aucune ville dans le fichier. Rien n'a été fait.");
  process.exit(0);
}

await importer(lues);
console.info(
  `\n${String(lues.length)} ville(s) à jour. Le site public les montre après` +
    ` publication d'une section, ou après reconstruction.\n`,
);
console.info(`(dossier du projet : ${dirname(fichier)})`);
