# Architecture cible — Hub officiel du GBUM

> Document d'architecture et registre des décisions (ADR).
> Compagnon du [cahier des charges](01-CAHIER-DES-CHARGES.md).
> **Statut : proposition. Les décisions marquées ⚖️ attendent l'arbitrage de Pierre.**

---

## 1. Les cinq principes qui gouvernent tout le reste

Chaque décision de ce document découle d'un de ces cinq principes. Quand deux
principes s'opposent, l'ordre ci-dessous tranche.

### P1 — Une seule personne doit pouvoir tout maintenir

C'est **la** contrainte du projet, et elle prime sur l'élégance technique. Une
architecture supérieure sur le papier mais qui demande de connaître quatre
langages, six services et trois modèles de déploiement est **inférieure** ici.

> *Corollaires :* un seul langage ; des services gérés plutôt qu'administrés ;
> une seule base de données ; la convention plutôt que la configuration.

### P2 — Une seule source de vérité

Une personne, une cellule, un budget existent **à un seul endroit**. L'échec
principal de l'existant — SQLite d'un côté, 18 fichiers JSON de l'autre — vient
de la violation de ce principe.

### P3 — Le domaine métier ne dépend de rien

Les règles du GBUM (« qui peut voir le carnet des Amis », « un budget validé ne
bouge plus », « le silence d'une cellule est une information ») vivent dans du
code **pur, testable sans base de données, sans HTTP, sans navigateur**. Le
cadre technique s'y branche ; jamais l'inverse.

> C'est ce qui permettra, dans dix ans, de changer de cadre sans réécrire le
> mouvement.

### P4 — La sécurité est structurelle, pas comportementale

Une règle qu'il faut **penser à appliquer** sera oubliée. Une règle que le
compilateur ou le type impose ne peut pas l'être. Toute protection doit être
posée à un endroit où on ne peut pas passer à côté.

### P5 — Ce qui n'est pas mesuré n'existe pas

L'accessibilité, la performance, la couverture, le temps de restauration : ce
sont des **contrôles automatiques bloquants**, pas des intentions.

---

## 2. Vue d'ensemble

### 2.1 Contexte

```
   ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐
   │ Étudiant │  │Responsable│ │    SN    │  │ Ami GBU  │  │  Public  │
   │ (mobile) │  │ (mobile)  │ │(bureau)  │  │  (web)   │  │  (SEO)   │
   └────┬─────┘  └─────┬─────┘ └────┬─────┘  └────┬─────┘  └────┬─────┘
        └──────────────┴────────────┴─────────────┴─────────────┘
                                    │
                    ╔═══════════════▼═══════════════╗
                    ║      HUB OFFICIEL DU GBUM     ║
                    ╚═══════════════╤═══════════════╝
                                    │
        ┌────────────┬──────────────┼──────────────┬────────────┐
        ▼            ▼              ▼              ▼            ▼
   ┌─────────┐ ┌──────────┐  ┌───────────┐  ┌──────────┐ ┌──────────┐
   │ LiveKit │ │ wa-sender│  │  Courriel │  │ Stockage │ │  Claude  │
   │  (SFU)  │ │(WhatsApp)│  │  (Resend) │  │ objet S3 │ │(synthèse)│
   └─────────┘ └──────────┘  └───────────┘  └──────────┘ └──────────┘
```

### 2.2 Conteneurs

```
┌───────────────────────────────────────────────────────────────────────┐
│                          MONOREPO  gbum-hub                            │
│                                                                        │
│  ┌──────────────────────┐          ┌──────────────────────┐           │
│  │  apps/vitrine        │          │  apps/hub            │           │
│  │  gbu-maroc.org       │          │  hub.gbu-maroc.org   │           │
│  │                      │          │                      │           │
│  │  • Rendu statique    │          │  • Rendu serveur     │           │
│  │    (pré-généré)      │          │  • Authentifié       │           │
│  │  • SEO, < 150 Ko     │          │  • PWA + hors ligne  │           │
│  │  • Anonyme           │          │  • Riche, dense      │           │
│  └──────────┬───────────┘          └──────────┬───────────┘           │
│             │                                  │                       │
│             └────────────┬─────────────────────┘                       │
│                          ▼                                             │
│  ┌─────────────────────────────────────────────────────────────────┐  │
│  │  packages/core   —  LE DOMAINE MÉTIER (P3)                      │  │
│  │                                                                  │  │
│  │   organisation · canevas · cellule · camp · finances · amis     │  │
│  │   accès (politique unique) · notifications · mémoire            │  │
│  │                                                                  │  │
│  │   Pur TypeScript. Aucune dépendance à Next, à HTTP, au DOM.     │  │
│  │   100 % testable en mémoire.                                    │  │
│  └────────────────────────────┬────────────────────────────────────┘  │
│                               ▼                                        │
│  ┌─────────────────────────────────────────────────────────────────┐  │
│  │  packages/db  (schéma + migrations)  ·  packages/ui  (design)   │  │
│  │  packages/i18n  ·  packages/config  ·  packages/adapters        │  │
│  └────────────────────────────┬────────────────────────────────────┘  │
│                               │                                        │
│  ┌────────────────────────────┼────────────────────────────────────┐  │
│  │  apps/worker  — tâches de fond (rappels, envois, relances,      │  │
│  │                 purges, sauvegardes vérifiées)                  │  │
│  └────────────────────────────┼────────────────────────────────────┘  │
└───────────────────────────────┼────────────────────────────────────────┘
                                ▼
                    ┌───────────────────────┐
                    │   PostgreSQL (géré)   │   ← source de vérité unique (P2)
                    │   + file pg-boss      │
                    └───────────────────────┘
```

**Ce qui est absent de ce schéma est aussi important que ce qui y figure :**
pas de Redis, pas de coturn à administrer, pas de service de signalisation
maison, pas de second magasin de données. *(P1, P2)*

---

## 2 bis. ✅ ADR-001 — Deux surfaces, une seule source de vérité

> **Décision prise le 9 septembre 2026** — point 2.1 de l'échéancier.
> Arbitrée par Pierre, sur l'examen de ce que font quatre organisations
> comparables.

### La question

Le hub doit-il être **un seul site** où tout se joue aux droits d'accès,
**deux surfaces** distinctes, ou **plusieurs sites indépendants** ?

### Ce que font les organisations comparables

La décision ne repose pas sur un raisonnement abstrait mais sur l'examen de
quatre mouvements qui ont résolu le même problème, dont la fédération à
laquelle le GBUM appartient.

| Organisation | Taille | Site public | Espace membre |
|---|---|---|---|
| **IFES** — la fédération du GBUM | 180 mouvements nationaux | `ifesworld.org` | `connect.ifesworld.org` · `elearning.ifesworld.org` |
| **UCCF** — Royaume-Uni, le pair le plus proche | Groupes chrétiens sur les campus britanniques | `uccf.org.uk` | `resources.uccf.io/login` — **autre domaine** |
| **Scouts et Guides de France** | 863 groupes locaux, 61 181 jeunes, 27 399 bénévoles | `sgdf.fr` | `intranet.sgdf.fr` · `chefscadres.sgdf.fr` |
| **Rotary International** — hors sphère chrétienne | Clubs locaux dans le monde entier | `rotary.org` | `my.rotary.org` |

**Les quatre séparent le site public de l'espace membre.** Aucune ne fait tenir
l'ensemble dans un site unique géré aux droits d'accès — c'est-à-dire aucune ne
fait ce que fait `gbu-connect` aujourd'hui.

L'usage professionnel le formule ainsi : l'espace membre *« n'a aucune vocation
SEO ni de visibilité publique. Ce ne sont pas des sites que l'on cherche à
référencer sur Google, ils ne devraient justement pas être accessibles sans
authentification. »*

Chez les Scouts et Guides de France, l'accès à l'intranet est d'ailleurs
conditionné à **trois** conditions cumulées : être membre, être à jour de
cotisation, **et être nommé à une fonction**. Ce n'est pas de
l'authentification, c'est déjà du rôle × portée — ce qui documente par
avance le point 2.2.

### La décision

**Deux surfaces, une seule source de vérité.**

```
gbu-maroc.org        vitrine publique — pré-générée, légère, référençable, anonyme
hub.gbu-maroc.org    espace membre — authentifié, riche, cloisonné
                     ↓
        un seul dépôt · un seul domaine métier · une seule base
```

### Ce qui a été écarté, et pourquoi

**Un seul site.** C'est le montage actuel, et il a deux défauts mesurables : la
page « Nous trouver » charge le code du tableau de bord national — lourd sur un
téléphone en 3G, alors que c'est *la* page que consulte une nouvelle étudiante ;
et le trafic anonyme atteint l'application qui porte l'annuaire. Aujourd'hui,
ouvrir `gbu-maroc.org` menait d'ailleurs à un écran de connexion : le mouvement
était invisible sur le web.

**Plusieurs sites indépendants.** Les données sont **les mêmes**. Une personne,
une ville, une cellule existeraient en trois exemplaires qui divergeraient en
quelques mois — ou il faudrait construire une API centrale, et l'on retomberait
sur la présente décision avec plus de travail. Trois déploiements, trois
chaînes de qualité, trois chartes à tenir **par une seule personne**.

### Ce qu'on ne copie pas

Les Scouts et Guides de France ont 88 000 membres et une équipe informatique
salariée : ils se paient trois sites distincts. **Le GBUM a un développeur
bénévole.** On reprend donc le *principe* — le public séparé du membre — et non
le montage : deux surfaces, un dépôt, une base. C'est le principe P1 appliqué.

### Une leçon de périmètre, tirée de la même enquête

**IFES Connect ferme en mai 2026.** La plateforme communautaire de la propre
fédération du GBUM — où « le personnel des mouvements nationaux, les étudiants
et les soutiens échangent idées et ressources » — est arrêtée.

Or `elearning.ifesworld.org`, la plateforme de **formation**, subsiste.

Le réseau social meurt, l'outil reste. Cela ne décide pas d'ADR-001, mais cela
oriente le point 2.5 (périmètre de la v1) : construire des **outils** — le
canevas, les rapports, les camps —, pas une communauté en ligne. La « Place des
Amis » de `gbu-connect` mérite d'être réexaminée à cette lumière.

### Conséquences

- Le domaine métier et la base sont **partagés** ; les deux surfaces ne
  dupliquent jamais une règle.
- La vitrine ne lit que des données explicitement marquées publiques — la
  doctrine « rien n'est public par défaut » de `gbu-connect` est conservée.
- Une faille dans une surface n'expose pas l'autre.
- Le référencement devient possible ; il ne l'est pas aujourd'hui.

### Sources

[IFES](https://ifesworld.org/en/) · [IFES Connect](https://connect.ifesworld.org/) ·
[IFES eLearning](https://elearning.ifesworld.org/) · [UCCF](https://www.uccf.org.uk/) ·
[UCCF CU Resources Hub](https://resources.uccf.io/login) ·
[Intranet SGDF](https://intranet.sgdf.fr/) ·
[Wikipédia — Scouts et Guides de France](https://en.wikipedia.org/wiki/Scouts_et_Guides_de_France) ·
[My Rotary](https://my.rotary.org/) ·
[Highfive — guide intranet/extranet](https://www.highfive.fr/intranet-extranet-guide-complet/)

---

## 2 ter. ✅ ADR-011 — Posture de visibilité publique : ouverte

> **Orientation prise le 9 septembre 2026 par Pierre** — point 2.4 de
> l'échéancier. **Réserve ouverte :** l'échéancier attribue ce point au
> Secrétariat National ; sa confirmation est requise avant toute mise en ligne
> portant de vrais noms.

### La question

Que voit-on du GBUM **sans compte** ? Le mouvement doit-il être ouvertement
visible, ou se protéger par la discrétion ?

### Ce que fait l'existant, et ce qui change

`gbu-connect` pose la doctrine inverse : *« rien n'est public par défaut. Chaque
page est ouverte délibérément, une par une […] Aucune coordonnée personnelle ne
sort : on joint un responsable par un formulaire, jamais par son numéro. »*
Neuf routes publiques seulement, et un drapeau `public` à 0 par défaut sur
chaque structure.

**ADR-011 renverse cette doctrine.** Ce qui sert la mission est public par
défaut ; ce qui est retenu doit se justifier.

### La décision

**Posture ouverte**, sur le modèle de GBU France — plus de cent groupes dont
les villes, campus, jours, heures et contacts sont publiés.

Deviennent publics :

| Publié | Détail |
|---|---|
| Présentation du mouvement | Vision décennale, devise, thème de l'année, histoire, appartenance à l'IFES |
| **Villes** où le GBUM est présent | Le niveau auquel la publication s'arrête |
| **Liste des cellules d'une ville** | Les cellules sont **nommées**, pour montrer que le mouvement est vivant sur place |
| **Contact du responsable de ville** | Le **seul** contact publié — c'est lui qu'on joint au besoin |
| Agenda | Les événements ouverts, camps compris |
| Galerie | Albums publiés explicitement, visages sur consentement |
| Soutenir | Besoins, moyens de don, formulaire de promesse |
| Actualités, témoignages | Sur consentement du témoin |

**La publication s'arrête à la ville.** *(précision du 9 septembre 2026)*

Restent fermés, **sans exception de posture** :

- **toute information sur les responsables de cellule** — nom, contact, photo :
  la chaîne publique s'arrête au bureau de ville ;
- l'**annuaire** et toute donnée personnelle non consentie ;
- le **suivi JTPA** — jamais public, jamais exporté ;
- les **finances**, rapports de cellule, gouvernance.

### Trois garde-fous qui survivent à la posture ouverte

1. **Consentement explicite et révocable** pour toute personne nommée ou
   photographiée. Publier n'est pas un droit acquis sur autrui : c'est un
   accord, retirable à tout moment, et le retrait doit produire un effet
   immédiat sur le site.
2. **Adresse de groupe plutôt que personnelle.** GBU France emploie les deux ;
   l'adresse de groupe offre la même ouverture sans exposer un individu, et
   elle survit au changement de responsable — un responsable sortant ne
   continue pas de recevoir les demandes.
3. **Réversibilité immédiate.** Une cellule doit pouvoir repasser en privé en
   un geste, sans intervention technique et sans attendre un déploiement.

### Ce qui a été écarté

**Posture prudente** — rien de localisé sans mise en relation humaine
préalable. C'était la recommandation initiale, et la doctrine de
`gbu-connect`. Écartée : elle allonge le chemin d'une étudiante qui cherche un
groupe, et le point d'entrée du mouvement est la rentrée universitaire.

**La publication au niveau de la cellule** — ce que fait GBU France, qui donne
le campus, le jour, l'heure et le contact de chaque groupe. Écartée le
9 septembre 2026 : la chaîne publique s'arrête au bureau de ville, et aucun
responsable de cellule n'est exposé.

**Posture discrète** — seules l'existence du mouvement et les villes. Écartée :
la vitrine perdrait sa raison d'être.

### Le risque, nommé

Le contexte marocain n'est pas neutre. Un rapport du Département d'État
américain relève des restrictions continues visant les chrétiens, exercées par
l'État et par la société, qui conduisent ces communautés à rester discrètes ;
des sources associatives décrivent une pratique en « églises domestiques ».

**Cette décision est prise en connaissance de ce contexte**, par le
responsable du projet, qui vit sur place. Elle est consignée ici pour que le
choix reste visible, révisable, et attribuable — et non subi par ceux qu'il
expose. Les trois garde-fous ci-dessus en sont la contrepartie.

### Conséquences sur les maquettes

Le parcours « Trouver mon groupe » est à refaire en phase 4. Il montre
aujourd'hui une cellule nommée avec son jour, son bâtiment, sa salle et le
prénom de son responsable — **au-delà de ce que cette décision autorise**.

Ce qu'il devra montrer : la **ville**, la **liste de ses cellules**, et le
**contact du responsable de ville**. L'étape « se présenter » reste utile, mais
elle s'adresse désormais au bureau de ville, pas à une cellule.

### Sources

[GBU France](https://www.gbu.fr/en/) · [GBU Île-de-France — trouver un groupe](https://idf.gbu.fr/fr/la-rentree-des-groupes-en-ile-de-france-2024/) ·
[GBU Île-de-France — contacts](https://idf.gbu.fr/fr/contacts/) ·
[Yabiladi — rapport sur les restrictions](https://www.yabiladi.com/articles/details/139648/maroc-chretiens-chiites-subissent-restrictions.html) ·
[AED — les chrétiens marocains](https://acninternational.org/fr/les-chretiens-marocains-doivent-pratiquer-leur-foi-en-secret/) ·
[IFES — région MENA](https://ifesworld.org/en/region/mena/)

---

## 3. ✅ ADR-002 — La pile technique

> **Décision prise le 8 septembre 2026 : option A, TypeScript de bout en bout.**
> Arbitrée par Pierre, qui a demandé l'option recommandée.
> Le §3.4 reste applicable : si sa maîtrise de Python s'avère nettement
> supérieure à l'usage, l'architecture bascule sans rien perdre.

### 3.1 Les trois candidats sérieux

| | **A. TypeScript de bout en bout** | **B. Python + front TS** | **C. Django + HTMX** |
|---|---|---|---|
| Back | Next.js (Server Components / Actions) | FastAPI + SQLAlchemy + Alembic | Django + DRF |
| Front | React 19 + Tailwind + shadcn/ui | Next.js (idem) | Templates + HTMX + Alpine |
| Langages à maîtriser | **1** | **2** | 1,5 |
| Types partagés front↔back | **Natifs, garantis** | Génération OpenAPI (dérive possible) | Aucun |
| Continuité avec l'existant | Rupture totale | **Forte** (Python conservé) | Forte |
| Écosystème LiveKit | **Excellent** (SDK JS de référence) | Bon (SDK Python serveur) | Bon |
| Hors ligne / PWA | **Excellent** | Excellent (front identique) | Difficile |
| Qualité d'UI atteignable | **Très élevée** (shadcn/ui, Radix, Framer) | Très élevée (front identique) | Moyenne |
| Accessibilité fournie | **Radix = AA par défaut** | Idem si React | À écrire à la main |
| Coût d'exploitation | **Faible** (plateforme gérée) | Moyen (2 services) | Moyen |
| Vitesse pour un dev seul | **Élevée** | Moyenne (2 bases de code) | **Très élevée** au début, décroît |
| Risque | Rupture complète, tout à réécrire | Deux mondes à tenir en phase | Plafond d'UX atteint vite |

### 3.2 Recommandation : **A — TypeScript de bout en bout**

Quatre arguments, dans l'ordre de poids.

**1. Un seul langage — c'est P1 appliqué littéralement.**
Le vrai coût d'un projet bénévole n'est pas d'écrire le code : c'est d'y
revenir après trois semaines d'absence. Une pile mono-langage divise par deux
le coût de rentrée. L'option B demande de tenir en phase deux bases de code,
deux jeux de dépendances, deux chaînes de tests, **pour une seule personne**.

**2. Le type traverse toute la pile — c'est P4 appliqué.**
Avec Server Components et Server Actions, la fonction qui lit la base et le
composant qui l'affiche partagent **le même type, vérifié par le compilateur**.
Renommer un champ casse la compilation partout où il est utilisé. En option B,
la même erreur passe la compilation et se découvre en production.

**3. L'exigence d'interface ne se négocie pas.**
Le cahier des charges demande WCAG 2.2 AA sur 100 % des écrans, une UI moderne
et une belle expérience. **Radix UI (sous shadcn/ui) fournit l'accessibilité
des composants complexes — menus, dialogues, combobox, onglets — nativement et
correctement.** Réimplémenter cela à la main (option C) coûte des mois et sera
moins bon. L'audit de l'existant a trouvé 50 manquements d'accessibilité sur du
HTML écrit à la main : ce n'est pas un hasard, c'est structurel.

**4. Le temps réel est en JavaScript de toute façon.**
Le client LiveKit tourne dans le navigateur. En option B, le serveur est en
Python et le client en TypeScript : la logique de salle est **coupée en deux
langages**. C'est exactement la situation actuelle, et elle a produit
4 736 lignes de JavaScript difficile.

### 3.3 Ce que cette recommandation coûte — dit honnêtement

- **Rupture totale.** Aucune ligne de Python n'est reprise. Les 23 482 lignes
  de `app/` deviennent une **spécification à lire**, pas un code à porter.
- **Écosystème mouvant.** L'univers JavaScript bouge plus vite que Python. Il
  faut discipliner les mises à jour (versions verrouillées, mises à jour
  planifiées, pas de dépendance exotique).
- **Si vous n'êtes pas déjà à l'aise en React/TypeScript**, comptez 3 à
  4 semaines de montée en compétence avant d'être productif — à mettre dans le
  calendrier, pas à découvrir en route.

### 3.4 Quand choisir B plutôt que A

**Si votre maîtrise de Python dépasse nettement celle de TypeScript**, prenez
l'option B et n'écoutez pas la recommandation ci-dessus. P1 dit « une seule
personne doit pouvoir tout maintenir » — et cette personne, c'est vous. Un
projet dans un langage que vous maîtrisez battra toujours un projet dans un
langage supérieur que vous apprenez en même temps que vous l'écrivez.

Dans ce cas, l'architecture de ce document reste **entièrement valable** :
seuls changent les outils. `packages/core` devient un paquet Python pur,
`packages/db` devient SQLAlchemy + Alembic, `apps/hub` reste Next.js et parle à
FastAPI via un contrat OpenAPI généré. Tous les ADR ci-dessous tiennent.

> ✅ **Arbitré le 8 septembre 2026 : option A.**

### 3.5 La pile détaillée (option A)

| Besoin | Choix | Motif |
|---|---|---|
| Cadre applicatif | **Next.js 15 (App Router)** | Un seul outil pour le statique (vitrine) et le dynamique (hub) |
| Langage | **TypeScript, mode `strict`** | P4 : l'erreur devient impossible, pas improbable |
| UI | **React 19 + Tailwind CSS v4 + shadcn/ui (Radix)** | Accessibilité fournie, design system possédé (pas une dépendance) |
| Animation | **Framer Motion**, sobre, `prefers-reduced-motion` respecté | « Vivant » sans être bavard |
| Base | **PostgreSQL** (géré) | Transactions, intégrité, JSONB, recherche plein texte, extensible |
| Accès données | **Drizzle ORM** | SQL explicite et typé ; pas de magie ; migrations SQL versionnées |
| Migrations | **drizzle-kit** | Versionnées, réversibles, jouées en CI — corrige le défaut §4.5 de l'audit |
| Validation | **Zod** | Un schéma = un type + une validation, aux frontières uniquement |
| Authentification | **Auth.js v5** (lien magique + mot de passe + TOTP) | Standard, audité, sessions sûres par défaut |
| Autorisation | **Politique maison dans `packages/core`** | ADR-005 — aucune bibliothèque ne connaît le GBUM |
| Tâches de fond | **pg-boss** (file dans PostgreSQL) | P1/P2 : pas de Redis à administrer, une seule base |
| Temps réel | **LiveKit Cloud** + SDK JS | ADR-004 : supprime SFU, Egress et coturn de l'exploitation |
| Hors ligne | **Service Worker + IndexedDB (Dexie)** | ADR-006 |
| Internationalisation | **next-intl** | ADR-007, RTL inclus |
| Fichiers | **Stockage objet S3** (Cloudflare R2) | Sort les fichiers du serveur ; sauvegardes indépendantes |
| Courriel | **Resend** (ou Postmark) | Transactionnel fiable, gratuit à ce volume |
| WhatsApp | **`wa-sender` conservé**, derrière un adaptateur unique | Ne pas casser ce qui marche ; isoler la dépendance |
| Tests unitaires | **Vitest** | Rapide ; le domaine se teste en mémoire |
| Tests bout en bout | **Playwright** + **axe-core** | ADR-009 : l'accessibilité devient bloquante |
| Qualité | **ESLint + Prettier + `tsc --noEmit`** | Zéro avertissement toléré |
| CI/CD | **GitHub Actions** | Là où vit déjà le code |
| Observabilité | **Sentry** + journaux structurés | P5 |

---

## 4. Le domaine métier — découpage

`packages/core` est découpé en **contextes**. Chaque contexte possède ses
entités, ses règles et son vocabulaire ; il communique avec les autres par des
identifiants et des événements, jamais en fouillant dans leurs tables.

```
packages/core/src/
├── organisation/     Personne · Structure · Rattachement · Rôle · Parcours
├── acces/            Politique d'autorisation UNIQUE (ADR-005)
├── canevas/          Canevas · Étude · Progression · Préparation · Retour
├── cellule/          Séance · Présence · Rapport mensuel
├── vision/           Vision décennale · Thème annuel · Objectif · Résultat
├── activites/        Activité · Inscription · Bilan · JTPA (cloisonné)
├── camps/            Camp · Participant · Chambre · Transport · Boutique
├── reunions/         Salle · Participant · Modération · Compte rendu
├── finances/         Soutien · Versement · Budget · Poste · Engagement
├── amis/             Ami · Finissant · Promesse · Place des Amis
├── communication/    Annonce · Envoi · Audience · Lettre de prière · Préférences
├── memoire/          Chronologie · Archive · Témoignage
└── partage/          Types, erreurs, dates (Africa/Casablanca), argent (MAD)
```

**Règles de dépendance, vérifiées automatiquement en CI :**

- `acces` et `partage` ne dépendent de rien.
- Tout contexte peut dépendre de `partage` et de `acces`.
- Un contexte **ne peut pas importer** un autre contexte métier ; il passe par
  un port déclaré (interface) que la couche applicative branche.
- **`core` n'importe jamais** `next`, `react`, `drizzle` ni aucun accès réseau.

> Cette dernière règle est ce qui rend le domaine testable en millisecondes et
> transportable en cas de changement de cadre. Elle est vérifiée par un test,
> pas par la discipline. *(P3, P4)*

### Exemple — une règle du GBUM, isolée et testable

```ts
// packages/core/src/cellule/rapport.ts
//
// « Le silence est une information. » Un mois sans rapport n'est pas une
// absence de donnée : c'est le signal qu'une cellule a besoin d'aide.
// L'écran national doit montrer les muettes AUSSI VISIBLEMENT que les autres —
// c'est même le plus utile. (Règle reprise de app/rapports.py, GBU Connect.)

export type EtatRemise =
  | { readonly type: "rendu"; readonly rapport: RapportMensuel }
  | { readonly type: "attendu"; readonly depuisMois: number }
  | { readonly type: "hors_periode" };

/** Trois mois de silence consécutifs : la cellule est en alerte. */
export const SEUIL_ALERTE_MOIS = 3;

export function etatRemise(
  cellule: Structure,
  mois: Mois,
  rapports: readonly RapportMensuel[],
): EtatRemise { /* … */ }
```

Aucune base, aucun HTTP, aucun composant. Ce fichier se teste en mémoire, et il
dit la règle du mouvement **en français, dans le code**.

---

## 5. Structure du monorepo

```
gbum-hub/
├── apps/
│   ├── vitrine/          gbu-maroc.org      — public, SEO, pré-généré
│   ├── hub/              hub.gbu-maroc.org  — membres, PWA, hors ligne
│   └── worker/           tâches de fond (rappels, envois, purges, contrôles)
│
├── packages/
│   ├── core/             ★ LE DOMAINE — pur, sans dépendance technique
│   ├── db/               schéma Drizzle + migrations versionnées + seed
│   ├── ui/               design system « Foyer » — composants, tokens, icônes
│   ├── i18n/             messages FR/AR/EN + formatage + direction
│   ├── adapters/         WhatsApp · courriel · LiveKit · stockage · IA
│   └── config/           ESLint, TypeScript, Tailwind — configurations partagées
│
├── tools/
│   ├── migration/        reprise des données de GBU Connect (SQLite + 18 JSON)
│   └── audit-a11y/       recette navigateur reprise de audit-ui.js, automatisée
│
├── docs/                 ce dossier
└── .github/workflows/    CI : lint · types · tests · a11y · sécurité · déploiement
```

**Pourquoi un monorepo plutôt que trois dépôts :** un changement du modèle
« personne » touche le domaine, la base, les deux surfaces et les tests. Dans
trois dépôts, c'est quatre pull requests coordonnées à la main. Dans un
monorepo, c'est **une pull request, une CI, un instantané cohérent**. *(P1)*

---

## 6. Infrastructure et déploiement

### 6.1 ⚖️ ADR-007 — Quitter le VPS pour une plateforme gérée

**Situation actuelle :** VPS Contabo, nginx, systemd, certbot, coturn, LiveKit
auto-hébergé, Egress, sauvegardes en cron sur le même disque, déploiement par
`scp`. **Esaïe, non développeur, administre tout cela.**

**Cible :**

| Brique | Choix | Ce que cela supprime |
|---|---|---|
| Applications | **Vercel** (ou Railway / Fly.io) | nginx, systemd, certbot, déploiement manuel |
| Base | **Neon** ou **Supabase** (PostgreSQL géré) | Sauvegardes manuelles, restauration à la main, mises à jour |
| Temps réel | **LiveKit Cloud** | SFU, Egress, **coturn**, mise à l'échelle |
| Fichiers | **Cloudflare R2** | Disque du serveur, sauvegarde des médias |
| Courriel | **Resend** | Configuration SMTP, réputation d'envoi |
| WhatsApp | `wa-sender` conservé sur un petit VPS | (seule brique auto-hébergée restante) |

**Ce que la bascule règle, point par point :**

| Défaut de l'audit | Réglé par |
|---|---|
| §4.2 Mono-processus | Plateforme sans état, plusieurs instances |
| §4.3 Déploiement hors Git | Déploiement déclenché par un commit, prévisualisation par PR |
| §4.12 Sauvegardes sur le disque protégé | Sauvegardes gérées, hors site, restauration à la date (PITR) |
| §4.12 Secrets dans les archives | Coffre de la plateforme, rotation possible |
| F7.12 Redémarrage qui coupe les réunions | Le temps réel n'est plus dans notre processus |

**Coût estimé :** 0 à 25 €/mois aux volumes du GBUM (offres gratuites
généreuses, tarifs associatifs). **Inférieur au VPS actuel**, pour une
disponibilité, une sécurité et un confort d'exploitation sans comparaison.

**Objection à traiter honnêtement — la souveraineté.** Confier les données d'un
mouvement chrétien au Maroc à des plateformes américaines mérite une décision
consciente. Trois réponses :
1. Les données sont **chiffrées au repos et en transit** chez tous ces
   fournisseurs ; le VPS actuel ne les chiffre pas au repos.
2. La **réversibilité (NF10)** est garantie : PostgreSQL standard, export
   complet, aucun verrou propriétaire. Un retour à l'auto-hébergement reste
   possible à tout moment.
3. Le risque réel aujourd'hui n'est pas la juridiction : c'est **un disque unique
   qui porte la production et ses sauvegardes**, administré à temps perdu.

> Si le Secrétariat National préfère l'Europe : Scaleway (Paris) ou Clever Cloud
> offrent l'équivalent. L'architecture ne change pas.

### 6.2 Environnements

| Environnement | Rôle | Données |
|---|---|---|
| **Local** | Développement | Base locale + jeu d'essai réaliste **anonymisé** |
| **Prévisualisation** | Une par pull request, URL propre | Base éphémère, données d'essai |
| **Recette** | Miroir de la production | **Copie anonymisée** de la production |
| **Production** | Le service | Les vraies données |

> **Règle absolue :** aucune donnée personnelle réelle hors production. Le jeu
> d'essai est généré, jamais copié. *(Corrige le fonctionnement actuel, où la
> recette tourne sur une copie de la vraie base.)*

### 6.3 Chaîne d'intégration

```
Pull request
   │
   ├─ Format & lint (ESLint, Prettier)         ─┐
   ├─ Types (tsc --noEmit, mode strict)         │  bloquants
   ├─ Tests unitaires (Vitest)                  │  parallèles
   ├─ Tests bout en bout (Playwright)           │  < 6 min
   ├─ Accessibilité (axe-core, 100 % des écrans)│
   ├─ Règles de dépendance du domaine           │
   ├─ Sécurité des dépendances (audit + CodeQL) │
   └─ Budget de performance (Lighthouse CI)    ─┘
   │
   ├─→ Environnement de prévisualisation + capture des écrans modifiés
   │
   └─→ Fusion → migrations jouées → production → contrôle de santé
                                              → retour arrière auto si échec
```

---

## 7. ADR-004 — Un seul moteur de visioconférence

**Décision.** Supprimer le moteur *mesh* maison. Tout passe par **LiveKit**,
avec le **chiffrement de bout en bout activable par salle**.

**Contexte.** L'existant maintient deux implémentations : un mesh WebRTC maison
(2 202 lignes) pour les petites réunions chiffrées de bout en bout, et un client
LiveKit (2 534 lignes) pour les grandes. Le `README` justifiait cet arbitrage
par le fait que le SFU déchiffre pour redistribuer.

**Ce qui a changé.** LiveKit prend désormais en charge le chiffrement de bout en
bout (*insertable streams*) : le serveur route sans déchiffrer. **L'argument qui
fondait le mesh est tombé.**

**Conséquences.**

| | Avant | Après |
|---|---|---|
| Lignes de code visio à maintenir | 4 736 | **≈ 400** (le SDK fait le reste) |
| Services à administrer | LiveKit + Egress + coturn | **0** (offre gérée) |
| Chiffrement bout en bout | Petites salles seulement | **Toutes les salles, au choix** |
| Plafond de participants | ~8 en mesh, non prouvé en SFU | **200+ garanti** |
| Redémarrage serveur | **Coupe toutes les réunions** | Sans effet |

**Ce qu'on perd.** L'autonomie totale : le média transite par l'infrastructure
LiveKit. Le chiffrement de bout en bout compense (le fournisseur ne peut pas
lire), et l'auto-hébergement de LiveKit reste possible sans changer une ligne de
code applicatif — c'est un simple changement d'URL.

---

## 8. ADR-005 — Une politique d'accès unique

**Problème constaté.** L'autorisation est aujourd'hui dispersée entre
`login_required`, `admin_required`, `role_required`, `est_admin()`,
`_est_national()`, `_voit_amis()`, `_place_amis()`, `_bloques()` et des
conditions dans les gabarits. Le rôle est **binaire et sans portée** :
« Responsable » désigne aussi bien l'animateur d'une cellule de Fès que le
Secrétaire national. C'est le terrain classique de l'IDOR — et le dépôt
contient d'ailleurs un `tests/audit_idor.py`.

**Décision.** Un modèle unique **rôle × portée**, écrit une fois dans
`packages/core/acces`, appelé partout, réimplémenté nulle part.

```ts
// Un droit répond toujours à trois questions : QUI, sur QUOI, pour FAIRE QUOI.
type Portee =
  | { readonly sur: "mouvement" }
  | { readonly sur: "structure"; readonly id: StructureId; readonly descendants: boolean }
  | { readonly sur: "soi" };

type Habilitation = {
  readonly role: RoleGBUM;      // conseiller_ville, responsable_cellule, permanent_sn…
  readonly portee: Portee;      // ← ce qui manque aujourd'hui
  readonly debut: Date;
  readonly fin: Date | null;    // une habilitation expire ; un rôle en base, non
};

/** Le seul point de décision de toute l'application. */
export function peut(
  acteur: Acteur,
  action: Action,          // "lire" | "modifier" | "valider" | "supprimer" | "exporter"
  ressource: Ressource,    // porte TOUJOURS sa structure de rattachement
): Decision;               // { autorise: true } | { autorise: false, motif: Motif }
```

**Ce que cette forme impose structurellement :**

1. **Toute ressource porte sa structure.** Le type l'exige ; on ne *peut pas*
   écrire une vérification qui oublie la portée — elle ne compile pas. *(P4)*
2. **`peut()` est la seule porte.** Une règle de lint interdit toute
   comparaison de rôle en dehors de `packages/core/acces`.
3. **La décision est motivée**, jamais un booléen nu : les journaux et les
   messages d'erreur savent *pourquoi* c'est refusé.
4. **Les habilitations expirent.** Un mandat qui se termine retire l'accès
   automatiquement — ce qui n'arrive pas aujourd'hui.
5. **La navigation dérive de `peut()`.** Un écran interdit n'est pas caché par
   un `if` dans le gabarit : il n'est pas dans le menu **parce que** `peut()`
   dit non. Une seule vérité, pas deux.

**Vérification.** Un test génératif énumère `(rôle × portée) × (action ×
ressource)` et vérifie qu'aucune combinaison n'autorise un accès hors
périmètre. C'est l'audit IDOR, en continu, sur chaque pull request. *(P5)*

---

## 9. ADR-006 — Le canevas hors ligne

**Exigence.** F3.3 : le canevas de l'année est consultable **sans réseau**.
Contrainte non négociable — les cellules se réunissent sur des campus où le
réseau est mauvais, et le canevas est **la** raison d'être du hub.

**Décision.**

| Donnée | Stratégie | Motif |
|---|---|---|
| Canevas de l'année en cours | **Pré-chargé** à la première connexion, IndexedDB | Doit être là sans y penser |
| Préparation de l'animateur | Écriture locale, synchronisation différée | Se prépare dans le train |
| Séance de cellule (présents, étude) | File locale, envoi au retour du réseau | Se saisit en cellule |
| Annuaire, finances, données nominatives | **Jamais en cache** | Vol de téléphone (§7.1 du CDC) |

**Résolution des conflits.** Chaque écriture hors ligne porte un identifiant
propre et un horodatage. Une séance déjà enregistrée n'est jamais dupliquée
(idempotence par clé `cellule × date`). En cas de conflit réel, **on ne devine
pas** : les deux versions sont montrées à l'utilisateur, qui tranche.

**Limite assumée.** Le mode hors ligne couvre le canevas et la séance. Il ne
couvre pas le hub entier — le faire coûterait dix fois plus pour un usage
marginal.

---

## 10. ADR-008 — Internationalisation dès la première ligne

**Décision.** L'architecture i18n et **RTL** est posée avant le premier écran,
même si la v1 ne livre que le français.

**Motif.** Rétro-adapter le RTL à une application existante coûte 5 à 10 fois
plus cher que le prévoir : chaque `margin-left`, chaque icône directionnelle,
chaque animation de panneau est à reprendre. L'existant, entièrement en
français en dur avec des `left/right` partout, en est la démonstration.

**Ce que cela impose, dès le premier composant :**

- Aucune chaîne visible en dur — tout passe par une clé de traduction ;
  une règle de lint bloque les littéraux dans le JSX.
- **Propriétés logiques uniquement** : `margin-inline-start`, jamais
  `margin-left`. Tailwind v4 le fait nativement (`ms-4`, `pe-2`).
- `dir="rtl"` appliqué à la racine ; les icônes directionnelles se retournent.
- Formatage des dates, nombres et de la devise (MAD) par la locale.
- Tests bout en bout exécutés **dans les deux directions**.

**Coût si posé d'emblée :** quasi nul — c'est une discipline, pas du travail.
**Coût si ajouté après :** plusieurs semaines.

---

## 11. ✅ ADR-009 — Le dépôt

**Décision recommandée : un nouveau dépôt `gbum-hub`.**

| Option | Pour | Contre |
|---|---|---|
| Continuer dans `gbu-connect` | Un seul endroit ; l'historique reste | Deux applications sans rapport dans un même dépôt ; CI mêlée ; `.gitignore`, dépendances, conventions incompatibles ; **risque de toucher la production par erreur** |
| **Nouveau dépôt `gbum-hub`** | Départ propre ; CI dédiée ; conventions cohérentes ; **la production ne peut pas être cassée par mégarde** | Deux dépôts à suivre pendant la transition |

**Ce que devient `gbu-connect` :** il reste **en service et intact** — il porte
la production. Il devient la **référence métier** : c'est de lui qu'on lit les
règles à transporter. Une fois la bascule faite et les 90 jours de lecture
seule écoulés, il est archivé (jamais supprimé — c'est la mémoire technique du
mouvement).

**Fait le 8 septembre 2026.** Ce dépôt est `gbum-hub`. Documentation,
maquettes et code du hub y ont été transplantés depuis la branche
`claude/gbum-official-hub-qp17ca` de `gbu-connect`, avec leurs messages de
commit. `gbu-connect` n'a pas été modifié : il porte toujours la production.

---

## 11 bis. ADR-010 — Monolithe modulaire, pas microservices

**Question posée.** Vu la complexité du projet (13 contextes métier), faut-il
une application monolithique ou une architecture en microservices ?

**Décision. Monolithe modulaire** — un seul déployable, des frontières internes
strictes et vérifiées automatiquement.

**Motif.** Le mot « complexité » recouvre deux réalités distinctes :

- la **complexité de domaine** — beaucoup de règles métier différentes. C'est le
  cas du GBUM : canevas, camps, finances, Amis, gouvernance…
- la **complexité d'échelle** — beaucoup de trafic, beaucoup d'équipes qui
  déploient en parallèle, des composants aux besoins de croissance divergents.

**Les microservices ne traitent que la seconde, et ils aggravent la première.**

| | GBUM | Seuil où les microservices deviennent rentables |
|---|---|---|
| Développeurs | **1**, à temps partiel | 15–20+, en équipes autonomes |
| Utilisateurs | ~300–500, pic ~200 simultanés | 10⁵–10⁶ |
| Budget infrastructure | ≤ 30 €/mois | 4 à 5 chiffres |
| Exploitation | **1 non-développeur** | équipe d'astreinte |

Coût réel qu'ils feraient porter à une personne seule : N déploiements à
orchestrer, des **transactions distribuées** (« inscrire au camp » toucherait
trois services), des pannes réseau entre modules internes, des contrats
versionnés entre services, du traçage distribué pour déboguer une requête.

**L'argument décisif est dans l'existant.** GBU Connect est un monolithe, et il
a échoué — mais pas *parce qu'*il était monolithique. Il a échoué faute de
**frontières internes** (`routes.py` : 4 656 lignes) et faute de **source de
vérité unique** (18 fichiers JSON à côté de SQLite). Des microservices auraient
rendu ces deux maux pires : dix-huit bases de données au lieu de dix-huit
fichiers.

**Ce que la décision apporte.** Les bénéfices que l'on cherche dans les
microservices — frontières nettes, domaines isolés, testables séparément — sont
obtenus par les règles de dépendance de `packages/core` (§4), vérifiées en
intégration continue. Sans le prix : pas de réseau entre modules, pas
d'orchestration, pas de transaction distribuée.

**La porte de sortie.** Si un contexte devait un jour devenir un vrai service,
**la frontière existe déjà** : extraire un module dont les dépendances sont
explicites est un travail de jours. L'extraire de `routes.py` est un travail de
mois. Le monolithe modulaire est la rampe d'accès aux microservices, pas leur
contraire.

### Ce qui est légitimement séparé — et pourquoi ce n'en est pas

| Séparé | Motif | Pourquoi ce n'est pas un microservice |
|---|---|---|
| **LiveKit** | Profil de charge radicalement différent (bande passante, pas CPU) | Service **géré, tiers** — non exploité par nous |
| **`apps/worker`** | Ne doit jamais bloquer une requête web ; échoue autrement | Même code, même base — un autre point d'entrée |
| **`wa-sender`** | Existe déjà et fonctionne | Isolé derrière **un seul** adaptateur |

> Principe : **on sépare ce qui a un profil d'exécution réellement différent,
> pas ce qui porte un nom différent.**

**Orthogonalité.** Cette décision est indépendante d'ADR-002 (le langage) : un
monolithe modulaire se réalise aussi bien en TypeScript qu'en Python, en Java ou
en C#.

---

## 12. Registre des décisions

| # | Décision | Statut |
|---|---|---|
| **ADR-001** | **Deux surfaces, une seule source de vérité** | ✅ **accepté** (9 sept. 2026) |
| **ADR-011** | **Posture de visibilité publique : ouverte** | ✅ **accepté** (9 sept. 2026) — *réserve : confirmation SN* |
| **ADR-002** | **Pile TypeScript de bout en bout** | ✅ **accepté** (8 sept. 2026) |
| ADR-003 | PostgreSQL unique, transactionnel, migrations versionnées | 🟡 proposé — *phase 5.2* |
| ADR-004 | Moteur de visio unique (LiveKit + E2EE) | 🟡 proposé — *phase 2.7* |
| ADR-005 | Politique d'accès unique, rôle × portée | 🟡 proposé — *phase 2.2* |
| ADR-006 | Canevas et séance disponibles hors ligne | 🟡 proposé |
| ADR-007 | Plateforme gérée plutôt que VPS auto-administré | ⚖️ à arbitrer — *phase 5.4* |
| ADR-008 | i18n et RTL posés dès la première ligne | 🟡 proposé |
| ADR-009 | Nouveau dépôt `gbum-hub` | ✅ **accepté** (8 sept. 2026) |
| **ADR-010** | **Monolithe modulaire, pas microservices** | ✅ **accepté** (7 sept. 2026) |

> **Un ADR « proposé » n'autorise rien.** Un prototype de la politique
> d'accès (ADR-005) a été écrit puis supprimé le 9 septembre 2026 : il
> anticipait une décision qui n'était pas prise. Le raisonnement reste
> dans ce document ; le code sera réécrit après validation.

*Un ADR accepté n'est jamais modifié : il est remplacé par un ADR ultérieur qui
le supersède, en expliquant ce qui a changé.*
