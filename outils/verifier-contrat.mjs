/**
 * Le parcours qui prouve que les deux hubs se parlent (ADR-014).
 *
 * Contre un faux hub privé (`outils/faux-hub-prive.mjs`) qui signe comme le
 * vrai, dans un vrai navigateur, contre une vraie base :
 *
 *   - les villes du hub arrivent sur le site par « Synchroniser », et
 *     l'administration ne permet plus de les créer ;
 *   - une réponse mal signée est ignorée, et le site garde sa copie ;
 *   - une demande « Rejoindre » arrive au hub, signée, sans doublon ;
 *   - un hub en panne ne fait rien perdre : la demande attend, puis part.
 *
 * usage : node outils/verifier-contrat.mjs [site] [faux hub] [courriel] [mot de passe]
 * Le site doit tourner avec HUB_PRIVE_URL pointant vers le faux hub, et la
 * même CONTRAT_CLE des deux côtés.
 */
import { createHmac } from "node:crypto";
import process from "node:process";
import { setTimeout as attendre } from "node:timers/promises";
import { chromium } from "playwright";
import AxeBuilder from "@axe-core/playwright";

const B = process.argv[2] ?? "http://localhost:3000";
const HUB = process.argv[3] ?? "http://localhost:4010";
const COURRIEL = process.argv[4] ?? "sn@exemple.org";
const MOT_DE_PASSE = process.argv[5] ?? "motdepassedetest2026";
const CLE = process.env["CONTRAT_CLE"] ?? "";
const VILLE = "Ville témoin du contrat";
// Des prénoms propres à CETTE exécution : une demande restée d'un passage
// précédent ne peut pas faire réussir un contrôle à tort.
const SUFFIXE = String(Date.now()).slice(-6);
const AMINA = `Amina${SUFFIXE}`;
const YANN = `Yann${SUFFIXE}`;

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
const modeDuHub = (mode) =>
  globalThis.fetch(`${HUB}/temoin/mode`, {
    method: "POST",
    body: JSON.stringify({ mode }),
  });
const recuesParLeHub = async () =>
  (await globalThis.fetch(`${HUB}/temoin/demandes`)).json();
// En minuscules : innerText rend le texte tel qu'il s'affiche, et les
// étiquettes de l'administration sont en capitales (text-transform).
const texte = async (page) => (await page.locator("body").innerText()).toLowerCase();
const patienter = async (condition) => {
  for (let i = 0; i < 40; i += 1) {
    if (await condition()) return true;
    await attendre(500);
  }
  return false;
};

async function envoyerRejoindre(prenom) {
  const r = await ctx.newPage();
  await r.goto(`${B}/fr/rejoindre`, { waitUntil: "load" });
  await r.selectOption("#villeId", { label: VILLE });
  await r.fill("#nom", prenom);
  await r.fill("#contact", `${prenom.toLowerCase()}@exemple.org`);
  await r.fill("#message", "Bonjour, je viens d'arriver.");
  await r.click("button.cta");
  await r.waitForSelector("[role=status]", { timeout: 60000 });
  await r.close();
}

// --- Connexion ------------------------------------------------------------
await p.goto(`${B}/admin/connexion`, { waitUntil: "load" });
await p.fill("#courriel", COURRIEL);
await p.fill("#motDePasse", MOT_DE_PASSE);
await p.click("button[type=submit]");
await p.waitForURL(`${B}/admin`, { timeout: 60000 });

// 1 — l'administration sait que le hub est propriétaire des villes.
await p.goto(`${B}/admin/villes`, { waitUntil: "load" });
verifier(
  "l'écran annonce que les villes viennent du hub",
  (await texte(p)).includes("hub privé"),
);
verifier(
  "le formulaire « Ajouter une ville » n'existe pas",
  (await p.locator("text=Ajouter une ville").count()) === 0,
);

// 2 — une réponse mal signée est ignorée.
await modeDuHub("signature-fausse");
await p.click('button:has-text("Synchroniser maintenant")');
await p.waitForSelector("[role=status]", { timeout: 60000 });
verifier(
  "une réponse mal signée est refusée, et l'écran le dit",
  (await texte(p)).includes("signée"),
);
// Lu sur l'écran d'administration, rendu à chaque visite : c'est la base
// qu'on interroge, pas une page fabriquée à l'avance.
verifier(
  "… et rien n'a été écrit : la ville n'est pas dans la base",
  !(await texte(p)).includes(VILLE.toLowerCase()),
);
const ou = await ctx.newPage();

