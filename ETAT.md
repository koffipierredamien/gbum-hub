# Où en est le projet

_11 novembre 2026. Une page, tenue à jour. Si vous ne lisez qu'un fichier, c'est
celui-ci._

## Le site est en ligne

Chaque fusion sur `main` est déployée par Vercel, toute seule. Il n'y a plus rien
à faire pour publier : on fusionne, et quelques minutes plus tard le site a
changé.

## Ce qui marche aujourd'hui

- **Six pages publiques**, en français et en anglais, sur téléphone comme sur
  ordinateur : l'accueil, Le mouvement, Où nous sommes, Le canevas, Nous écrire,
  et le formulaire « Rejoindre le GBUM ».
- **Les dix-neuf villes** du mouvement, dans le filet défilant et sur « Où nous
  sommes ». La liste vient du dépôt : une base vide ne peut pas les effacer.
- **Vingt-huit photographies** : douze défilent en ouverture, seize sont en
  galerie, sur trois pages. Elles s'ajoutent en déposant un fichier et une ligne
  de description — le mode d'emploi est dans `apps/site/public/photos/`.
- **Le canevas 2026-2027** : sa couverture, ses six parties, ses études, et le
  PDF à télécharger.
- **Le formulaire** : un étudiant choisit sa ville, laisse son prénom et un moyen
  de le joindre. Le message arrive dans l'administration, et repart au hub privé.
- **L'espace d'administration** : textes des pages, comptes, demandes reçues,
  réponses au formulaire de collecte. Les villes et les cellules y sont en
  lecture seule — c'est le hub privé qui les détient (ADR-014).
- **Les vérifications automatiques** : à chaque poussée, le site est construit,
  mesuré sur douze pages pour l'accessibilité WCAG 2.2 AA, et le contrat avec le
  hub privé est rejoué de bout en bout. Rien ne part en ligne sans elles.

## Ce qui manque, et qui doit le fournir

| Ce qui manque                                                     | Qui      | Bloque quoi                                |
| ----------------------------------------------------------------- | -------- | ------------------------------------------ |
| L'année et le récit de la fondation du GBUM                       | Le SN    | Un point de la frise, entre 1968 et 2023   |
| Une adresse d'envoi de courriel                                   | Le SN    | L'alerte au bureau quand un étudiant écrit |
| Les pages Confidentialité et Vos données                          | Le SN    | Deux liens retirés du pied de page         |
| Les contenus de « La vie du mouvement », « Agenda », « Soutenir » | Le SN    | Trois pages retirées du site               |
| La vidéo de présentation                                          | **Vous** | Rien — mais c'est ce qui circule le mieux  |

**Rien n'est inventé.** Ce que le mouvement n'a pas fourni n'est pas meublé : la
page est retirée, pas remplie de faux. Et depuis le 11 novembre, elle n'annonce
plus non plus qu'elle attend quelque chose — un site public qu'on envoie à des
étudiants ne parle pas de son propre chantier.

## Ce qu'il reste à faire, dans l'ordre

1. **Remplir ce qui ne dépend que de vous**, depuis l'administration : le thème
   de l'année, les accroches des pages.
2. **Envoyer le formulaire au Secrétariat National** pour le reste —
   [`docs/FORMULAIRE-DE-COLLECTE.md`](docs/FORMULAIRE-DE-COLLECTE.md). Le
   formulaire en ligne ne s'ouvre que si `CLE_COLLECTE` est renseignée ; tant
   qu'elle est vide, l'adresse `/collecte` reste fermée, et c'est voulu.
3. **La vidéo**, quand vous aurez répondu à trois questions : sa durée, où elle
   sera montrée, et qui y parle.

## Les documents

| Fichier                                   | Quand le lire                               |
| ----------------------------------------- | ------------------------------------------- |
| `docs/11-DEMARRER-EN-LOCAL.md`            | Faire tourner le projet chez vous           |
| `docs/16-REMPLIR-LE-SITE.md`              | Saisir les textes, les villes, les contacts |
| `docs/DEPLOIEMENT-VERCEL.md`              | Comprendre la mise en ligne                 |
| `docs/01-CAHIER-DES-CHARGES.md`           | Ce que le projet doit faire                 |
| `docs/02-ARCHITECTURE.md`                 | Pourquoi telle décision technique           |
| `docs/07-NOTE-AU-SECRETARIAT-NATIONAL.md` | Ce qu'il faut demander au SN                |

Le reste est dans `docs/archives/` — utile un jour, inutile aujourd'hui.
