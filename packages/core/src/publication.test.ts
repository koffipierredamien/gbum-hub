import { describe, expect, it } from "vitest";
import { celluleId, personneId, villeId } from "./identifiants";
import { instantDepuisIso } from "./temps";
import {
  publierCellule,
  publierContact,
  publierVille,
  type Cellule,
  type Ville,
} from "./publication";

const RENTREE_2026 = instantDepuisIso("2026-09-01T00:00:00Z");
const RENTREE_2027 = instantDepuisIso("2027-09-01T00:00:00Z");

const agdal: Cellule = {
  id: celluleId("agdal"),
  nom: "Cellule Agdal",
  nombreDeMembres: 12,
  jourDeRencontre: "mardi",
  lieu: "Faculté des sciences, salle 3",
  responsable: personneId("p-1"),
};

const rabat: Ville = {
  id: villeId("rabat"),
  nom: "Rabat",
  cellules: [agdal],
  bureau: {
    courriel: "rabat@example.org",
    mandat: { debut: RENTREE_2026, fin: RENTREE_2027 },
  },
};

describe("publier une cellule (ADR-011)", () => {
  it("ne publie que le nom et l'effectif", () => {
    expect(publierCellule(agdal)).toEqual({
      nom: "Cellule Agdal",
      nombreDeMembres: 12,
    });
  });

  it("ne laisse fuir NI le jour, NI le lieu, NI le responsable", () => {
    // On compare la liste exacte des clés, et non la présence de chacune :
    // c'est ce qui attrape un `{ ...cellule }` distrait ajouté un jour de
    // fatigue. Le type l'interdit déjà ; ce test le vérifie à l'exécution,
    // parce qu'une donnée qui fuit ne se rattrape pas.
    expect(Object.keys(publierCellule(agdal)).sort()).toEqual([
      "nom",
      "nombreDeMembres",
    ]);
  });
});

describe("publier le contact d'un bureau (R8 — mandat daté)", () => {
  it("publie le courriel pendant le mandat", () => {
    const veilleDeLaFin = instantDepuisIso("2027-08-31T23:59:00Z");
    expect(publierContact(rabat.bureau, veilleDeLaFin)).toEqual({
      type: "disponible",
      courriel: "rabat@example.org",
    });
  });

  it("ne le publie pas avant le début du mandat", () => {
    const avant = instantDepuisIso("2026-08-31T23:59:00Z");
    expect(publierContact(rabat.bureau, avant)).toEqual({ type: "mandat-echu" });
  });

  it("bascule exactement à l'instant de bascule, sans recouvrement", () => {
    // Fin exclusive : à l'instant du 1er septembre 2027, l'ancien bureau n'est
    // plus en fonction. C'est la seconde où, sans cette convention, deux
    // bureaux seraient joignables — ou aucun.
    expect(publierContact(rabat.bureau, RENTREE_2027)).toEqual({
      type: "mandat-echu",
    });
    expect(publierContact(rabat.bureau, RENTREE_2026).type).toBe("disponible");
  });

  it("dit pourquoi le contact manque, au lieu de rendre un vide", () => {
    // A1.3 : un emplacement vide ANNONCE qu'il attend, il ne se tait pas.
    const echu = publierContact(rabat.bureau, RENTREE_2027);
    expect(echu.type).toBe("mandat-echu");
  });
});

describe("publier une ville", () => {
  it("compte les cellules et les publie sous leur forme réduite", () => {
    const publiee = publierVille(rabat, RENTREE_2026);
    expect(publiee.nom).toBe("Rabat");
    expect(publiee.nombreDeCellules).toBe(1);
    expect(publiee.cellules).toEqual([{ nom: "Cellule Agdal", nombreDeMembres: 12 }]);
  });

  it("publie la ville même quand le bureau n'est plus en mandat", () => {
    // La ville ne disparaît pas du site parce que son bureau change : elle
    // reste visible, et c'est le contact qui annonce son absence.
    const publiee = publierVille(rabat, RENTREE_2027);
    expect(publiee.nom).toBe("Rabat");
    expect(publiee.contact.type).toBe("mandat-echu");
  });

  it("ne laisse fuir aucun champ interne de la ville", () => {
    expect(Object.keys(publierVille(rabat, RENTREE_2026)).sort()).toEqual([
      "cellules",
      "contact",
      "nom",
      "nombreDeCellules",
    ]);
  });
});
