/**
 * Le parcours qui décide si le lot 1 a atteint son but.
 *
 * « Si le Secrétariat National ne peut pas modifier le site lui-même, le site
 * cesse de vivre au bout de trois mois. » Ce script joue ce parcours en
 * entier, dans un vrai navigateur, contre une vraie base : se connecter,
 * écrire un brouillon, vérifier que le site public N'A PAS CHANGÉ, publier, et
 * vérifier qu'il a changé.
 *
 * La sixième vérification est celle qui compte. Un espace d'administration où
 * « enregistrer » publie sans le dire est plus dangereux que pas
 * d'administration du tout.
 *
 * usage : node outils/verifier-administration.mjs [adresse] [courriel] [mot de passe]
 */
import { chromium } from "playwright";
import AxeBuilder from "@axe-core/playwright";
import process from "node:process";

const B = process.argv[2] ?? "http://localhost:3000";
const COURRIEL = process.argv[3] ?? "sn@exemple.org";
const MOT_DE_PASSE = process.argv[4] ?? "motdepassedetest2026";
const THEME = `Thème de vérification ${String(Date.now())}`;

const chemin = process.env["CHROMIUM_EXECUTABLE"];
const nav = await chromium.launch(
  chemin === undefined ? {} : { executablePath: chemin },
);
const ctx = await nav.newContext({ viewport: { width: 1280, height: 900 } });
const p = await ctx.newPage();

let echecs = 0;
const verifier = (nom, ok, detail = "") => {
  if (!ok) echecs += 1;
  console.log(
    `${ok ? "  ok  " : "  NON "} ${nom}${detail === "" ? "" : ` — ${detail}`}`,
  );
};

// 1 — une porte fermée, pas une porte cachée.
await p.goto(`${B}/admin`, { waitUntil: "load" });
verifier(
  "sans session, /admin renvoie vers la connexion",
  p.url().includes("/admin/connexion"),
);

// 2 — un mauvais mot de passe est refusé.
//
// Sur SA PROPRE page, refermée ensuite. Rejouer une connexion réussie dans le
// même formulaire qu'un échec fait courir la saisie contre le rendu de React :
// on remplit le champ, React remonte le formulaire, et le mot de passe part
// vide. Un humain qui retape met plusieurs secondes et ne le voit jamais ; un
// script, si. Deux pages, deux histoires — et le doute disparaît.
const essai = await ctx.newPage();
await essai.goto(`${B}/admin/connexion`, { waitUntil: "load" });
await essai.fill("#courriel", COURRIEL);
await essai.fill("#motDePasse", "ce-n-est-pas-le-bon");
await essai.click("button[type=submit]");
await essai.waitForSelector("[role=alert]", { timeout: 60000 });
verifier("un mauvais mot de passe est refusé", essai.url().includes("connexion"));
await essai.close();

// 3 — le bon mot de passe ouvre la session.
await p.goto(`${B}/admin/connexion`, { waitUntil: "load" });
await p.fill("#courriel", COURRIEL);
await p.fill("#motDePasse", MOT_DE_PASSE);
await p.click("button[type=submit]");
await p.waitForURL(`${B}/admin`, { timeout: 60000 });
verifier("le bon mot de passe ouvre la session", p.url() === `${B}/admin`);

// 4 — avant toute écriture, le site annonce le thème comme attendu.
const pub = await ctx.newPage();
await pub.goto(`${B}/fr`, { waitUntil: "load" });
verifier(
  "avant publication, l'accueil annonce le thème comme attendu",
  !(await pub.locator("body").innerText()).includes(THEME),
);

// 5 — on écrit un brouillon.
await p.goto(`${B}/admin/pages/commun`, { waitUntil: "load" });
await p.fill("#section\\:themeNom", THEME);
await p.click('button[type=submit]:has-text("Enregistrer le brouillon")');
await p.waitForSelector("text=Brouillon enregistré", { timeout: 60000 });
const apresBrouillon = await p.locator("body").innerText();
verifier(
  "le brouillon est enregistré",
  apresBrouillon.includes("Brouillon enregistré"),
);
verifier(
  "l'écran annonce des modifications non publiées",
  apresBrouillon.includes("Modifications non publiées"),
);

// 6 — LA VÉRIFICATION QUI COMPTE : un brouillon ne change rien en ligne.
await pub.reload({ waitUntil: "load" });
verifier(
  "un brouillon ne change RIEN sur le site public",
  !(await pub.locator("body").innerText()).includes(THEME),
);

// 7 — on publie.
await p.click('button[type=submit]:has-text("Publier la page")');
await p.waitForSelector("text=Page publiée", { timeout: 60000 });
verifier("la publication est confirmée", true);

// 8 — et le site public l'affiche, tout de suite.
await pub.reload({ waitUntil: "load" });
verifier(
  "après publication, l'accueil affiche le thème",
  (await pub.locator("body").innerText()).includes(THEME),
);

// 9 — une ville ajoutée apparaît sur le site public.
const ville = `Ville ${String(Date.now()).slice(-5)}`;
await p.goto(`${B}/admin/villes`, { waitUntil: "load" });
await p.fill("input[name=nom]", ville);
await p.click('button:has-text("Enregistrer")');
await p.waitForTimeout(5000);
const ou = await ctx.newPage();
await ou.goto(`${B}/fr/ou-nous-sommes`, { waitUntil: "load" });
verifier(
  "la ville ajoutée apparaît sur « Où nous sommes »",
  (await ou.locator("body").innerText()).includes(ville),
);

// 10 — se déconnecter referme la porte.
await p.goto(`${B}/admin`, { waitUntil: "load" });
await p.click('button:has-text("Se déconnecter")');
await p.waitForURL(/connexion/, { timeout: 60000 });
await p.goto(`${B}/admin/villes`, { waitUntil: "load" });
verifier(
  "après déconnexion, /admin/villes renvoie vers la connexion",
  p.url().includes("/admin/connexion"),
);

// 11 — l'accessibilité de l'espace d'administration.
// Elle est bloquante ici comme sur le site public : le Secrétariat National
// n'est pas un public de seconde zone. Elle se vérifie dans ce script et non
// dans l'autre, parce qu'il faut une session ouverte pour voir ces écrans.
await p.goto(`${B}/admin/connexion`, { waitUntil: "load" });
await p.fill("#courriel", COURRIEL);
await p.fill("#motDePasse", MOT_DE_PASSE);
await p.click("button[type=submit]");
await p.waitForURL(`${B}/admin`, { timeout: 60000 });

for (const ecran of [
  "/admin",
  "/admin/pages",
  "/admin/pages/commun",
  "/admin/villes",
  "/admin/demandes",
]) {
  await p.goto(`${B}${ecran}`, { waitUntil: "load" });
  const { violations } = await new AxeBuilder({ page: p })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
    .analyze();
  verifier(
    `accessibilité de ${ecran}`,
    violations.length === 0,
    violations.map((v) => `${v.id} (${v.nodes[0]?.target.join(" ")})`).join(", "),
  );
}

await nav.close();
console.log(
  echecs === 0
    ? "\nLe parcours complet passe : écrire, ne rien publier, publier, voir."
    : `\n${String(echecs)} vérification(s) en échec.`,
);
process.exit(echecs === 0 ? 0 : 1);
