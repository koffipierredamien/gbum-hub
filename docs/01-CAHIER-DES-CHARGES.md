# Cahier des charges — Hub officiel du GBUM

| | |
|---|---|
| **Projet** | Hub officiel du GBUM — *Groupe Biblique Universitaire au Maroc* |
| **Version** | 2.0 — refonte du 9 septembre 2026 |
| **Maîtrise d'ouvrage** | Le Secrétariat National |
| **Maîtrise d'œuvre** | Pierre Damien Koffi Koumassi |
| **Existant** | `gbu-connect`, en service sur `gbu-maroc.org` — voir [l'audit](00-AUDIT-EXISTANT.md) |
| **Avancement** | Phase 2 de [l'échéancier](04-ROADMAP.md) |

> **Règle de ce document.** Rien n'y est inventé. Ce qui vient du mouvement est
> marqué *(mouvement)* ; ce qui vient d'une source publique est lié ; ce qui
> manque est **dit manquant** et attend une réponse. Une version 1.0 portait des
> chiffres, un thème d'année et des profils d'utilisateurs fabriqués : ils ont
> été retirés.

**Vocabulaire.** Le **Secrétaire National (Secrétariat National)** est une personne. Le
**Secrétariat National** est l'instance qu'il forme avec ses cinq **Assistants
(ASN)**. Ce document n'abrège jamais « Secrétariat National ».

---

## Sommaire

1. [Le mouvement](#1-le-mouvement)
2. [Deux produits, deux raisons d'être](#2-deux-produits-deux-raisons-dêtre)
3. [Le site public](#3-le-site-public)
4. [L'espace de travail](#4-lespace-de-travail)
5. [Le modèle d'accès](#5-le-modèle-daccès)
6. [Exigences non fonctionnelles](#6-exigences-non-fonctionnelles)
7. [Sécurité et protection des personnes](#7-sécurité-et-protection-des-personnes)
8. [Contraintes](#8-contraintes)
9. [Reprise de l'existant](#9-reprise-de-lexistant)
10. [Décisions](#10-décisions)

---

## 1. Le mouvement

### 1.1 Ce qui le définit

Le GBUM rassemble des étudiants qui veulent vivre et approfondir leur foi
chrétienne pendant leurs années d'études, dans les villes universitaires du
Maroc. Un membre s'appelle un **GBUssien**. *(mouvement)*

| | |
|---|---|
| **Devise** | « Connaître Christ et Le faire connaître » |
| **Vision décennale** | « Éclaireurs des campus pour Christ » — née lors de la préparation du camp d'Ifrane 2023 |
| **Thème annuel** | Un thème porte la vision chaque année. **Celui de l'année en cours n'est pas encore disponible.** |

### 1.2 Ce que le mouvement fait

*(mouvement — liste ouverte, elle s'enrichira)*

| Activité | Nature |
|---|---|
| **Études bibliques hebdomadaires** | En cellule, sur le canevas de l'année |
| **Études bibliques communautaires** | À l'échelle de la ville ou plus large |
| **Prière** | Temps de prière du mouvement |
| **Masterclass** | Formations |
| **Sorties de détente** | Vie fraternelle |
| **Agapès** | Repas partagés |
| **Sorties d'évangélisation** | Témoignage sur les campus |
| **JTPA** | Journées de Témoignage par Amitié — *forme à préciser, réserve R4* |
| **Jeux bibliques, jeux** | Vie de groupe |
| **Camp des responsables** | Formation des responsables |
| **Camp des témoins** | |
| **Camp d'Ifrane** | Retraite étudiante nationale : communion, détente, et une force de transformation reconnue |

### 1.3 Comment il est organisé

*(mouvement, 9 septembre 2026)*

#### Le Secrétariat National

Il chapeaute l'ensemble du mouvement au Maroc.

- **Le Secrétaire National** : Dr Pierre ADIMI
- **Cinq Assistants du Secrétaire National** : Esaïe NIKIEMA, Junias OUEDRAOGO,
  Saint-Clair DJASSAMA, Mike Vianney MIKEDI, Crassi Flora POUTOU

#### Le Conseil Exécutif

- Son bureau est **renouvelé chaque année**.
- Président, vice-président, et d'autres postes.
- **Chaque membre du bureau porte une responsabilité nationale** — par exemple
  la trésorerie du mouvement.
- **Certains conseillers se voient attribuer une ville** et y exercent comme
  **conseiller de ville** : ils accompagnent le bureau de ville.

#### Les bureaux de ville

Chaque ville où le GBU est représenté est gérée par un bureau, **renouvelé
chaque année**. Sa composition varie selon la ville : responsable de ville,
secrétaire, trésorier, responsable de l'intercession, responsable du
témoignage, responsable de la communication, et d'autres.

Outre la fonction que leur nom indique, ses membres **servent le mouvement dans
la ville**.

#### Les cellules

Dans chaque ville, des cellules — dans les quartiers, chez quelqu'un, ou sur un
campus. C'est là que se tiennent les études bibliques et une partie des autres
activités. Leurs **responsables sont renouvelés chaque année**.

Des activités existent aussi à l'échelle de la **ville** et du **pays**.

#### Les Amis du GBU — hors hiérarchie

D'anciens GBUssiens, leurs études terminées, qui portent toujours le mouvement
et le soutiennent : financièrement, dans la prière, autrement.

```
Secrétariat National   Secrétaire National + 5 ASN
        │
Conseil Exécutif       bureau annuel · responsabilités nationales
        │              dont certains conseillers → conseiller d'une ville
        │
Bureaux de ville       bureau annuel · composition variable
        │
Cellules               responsables annuels · quartier ou campus
        │
GBUssiens

⟂  Amis du GBU — anciens diplômés, hors hiérarchie
```

> **Tous les mandats sont annuels.** Conseil Exécutif, bureaux de ville,
> responsables de cellule : tout se renouvelle chaque année. **Le hub doit
> traiter le mandat comme une donnée datée qui expire d'elle-même**, jamais
> comme une étiquette permanente qu'il faudrait penser à retirer.

### 1.4 Le GBUM dans le monde des GBU

- Le GBUM relève de la région **MENA** — Moyen-Orient et Afrique du Nord — de
  l'IFES. *(mouvement)*
- **La plupart des GBUssiens du Maroc viennent des pays du GBUAF** —
  Groupes Bibliques Universitaires d'Afrique Francophone. *(mouvement)* C'est
  pourquoi l'histoire du GBUAF appartient à celle du GBUM, et pourquoi le
  français est la langue première du hub.
- L'**IFES** a été fondée en **1947 à Harvard** par les représentants de dix
  mouvements nationaux, sur une base de foi, une constitution et **l'autonomie
  de chaque mouvement membre**. Siège à Oxford ; présente dans 180 pays.
  ([IFES](https://ifesworld.org/en/our-story/), [Wikipédia](https://fr.wikipedia.org/wiki/Union_internationale_des_groupes_bibliques_universitaires))
- Le **GBUAF** naît d'un congrès d'une quinzaine d'étudiants à **Abidjan en
  1968**, après Dakar 1965 et Abidjan 1966 ; membre affilié de l'IFES en 1972.
  ([GBUAF](https://gbuaf.org/les-gbuaf/lhistoire-des-gbu/))

### 1.5 Ce qui manque encore

À obtenir du Secrétariat National. **Ces vides ne seront pas comblés par des
suppositions.**

| Manquant | Ce qu'il bloque |
|---|---|
| Le **canevas d'études de l'année** | La section canevas, publique comme interne |
| Le **thème de l'année** | L'accroche du site et le lien à la vision |
| L'**histoire des GBU et du GBUM** | La page « Notre histoire ». Introuvable en ligne. |
| Les **chiffres du mouvement** | La vitrine et les tableaux de suivi |
| De **vraies photos** | Les maquettes portent des emplacements vides |
| Ce qu'est réellement une **JTPA** | L'exigence correspondante et sa protection |

### 1.6 Pourquoi refaire l'outil

L'application actuelle rend de vrais services, mais :

- **ouvrir `gbu-maroc.org` mène à un écran de connexion** — le mouvement est
  invisible sur le web, et rien n'y conserve sa mémoire ;
- **ses données sont réparties entre des endroits jamais cohérents entre eux**,
  ce qui rend les sauvegardes fragiles ;
- **toute réunion en cours est coupée** dès qu'on met le service à jour ;
- **son interface** n'atteint pas le niveau attendu d'un hub officiel.

---

## 2. Deux produits, deux raisons d'être

Le hub n'est pas un produit avec deux façades : ce sont **deux produits qui
partagent une même base de données**, et ils ne servent pas le même but.

| | **Le site public** | **L'espace de travail** |
|---|---|---|
| Adresse | `gbu-maroc.org` | `hub.gbu-maroc.org` |
| Public | Tout le monde, sans compte | Les membres, selon leur niveau |
| Raison d'être | **Faire connaître et garder mémoire** | **Travailler ensemble** |
| Rythme | Actualisé régulièrement — photos, vidéos, actualités | Utilisé chaque semaine |
| Exigence première | Être trouvé, être lu, être crédible | Faire gagner du temps |

### 2.1 Objectifs du site public

*(mouvement)*

| # | Objectif |
|---|---|
| **P1** | **Rendre le GBUM visible.** Qu'un étudiant, un parent, une église ou un partenaire trouve le mouvement et comprenne ce qu'il est. |
| **P2** | **Conserver la mémoire du mouvement, et l'ouvrir largement.** L'histoire, les canevas passés, les camps, ce qui a été vécu. |
| **P3** | **Montrer ce que le mouvement fait**, par une actualisation régulière — photos, vidéos, nouvelles sections. Un site figé ne dit rien de vivant. |

### 2.2 Objectifs de l'espace de travail

*(mouvement)*

| # | Objectif |
|---|---|
| **T1** | **Travailler ensemble.** Chaque niveau dispose de ce dont il a besoin pour exercer sa responsabilité, et voit ce que fait le niveau qu'il accompagne. |
| **T2** | **Ne pas ressaisir.** Ce qu'une cellule enregistre remonte à la ville et au national sans que personne le retape. |
| **T3** | **Garder la trace.** Séances, rapports, décisions, budgets, camps — le mouvement retrouve ce qu'il a fait. |

> **Aucune cible chiffrée n'est fixée.** Celles d'une version antérieure étaient
> inventées. Le Secrétariat National les fixera — voir la
> [note qui lui est adressée](07-NOTE-AU-SECRETARIAT-NATIONAL.md).

### 2.3 Une correction de cadrage

Une version antérieure de ce document présentait **le canevas d'études comme le
cœur du hub**, et l'audit en tirait un diagnostic sévère. **C'était une lecture
de la maîtrise d'œuvre, pas une position du mouvement.** *(corrigé le 9 sept. 2026)*

Le canevas est **une section importante — pas le centre de gravité**. Il aura
sa place, avec l'année en cours et les années antérieures. Ce que le mouvement
attend d'abord du hub, c'est d'être **visible et de garder mémoire** côté
public, et de **travailler ensemble** côté interne.

---

## 3. Le site public

**Priorités :** 🔴 v1 · 🟠 v1.1 · 🟡 plus tard

### A1 — Identité et présentation 🔴

| ID | Exigence |
|---|---|
| **A1.1** | Présenter le GBUM : ce qu'il est, la devise, la **vision décennale**, le **thème de l'année**, les convictions, l'appartenance à l'IFES et la parenté avec le GBUAF. |
| **A1.2** | **Contenu éditable par le Secrétariat National sans intervention technique.** C'est la condition pour que le site vive. |
| **A1.3** | Tant qu'un contenu officiel manque, la page **annonce qu'elle est en cours d'écriture** — ni vide, ni meublée par des suppositions. |

### A2 — Mémoire et histoire 🔴

*Objectif P2. C'est ce qui manque le plus cruellement aujourd'hui.*

| ID | Exigence |
|---|---|
| **A2.1** | **« Notre histoire »** : la naissance des GBU, du GBUAF, du GBUM, et ses étapes. Emplacement réservé dès la conception ; contenu attendu du Secrétariat National. |
| **A2.2** | **Chronologie du mouvement** : les jalons, les camps marquants, les tournants — dont Ifrane 2023 et la vision décennale. |
| **A2.3** | **Archive des canevas** : le canevas de l'année en cours et **ceux des années antérieures**, consultables et téléchargeables. **Ouverte à tous, sans compte** *(mouvement, 9 sept. 2026)* — c'est l'objectif P2, la mémoire largement ouverte. |
| **A2.4** | **Photothèque historique** : les albums par année, ville, événement. |
| **A2.5** | **Témoignages**, recueillis et publiés avec l'accord de leur auteur. |
| **A2.6** | Archive des **bureaux successifs** — nationaux et de ville : qui a servi, quand. *(🟠)* |

### A3 — La vie du mouvement 🔴

*Objectif P3. Sans mise à jour régulière, le site meurt en trois mois.*

| ID | Exigence |
|---|---|
| **A3.1** | **Actualités** : nouvelles du mouvement, comptes rendus d'activités, publiées par le Secrétariat National ou une ville habilitée. |
| **A3.2** | **Photos et vidéos**, en albums rattachés à un événement. |
| **A3.3** | **Publication depuis l'espace de travail** : une activité dont le bilan est saisi côté interne peut être publiée en un geste, sans ressaisie. C'est ce qui rend l'actualisation régulière soutenable. |
| **A3.4** | **Sections nouvelles créées sans développeur** : le site doit pouvoir grandir sans passer par la maîtrise d'œuvre. |

### A4 — Où nous sommes 🔴

| ID | Exigence |
|---|---|
| **A4.1** | Les **villes** où le GBUM est présent. |
| **A4.2** | Pour chaque ville, la **liste de ses cellules : nom et nombre de membres**. Rien d'autre — ni jour, ni heure, ni lieu, ni responsable de cellule. |
| **A4.3** | Le **contact du responsable de ville** : le seul contact publié. Adresse de la ville plutôt que personnelle. |
| **A4.4** | **Rejoindre le GBUM** : formulaire qui atteint le bureau de la ville concernée, avec accusé de réception et relance si la demande reste sans suite. |

### A5 — Agenda, soutien, contact 🔴

| ID | Exigence |
|---|---|
| **A5.1** | **Agenda public** des événements ouverts, camps compris ; export iCal. *(🟠)* |
| **A5.2** | **Soutenir** : les besoins, les moyens de don, un formulaire de promesse. |
| **A5.3** | **Nous écrire** : formulaire par sujet, sans exposer d'adresse. |

### A6 — Être trouvé 🔴

| ID | Exigence |
|---|---|
| **A6.1** | **Référencement** : métadonnées, données structurées, `sitemap`, URL lisibles, rendu servi depuis le serveur. Aujourd'hui le mouvement est introuvable. |
| **A6.2** | **Partage social** : un lien partagé affiche un aperçu correct. |
| **A6.3** | **Multilingue FR / AR / EN**, avec support **RTL** complet pour l'arabe. *(🟡 — l'architecture est posée dès la v1)* |

---

## 4. L'espace de travail

Organisé **par niveau de responsabilité**, plus des sections transverses
communes. Chaque section existe parce qu'un niveau a un travail à faire.

### B1 — Secrétariat National 🔴

| ID | Exigence |
|---|---|
| **B1.1** | **Vue du mouvement** : les villes, leurs cellules, leur vivacité — y compris **celles qui ne donnent plus signe de vie**. |
| **B1.2** | **Vision et thème** : rédiger et publier la vision décennale et le thème de l'année ; les relier aux objectifs des villes. |
| **B1.3** | **Plan d'action national**, décliné par ville et par cellule. |
| **B1.4** | **Nominations et mandats** : constater les renouvellements annuels des bureaux et des responsables de cellule. |
| **B1.5** | **Validation** de ce qui doit l'être : budgets, contenus publics, canevas. |

### B2 — Conseil Exécutif 🔴

| ID | Exigence |
|---|---|
| **B2.1** | **Espace du bureau** : ordre du jour, décisions, actions assignées, échéances. |
| **B2.2** | **Responsabilités nationales** : chaque membre dispose de l'espace de sa charge — la trésorerie pour le trésorier, et ainsi de suite. |
| **B2.3** | **Ville confiée** : un conseiller de ville accède au bureau de la ville qu'il accompagne, et suit son travail. |
| **B2.4** | **Passation annuelle** : au renouvellement du bureau, le successeur reçoit dossiers, décisions en cours et état des lieux. |

### B3 — Bureau de ville 🔴

| ID | Exigence |
|---|---|
| **B3.1** | **Vue de la ville** : ses cellules, ses effectifs, sa vie. |
| **B3.2** | **Espaces par fonction** — intercession, témoignage, communication, trésorerie… — la composition du bureau variant d'une ville à l'autre, **les fonctions sont configurables**, non figées dans le code. |
| **B3.3** | **Activités de la ville** : préparation, budget, inscriptions, bilan. |
| **B3.4** | **Budget de la ville** : prévision, réel, justificatifs. |
| **B3.5** | **Demandes reçues du site public**, à traiter et à suivre. |
| **B3.6** | **Passation annuelle**, comme pour le Conseil Exécutif. |

### B4 — Cellule 🔴

| ID | Exigence |
|---|---|
| **B4.1** | **Membres de la cellule** et leur présence dans le temps. |
| **B4.2** | **Séance** : date, lieu, étude traitée, présents, sujets de prière. **Saisissable en moins de trois minutes sur un téléphone.** |
| **B4.3** | **Aller chercher qui manque** : voir qui n'est pas venu depuis plusieurs séances. Le libellé dit « qui était là », jamais « qui a manqué ». |
| **B4.4** | **Rapport mensuel** : cinq champs, pré-remplis depuis les séances du mois. |
| **B4.5** | **Préparation de l'animateur** : notes privées sur l'étude, partageables au bureau de ville s'il le souhaite. |

### B5 — Amis du GBU 🟠

| ID | Exigence |
|---|---|
| **B5.1** | **Espace des Amis** : leur annuaire, leurs échanges, ce que le mouvement leur adresse. |
| **B5.2** | **Passage finissant → Ami** : recueil du consentement, du contact durable, puis transfert. |
| **B5.3** | **Promesses et engagements** : échéancier, rappel, taux de tenue. |
| **B5.4** | **Cartographie du réseau** : où sont les Amis, dans quels secteurs. |
| **B5.5** | Les Amis **ne voient pas** les espaces des niveaux étudiants. |

### B6 — Administration technique 🔴

*L'administrateur technique est un rôle du hub, pas un niveau du mouvement.
L'équipe technique est appelée à s'étendre.*

| ID | Exigence |
|---|---|
| **B6.1** | **Comptes** : invitation, activation, suspension, clôture. |
| **B6.2** | **Droits** : attribuer, retirer, constater les mandats en cours et échus. |
| **B6.3** | **Santé du service**, lisible par un non-développeur. |
| **B6.4** | **Sauvegardes** : état, ancienneté, dernière restauration vérifiée. |
| **B6.5** | **Journal des actions sensibles** — finances, données personnelles, droits, suppressions. |
| **B6.6** | **Plusieurs administrateurs**, avec des droits distincts. |

### Sections transverses

Accessibles à plusieurs niveaux, selon les droits.

| ID | Section | Exigence |
|---|---|---|
| **C1** | **Annuaire** 🔴 | Personnes, structures, rattachements. Cloisonné : chacun voit selon son niveau. |
| **C2** | **Canevas et études** 🔴 | Le canevas de l'année et ses archives ; l'avancement de chaque cellule ; **consultable hors réseau**. |
| **C3** | **Visioconférence** 🟠 | Réunions, salle d'attente, modération, sous-groupes, enregistrement avec consentement, compte rendu. **Un redémarrage du service ne coupe pas une réunion en cours.** |
| **C4** | **Agenda et activités** 🔴 | Toutes les activités du §1.2, typées ; inscriptions ; bilan ; **publication vers le site public**. |
| **C5** | **Documents** 🔴 | Bibliothèque : dépôt, catégories, droits de lecture, versions. |
| **C6** | **Communication** 🟠 | Annonces ciblées, envois par audience, préférences de contact par personne, canaux — hub, courriel, WhatsApp. |
| **C7** | **Prière** 🟠 | Sujets de prière, lettre de prière, diffusion aux membres et aux Amis, archive. |
| **C8** | **Camps** 🟠 | Dossier de camp : participants, chambres, transport, finances, boutique, attestations, programme, bilan. |
| **C9** | **Finances** 🟡 | Soutiens, versements, budgets par structure, validation, trésorerie, **journal inaltérable**. |
| **C10** | **Parcours et formation** 🟡 | Historique des rattachements et mandats, masterclass suivies, camps, relève. |
| **C11** | **Recherche** 🔴 | Sur tout le hub, **filtrée par les droits du demandeur**. |
| **C12** | **Notifications** 🔴 | Centre de notifications, préférences, jamais deux fois la même chose. |

---

## 5. Le modèle d'accès

### 5.1 Le principe posé par le mouvement

> **Le niveau n+1 accède à tout ce à quoi le niveau n accède, plus ce qui lui
> est propre.** Le Secrétariat National accède à l'espace des Amis ;
> l'inverse n'est pas vrai. *(mouvement)*

```
Secrétariat National   ─┐
Conseil Exécutif        │  chaque niveau ajoute au précédent
Bureau de ville         │
Responsable de cellule  │
GBUssien               ─┘

Amis du GBU     espace séparé — le Secrétariat National y accède, eux ne
                remontent pas

Administration  rôle technique transverse : les comptes et le service,
technique       jamais le contenu du mouvement
```

### 5.2 Ce que le modèle doit garantir

| ID | Exigence |
|---|---|
| **AC.1** | **Une seule définition des droits** pour tout le hub. Aucun écran ne décide par lui-même. |
| **AC.2** | **Le mandat expire de lui-même.** Tous les mandats étant annuels, un droit est daté : il s'ouvre et se referme sans que personne y pense. |
| **AC.3** | **Un refus est motivé** — jamais un écran vide sans explication. |
| **AC.4** | **La navigation dérive des droits** : un espace interdit n'est pas caché par une astuce d'affichage, il n'existe pas pour qui n'y a pas droit. |
| **AC.5** | **Vérifié automatiquement** : aucune combinaison de niveau et d'action ne doit ouvrir un accès hors périmètre. |
| **AC.6** | **« Voir à la place de »** pour l'administration : bandeau permanent, durée limitée, action journalisée. |

### 5.3 Entre pairs : cloisonné, avec ouverture temporaire

*(mouvement, 9 septembre 2026)*

**Le bureau de Rabat ne voit pas celui de Fès. Une cellule ne voit pas une
autre cellule.** Mais le hub doit permettre de **rendre accessibles
provisoirement** les détails d'une ville à une autre — et de même entre
cellules.

| ID | Exigence |
|---|---|
| **AC.7** | Une ouverture entre pairs porte **obligatoirement une date de fin**. Aucune ouverture indéfinie. |
| **AC.8** | Elle est **en lecture seule par défaut** ; l'écriture s'accorde à part. |
| **AC.9** | Elle est **motivée** : qui ouvre écrit pourquoi. |
| **AC.10** | Elle est **révocable à tout moment**, sans attendre l'échéance. |
| **AC.11** | Elle est **journalisée**, et **le propriétaire de la donnée est prévenu**. |
| **AC.12** | Sa **portée est explicite** : toute la ville, ou seulement une activité, un budget, un rapport. |
| **AC.13** | **Un pair ne s'ouvre jamais lui-même** l'accès à un autre pair. |

> **La même notion sert les mandats et les ouvertures.** Un droit est une
> **habilitation datée** : un mandat annuel finit avec l'année, une ouverture
> finit à la date convenue. Une seule notion, deux usages — et rien ne reste
> ouvert par oubli. Voir [ADR-005](02-ARCHITECTURE.md).

---

## 6. Exigences non fonctionnelles

### NF1 — Performance
Site public : première page utile en moins de 2 s sur un téléphone en 4G,
moins de 150 Ko compressé. Espace de travail : réaction perçue sous 200 ms.
Toute liste de plus de 50 éléments est paginée.

### NF2 — Hors réseau
Le **canevas de l'année** est consultable **sans réseau** après une première
ouverture. La **saisie d'une séance** fonctionne hors réseau et se synchronise
au retour, sans perte ni doublon. Aucune donnée nominative n'est mise en cache.

### NF3 — Mobile d'abord
Conçu à partir du téléphone. Points de rupture 360 / 768 / 1024 / 1440 px.
**Cibles tactiles ≥ 44 × 44 px, mesurées à l'écran.** Aucun débordement
horizontal.

### NF4 — Accessibilité
**WCAG 2.2 niveau AA sur 100 % des écrans.** Contraste calculé sur le fond réel.
Navigation clavier complète. Contrôle automatisé et bloquant en intégration
continue.

### NF5 — Langues
Aucune chaîne visible en dur. FR d'abord ; AR (RTL) et EN ensuite. **Mise en
page logique dès la première ligne** : rétro-adapter le RTL coûte dix fois plus
cher.

### NF6 — Maintenabilité
Aucun fichier au-delà de 400 lignes, aucune fonction au-delà de 50.
Typage strict. Règles métier couvertes par des tests. **Compréhensible par une
personne seule après six mois d'absence.**

### NF7 — Exploitabilité
Déploiement en une commande, **sans coupure de service**. Retour arrière en une
commande. Migrations versionnées et réversibles. **Aucune erreur silencieuse.**

### NF8 — Sauvegarde et reprise
Perte maximale acceptable : 1 heure. Remise en service : 4 heures.
Sauvegardes quotidiennes, **chiffrées, hors du serveur de production**,
avec **restauration de test automatique mensuelle**.

### NF9 — Réversibilité
Le mouvement doit pouvoir partir avec ses données : export complet, formats
ouverts, schéma publié.

### NF10 — Sobriété
Forfaits limités, téléphones anciens. Le poids des pages et le nombre de
requêtes sont des **exigences**, pas des optimisations.

---

## 7. Sécurité et protection des personnes

> Le GBUM est un mouvement chrétien dans un pays à majorité musulmane. La liste
> de ses membres est une donnée dont la divulgation peut porter un préjudice
> personnel et familial réel à des individus identifiables. **Le hub est conçu
> sur cette hypothèse.**

### 7.1 Principes

1. **Minimisation** — on ne collecte que ce qui sert une exigence écrite.
2. **Cloisonnement par niveau** — le modèle du §5, appliqué partout.
3. **Une seule politique d'accès**, testée automatiquement.
4. **Chiffrement** — en transit, au repos, et pour les sauvegardes.
5. **Consentement** explicite, horodaté et **révocable** pour toute personne
   nommée ou photographiée publiquement, avec effet immédiat.
6. **Traçabilité** — toute action sensible est journalisée de façon inaltérable.
7. **Sécurité par défaut, jamais par vigilance.**

### 7.2 Menaces et parades

| Menace | Parade |
|---|---|
| Compromission d'un compte | Double authentification sur les niveaux national, finances et administration ; sessions courtes ; cloisonnement |
| Compromission du serveur | Chiffrement au repos, secrets hors du dépôt et des sauvegardes, moindre privilège |
| Vol d'un téléphone déverrouillé | Aucune donnée nominative en cache hors ligne |
| Réquisition ou saisie | Minimisation, durées de conservation courtes, effacement effectif |
| Défiguration du site public | Site public séparé, servi en lecture seule |
| Fuite de données issues des JTPA | *Parade à définir avec la réserve R4* — le principe tient : ce qui touche des personnes approchées ne sort ni en export, ni en recherche, ni en sauvegarde claire |

### 7.3 Conformité

**Loi marocaine 09-08 (CNDP)** et **RGPD** — ce dernier dès que des personnes
concernées sont dans l'Union (Amis expatriés, partenaires IFES). Dans les deux
cadres, **les convictions religieuses sont une donnée sensible**.

Livrables : registre des traitements · politique de confidentialité publiée ·
durées de conservation et purge · procédure d'exercice des droits · analyse
d'impact · procédure de notification de violation · consentements horodatés.

---

## 8. Contraintes

- **Un développeur bénévole à temps partiel**, plus un administrateur ; l'équipe
  technique est appelée à s'étendre.
- **Le mouvement se renouvelle chaque année** — tous les mandats sont annuels.
- **Budget d'infrastructure faible et prévisible.**
- **Service continu** : `gbu-maroc.org` est en production, la bascule doit être
  transparente.
- **Utilisateurs** : téléphones d'entrée de gamme, 3G/4G instable, forfaits
  limités, compétence numérique variable. **WhatsApp est le canal réel du
  mouvement** — le hub s'y raccorde, il ne le remplace pas.

> **Conséquence, et elle prime sur l'élégance :** toute décision qui augmente le
> nombre de choses à connaître pour maintenir le système est mauvaise, même si
> elle est techniquement supérieure.

---

## 9. Reprise de l'existant

### 9.1 Ce qui est repris — conceptuellement

Le modèle personne / structure / rattachement, avec le rôle déduit du
rattachement. Le rapport mensuel en cinq champs, et la règle « le silence d'une
cellule est une information ». La distinction soutien / versement / budget. Le
domaine « camp » dans son entier. « Voir à la place de » avec bandeau et trace.
Le traitement du fuseau horaire marocain. Et la recette d'accessibilité mesurée
dans le navigateur.

### 9.2 Ce qui est abandonné

Les données réparties hors d'une base unique. Le moteur de visioconférence
maison. L'état des réunions gardé en mémoire du serveur. Les évolutions de
schéma non versionnées. Le déploiement qui ne passe pas par le dépôt.

### 9.3 Migration

Geler l'existant · extraire · **réconcilier avec un rapport d'anomalies relu
par le Secrétariat National** · charger avec contrôles bloquants · **répéter à
blanc trois fois** · basculer avec retour arrière préparé · conserver l'ancien
système en lecture seule 90 jours.

> **Aucune donnée perdue, aucune inventée.** Toute donnée non réconciliable est
> signalée, jamais devinée.

---

## 10. Décisions

| # | Décision | État |
|---|---|---|
| **D1** | Un site ou plusieurs ? | ✅ **Deux surfaces, une seule base** — [ADR-001](02-ARCHITECTURE.md) |
| **D2** | Pile technique | ✅ TypeScript de bout en bout — [ADR-002](02-ARCHITECTURE.md) |
| **D3** | Dépôt | ✅ `gbum-hub` — [ADR-009](02-ARCHITECTURE.md) |
| **D9** | Monolithe ou microservices ? | ✅ Monolithe modulaire — [ADR-010](02-ARCHITECTURE.md) |
| **D10** | Visibilité publique | ✅ Ouverte, **jusqu'à la ville** — [ADR-011](02-ARCHITECTURE.md) · *réserve R1* |
| **D11** | Accès entre pairs | ✅ **Cloisonné, avec ouverture temporaire datée** — [ADR-005](02-ARCHITECTURE.md) |
| **D12** | Archive publique des canevas | ✅ **Ouverte à tous** |
| **D4** | Périmètre de la v1 | ⬜ Point 2.5 |
| **D8** | Le JTPA dans le hub ? | ⬜ Point 2.6 · *réserve R4* |
| **D5** | Stratégie de bascule | ⬜ Point 3.7 |
| **D6** | Langues de la v1 | ⬜ Point 3.3 |
| **D7** | Hébergement | ⬜ Point 5.4 |

*Document vivant. Toute modification passe par une pull request et est datée.*
