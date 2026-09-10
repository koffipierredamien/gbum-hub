import {
  boolean,
  integer,
  pgTable,
  text,
  timestamp,
  unique,
  uuid,
} from "drizzle-orm/pg-core";

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

/**
 * Les comptes de l'espace d'administration.
 *
 * Il n'y a PAS d'inscription : les comptes sont créés en ligne de commande
 * (`pnpm compte:creer`). Un espace d'administration où l'on peut s'inscrire
 * soi-même n'est pas un espace d'administration.
 *
 * `role` ne porte pour l'instant que deux valeurs — le Secrétariat National et
 * l'administration technique. Le modèle d'accès complet (ADR-005 : cumulatif
 * vertical, cloisonné latéral, ouvertures datées) viendra avec l'espace de
 * travail, où il y a des niveaux à cloisonner. Ici, il n'y en a pas.
 */
export const comptes = pgTable("comptes", {
  id: uuid("id").primaryKey().defaultRandom(),
  courriel: text("courriel").notNull().unique(),
  nom: text("nom").notNull(),
  /** Le condensat scrypt, paramètres compris. Jamais le mot de passe. */
  motDePasse: text("mot_de_passe").notNull(),
  role: text("role").notNull().default("secretariat"),
  actif: boolean("actif").notNull().default(true),
  creeLe: timestamp("cree_le", { withTimezone: true }).notNull().defaultNow(),
  derniereConnexion: timestamp("derniere_connexion", { withTimezone: true }),
});

/**
 * Les sessions ouvertes.
 *
 * La clé est l'EMPREINTE du jeton, jamais le jeton : une fuite de la base ne
 * donne aucune session utilisable. C'est la même règle que pour les mots de
 * passe, et pour la même raison.
 */
export const sessions = pgTable("sessions", {
  empreinte: text("empreinte").primaryKey(),
  compteId: uuid("compte_id")
    .notNull()
    .references(() => comptes.id, { onDelete: "cascade" }),
  expireLe: timestamp("expire_le", { withTimezone: true }).notNull(),
  creeLe: timestamp("cree_le", { withTimezone: true }).notNull().defaultNow(),
});

/**
 * Le contenu éditorial du site public, section par section et langue par
 * langue.
 *
 * DEUX COLONNES DE TEXTE, ET C'EST TOUT L'ENJEU. `brouillon` est ce que le
 * Secrétariat National est en train d'écrire ; `publie` est ce que le site
 * montre. Publier, c'est recopier l'un dans l'autre — un geste distinct, et
 * c'est voulu : rien ne change en ligne tant qu'on n'a pas publié.
 *
 * `cle` est la clé de traduction de la page publique. Une section absente
 * d'ici n'est pas un trou : c'est le texte livré avec le site qui s'affiche.
 * Le mouvement ne remplit donc que ce qu'il veut changer.
 */
export const sectionsEditoriales = pgTable(
  "sections_editoriales",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    page: text("page").notNull(),
    cle: text("cle").notNull(),
    langue: text("langue").notNull(),
    brouillon: text("brouillon"),
    publie: text("publie"),
    modifieLe: timestamp("modifie_le", { withTimezone: true }).notNull().defaultNow(),
    modifiePar: uuid("modifie_par").references(() => comptes.id, {
      onDelete: "set null",
    }),
  },
  (table) => [unique("section_unique").on(table.page, table.cle, table.langue)],
);
