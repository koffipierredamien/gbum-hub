import { describe, expect, it } from "vitest";
import { peut } from "../src/index.js";
import type { Ressource } from "../src/index.js";
import {
  CTX, P, S, acteur, habilitation, surCellule, surEtSous, surLeMouvement,
} from "./fixtures.js";

const rapport = (structureId: (typeof S)[keyof typeof S]): Ressource => ({
  type: "rapport",
  structureId,
});

describe("la portée cloisonne — c'est ce qui manque au modèle actuel", () => {
  const yann = acteur(P.yann, habilitation("responsable_cellule", surCellule(S.agdal)));

  it("le responsable de Rabat-Agdal rend le rapport de SA cellule", () => {
    expect(peut(yann, "creer", rapport(S.agdal), CTX)).toEqual({ autorise: true });
  });

  it("il ne lit pas celui de la cellule d'à côté", () => {
    expect(peut(yann, "lire", rapport(S.souissi), CTX)).toEqual({
      autorise: false,
      motif: "hors_perimetre",
    });
  });

  it("ni celui d'une cellule de Fès", () => {
    expect(peut(yann, "lire", rapport(S.dharElMahraz), CTX)).toEqual({
      autorise: false,
      motif: "hors_perimetre",
    });
  });

  it("le bureau de ville voit toutes les cellules de SA ville", () => {
    const bureau = acteur(P.yann, habilitation("responsable_ville", surEtSous(S.rabat)));
    expect(peut(bureau, "lire", rapport(S.agdal), CTX)).toEqual({ autorise: true });
    expect(peut(bureau, "lire", rapport(S.souissi), CTX)).toEqual({ autorise: true });
    expect(peut(bureau, "lire", rapport(S.dharElMahraz), CTX)).toEqual({
      autorise: false,
      motif: "hors_perimetre",
    });
  });

  it("une portée sans descendants s'arrête à la structure elle-même", () => {
    const ville = acteur(P.yann, habilitation("responsable_ville", surCellule(S.rabat)));
    expect(peut(ville, "lire", rapport(S.agdal), CTX)).toEqual({
      autorise: false,
      motif: "hors_perimetre",
    });
  });
});

describe("une habilitation expire", () => {
  it("un mandat terminé ne donne plus rien", () => {
    const ancien = acteur(
      P.yann,
      habilitation("responsable_cellule", surCellule(S.agdal), {
        fin: new Date("2026-01-31T00:00:00Z"),
      }),
    );
    expect(peut(ancien, "creer", rapport(S.agdal), CTX)).toEqual({
      autorise: false,
      motif: "habilitation_expiree",
    });
  });

  it("un mandat qui n'a pas commencé non plus", () => {
    const futur = acteur(
      P.yann,
      habilitation("responsable_cellule", surCellule(S.agdal), {
        debut: new Date("2026-09-01T00:00:00Z"),
      }),
    );
    expect(peut(futur, "creer", rapport(S.agdal), CTX).autorise).toBe(false);
  });
});

describe("le budget validé ne bouge plus — c'est un engagement", () => {
  const sn = acteur(P.sarah, habilitation("permanent_sn", surLeMouvement));

  it("un brouillon se modifie", () => {
    expect(
      peut(sn, "modifier", { type: "budget", structureId: S.agdal, etat: "brouillon" }, CTX),
    ).toEqual({ autorise: true });
  });

  it("un budget validé ne se modifie plus, même par le national", () => {
    expect(
      peut(sn, "modifier", { type: "budget", structureId: S.agdal, etat: "valide" }, CTX),
    ).toEqual({ autorise: false, motif: "ressource_verrouillee" });
  });

  it("même l'administrateur ne le rouvre pas", () => {
    const admin = acteur(P.sarah, habilitation("administrateur", surLeMouvement));
    expect(
      peut(admin, "modifier", { type: "budget", structureId: S.agdal, etat: "clos" }, CTX),
    ).toEqual({ autorise: false, motif: "ressource_verrouillee" });
  });
});

describe("le carnet des Amis", () => {
  const carnet: Ressource = { type: "carnet_amis", structureId: S.corpsAmis };

  it("s'ouvre au responsable des Amis", () => {
    const resp = acteur(P.sarah, habilitation("responsable_amis", surEtSous(S.corpsAmis)));
    expect(peut(resp, "lire", carnet, CTX)).toEqual({ autorise: true });
  });

  it("s'ouvre au Secrétariat National", () => {
    const sn = acteur(P.sarah, habilitation("permanent_sn", surLeMouvement));
    expect(peut(sn, "lire", carnet, CTX)).toEqual({ autorise: true });
  });

  it("reste fermé au responsable de ville, si étendue soit sa portée", () => {
    const ville = acteur(P.yann, habilitation("responsable_ville", surEtSous(S.mouvement)));
    expect(peut(ville, "lire", carnet, CTX)).toEqual({
      autorise: false,
      motif: "role_insuffisant",
    });
  });
});

