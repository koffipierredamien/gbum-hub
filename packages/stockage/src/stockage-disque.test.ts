import { mkdtemp, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { beforeEach, describe, expect, it } from "vitest";
import { StockageDisque } from "./stockage-disque";
import { cheminValide, ProblemeDeStockage } from "./stockage";
import { construireStockage } from "./fabrique";

let racine = "";
let stockage: StockageDisque;

beforeEach(async () => {
  racine = await mkdtemp(join(tmpdir(), "gbum-stockage-"));
  stockage = new StockageDisque(racine, "https://exemple.org/fichiers");
});

const contenu = new TextEncoder().encode("une photo du camp");

describe("écrire, lire, supprimer", () => {
  it("relit ce qu'il a écrit", async () => {
    await stockage.ecrire("camps/ifrane/2026/01.jpg", contenu);
    expect(await stockage.lire("camps/ifrane/2026/01.jpg")).toEqual(contenu);
  });

  it("rend un Uint8Array, et jamais un Buffer de Node", async () => {
    // Le Buffer est une invention de Node. S'il sortait d'ici, les appelants
    // s'appuieraient sur ses méthodes — et le jour du basculement vers S3, la
    // panne apparaîtrait ailleurs que dans le code changé.
    await stockage.ecrire("photo.jpg", contenu);
    const relu = await stockage.lire("photo.jpg");
    expect(relu).toBeInstanceOf(Uint8Array);
    expect(Buffer.isBuffer(relu)).toBe(false);
  });

  it("crée les dossiers intermédiaires", async () => {
    await stockage.ecrire("a/b/c/d.txt", contenu);
    expect(await readFile(join(racine, "a/b/c/d.txt"))).toEqual(Buffer.from(contenu));
  });

  it("supprime sans se plaindre d'un fichier absent", async () => {
    await expect(stockage.supprimer("jamais-ecrit.txt")).resolves.toBeUndefined();
  });

  it("dit « introuvable » au lieu de rendre du vide (R2)", async () => {
    // C'est le défaut central de l'application actuelle : une lecture qui
    // échoue rend une liste vide, et la panne devient indiscernable d'un
    // dossier réellement vide.
    await expect(stockage.lire("absent.jpg")).rejects.toBeInstanceOf(
      ProblemeDeStockage,
    );
    await expect(stockage.lire("absent.jpg")).rejects.toMatchObject({
      probleme: { type: "introuvable" },
    });
  });
});

describe("un chemin venu de l'extérieur est validé à la frontière (R4)", () => {
  it("refuse la remontée de dossier", () => {
    expect(cheminValide("../../.env")).toBe(false);
    expect(cheminValide("camps/../../secret")).toBe(false);
  });

  it("refuse le chemin absolu, l'antislash et le vide", () => {
    expect(cheminValide("/etc/passwd")).toBe(false);
    expect(cheminValide("camps\\ifrane.jpg")).toBe(false);
    expect(cheminValide("")).toBe(false);
  });

  it("accepte un chemin ordinaire", () => {
    expect(cheminValide("camps/ifrane/2026/01.jpg")).toBe(true);
  });

  it("ne sert pas un fichier posé hors de la racine", async () => {
    // Le fichier existe réellement, à côté de la racine. Sans la garde, le
    // stockage disque le servirait ; le stockage objet, lui, n'a pas ce
    // défaut — raison de plus pour que la règle vive dans les deux.
    await writeFile(join(racine, "..", "voisin.txt"), "secret");
    await expect(stockage.lire("../voisin.txt")).rejects.toMatchObject({
      probleme: { type: "chemin-refuse" },
    });
  });
});

describe("l'URL publique", () => {
  it("colle le chemin derrière la racine publique", () => {
    expect(stockage.url("camps/ifrane/01.jpg")).toBe(
      "https://exemple.org/fichiers/camps/ifrane/01.jpg",
    );
  });
});

describe("la fabrique (S2 — la décision est dans l'environnement)", () => {
  it("choisit le disque par défaut", () => {
    const s = construireStockage({
      pilote: undefined,
      racineDisque: racine,
      urlPublique: "https://exemple.org/f",
    });
    expect(s).toBeInstanceOf(StockageDisque);
  });

  it("échoue bruyamment sur un pilote inconnu, au lieu de retomber sur le disque", () => {
    // Un stockage qui n'est pas celui qu'on croit est une perte de données
    // qu'on découvre trop tard.
    expect(() =>
      construireStockage({
        pilote: "azure",
        racineDisque: racine,
        urlPublique: "https://exemple.org/f",
      }),
    ).toThrow(/inconnu/);
  });

  it("annonce que S3 n'est pas encore écrit", () => {
    expect(() =>
      construireStockage({
        pilote: "s3",
        racineDisque: racine,
        urlPublique: "https://exemple.org/f",
      }),
    ).toThrow(/ADR-013/);
  });
});
