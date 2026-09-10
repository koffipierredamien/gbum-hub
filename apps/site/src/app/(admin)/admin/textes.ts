/**
 * Les textes de l'espace d'administration, tous au même endroit.
 *
 * **L'administration est en français seulement, et c'est une décision.**
 * ADR-008 impose que les textes du SITE PUBLIC passent par une clé de
 * traduction — c'est ce qui le rend bilingue. L'espace d'administration, lui,
 * s'adresse au Secrétariat National, qui travaille en français ; le traduire
 * doublerait le travail pour personne. Les textes vivent donc ici, dans un
 * seul module typé plutôt que dispersés dans le balisage : le jour où il
 * faudra traduire, ce fichier est le seul à lire.
 */
export const T = {
  titre: "Administration",
  sousTitre: "du site public",
  connexion: {
    titre: "Se connecter",
    accroche:
      "L'espace d'administration du site public. Il n'y a pas d'inscription : votre compte a été créé par l'administrateur technique.",
    courriel: "Courriel",
    motDePasse: "Mot de passe",
    entrer: "Entrer",
    refuse: "Courriel ou mot de passe incorrect.",
    indisponible:
      "La connexion n'a pas pu aboutir : le site n'arrive pas à sa base. Ce n'est pas votre mot de passe. Réessayez dans quelques minutes.",
  },
  onglets: {
    tableau: "Tableau de bord",
    pages: "Les pages",
    villes: "Villes et cellules",
    demandes: "Demandes reçues",
  },
  deconnexion: "Se déconnecter",
  tableau: {
    titre: "Ce qui attend votre main.",
    accroche:
      "Le site public est en ligne et il fonctionne. Ce qui suit est ce qu'il annonce comme manquant — chaque ligne remplie ici est un encadré qui disparaît là-bas.",
    sectionsVides: "sections sans contenu",
    sectionsEcrites: "sections écrites",
    villes: "villes publiées",
    cellules: "cellules publiées",
    demandesNonTraitees: "demandes à traiter",
    voirLeSite: "Voir le site public",
  },
  pages: {
    titre: "Les pages",
    accroche:
      "Le texte du site public, section par section, en français et en anglais. Ce que vous écrivez ici ne part pas en ligne tout de suite : publier est un geste distinct.",
    modifier: "Modifier",
    sectionsVides: "en attente",
    aJour: "à jour",
    brouillonsEnAttente: "modifications non publiées",
  },
  editeur: {
    francais: "Français",
    anglais: "English",
    anglaisAbsent: "Anglais absent — le français s'affichera à sa place.",
    enregistrer: "Enregistrer le brouillon",
    publier: "Publier la page",
    voir: "Voir la page publique",
    enregistre:
      "Brouillon enregistré. Le site public affiche encore la version précédente.",
    publiee: "Page publiée. Le site public l'affiche maintenant.",
    echec: "Rien n'a été enregistré : le site n'arrive pas à sa base. Réessayez.",
    etat: "État de la page",
    nonPublie: "Modifications non publiées",
    nonPublieTexte:
      "Le site public affiche encore la version précédente. Rien ne change en ligne tant que vous n'avez pas publié. Publier est un geste distinct, et c'est voulu.",
    toutPublie: "Tout est publié",
    toutPublieTexte: "Le site public affiche exactement ce que vous voyez ici.",
    sections: "Sections de la page",
    vide: "en attente",
    ecrite: "écrite",
    brouillon: "brouillon",
  },
  villes: {
    titre: "Villes et cellules",
    accroche:
      "La liste qui alimente « Où nous sommes » et le parcours « Rejoindre ». Une cellule n'a ici que son nom et son effectif — ni jour, ni heure, ni lieu, ni responsable : ces colonnes n'existent pas dans la base, et c'est la décision du 9 septembre 2026.",
    ajouterVille: "Ajouter une ville",
    nom: "Nom",
    rang: "Rang",
    rangIndice: "L'ordre d'affichage sur le site.",
    courriel: "Courriel du bureau",
    mandatDebut: "Mandat — début",
    mandatFin: "Mandat — fin",
    mandatIndice:
      "Hors de ces dates, le site n'affiche pas le courriel : il annonce que le bureau est en cours de renouvellement.",
    enregistrer: "Enregistrer",
    supprimer: "Supprimer",
    supprimerVille: "Supprimer cette ville et ses cellules",
    cellules: "Cellules",
    ajouterCellule: "Ajouter une cellule",
    membres: "Membres",
    aucuneVille:
      "Aucune ville enregistrée. Le site public affiche la liste provisoire livrée avec lui, et annonce qu'elle est à compléter.",
  },
  demandes: {
    titre: "Demandes reçues",
    accroche:
      "Les messages envoyés par les formulaires du site. Ils ne partent nulle part ailleurs — l'alerte automatique au bureau de la ville reste à brancher.",
    aucune: "Aucune demande reçue.",
    traiter: "Marquer comme traitée",
    rouvrir: "Rouvrir",
    traitee: "Traitée",
    sujets: {
      rejoindre: "Rejoindre un groupe",
      soutenir: "Soutenir le mouvement",
      question: "Une question",
      autre: "Autre",
      souvenir: "Un souvenir",
    } as Record<string, string>,
  },
} as const;

