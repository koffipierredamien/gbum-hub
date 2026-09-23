/**
 * Les questions du formulaire de collecte.
 *
 * Ce sont les sept informations de la note au Secrétariat National, plus les
 * deux qui bloquent une fonction chacune — l'adresse d'expédition et les
 * moyens de don. Rien d'autre : un formulaire qui demande tout n'obtient
 * rien.
 *
 * L'ordre suit ce que chaque réponse DÉBLOQUE sur le site, du plus visible au
 * moins visible. Une personne qui s'arrête au milieu aura répondu aux
 * questions qui comptent le plus.
 *
 * `cle` est la clé rangée en base ; elle ne change plus une fois qu'une
 * réponse existe.
 */
export interface Question {
  readonly cle: string;
  readonly libelle: string;
  readonly aide: string;
  readonly long?: true;
}

export const QUESTIONS: readonly Question[] = [
  {
    cle: "theme-nom",
    libelle: "Le thème de l'année, tel qu'on le dit",
    aide: "La formule exacte retenue par le Secrétariat National. Elle s'affiche sur l'accueil et sur « Le mouvement ».",
  },
  {
    cle: "theme-sens",
    libelle: "Ce que ce thème demande aux étudiants cette année",
    aide: "Deux à quatre phrases.",
    long: true,
  },
  {
    cle: "villes",
    libelle: "Les villes où le GBUM est présent",
    aide: "Une ville par ligne, dans l'ordre où le mouvement veut les citer. Si vous connaissez les cellules d'une ville, mettez-les sous elle avec leur effectif.",
    long: true,
  },
  {
    cle: "chiffres",
    libelle: "Les chiffres du mouvement",
    aide: "Nombre de villes, de cellules, d'étudiants, d'Amis du GBU. Écrivez ce que vous savez ; ce qui manque restera vide plutôt que d'être inventé.",
    long: true,
  },
  {
    cle: "histoire-annee",
    libelle: "L'année de fondation du GBUM",
    aide: "Une année suffit. Elle place le mouvement sur la frise, entre 1947 et 1968.",
  },
  {
    cle: "histoire-recit",
    libelle: "La fondation du GBUM, en quelques lignes",
    aide: "Qui l'a portée, dans quelles circonstances. Cette histoire n'existe nulle part en ligne : vous êtes la source.",
    long: true,
  },
  {
    cle: "canevas",
    libelle: "Le canevas d'études de l'année",
    aide: "Son titre, ce qu'il est, et la liste de ses études. Si un fichier existe, dites-le : nous vous dirons où l'envoyer.",
    long: true,
  },
  {
    cle: "temps-fort",
    libelle: "Le prochain temps fort",
    aide: "Son nom, ses dates, son lieu, et à qui il s'adresse.",
    long: true,
  },
  {
    cle: "don",
    libelle: "Les moyens de soutenir financièrement",
    aide: "Le compte, les moyens de paiement acceptés, le reçu éventuel. Tant que ce champ est vide, AUCUN bouton de don n'apparaît sur le site.",
    long: true,
  },
  {
    cle: "courriel-expedition",
    libelle: "Une adresse d'envoi pour les messages automatiques",
    aide: "Sans elle, un étudiant qui écrit au bureau de sa ville n'alerte personne : le message est enregistré, mais dort.",
  },
  {
    cle: "remarques",
    libelle: "Autre chose que le site devrait dire, ou ne pas dire",
    aide: "Facultatif.",
    long: true,
  },
];
