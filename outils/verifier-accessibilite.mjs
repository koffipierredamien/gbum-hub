/**
 * L'accessibilité est BLOQUANTE (docs/03-CONVENTIONS-ET-QUALITE.md §4) :
 * WCAG 2.2 AA, sur chaque écran, zéro manquement.
 *
 * Ce script visite les neuf pages dans les deux langues et vérifie trois
 * choses à la fois — parce qu'elles se découvrent au même endroit et qu'un
 * seul passage coûte moins qu'un troisième outil :
 *
 *   1. aucun manquement WCAG 2.2 AA (axe-core) ;
 *   2. aucun débordement horizontal — une page qui déborde sur téléphone est
 *      une page qu'on lit de travers ;
 *   3. aucune clé de traduction manquante — le repli affiche « [texte
 *      manquant : … ] », visible à dessein, et ce script le refuse.
 *
 * usage : node outils/verifier-accessibilite.mjs [adresse]
 */
import { chromium } from "playwright";
import AxeBuilder from "@axe-core/playwright";

const ADRESSE = process.argv[2] ?? "http://localhost:3000";
const PAGES = [
  "",
  "/le-mouvement",
  "/ou-nous-sommes",
  "/la-vie-du-mouvement",
  "/agenda",
  "/le-canevas",
  "/soutenir",
  "/nous-ecrire",
  "/rejoindre",
];
const LANGUES = ["fr", "en"];
const NORMES = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];

// En intégration continue, Playwright télécharge son propre navigateur. Sur un
// poste où un Chromium est déjà installé, CHROMIUM_EXECUTABLE évite un
// second téléchargement de 150 Mo — et évite surtout de figer un chemin de
// machine dans un fichier versionné.
const chemin = process.env["CHROMIUM_EXECUTABLE"];
const navigateur = await chromium.launch(
  chemin === undefined ? {} : { executablePath: chemin },
);
let manquements = 0;

for (const langue of LANGUES) {
  for (const chemin of PAGES) {
    const contexte = await navigateur.newContext({
      viewport: { width: 390, height: 844 },
    });
    const page = await contexte.newPage();
    const reponse = await page.goto(`${ADRESSE}/${langue}${chemin}`, {
      waitUntil: "load",
      timeout: 30000,
    });

    const textesManquants = await page.evaluate(
      () => document.body.innerText.match(/\[texte manquant : [^\]]+\]/g) ?? [],
    );
    const debord = await page.evaluate(() =>
      document.documentElement.scrollWidth > window.innerWidth
        ? document.documentElement.scrollWidth
        : 0,
    );
    const { violations } = await new AxeBuilder({ page }).withTags(NORMES).analyze();

    const problemes = [];
    if (reponse?.status() !== 200) problemes.push(`HTTP ${reponse?.status()}`);
    if (debord > 0) problemes.push(`débordement horizontal : ${debord} px`);
    if (textesManquants.length > 0)
      problemes.push(`traductions manquantes : ${textesManquants.join(" ")}`);
    for (const violation of violations) {
      problemes.push(
        `${violation.id} (${violation.nodes.length}) — ${violation.nodes[0]?.target.join(" ")}`,
      );
    }

    manquements += problemes.length;
    const nom = `${langue}${chemin === "" ? "/" : chemin}`;
    console.log(
      problemes.length === 0
        ? `  ok   ${nom}`
        : `  NON  ${nom}\n       ${problemes.join("\n       ")}`,
    );

    await contexte.close();
  }
}

await navigateur.close();

if (manquements > 0) {
  console.error(
    `\n${manquements} problème(s) sur ${LANGUES.length * PAGES.length} pages.`,
  );
  process.exit(1);
}
console.log(`\nAucun manquement sur ${LANGUES.length * PAGES.length} pages.`);