/**
 * Ce que le Secrétariat National peut modifier, et rien d'autre.
 *
 * La liste est COURTE À DESSEIN. Ouvrir les trois cents clés du site à
 * l'édition ne rendrait service à personne : on ne trouverait plus celles qui
 * comptent, et une étiquette de bouton modifiée par erreur casserait une page.
 * Ce sont les sections qui attendent du contenu, ou qui changent d'une année
 * sur l'autre.
 */
export interface SectionEditable {
  readonly cle: string;
  readonly libelle: string;
  readonly aide?: string;
  readonly long?: boolean;
}

export interface PageEditable {
  readonly espace: string;
  readonly titre: string;
  readonly chemin: string;
  readonly sections: readonly SectionEditable[];
}

export const PAGES_EDITABLES: readonly PageEditable[] = [
  {
    espace: "commun",
    titre: "Le thème de l'année",
    chemin: "/",
    sections: [
      {
        cle: "themeNom",
        libelle: "Le thème, tel qu'on le dit",
        aide: "Tant qu'il est vide, l'accueil et « Le mouvement » annoncent qu'il est attendu. Dès qu'il est publié, il s'affiche aux deux endroits.",
      },
      { cle: "themeTexte", libelle: "Ce que le thème veut dire", long: true },
    ],
  },
  {
    espace: "accueil",
    titre: "L'accueil",
    chemin: "/",
    sections: [
      { cle: "display", libelle: "La phrase d'ouverture", long: true },
      { cle: "accroche", libelle: "Le paragraphe sous l'ouverture", long: true },
      {
        cle: "voixCitation",
        libelle: "Le témoignage d'un étudiant",
        aide: "Deux ou trois phrases, avec l'accord écrit de la personne. C'est la section qui change le plus la page.",
        long: true,
      },
      { cle: "tempsFortNom", libelle: "Le prochain temps fort — son nom" },
      {
        cle: "tempsFortTexte",
        libelle: "Le prochain temps fort — sa description",
        long: true,
      },
    ],
  },
  {
    espace: "leMouvement",
    titre: "Le mouvement",
    chemin: "/le-mouvement",
    sections: [
      { cle: "accroche", libelle: "La présentation du mouvement", long: true },
      { cle: "visionNom", libelle: "Le nom de la vision décennale" },
      { cle: "visionTexte", libelle: "La vision, en deux phrases", long: true },
      {
        cle: "friseGbumAnnee",
        libelle: "L'année de fondation du GBUM",
        aide: "Tant qu'elle est vide, la frise annonce que cette date manque. Dès que l'année ET le récit sont publiés, elle devient un point daté comme 1947 et 1968.",
      },
      {
        cle: "friseGbumTexte",
        libelle: "La fondation du GBUM, en quelques lignes",
        long: true,
      },
    ],
  },
  {
    espace: "leCanevas",
    titre: "Le canevas",
    chemin: "/le-canevas",
    sections: [
      { cle: "anneeTitre", libelle: "Le canevas de l'année — son titre" },
      { cle: "accroche", libelle: "Ce qu'est le canevas", long: true },
    ],
  },
  {
    espace: "agenda",
    titre: "L'agenda",
    chemin: "/agenda",
    sections: [
      { cle: "prochainNom", libelle: "Le prochain temps fort — son nom" },
      {
        cle: "prochainTexte",
        libelle: "Le prochain temps fort — sa description",
        long: true,
      },
      {
        cle: "datesTexte",
        libelle: "Ses dates et informations pratiques",
        aide: "Écrivez-les dès qu'elles sont arrêtées : c'est la première chose qu'un étudiant cherche.",
        long: true,
      },
    ],
  },
  {
    espace: "soutenir",
    titre: "Soutenir",
    chemin: "/soutenir",
    sections: [
      { cle: "accroche", libelle: "Pourquoi soutenir le mouvement", long: true },
      {
        cle: "donAttenteTexte",
        libelle: "Les moyens de don",
        aide: "Tant qu'ils ne sont pas indiqués, aucun bouton de paiement n'est affiché sur le site : un don que l'on ne sait pas recevoir ne se demande pas.",
        long: true,
      },
    ],
  },
];

export function trouverPageEditable(espace: string): PageEditable | undefined {
  return PAGES_EDITABLES.find((page) => page.espace === espace);
}