describe("le JTPA est cloisonné avant tout examen de rôle", () => {
  const suivi: Ressource = {
    type: "suivi_jtpa",
    structureId: S.agdal,
    accompagnantId: P.yann,
    partageAuResponsable: false,
  };

  it("l'accompagnant lit et modifie le sien", () => {
    const yann = acteur(P.yann, habilitation("gbussien", surCellule(S.agdal)));
    expect(peut(yann, "lire", suivi, CTX)).toEqual({ autorise: true });
    expect(peut(yann, "modifier", suivi, CTX)).toEqual({ autorise: true });
  });

  it("l'administrateur du mouvement ne lit pas celui d'un autre", () => {
    const admin = acteur(P.sarah, habilitation("administrateur", surLeMouvement));
    expect(peut(admin, "lire", suivi, CTX)).toEqual({
      autorise: false,
      motif: "cloisonnement",
    });
  });

  it("partagé, il s'ouvre au responsable — en lecture seule", () => {
    const partage: Ressource = { ...suivi, partageAuResponsable: true };
    const resp = acteur(P.sarah, habilitation("responsable_ville", surEtSous(S.rabat)));
    expect(peut(resp, "lire", partage, CTX)).toEqual({ autorise: true });
    expect(peut(resp, "modifier", partage, CTX)).toEqual({
      autorise: false,
      motif: "cloisonnement",
    });
  });

  it("partagé au responsable, il ne remonte PAS au national pour autant", () => {
    const partage: Ressource = { ...suivi, partageAuResponsable: true };
    const sn = acteur(P.sarah, habilitation("permanent_sn", surLeMouvement));
    const admin = acteur(P.sarah, habilitation("administrateur", surLeMouvement));
    for (const a of [sn, admin]) {
      expect(peut(a, "lire", partage, CTX)).toEqual({
        autorise: false,
        motif: "cloisonnement",
      });
    }
  });

  it("PERSONNE ne l'exporte — pas même celui qui l'a écrit", () => {
    // L'export fabrique une copie hors des protections du hub. C'est le
    // risque réel : un tableur qui circule sur WhatsApp.
    const admin = acteur(P.sarah, habilitation("administrateur", surLeMouvement));
    const lui = acteur(P.yann, habilitation("administrateur", surLeMouvement));
    for (const a of [admin, lui]) {
      expect(peut(a, "exporter", suivi, CTX)).toEqual({
        autorise: false,
        motif: "cloisonnement",
      });
    }
  });

  it("l'accompagnant SUPPRIME le sien — et lui seul", () => {
    // Décision délibérée, et l'inverse de l'export. Interdire l'effacement
    // rendrait une note sensible sur un tiers indestructible : c'est la
    // personne approchée que cela dessert, et le droit à l'effacement que
    // cela contredit (CDC §7.3, C4). Un autre, même administrateur, ne
    // supprime pas : il ne peut pas juger de ce qu'il n'a pas le droit de
    // lire.
    const lui = acteur(P.yann, habilitation("gbussien", surCellule(S.agdal)));
    const admin = acteur(P.sarah, habilitation("administrateur", surLeMouvement));
    expect(peut(lui, "supprimer", suivi, CTX)).toEqual({ autorise: true });
    expect(peut(admin, "supprimer", suivi, CTX)).toEqual({
      autorise: false,
      motif: "cloisonnement",
    });
  });
});

describe("chacun sa fiche, et le canevas du mouvement", () => {
  it("on lit et corrige sa propre fiche sans habilitation particulière", () => {
    const seul = acteur(P.amina);
    const sienne: Ressource = {
      type: "fiche_personne",
      structureId: S.agdal,
      personneId: P.amina,
    };
    expect(peut(seul, "lire", sienne, CTX)).toEqual({ autorise: true });
    expect(peut(seul, "modifier", sienne, CTX)).toEqual({ autorise: true });
    expect(peut(seul, "supprimer", sienne, CTX).autorise).toBe(false);
  });

  it("une GBUssienne lit le canevas publié, pas le brouillon des auteurs", () => {
    const amina = acteur(P.amina, habilitation("gbussien", surCellule(S.agdal)));
    const publie: Ressource = { type: "canevas", structureId: S.agdal, publie: true };
    const brouillon: Ressource = { ...publie, publie: false };
    expect(peut(amina, "lire", publie, CTX)).toEqual({ autorise: true });
    expect(peut(amina, "lire", brouillon, CTX)).toEqual({
      autorise: false,
      motif: "role_insuffisant",
    });
  });

  it("le conseiller de ville accompagne : il voit tout, il n'écrit rien", () => {
    const conseiller = acteur(P.sarah, habilitation("conseiller_ville", surEtSous(S.rabat)));
    expect(peut(conseiller, "lire", rapport(S.agdal), CTX)).toEqual({ autorise: true });
    expect(peut(conseiller, "modifier", rapport(S.agdal), CTX)).toEqual({
      autorise: false,
      motif: "role_insuffisant",
    });
  });
});
