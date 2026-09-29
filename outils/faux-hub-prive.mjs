/**
 * Un faux hub privé, pour éprouver le contrat de bout en bout (ADR-014).
 *
 * Il parle comme le vrai (gbu-connect, app/routes_contrat.py) : il SIGNE ses
 * publications et VÉRIFIE la signature des demandes qu'on lui remet. Il
 * n'est jamais déployé : il sert au parcours `outils/verifier-contrat.mjs`,
 * en local comme en intégration continue.
 *
 * Trois comportements, pour éprouver aussi ce que le site fait quand ça va
 * mal : « normal », « signature-fausse » (il signe avec une autre clé) et
 * « panne » (il répond 503 à tout).
 *
 * La règle de signature est réécrite ici en trois lignes plutôt qu'importée :
 * c'est un double de test, écrit comme le serait un hub tiers. S'il signait
 * autrement que le contrat, le site le refuserait et le parcours échouerait —
 * c'est précisément ce qu'on veut savoir.
 *
 * usage : CONTRAT_CLE=… node outils/faux-hub-prive.mjs [port]
 */
import { Buffer } from "node:buffer";
import { createHmac, timingSafeEqual } from "node:crypto";
import { createServer } from "node:http";
import process from "node:process";

const PORT = Number(process.argv[2] ?? 4010);
const CLE = process.env["CONTRAT_CLE"] ?? "";
if (CLE === "") throw new Error("CONTRAT_CLE n'est pas définie.");

const VILLES_TEMOINS = [
  {
    nom: "Ville témoin du contrat",
    rang: 1,
    cellules: [
      { nom: "Cellule témoin A", nombreDeMembres: 7 },
      { nom: "Cellule témoin B", nombreDeMembres: null },
    ],
  },
];

let mode = "normal";
const demandesRecues = [];

const signer = (cle, horodatage, corps) =>
  `sha256=${createHmac("sha256", cle)
    .update(`${String(horodatage)}.${corps}`)
    .digest("hex")}`;

function signatureValide(horodatage, corps, signature) {
  const attendue = Buffer.from(signer(CLE, horodatage, corps));
  const recue = Buffer.from(signature ?? "");
  const recent = Math.abs(Date.now() / 1000 - horodatage) <= 300;
  return recent && attendue.length === recue.length && timingSafeEqual(attendue, recue);
}

function lireCorps(requete) {
  return new Promise((resoudre) => {
    let corps = "";
    requete.on("data", (morceau) => (corps += morceau));
    requete.on("end", () => resoudre(corps));
  });
}

function repondre(reponse, statut, objet, entetes = {}) {
  reponse.writeHead(statut, { "Content-Type": "application/json", ...entetes });
  reponse.end(
    objet === null ? "" : typeof objet === "string" ? objet : JSON.stringify(objet),
  );
}

function publications(reponse) {
  const corps = JSON.stringify({
    version: "1",
    emisLe: new Date().toISOString().replace(/\.\d{3}Z$/, "Z"),
    villes: VILLES_TEMOINS,
  });
  const horodatage = Math.floor(Date.now() / 1000);
  const cle = mode === "signature-fausse" ? "une-autre-cle" : CLE;
  repondre(reponse, 200, corps, {
    "X-GBUM-Horodatage": String(horodatage),
    "X-GBUM-Signature": signer(cle, horodatage, corps),
  });
}

async function demande(requete, reponse) {
  const corps = await lireCorps(requete);
  const horodatage = Number(requete.headers["x-gbum-horodatage"]);
  if (!signatureValide(horodatage, corps, requete.headers["x-gbum-signature"])) {
    return repondre(reponse, 401, { refus: "signature-invalide" });
  }
  const objet = JSON.parse(corps);
  const deja = demandesRecues.some((d) => d.id === objet.id);
  if (!deja) demandesRecues.push(objet);
  return repondre(reponse, deja ? 200 : 201, { recue: true });
}

async function changerDeMode(requete, reponse) {
  mode = JSON.parse(await lireCorps(requete)).mode;
  repondre(reponse, 200, { mode });
}

// Les portes du témoin répondent toujours ; celles du contrat tombent avec
// le mode « panne », comme tomberait le vrai hub.
const TEMOIN = {
  "GET /temoin/demandes": (_requete, reponse) => repondre(reponse, 200, demandesRecues),
  "POST /temoin/mode": changerDeMode,
};
const CONTRAT = {
  "GET /contrat/v1/publications": (_requete, reponse) => publications(reponse),
  "POST /contrat/v1/demandes": demande,
};

createServer((requete, reponse) => {
  const cle = `${requete.method ?? "GET"} ${requete.url ?? ""}`;
  const temoin = TEMOIN[cle];
  if (temoin !== undefined) return temoin(requete, reponse);
  if (mode === "panne") return repondre(reponse, 503, null);
  const porte = CONTRAT[cle];
  return porte === undefined ? repondre(reponse, 404, null) : porte(requete, reponse);
}).listen(PORT, () => console.log(`Faux hub privé sur le port ${String(PORT)}`));