// 3 — une réponse bien signée remplace le miroir.
await modeDuHub("normal");
await p.click('button:has-text("Synchroniser maintenant")');
await p.waitForSelector("text=Synchronisé", { timeout: 60000 });
verifier("la synchronisation est confirmée", true);
await ou.goto(`${B}/fr/ou-nous-sommes`, { waitUntil: "load" });
const page = await texte(ou);
verifier(
  "la ville du hub apparaît sur « Où nous sommes »",
  page.includes(VILLE.toLowerCase()),
);
verifier(
  "ses cellules aussi",
  page.includes("cellule témoin a") && page.includes("cellule témoin b"),
);
verifier(
  "et le contact de son bureau, donné par le hub",
  (await ou.locator('a[href="mailto:bureau.temoin@exemple.org"]').count()) === 1,
);
await p.goto(`${B}/admin/villes`, { waitUntil: "load" });
verifier(
  "l'administration du site ne peut plus le modifier",
  (await p.locator('input[name="bureauCourriel"]').first().getAttribute("readonly")) !==
    null && (await p.locator('button:has-text("Enregistrer")').count()) === 0,
);

// 4 — la porte de revalidation refuse qui n'a pas la clé.
const corps = JSON.stringify({ version: "1", objet: "publications" });
const sans = await globalThis.fetch(`${B}/api/contrat/publications`, {
  method: "POST",
  body: corps,
});
verifier(
  "un appel non signé est refusé (401)",
  sans.status === 401,
  String(sans.status),
);
const t = Math.floor(Date.now() / 1000);
const signature = `sha256=${createHmac("sha256", CLE)
  .update(`${String(t)}.${corps}`)
  .digest("hex")}`;
const avec = await globalThis.fetch(`${B}/api/contrat/publications`, {
  method: "POST",
  body: corps,
  headers: { "X-GBUM-Horodatage": String(t), "X-GBUM-Signature": signature },
});
verifier(
  "un appel signé déclenche la synchronisation (200)",
  avec.status === 200,
  String(avec.status),
);

// 5 — une demande arrive au hub, sans doublon.
await envoyerRejoindre(AMINA);
const arrivee = await patienter(async () =>
  (await recuesParLeHub()).some((d) => d.nom === AMINA),
);
verifier("la demande « Rejoindre » arrive au hub privé", arrivee);
const recue = (await recuesParLeHub()).find((d) => d.nom === AMINA);
verifier(
  "avec la ville et le sujet du contrat",
  recue?.ville === VILLE && recue?.sujet === "rejoindre",
);

// 6 — hub en panne : rien ne se perd.
await modeDuHub("panne");
await envoyerRejoindre(YANN);
await p.goto(`${B}/admin/demandes`, { waitUntil: "load" });
verifier(
  "la demande envoyée pendant la panne attend, et l'écran le dit",
  (await texte(p)).includes("pas encore remise"),
);
await modeDuHub("normal");
await p.click('button:has-text("Remettre au hub privé maintenant")');
await p.waitForSelector("[role=status]", { timeout: 60000 });
const toutes = await recuesParLeHub();
verifier(
  "le retour du hub la fait partir",
  toutes.some((d) => d.nom === YANN),
);
verifier(
  "aucune demande n'est comptée deux fois",
  new Set(toutes.map((d) => d.id)).size === toutes.length,
);

// 7 — les écrans du mode miroir restent accessibles.
for (const ecran of ["/admin/villes", "/admin/demandes"]) {
  await p.goto(`${B}${ecran}`, { waitUntil: "load" });
  const { violations } = await new AxeBuilder({ page: p })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
    .analyze();
  verifier(
    `accessibilité de ${ecran} (hub branché)`,
    violations.length === 0,
    violations.map((v) => v.id).join(", "),
  );
}

await nav.close();
console.log(
  echecs === 0
    ? "\nLe contrat tient : les villes descendent, les demandes remontent, rien ne se perd."
    : `\n${String(echecs)} vérification(s) en échec.`,
);
process.exit(echecs === 0 ? 0 : 1);
