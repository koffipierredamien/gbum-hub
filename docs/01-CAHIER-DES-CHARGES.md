# Cahier des charges — Hub officiel du GBUM

| | |
|---|---|
| **Projet** | Hub officiel du GBUM — *Groupe Biblique Universitaire au Maroc* |
| **Version** | 1.0 — proposition soumise à validation |
| **Date** | 7 septembre 2026 |
| **Maîtrise d'ouvrage** | Secrétariat National du GBUM |
| **Maîtrise d'œuvre** | Pierre Damien Koffi Koumassi (développeur logiciel) |
| **Existant** | `gbu-connect` — en production sur `gbu-maroc.org` (voir [audit](00-AUDIT-EXISTANT.md)) |
| **Statut** | 🟡 En attente d'arbitrage sur les points marqués **⚖️ À TRANCHER** |

---

## Sommaire

1. [Contexte et enjeux](#1-contexte-et-enjeux)
2. [Objectifs](#2-objectifs)
3. [Parties prenantes et personas](#3-parties-prenantes-et-personas)
4. [Périmètre](#4-périmètre)
5. [Exigences fonctionnelles](#5-exigences-fonctionnelles)
6. [Exigences non fonctionnelles](#6-exigences-non-fonctionnelles)
7. [Sécurité et protection des personnes](#7-sécurité-et-protection-des-personnes)
8. [Contraintes](#8-contraintes)
9. [Reprise de l'existant](#9-reprise-de-lexistant)
10. [Critères d'acceptation](#10-critères-dacceptation)
11. [Gouvernance du projet](#11-gouvernance-du-projet)
12. [Décisions à arbitrer](#12-décisions-à-arbitrer)

---

## 1. Contexte et enjeux

### 1.1 Le mouvement

Le GBUM rassemble des étudiants qui veulent vivre et approfondir leur foi
chrétienne pendant leurs années d'études, dans les principales villes
universitaires du Maroc. Il est membre de l'**IFES**.

- **Devise** : « Connaître Christ et Le faire connaître. »
- **Vision décennale** (née à Ifrane, 2023) : **« Éclaireurs des campus pour Christ. »**
- **Thème annuel** : chaque année, un thème porte la vision.
- **Activité première** : l'**étude biblique hebdomadaire en cellule**, suivant
  un **canevas édité chaque année**.
- **Autres activités** : sorties, agapè, sorties d'évangélisation,
  évangélisation par amitié (**JTPA**), camp des responsables, camp des
  témoins, **camp d'Ifrane**.
- **Organisation** : Secrétariat National → Conseil Exécutif → conseillers de
  ville → responsables de ville / bureaux → responsables de cellule →
  GBUssiens. En marge : les **Amis du GBU** (anciens diplômés, soutien
  financier et spirituel).

### 1.2 Le problème

Le mouvement dispose d'un outil (`gbu-connect`) qui rend déjà de vrais
services, mais :

- il **ne porte pas la mission** — le canevas d'études bibliques, cœur de la
  vie hebdomadaire, n'y existe pas ;
- son **architecture ne tient plus** — persistance éclatée sur 18 fichiers JSON
  et une base SQLite, mono-processus obligatoire, aucune traçabilité de
  déploiement (voir [audit §4](00-AUDIT-EXISTANT.md#4-les-défauts-structurels--par-gravité)) ;
- son **interface et son expérience** n'atteignent pas le niveau attendu d'un
  hub officiel en 2026.

### 1.3 L'enjeu réel

Un mouvement étudiant se **renouvelle intégralement tous les 4 à 5 ans**. Le
hub n'est donc pas seulement un outil de gestion : c'est **le support de la
transmission**. Ce qu'il ne sait pas retenir — la mémoire, les parcours, les
canevas passés, les leçons d'un camp — le mouvement le réapprendra à chaque
génération.

> **Principe directeur du projet :**
> *Le hub sert la mission — connaître Christ et Le faire connaître — avant de
> servir l'administration du mouvement.*
> Toute fonctionnalité qui ne se rattache pas à cette phrase est reportée.

---

## 2. Objectifs

### 2.1 Objectifs métier

| # | Objectif | Indicateur de réussite |
|---|---|---|
| **O1** | Faire vivre le canevas d'études bibliques dans l'outil | ≥ 80 % des cellules actives déclarent leur avancement chaque mois |
| **O2** | Donner au national une vision réelle et à jour du terrain | Taux de rapports mensuels rendus > 75 % ; délai national → décision < 7 j |
| **O3** | Accueillir les nouveaux à chaque rentrée | ≥ 90 % des demandes publiques mises en relation sous 72 h |
| **O4** | Rendre visible et crédible le GBUM auprès du public | Vitrine publique indexée, 1ʳᵉ page sur « GBU Maroc » ; ≥ 3× le trafic actuel |
| **O5** | Soutenir le réseau des Amis du GBU | Promesses tenues suivies à 100 % ; relance automatisée |
| **O6** | Conserver la mémoire du mouvement | 100 % des canevas, camps et bureaux archivés et retrouvables |
| **O7** | Réunir le mouvement à distance de façon fiable | Réunion nationale ≥ 150 participants sans incident |

### 2.2 Objectifs techniques

| # | Objectif | Critère mesurable |
|---|---|---|
| **T1** | Une source de vérité unique et transactionnelle | 0 fichier JSON de persistance ; 100 % des écritures transactionnelles |
| **T2** | Déploiement traçable et sans coupure | Chaque mise en production correspond à un commit ; interruption = 0 s |
| **T3** | Maintenable par une seule personne | Aucun fichier > 400 lignes ; couverture des règles métier ≥ 80 % |
| **T4** | Sécurité et confidentialité démontrables | 0 finding critique à l'audit ; politique d'accès centralisée et testée |
| **T5** | Excellence de l'interface | WCAG 2.2 AA sur 100 % des écrans ; Lighthouse ≥ 95 sur la vitrine |
| **T6** | Réversibilité | Export complet des données du mouvement en un clic, format ouvert |

### 2.3 Non-objectifs (v1)

Explicitement **hors** de la première version, pour protéger le calendrier :

- Application mobile native (iOS/Android) — la PWA couvre le besoin ;
- Réseau social interne (fil, murs, réactions) ;
- Comptabilité générale certifiée (le hub fait du suivi budgétaire, pas de la
  compta) ;
- Plateforme d'apprentissage complète (LMS) ;
- Billetterie et paiement en ligne.

---

## 3. Parties prenantes et personas

### 3.1 Cartographie

| Acteur | Effectif ordre de grandeur | Rôle vis-à-vis du hub |
|---|---|---|
| GBUssien (étudiant membre) | quelques centaines | Utilisateur principal |
| Responsable de cellule | quelques dizaines | Anime, rapporte |
| Bureau de ville / responsable de ville | ~7–12 villes | Coordonne |
| Conseiller de ville | 1 par ville | Accompagne, non étudiant |
| Secrétariat National (permanents) | ~6 | Pilote, administre |
| Conseil Exécutif | ~10 | Décide, valide les budgets |
| Amis du GBU | dizaines à centaines | Soutiennent |
| Public (étudiants, parents, églises, IFES) | ouvert | Découvre |
| Administrateur technique | 1–2 | Exploite |

### 3.2 Personas

> **Amina, 19 ans — nouvelle étudiante à Fès.**
> Elle arrive d'une autre ville, ne connaît personne. Une amie lui parle du
> GBU. Elle cherche sur son téléphone, en 4G, sur un forfait limité.
> **Attend du hub** : trouver en moins de deux minutes s'il existe un groupe
> sur *son* campus, quand il se réunit, et à qui écrire — sans créer de compte,
> et sans que son nom apparaisse publiquement.
> *Exigences induites : F1.2, F1.3, NF1 (performance mobile), NF6 (confidentialité).*

> **Yann, 22 ans — responsable de la cellule de Rabat-Agdal.**
> Il anime l'étude biblique du jeudi. Il prépare son étude le mercredi soir,
> parfois dans le train. Il remplit le rapport mensuel depuis son téléphone,
> le soir, fatigué.
> **Attend du hub** : le canevas de la semaine, consultable **hors ligne** ;
> des notes de préparation ; un rapport qui se remplit en moins de trois
> minutes ; savoir qui manque à l'appel depuis trois semaines.
> *Exigences induites : F3.1–F3.5, F4.1, NF2 (hors ligne), NF3 (mobile-first).*

> **Sarah, 27 ans — Secrétaire nationale.**
> Elle doit savoir, un lundi matin, quelles cellules vivent et lesquelles
> s'éteignent, où en est le budget, et qui pourra reprendre Marrakech en
> septembre.
> **Attend du hub** : un tableau de bord qui montre **les silences** autant que
> les activités ; le suivi du canevas par ville ; la relève identifiée.
> *Exigences induites : F4.2–F4.5, F11.3, F9.4.*

> **Esaïe — administrateur, non développeur.**
> Il déploie, restaure, surveille. Il ne doit jamais avoir à lire du code pour
> exploiter le service.
> **Attend du hub** : une page de santé, des sauvegardes vérifiées
> automatiquement, un déploiement en une commande, une restauration
> documentée et **répétée**.
> *Exigences induites : NF8, NF9, NF10.*

> **Jean-Marc, 34 ans — Ami du GBU, ingénieur à Casablanca.**
> Ancien GBUssien. Il donne chaque trimestre et prie pour le mouvement.
> **Attend du hub** : recevoir la lettre de prière, voir où va son don, tenir
> sa promesse sans qu'on ait à le relancer trois fois, retrouver ses amis de
> promotion.
> *Exigences induites : F10.1–F10.4, F8.3.*

---

## 4. Périmètre

### 4.1 Réponse à la question « un site ou plusieurs ? »

**Un seul produit, un seul dépôt, deux surfaces web distinctes.**

Ce n'est ni « plusieurs sites séparés » ni « un seul site où tout se joue aux
droits d'accès ». C'est la synthèse des deux, et voici pourquoi.

**Pourquoi pas plusieurs sites indépendants :**
Les données sont **les mêmes**. Une personne, une ville, une cellule, un camp,
un budget : trois sites, c'est trois référentiels qui divergent en six mois.
C'est aussi trois déploiements, trois chaînes de qualité, trois chartes
graphiques à tenir — pour **une seule personne**. Le coût est multiplié, la
cohérence est perdue.

**Pourquoi pas un site unique monolithique :**
La vitrine publique et l'espace membre n'ont **rien en commun** sur le plan
technique :

| | Vitrine publique | Espace membre |
|---|---|---|
| Public | Anonyme, inconnu | Authentifié, connu |
| Enjeu | SEO, vitesse, crédibilité | Densité, productivité, exactitude |
| Contenu | Éditorial, lent à changer | Données, changent en permanence |
| Rendu | Statique / pré-généré | Dynamique, personnalisé |
| Menace | Défiguration, désinformation | Fuite de données personnelles |

Les mêler, c'est charger un tableau de bord de 200 Ko pour afficher une page
« Nous trouver », et ouvrir la surface d'attaque de l'espace membre au trafic
anonyme.

**La cible :**

```
                    ┌──────────────────────────────────────┐
   Public anonyme → │  gbu-maroc.org        (vitrine)      │  statique/SSR, SEO, rapide
                    └───────────────┬──────────────────────┘
                                    │ lecture seule, données publiques
                    ┌───────────────▼──────────────────────┐
   Membres        → │  hub.gbu-maroc.org    (espace membre)│  authentifié, riche
                    └───────────────┬──────────────────────┘
                                    │
                    ┌───────────────▼──────────────────────┐
                    │  API + domaine métier  (source unique)│  une base, une politique d'accès
                    └───────────────┬──────────────────────┘
                                    │
                    ┌───────────────▼──────────────────────┐
                    │  Temps réel (LiveKit) · Tâches de fond│  mise à l'échelle indépendante
                    └──────────────────────────────────────┘
```

- **Un dépôt unique (monorepo)** : une seule chaîne de qualité, un seul design
  system, des types partagés de bout en bout, un seul endroit où lire les
  règles métier.
- **Deux surfaces déployables** : chacune optimisée pour son public.
- **Une source de vérité** : le domaine métier et la base, jamais dupliqués.

> **⚖️ À TRANCHER — D1, point 2.1 de l'échéancier.** Cette organisation
> n'est **pas** validée. Ce qui précède est une recommandation argumentée.
> *Recommandation : oui.* Détail et justification technique complète dans
> [`02-ARCHITECTURE.md`](02-ARCHITECTURE.md).

### 4.2 Domaines fonctionnels

| # | Domaine | Surface | Priorité |
|---|---|---|---|
| **D1** | Vitrine publique & accueil de rentrée | Publique | 🔴 v1 |
| **D2** | Identité, organisation & annuaire | Membre | 🔴 v1 |
| **D3** | **Canevas d'études bibliques & vie de la cellule** | Membre + hors ligne | 🔴 v1 |
| **D4** | Vision, plan d'action & rapports de terrain | Membre | 🔴 v1 |
| **D5** | Activités, événements & évangélisation (JTPA) | Membre | 🟠 v1.1 |
| **D6** | Camps & conventions | Membre | 🟠 v1.1 |
| **D7** | Réunions & visioconférence | Membre | 🟠 v1.1 |
| **D8** | Communication & diffusion | Membre + publique | 🟠 v1.1 |
| **D9** | Finances & ressources | Membre restreint | 🟡 v1.2 |
| **D10** | Amis du GBU, finissants & réseau | Membre + espace Amis | 🟡 v1.2 |
| **D11** | Formation, parcours & relève | Membre | 🟡 v1.2 |
| **D12** | Mémoire & archives | Membre + publique | 🟢 v2 |
| **DT** | Transverse : administration, sécurité, santé, recherche, notifications | Toutes | 🔴 v1 |

---

## 5. Exigences fonctionnelles

> **Convention de lecture.** Chaque exigence porte un identifiant `F<domaine>.<n>`,
> une priorité **MoSCoW** (`M` = indispensable, `S` = important, `C` = souhaitable,
> `W` = plus tard) et, quand elle existe déjà, un renvoi au module de l'existant
> à reprendre.

---

### D1 — Vitrine publique & accueil de rentrée

| ID | Exigence | P | Existant |
|---|---|---|---|
| **F1.1** | Présenter le GBUM : vision décennale, devise, thème de l'année, convictions, histoire, appartenance à l'IFES. Contenu **éditable par le Secrétariat National sans intervention technique**. | M | `public.py` (textes en dur) |
| **F1.2** | « Nous trouver » : carte et liste des villes et campus où le GBUM est présent, avec jour, heure et lieu de la cellule **lorsque la structure est marquée publique**. Aucune coordonnée personnelle. | M | `public_villes.html` |
| **F1.3** | **Parcours d'accueil** (rentrée) : formulaire « Je cherche un groupe » → ville/campus → mise en relation avec le responsable → **accusé de réception immédiat** → relance automatique si non traité sous 72 h → suivi jusqu'à la première présence. | M | ❌ **absent** |
| **F1.4** | Agenda public des événements ouverts (camps, conventions, soirées). | M | `public_agenda.html` |
| **F1.5** | « Soutenir » : présentation des besoins, moyens de don, formulaire de promesse. | S | `public_soutenir.html` |
| **F1.6** | Galerie publique modérée : albums publiés explicitement, **aucun visage sans consentement**. | S | `public_photos.html` |
| **F1.7** | Contact : formulaire par sujet, sans exposer d'adresse. | M | `public_contact.html` |
| **F1.8** | Blog / actualités : nouvelles du mouvement, témoignages, comptes rendus de camp. | S | ❌ absent |
| **F1.9** | SEO complet : métadonnées, Open Graph, données structurées `Organization`/`Event`, `sitemap.xml`, `robots.txt`, URL canoniques, rendu **serveur ou statique**. | M | ❌ absent |
| **F1.10** | Multilingue **FR / AR / EN**, avec **support RTL complet** pour l'arabe. | S | ❌ absent |

---

### D2 — Identité, organisation & annuaire

| ID | Exigence | P | Existant |
|---|---|---|---|
| **F2.1** | Modéliser l'organisation en arbre : Mouvement → Conseil Exécutif / Secrétariat National / Corps des Amis → Ville → Cellule. Profondeur non figée. | M | ✅ `socle.py` — **à reprendre** |
| **F2.2** | Fiche personne : identité, contact, genre, statut, campus, filière, promotion, photo, **contact durable** (qui survit à la fin des études). | M | ✅ `socle.py` |
| **F2.3** | **Rattachement** = personne × structure × rôle × niveau × période (début/fin). Le rôle applicatif se **déduit** des rattachements, jamais saisi deux fois. | M | ✅ `socle.py` + `auth.py` |
| **F2.4** | Rôles nommés du mouvement : GBUssien, responsable de cellule, membre de bureau, responsable de ville, **conseiller de ville**, membre du CE, permanent du SN, Ami, ami référent. | M | Partiel — `conseiller` absent |
| **F2.5** | Annuaire filtrable (ville, campus, cellule, statut, promotion), paginé, avec recherche. Visibilité des coordonnées **soumise à la politique d'accès**. | M | `annuaire.html` |
| **F2.6** | Organigramme visuel navigable du mouvement. | S | `organisation.html` |
| **F2.7** | Cycle de vie : arrivée, changement de ville, **passage responsable**, départ, devenir Ami — chaque transition datée et conservée. | M | Partiel |
| **F2.8** | Cycle de compte : invitation → activation → actif → suspendu → clos, avec lien d'activation à usage unique et durée de vie limitée. | M | ✅ `comptes.py` |
| **F2.9** | Authentification : mot de passe fort **ou** lien magique par courriel ; **2FA obligatoire** pour les rôles national, finances et administration. | M | Partiel (mot de passe seul) |
| **F2.10** | **Voir à la place de** (usurpation d'identité assistée) : réservé à l'administration, bandeau permanent, journalisée, durée limitée. | S | ✅ `emprunt.py` — **excellent, à reprendre** |

---

### D3 — 🔴 Canevas d'études bibliques & vie de la cellule

> **Domaine nouveau et prioritaire.** C'est la raison d'être du hub.
> Aucune brique n'existe dans l'application actuelle (voir [audit §6.1](00-AUDIT-EXISTANT.md#61--le-canevas-détudes-bibliques--absent)).

| ID | Exigence | P |
|---|---|---|
| **F3.1** | **Canevas annuel** : entité de premier rang, rattachée à une année académique et au thème de l'année. Attributs : titre, année, auteurs, introduction, mode d'emploi, statut (brouillon / publié / archivé). | M |
| **F3.2** | **Étude** : le canevas contient une suite ordonnée d'études. Chaque étude porte : numéro, titre, référence(s) biblique(s), texte d'introduction, **questions d'observation / interprétation / application**, notes pour l'animateur, ressources jointes, durée indicative. | M |
| **F3.3** | **Consultation hors ligne** : le canevas de l'année est consultable **sans réseau**, sur téléphone, une fois ouvert au moins une fois. Contrainte non négociable — les cellules se réunissent sur des campus où le réseau est mauvais. | M |
| **F3.4** | **Progression par cellule** : chaque cellule marque l'étude traitée, à quelle date, avec le nombre de présents. L'outil affiche « où en est ma cellule », « où en sont les autres cellules de ma ville ». | M |
| **F3.5** | **Préparation de l'animateur** : notes privées par étude, réponses préparées, questions ajoutées localement. Privé par défaut, partageable au bureau de la ville. | M |
| **F3.6** | **Retour du terrain** : après une étude, l'animateur peut signaler en un geste — « bien passé » / « questions difficiles » / « manque de contexte ». Ces retours alimentent la rédaction du canevas suivant. | S |
| **F3.7** | **Séance de cellule** : date, lieu, présents (émargement rapide), étude traitée, sujets de prière, décisions. Saisissable en < 3 minutes sur téléphone. | M |
| **F3.8** | **Présence et attention** : voir qui n'est pas venu depuis N séances, pour aller le chercher — **pas pour le noter**. Le libellé et l'ergonomie doivent porter cette intention. | M |
| **F3.9** | **Bibliothèque des canevas** : tous les canevas des années passées, consultables et recherchables par passage biblique et par thème. | S |
| **F3.10** | **Rédaction du canevas** dans le hub : les auteurs écrivent, relisent, valident, publient — avec relecture par le Secrétariat National avant publication. | C |
| **F3.11** | Export du canevas en **PDF imprimable** (une cellule sans smartphone doit pouvoir travailler sur papier). | M |
| **F3.12** | Canevas de **prière** : même modèle, sujets de prière du mouvement par période. | S |

---

### D4 — Vision, plan d'action & rapports de terrain

| ID | Exigence | P | Existant |
|---|---|---|---|
| **F4.1** | **Rapport mensuel de cellule** : cinq champs maximum (présents, rencontres, où en est l'étude, sujets de prière, difficultés, appui souhaité). Un rapport par structure et par mois ; le remplir deux fois corrige le premier. | M | ✅ `rapports.py` — **modèle excellent, à reprendre** |
| **F4.2** | **Le silence est une information** : les écrans de pilotage montrent les cellules qui n'ont pas rendu **au même rang** que celles qui ont rendu. | M | ✅ `rapports.py` |
| **F4.3** | **Chaîne de sens** : `Vision décennale (2023-2033) → Thème annuel → Objectif (par structure) → Activité → Résultat`. Tout objectif se rattache au thème ; tout GBUssien voit à quoi son action se rattache. | M | Partiel — vision absente |
| **F4.4** | Plan d'action **décentralisé** : chaque ville, cellule et instance porte ses propres objectifs, agrégés au national. | M | ✅ `plan.py` |
| **F4.5** | **Tableau de bord** par niveau (cellule / ville / national) : vivacité des cellules, avancement du canevas, effectifs, rapports rendus, budget consommé, alertes. | M | `tableau_bord.py` |
| **F4.6** | Gouvernance : décisions du Conseil Exécutif, actions assignées, échéances, relances, « mes actions ». | S | ✅ `gouvernance.py` |
| **F4.7** | Comptes rendus de réunions d'instance : ordre du jour, présents, décisions, actions — liés aux décisions ci-dessus. | S | ✅ `cr.py` |

---

### D5 — Activités, événements & évangélisation

| ID | Exigence | P | Existant |
|---|---|---|---|
| **F5.1** | Activité typée du mouvement : étude, **agapè**, sortie, **sortie d'évangélisation**, soirée, formation, retraite, convention, rentrée. | M | Partiel (générique) |
| **F5.2** | Cycle : proposition → budget → validation → publication → inscriptions → tenue → bilan. | M | ✅ `activites.py` |
| **F5.3** | Inscriptions et désinscriptions, avec limite de places et liste d'attente. | M | ✅ |
| **F5.4** | Budget par activité, rattaché au budget de la structure. | S | ✅ `ressources.py` |
| **F5.5** | Bilan d'activité : présents, ce qui a marché, ce qu'on refera. Alimente la mémoire (D12). | S | Partiel |
| **F5.6** | **JTPA — évangélisation par amitié** : suivi relationnel discret. Qui accompagne qui, depuis quand, sujets de prière, prochaine étape. **Visible du seul accompagnant** et, s'il le choisit, de son responsable. Jamais dans l'annuaire, jamais dans un export, jamais dans la recherche globale. | M | ❌ **absent** |
| **F5.7** | Sorties d'évangélisation : préparation, équipe, campus visé, bilan, contacts noués (versés au JTPA avec consentement). | S | ❌ absent |
| **F5.8** | Calendrier unifié du mouvement, filtrable par structure, exportable en **iCal**. | M | ✅ `agenda.py` |

---

### D6 — Camps & conventions

| ID | Exigence | P | Existant |
|---|---|---|---|
| **F6.1** | Dossier de camp typé : **camp d'Ifrane**, camp des responsables, camp des témoins, convention, retraite. | M | ✅ `camp.py` — **1 775 lignes de métier réel** |
| **F6.2** | Cycle de vie : préparation → inscriptions → tenue → clôture → archive. | M | ✅ |
| **F6.3** | Participants : inscription, statut, arrivée, régime alimentaire, santé, contact d'urgence. | M | ✅ |
| **F6.4** | Chambres : affectation, contraintes (genre, ville, âge), plan d'occupation. | M | ✅ |
| **F6.5** | Transport : trajets, points de ramassage, affectation, coût. | M | ✅ |
| **F6.6** | Finances de camp : recettes (participations), dépenses, encaissements, solde ; **rattachement au budget du mouvement à la clôture**. | M | ✅ |
| **F6.7** | Boutique : produits, précommandes, ventes. | S | ✅ |
| **F6.8** | Attestations de participation, générées et téléchargeables. | S | ✅ |
| **F6.9** | Équipe du camp : rôles, feuille de route, briefing. | S | ✅ |
| **F6.10** | Programme du camp publié aux participants (planning, orateurs, ateliers). | S | ❌ absent |
| **F6.11** | Bilan de camp versé à la mémoire du mouvement (D12). | S | ❌ absent |

---

### D7 — Réunions & visioconférence

| ID | Exigence | P | Existant |
|---|---|---|---|
| **F7.1** | **Un seul moteur** de visioconférence (SFU), avec **chiffrement de bout en bout activable** par salle. Suppression de la double implémentation mesh/SFU. | M | 2 moteurs, 4 736 l. de JS |
| **F7.2** | Créer une réunion : titre, horaire, structure, mode d'accès (membres / lien ouvert / validation à la porte). | M | ✅ `salles.py` |
| **F7.3** | Salle d'attente et validation des entrants un par un. | M | ✅ `attente_gs.py` |
| **F7.4** | Modération : couper le micro, retirer, promouvoir co-hôte, verrouiller. | M | ✅ |
| **F7.5** | Sous-groupes (*breakout rooms*). | S | ✅ |
| **F7.6** | Partage d'écran, chat, main levée, questions/réponses. | M | ✅ |
| **F7.7** | Enregistrement **serveur**, avec consentement annoncé à tous les participants. | S | ✅ `sfu.py`, Egress |
| **F7.8** | Transcription et **compte rendu assisté** : synthèse, décisions, actions assignées. | S | ✅ `audio.py`, `cr.py` |
| **F7.9** | Export du compte rendu en PDF / Word / PowerPoint. | C | ✅ `cr_export.py` |
| **F7.10** | Rappels avant réunion (WhatsApp / notification). | S | ✅ `rappels_reunions.py` |
| **F7.11** | Tenir **≥ 200 participants** sur une réunion nationale. | M | Non prouvé |
| **F7.12** | **Un redémarrage du serveur applicatif ne coupe pas les réunions en cours.** | M | ❌ impossible aujourd'hui |

---

### D8 — Communication & diffusion

| ID | Exigence | P | Existant |
|---|---|---|---|
| **F8.1** | Annonces ciblées par structure, avec accusé de lecture. | M | ✅ `contenu.py` |
| **F8.2** | **Envois ciblés** : constituer une audience (structure, rôle, ville, promotion), rédiger, prévisualiser, envoyer, suivre. | M | ✅ `envois.py` |
| **F8.3** | **Lettre de prière** : rédaction, validation, diffusion aux Amis et aux membres, archive. | M | ✅ `priere.py` |
| **F8.4** | Canaux : notification dans le hub, **courriel**, **WhatsApp**, notification web *push*. Le canal WhatsApp reste isolé derrière une interface unique. | M | WhatsApp seul |
| **F8.5** | **Préférences de contact par personne**, respectées par tous les envois (canal, fréquence, désabonnement). | M | Partiel |
| **F8.6** | Événement en direct : diffusion, chat, questions, votes. | S | ✅ `lives.py` |
| **F8.7** | Galerie interne : albums par événement, modération, consentement à l'image. | S | ✅ `galerie.py` |
| **F8.8** | Bibliothèque de documents : dépôt, catégories, droits de lecture, versions. | M | ✅ `ressources.py` |

---

### D9 — Finances & ressources

| ID | Exigence | P | Existant |
|---|---|---|---|
| **F9.1** | Distinguer **soutien** (personne/structure qui donne), **versement** (fait daté, s'annule, ne se corrige pas) et **budget** (prévision comparée au réel). | M | ✅ `ressources.py` — **modèle excellent** |
| **F9.2** | Budget **par structure et par niveau** : chaque cellule, ville et instance porte le sien. Chiffrage au forfait **ou** au détail (les lignes remplacent alors le forfait). | M | ✅ |
| **F9.3** | Cycle de validation : brouillon → soumis → en revue → validé → clos. Un budget validé ne bouge plus. | M | ✅ |
| **F9.4** | Trésorerie : entrées, sorties, justificatifs, solde par structure. | M | ✅ |
| **F9.5** | **Engagements et promesses** : promesse d'un Ami, échéancier, rappel automatique, taux de tenue. | M | ✅ `promesses.py`, `engagements.py` |
| **F9.6** | Restitution : rapport financier par période, exportable, présentable au Conseil Exécutif. | S | Partiel |
| **F9.7** | **Journal d'audit inaltérable** sur toute écriture financière (qui, quoi, quand, ancienne valeur). | M | ❌ **absent** |
| **F9.8** | Multidevise d'affichage (MAD principal ; EUR/USD pour les partenaires). | C | ❌ absent |

---

### D10 — Amis du GBU, finissants & réseau

| ID | Exigence | P | Existant |
|---|---|---|---|
| **F10.1** | Les Amis sont un **corps du mouvement** dans l'organigramme, pas une étiquette. | M | ✅ `socle.structure_amis()` |
| **F10.2** | **Passage finissant → Ami** : détection de la promotion sortante, recueil du **consentement explicite**, du contact durable, puis transfert. | M | ✅ `finissants.py`, `consentement.py` |
| **F10.3** | Fiche Ami : promotion, filière, secteur professionnel, ville actuelle (y compris hors Maroc), disponibilité (prière / don / mentorat / accueil). | M | ✅ `amis.py` |
| **F10.4** | **Place des Amis** : espace d'échange réservé au corps des Amis. | S | ✅ `place.py` |
| **F10.5** | Cartographie du réseau : où sont les Amis, dans quels secteurs — pour savoir où le réseau est fort et où il manque. | S | Partiel |
| **F10.6** | Mise en relation Ami ↔ étudiant (mentorat, stage, accueil dans une ville), **à l'initiative de l'étudiant**, jamais imposée. | C | ❌ absent |

---

### D11 — Formation, parcours & relève

| ID | Exigence | P | Existant |
|---|---|---|---|
| **F11.1** | **Parcours du GBUssien** : historique complet des rattachements, rôles, formations, camps — la trajectoire, pas seulement l'état actuel. | M | Partiel `parcours.py` |
| **F11.2** | Jalons de formation : camp des responsables, camp des témoins, formations de ville — suivis et attestés. | S | ❌ absent |
| **F11.3** | **Relève** : identifier et suivre les personnes pressenties pour reprendre une responsabilité. Confidentiel, réservé au bureau concerné et au national. | S | ❌ absent |
| **F11.4** | **Kit du responsable** : ce qu'on attend de lui, sa feuille de route, ses échéances. | S | ✅ `kit_bureau.py` |
| **F11.5** | Accompagnement : qui accompagne qui, rythme, points d'attention. Confidentiel. | S | Partiel |
| **F11.6** | **Passation** : à la fin d'un mandat, transfert guidé (documents, accès, contacts, état des lieux) au successeur. | S | ❌ absent |

---

### D12 — Mémoire & archives

| ID | Exigence | P |
|---|---|---|
| **F12.1** | **Chronologie du mouvement** : création du GBUM, jalons, camps, tournants — publique et interne. | S |
| **F12.2** | Archives : canevas passés, bureaux successifs, camps, lettres de prière, comptes rendus — recherchables. | S |
| **F12.3** | Témoignages : recueil, validation, publication (avec consentement). | C |
| **F12.4** | Photothèque historique indexée par année, ville, événement. | C |
| **F12.5** | « Il y a un an » : rappel contextuel dans le hub. | W |

---

### DT — Transverse

| ID | Exigence | P | Existant |
|---|---|---|---|
| **FT.1** | **Politique d'accès centralisée** : une seule définition, testée, de « qui peut faire quoi sur quelle ressource ». Aucune règle d'autorisation dans un écran. | M | ❌ dispersée |
| **FT.2** | Recherche globale : personnes, structures, documents, canevas, camps — **filtrée par les droits du demandeur**. | M | ✅ `recherche.py` |
| **FT.3** | **Journal d'audit** de toute action sensible (finances, données personnelles, droits, suppressions, « voir à la place de »). | M | Partiel |
| **FT.4** | Page de **santé du service** lisible par un non-technicien. | M | ✅ `sante.py` |
| **FT.5** | Journal des incidents et alerte automatique. | S | ✅ `incidents.py` |
| **FT.6** | Notifications : centre de notifications, préférences, ne jamais notifier deux fois la même chose. | M | Partiel |
| **FT.7** | **Import / export complet** des données du mouvement, format ouvert et documenté. | M | ❌ absent |
| **FT.8** | Administration : gestion des comptes, des droits, des contenus éditoriaux — sans intervention technique. | M | Partiel |

---

## 6. Exigences non fonctionnelles

### NF1 — Performance

| Critère | Cible |
|---|---|
| Vitrine publique — LCP (4G, mobile milieu de gamme) | **< 2,0 s** |
| Espace membre — interaction perçue | **< 200 ms** |
| API — p95 en lecture | **< 300 ms** |
| Poids initial d'une page vitrine | **< 150 Ko** compressé |
| Score Lighthouse vitrine (perf / a11y / SEO) | **≥ 95** |
| Pagination | Toute liste pouvant dépasser 50 éléments est paginée |

### NF2 — Disponibilité hors ligne

- Le **canevas de l'année en cours est intégralement disponible hors ligne**
  après une première consultation (F3.3).
- La saisie d'une séance de cellule fonctionne hors ligne et se synchronise au
  retour du réseau, sans perte et sans doublon.
- La PWA est installable et démarre hors ligne sur un écran utile.

### NF3 — Mobile-first et responsive

- Conception **à partir du téléphone**, pas adaptée après coup.
- Points de rupture : 360 / 768 / 1024 / 1440 px, testés à chacun.
- **Cibles tactiles ≥ 44 × 44 px, mesurées à l'écran** (l'audit de l'existant a
  montré 41 px réels pour 44 px déclarés).
- Aucun débordement horizontal, à aucune largeur.

### NF4 — Accessibilité

- **WCAG 2.2 niveau AA sur 100 % des écrans**, sans exception.
- Contraste ≥ 4,5:1 (≥ 3:1 pour le grand texte), **calculé sur le fond composé
  réel**, y compris les fonds translucides.
- Navigation clavier complète, focus visible, ordre de tabulation cohérent.
- Nom accessible non vide pour toute commande ; `alt` sur toute image.
- Respect de `prefers-reduced-motion`.
- **La recette navigateur de l'existant (`audit-ui.js`) est reprise et
  automatisée en intégration continue** — c'est le meilleur actif qualité du
  projet actuel.

### NF5 — Internationalisation

- Aucune chaîne visible en dur dans le code.
- Langues v1 : **français** (référence), **arabe** (RTL), **anglais**.
- **Support RTL de bout en bout** : mise en page logique (`start`/`end`, jamais
  `left`/`right`), miroir des icônes directionnelles, tests aux deux directions.
- Dates, nombres et devises localisés ; fuseau **Africa/Casablanca** partout
  (avec la règle marocaine du Ramadan — reprendre le traitement de l'existant).

### NF6 — Sécurité et confidentialité

Traité au [chapitre 7](#7-sécurité-et-protection-des-personnes).

### NF7 — Maintenabilité

- **Aucun fichier > 400 lignes**, aucune fonction > 50 lignes.
- Le code doit être **compréhensible par une personne seule après six mois
  d'absence** : c'est le critère d'acceptation réel.
- Typage statique strict de bout en bout ; **aucun type dynamique implicite**.
- Couverture de tests : **≥ 80 % sur les règles métier**, ≥ 60 % global.
- Zéro avertissement de linter en intégration continue.
- **La culture de commentaire de l'existant est conservée** : on n'explique pas
  *ce que* fait le code, on explique *quel problème réel* il corrige.

### NF8 — Exploitabilité

- Déploiement **en une commande**, depuis Git, **sans coupure de service**.
- Retour arrière en une commande.
- Migrations de schéma **versionnées, réversibles, jouées automatiquement**.
- Journalisation structurée, corrélée par requête.
- Métriques et alertes : disponibilité, erreurs, latence, saturation.
- **Aucune erreur silencieuse** : tout `catch` journalise ou remonte.

### NF9 — Sauvegarde et reprise

| Critère | Cible |
|---|---|
| **RPO** (perte maximale acceptable) | **≤ 1 heure** |
| **RTO** (délai de remise en service) | **≤ 4 heures** |
| Sauvegardes | Quotidiennes, **chiffrées**, **hors du serveur de production** |
| Vérification | **Restauration de test automatique mensuelle**, avec rapport |
| Rétention | 30 jours glissants + 12 mensuelles |

> Le défaut de l'existant — les sauvegardes vivent sur le disque qu'elles
> protègent — est **éliminé par conception** : au moins une copie chiffrée chez
> un tiers, dans une autre juridiction technique.

### NF10 — Réversibilité

Le mouvement doit pouvoir **partir avec ses données**, sans nous et sans
l'éditeur : export complet documenté, formats ouverts, schéma publié. Aucune
dépendance à un service propriétaire pour les données métier.

### NF11 — Écoconception et sobriété

Les étudiants ont des forfaits limités et des téléphones anciens. Le poids des
pages, le nombre de requêtes et le volume d'images sont des **exigences**, pas
des optimisations. Images servies en formats modernes, dimensionnées, en
chargement différé.

---

## 7. Sécurité et protection des personnes

> **Ce chapitre n'est pas une formalité.** Le GBUM est un mouvement chrétien
> dans un pays à majorité musulmane. La liste de ses membres, et plus encore la
> liste des personnes approchées par le JTPA, sont des données dont la
> divulgation peut porter un préjudice **personnel, familial et social réel** à
> des individus identifiables. L'application existante le reconnaît en
> commentaire : *« Le GBU est un mouvement qui peut être visé. »*
> **Le hub doit être conçu sur cette hypothèse, pas la découvrir après coup.**

### 7.1 Modèle de menace

| Menace | Impact | Parade exigée |
|---|---|---|
| Compromission d'un compte membre | Accès à l'annuaire complet | 2FA sur les rôles élevés, sessions courtes, alerte de connexion inhabituelle, **cloisonnement par structure** |
| Compromission du serveur | Divulgation totale | Chiffrement au repos, secrets hors du dépôt et hors des sauvegardes, moindre privilège, journalisation externalisée |
| **Fuite du JTPA** | **Préjudice grave à des tiers non membres** | Cloisonnement fort : visible du seul accompagnant ; **jamais** dans les exports, la recherche globale, les sauvegardes en clair ; chiffrement applicatif dédié |
| Réquisition ou saisie | Divulgation légale | Minimisation des données, durées de conservation courtes, effacement effectif, sauvegardes hors juridiction |
| Vol d'un téléphone déverrouillé | Accès aux données mises en cache | Cache hors ligne limité au canevas et aux données non nominatives ; verrouillage applicatif |
| Ingénierie sociale | Usurpation | Aucune coordonnée exposée publiquement ; validation des demandes par un humain identifié |
| Défiguration de la vitrine | Atteinte à l'image | Vitrine pré-générée et servie en lecture seule, séparée de l'espace membre |

### 7.2 Principes de conception

1. **Minimisation.** On ne collecte que ce qui sert une exigence écrite du
   présent document. Tout champ doit pouvoir citer son `F<x.y>`.
2. **Rien n'est public par défaut.** Chaque exposition publique est une
   décision explicite, tracée. *(Doctrine de l'existant — conservée.)*
3. **Cloisonnement par structure.** Un responsable de cellule voit sa cellule.
   Un bureau de ville voit sa ville. L'accès au national se justifie.
   **Le rôle sans portée n'existe pas.**
4. **Politique d'accès unique.** Une seule définition, testée, du « qui peut
   quoi ». Toute vue la consulte, aucune ne la réimplémente.
5. **Chiffrement.** TLS partout ; base chiffrée au repos ; sauvegardes
   chiffrées ; secrets dans un coffre, jamais dans une archive.
6. **Traçabilité.** Toute action sensible est journalisée de façon inaltérable.
7. **Consentement pour l'image et les données sensibles**, recueilli,
   horodaté, révocable.
8. **Sécurité par défaut, jamais par vigilance.** *(Doctrine de l'existant —
   conservée.)*

### 7.3 Conformité

Deux cadres s'appliquent simultanément :

- **Loi marocaine 09-08** (CNDP) — traitement de données personnelles au Maroc.
- **RGPD** — dès lors que des personnes concernées sont dans l'UE (Amis du GBU
  expatriés, partenaires IFES, étudiants européens).

Dans les deux cadres, **les convictions religieuses sont une donnée sensible**
soumise à un régime renforcé.

Livrables de conformité attendus :

| # | Livrable |
|---|---|
| C1 | Registre des traitements |
| C2 | Politique de confidentialité publiée, en langage clair, FR/AR/EN |
| C3 | Durées de conservation par catégorie de donnée, et purge automatique |
| C4 | Procédure d'exercice des droits (accès, rectification, effacement, portabilité) |
| C5 | Analyse d'impact (AIPD) — obligatoire compte tenu des données sensibles |
| C6 | Procédure de notification de violation de données |
| C7 | Consentements horodatés et révocables |
| C8 | Formalité auprès de la CNDP si requise |

### 7.4 Exigences de sécurité applicative

- Protection CSRF stricte sur toute écriture *(reprendre la règle de
  l'existant : le jeton est exigé même quand la session n'en porte pas encore)*.
- En-têtes : `Content-Security-Policy`, `Strict-Transport-Security`,
  `X-Content-Type-Options`, `Referrer-Policy`, `X-Frame-Options`.
- Anti-force-brute à **double clé** (adresse **et** compte visé), réponse
  identique dans tous les cas *(reprendre l'existant)*.
- Validation et typage de **toutes** les entrées, aux frontières.
- Requêtes paramétrées exclusivement ; aucune interpolation SQL.
- Téléversements : type vérifié par le contenu, taille bornée, hors de la
  racine web, ré-encodés.
- Dépendances : versions verrouillées, analyse de vulnérabilités en continu.
- **Test d'intrusion et audit IDOR avant toute mise en production.**

---

## 8. Contraintes

### 8.1 Contraintes d'équipe

- **Un développeur** (Pierre), **à temps partiel**, sur un projet bénévole.
- **Un administrateur non développeur** (Esaïe) qui exploite.
- Le mouvement est animé par des **étudiants qui changent tous les 4 à 5 ans**.

> **Conséquence directe, et elle prime sur l'élégance :** toute décision qui
> augmente le nombre de choses à connaître pour maintenir le système est
> mauvaise, même si elle est techniquement supérieure. Un langage unique vaut
> mieux que deux ; un service géré vaut mieux qu'un service à administrer ;
> une convention vaut mieux qu'une configuration.

### 8.2 Contraintes budgétaires

- Budget d'infrastructure **faible et prévisible**.
- Priorité aux briques libres et aux offres gratuites pour associations.
- Coût cible : **≤ 30 €/mois** hors visioconférence intensive.

### 8.3 Contraintes d'exploitation

- Service **continu** : le hub doit rester joignable pendant les migrations.
- **Reprise obligatoire des données de production existantes**, sans perte.
- Le domaine `gbu-maroc.org` est en service : la bascule doit être transparente.

### 8.4 Contraintes des utilisateurs

- Téléphones d'entrée et de milieu de gamme, Android majoritaire.
- Connexions 3G/4G instables, forfaits limités.
- Compétence numérique très variable.
- **WhatsApp est le canal de communication réel du mouvement** — le hub s'y
  raccorde, il ne cherche pas à le remplacer.

---

## 9. Reprise de l'existant

### 9.1 Ce qui est repris tel quel (conceptuellement)

| Élément | Source |
|---|---|
| Modèle personne / structure / rattachement | `app/socle.py` |
| Rôle déduit des rattachements | `app/auth.py` |
| Rapport mensuel « cinq champs, silence = information » | `app/rapports.py` |
| Modèle soutien / versement / budget | `app/ressources.py` |
| Domaine « camp » complet | `app/camp.py` |
| « Voir à la place de » avec bandeau et trace | `app/emprunt.py` |
| Doctrine « rien n'est public par défaut » | `app/public.py` |
| Anti-force-brute à double clé | `app/securite.py` |
| Traitement du fuseau `Africa/Casablanca` | `app/__init__.py` |
| **Recette navigateur d'accessibilité** | `static/js/audit-ui.js` |
| Culture de commentaire qui raconte l'incident | tout le dépôt |

### 9.2 Ce qui est abandonné

| Élément | Motif |
|---|---|
| Persistance en fichiers JSON | Pas de transaction, pas d'intégrité, pas de cohérence de sauvegarde |
| Signalisation WebRTC mesh maison (4 736 l.) | Le SFU chiffre désormais de bout en bout |
| État des salles en mémoire de processus | Interdit toute redondance et tout déploiement sans coupure |
| Migrations dans `create_app()` | Non versionnées, non réversibles |
| Rendu Jinja + CSS global + JS impératif | Ne permet ni composants, ni tests, ni cohérence |
| `app/data.py` comme source d'identité | Doublon du socle |
| Déploiement hors Git | Aucune traçabilité |
| Code mort divergent (≈ 106 Ko) | Source d'erreurs de diagnostic |

### 9.3 Stratégie de migration des données

1. **Geler le schéma** de l'existant (aucune évolution pendant la reprise).
2. **Écrire un extracteur** : SQLite + 18 JSON → format intermédiaire documenté.
3. **Réconcilier** : dédoublonner les personnes, rattacher les orphelins des
   JSON, **produire un rapport d'anomalies relu par le Secrétariat National**.
4. **Charger** dans la base cible, avec contrôles d'intégrité bloquants.
5. **Rejouer la migration à blanc au moins trois fois**, mesurer la durée.
6. **Basculer** sur une fenêtre annoncée, avec retour arrière préparé et testé.
7. **Conserver l'ancien système en lecture seule 90 jours.**

> Aucune donnée n'est perdue, aucune n'est inventée. Toute donnée non
> réconciliable est **signalée**, jamais devinée.

---

## 10. Critères d'acceptation

La version 1 est recevable si, et seulement si, **tous** les points suivants
sont vérifiés et démontrés :

### Fonctionnel
- [ ] Toutes les exigences `M` des domaines D1 à D4 et DT sont livrées.
- [ ] Un responsable de cellule ouvre le canevas de la semaine **hors ligne**,
      sur un téléphone, en moins de 5 secondes.
- [ ] Un rapport mensuel se remplit sur téléphone en **moins de 3 minutes**,
      chronométré avec un vrai responsable.
- [ ] Une demande publique « je cherche un groupe » atteint le bon responsable
      et déclenche une relance si elle n'est pas traitée sous 72 h.
- [ ] Le Secrétariat National édite le texte de la vitrine **sans développeur**.

### Technique
- [ ] Zéro fichier JSON de persistance ; 100 % des écritures transactionnelles.
- [ ] Migration des données de production rejouée **3 fois sans anomalie**.
- [ ] Déploiement depuis Git, **sans coupure**, retour arrière prouvé.
- [ ] CI verte obligatoire : lint, typage, tests, audit d'accessibilité, audit
      de sécurité des dépendances.
- [ ] Couverture ≥ 80 % sur les règles métier.
- [ ] Aucun fichier > 400 lignes.

### Qualité d'usage
- [ ] **WCAG 2.2 AA vérifié sur 100 % des écrans**, en automatique et à la main.
- [ ] Lighthouse ≥ 95 sur la vitrine (perf, a11y, best practices, SEO).
- [ ] Testé sur Android d'entrée de gamme en 3G bridée.
- [ ] Aucun débordement horizontal à 360 px.
- [ ] Test d'usage avec **au moins 5 GBUssiens réels** avant mise en production.

### Sécurité
- [ ] Audit IDOR : aucun accès hors périmètre sur 100 % des ressources.
- [ ] Test d'intrusion réalisé, findings critiques et élevés corrigés.
- [ ] Sauvegarde chiffrée hors site, **restauration de test réussie**.
- [ ] Registre des traitements, AIPD et politique de confidentialité publiés.
- [ ] 2FA effective sur les rôles national, finances et administration.

---

## 11. Gouvernance du projet

### 11.1 Rôles

| Rôle | Titulaire | Responsabilité |
|---|---|---|
| Commanditaire | Secrétariat National | Valide le périmètre, arbitre, valide les contenus |
| Responsable produit | *à désigner* (SN) | Priorise, décide au quotidien, relit les écrans |
| Architecte / développeur | Pierre | Conçoit, réalise, garantit la qualité |
| Exploitant | Esaïe | Déploie, surveille, restaure |
| Référent données personnelles | *à désigner* | Tient le registre, instruit les demandes |
| Testeurs | 5 GBUssiens de villes différentes | Éprouvent chaque version |

### 11.2 Rituels

- **Revue de version** à chaque jalon, avec le Secrétariat National, sur
  l'application réelle — jamais sur des captures d'écran.
- **Recette de terrain** avant chaque mise en production : les 5 testeurs,
  sur leurs propres téléphones, sur leur propre connexion.
- **Revue de sécurité** à chaque jalon majeur.

### 11.3 Définition de « terminé »

Une fonctionnalité est terminée quand — et seulement quand :

1. le code est relu et fusionné par pull request ;
2. les tests automatiques couvrent la règle métier ;
3. l'audit d'accessibilité passe sur les écrans touchés ;
4. la documentation utilisateur est à jour ;
5. **un utilisateur réel l'a utilisée** et n'a pas eu besoin d'explication.

Le point 5 n'est pas négociable. Une fonctionnalité que personne n'utilise n'a
pas été livrée.

---

## 12. Décisions à arbitrer

Ces points relèvent de la maîtrise d'ouvrage. Chacun porte une recommandation
argumentée ; l'arbitrage est attendu avant le lancement du lot 1.

| # | Décision | Recommandation | Détail |
|---|---|---|---|
| **D1** | Un site ou plusieurs ? | ⬜ **À TRANCHER — phase 2.1.** La recommandation ci-dessous est une proposition, pas une décision. | [§4.1](#41-réponse-à-la-question--un-site-ou-plusieurs-) |
| ~~D2~~ | ~~Pile technique~~ | ✅ **Tranché — TypeScript de bout en bout** (Next.js + PostgreSQL + LiveKit) | [`02-ARCHITECTURE.md` §3](02-ARCHITECTURE.md) |
| ~~D3~~ | ~~Dépôt~~ | ✅ **Tranché — dépôt `gbum-hub`** ; `gbu-connect` reste en production | [`02-ARCHITECTURE.md` §8](02-ARCHITECTURE.md) |
| **D4** | Périmètre du lot 1 | **D1 + D2 + D3 + D4** (vitrine, socle, canevas, pilotage) | [`04-ROADMAP.md`](04-ROADMAP.md) |
| **D5** | Bascule : big-bang ou progressive ? | **Progressive** — la vitrine d'abord, l'espace membre ensuite, l'ancien en lecture seule 90 j | [§9.3](#93-stratégie-de-migration-des-données) |
| **D6** | Langues à la v1 | **FR seul en v1**, architecture i18n + RTL posée dès le départ ; AR et EN au lot 3 | [NF5](#nf5--internationalisation) |
| **D7** | Hébergement | **Plateforme gérée** (base et applicatif) plutôt que le VPS actuel | [`02-ARCHITECTURE.md` §6](02-ARCHITECTURE.md) |
| **D8** | Le JTPA fait-il partie du hub ? | **Oui, mais cloisonné** et chiffré à part — ou reporté si le SN juge le risque trop élevé | [§7.1](#71-modèle-de-menace) |

---

*Document vivant. Toute modification passe par une pull request et est datée.*
