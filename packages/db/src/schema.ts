import { boolean, integer, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

/**
 * La structure de la base.
 *
 * S3 (ADR-012) — c'est ici, et nulle part ailleurs, qu'on décrit ce que
 * PostgreSQL contient. Aucun autre paquet n'écrit de SQL.
 * S4 — ce fichier ne suffit pas : chaque changement produit une migration
 * numérotée dans `migrations/`, relue comme du code. **On ne modifie jamais la
 * base à la main.** C'est la règle qui rend toutes les autres vraies.
 *
 * Le lot 1 n'a besoin que des villes et de leurs cellules. Les pages
 * éditoriales, l'agenda, le canevas et les demandes viendront avec les écrans
 * qui les utilisent — une table sans écran est une table qu'on modélise à
 * l'aveugle.
 */

export const villes = pgTable("villes", {
  id: uuid("id").primaryKey().defaultRandom(),
  nom: text("nom").notNull(),

  /**
   * Le contact publié — le seul, ADR-011. Il appartient au BUREAU, dont le
   * mandat est annuel : d'où les deux bornes. Hors mandat, le site affiche
   * « le bureau est en cours de renouvellement » plutôt qu'un vide, et jamais
   * l'adresse de l'année précédente.
   */
  bureauCourriel: text("bureau_courriel"),
  bureauMandatDebut: timestamp("bureau_mandat_debut", { withTimezone: true }),
  bureauMandatFin: timestamp("bureau_mandat_fin", { withTimezone: true }),

  /** L'ordre dans lequel le mouvement veut citer ses villes (demande N3). */
  rang: integer("rang").notNull().default(0),

  creeLe: timestamp("cree_le", { withTimezone: true }).notNull().defaultNow(),
  modifieLe: timestamp("modifie_le", { withTimezone: true }).notNull().defaultNow(),
});

/**
 * Une cellule n'a ici que son nom et son effectif.
 *
 * Ni jour, ni heure, ni lieu, ni responsable — et ce n'est pas un oubli : la
 * colonne n'existe pas. C'est ADR-011 appliquée à la base elle-même. Ce qui
 * n'existe pas ne fuit pas, ne s'exporte pas par erreur, et ne se retrouve pas
 * dans une sauvegarde qu'on partage.
 *
 * Le jour et le lieu vivront dans l'espace de travail, quand il viendra, dans
 * une autre table dont la publication n'est pas possible.
 */
export const cellules = pgTable("cellules", {
  id: uuid("id").primaryKey().defaultRandom(),
  villeId: uuid("ville_id")
    .notNull()
    .references(() => villes.id, { onDelete: "cascade" }),
  nom: text("nom").notNull(),
  nombreDeMembres: integer("nombre_de_membres"),
  rang: integer("rang").notNull().default(0),

  creeLe: timestamp("cree_le", { withTimezone: true }).notNull().defaultNow(),
  modifieLe: timestamp("modifie_le", { withTimezone: true }).notNull().defaultNow(),
});

/**
 * Les messages reçus par les formulaires publics.
 *
 * Ils vont au bureau de la ville, et à lui seul — c'est ce que la page promet
 * au visiteur, et c'est donc ce que la structure doit rendre vrai : la
 * demande porte la ville à laquelle elle appartient, et rien ne la duplique
 * ailleurs.
 *
 * `traitee` existe dès maintenant parce qu'une boîte de réception sans état de
 * traitement se remplit et n'est plus lue — c'est la raison pour laquelle
 * l'écran « Demandes reçues » de l'administration porte un compteur.
 */
export const demandes = pgTable("demandes", {
  id: uuid("id").primaryKey().defaultRandom(),
  sujet: text("sujet").notNull(),
  nom: text("nom").notNull(),
  contact: text("contact").notNull(),
  villeId: uuid("ville_id").references(() => villes.id, { onDelete: "set null" }),
  /** Saisi librement quand la ville n'est pas encore dans la liste. */
  villeLibre: text("ville_libre"),
  message: text("message").notNull(),
  traitee: boolean("traitee").notNull().default(false),
  creeLe: timestamp("cree_le", { withTimezone: true }).notNull().defaultNow(),
});
