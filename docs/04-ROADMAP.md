# Échéancier — Hub officiel du GBUM

### Réserves ouvertes

| # | Réserve | Origine | Bloque |
|---|---|---|---|
| **R1** | La posture de visibilité publique (ADR-011) doit être confirmée par le Secrétariat National. | Point 2.4, tranché par Pierre alors que l'échéancier l'attribue au Secrétariat National. | La première mise en ligne portant de vrais noms — pas la conception. |
| **R2** | Les maquettes portent des données inventées — thème, chiffres, « plus de trente ans », budget, dates de camp — ainsi qu'un parcours « Trouver mon groupe » qui va au-delà d'ADR-011. | Écrites avant que le cadrage soit validé. | Rien pour l'instant : reprise décidée en **phase 4**. |
| **R5** | Le sort du **canevas sur le site public** : l'archive des canevas passés est-elle ouverte à tous, ou réservée aux membres ? | Le mouvement a demandé une section canevas — année en cours et années antérieures — dans le cadre du site public. | L'exigence A2.3. |
| **R4** | Ce qu'est réellement un **JTPA — Journée de Témoignage par Amitié** — ce qui s'y passe, ce qui en est conservé, par qui et combien de temps. | Le sigle avait été glosé « évangélisation par amitié » et modélisé comme un suivi relationnel continu ; « journées » désigne des événements. | L'exigence F5.6, le modèle de menace correspondant, et le point 2.6. |
| **R3** | L'histoire des GBU et du GBUM manque entièrement. | Aucune source publique ; le Secrétariat National sera sollicité. | Rien : **une place est réservée** dans le produit (F1.11, domaine D12). |

---

> **La règle du projet.** Le travail avance par **phases**. On ne commence
> rien de la phase suivante avant que la phase en cours soit **validée à
> 70 %**. Les 30 % restants deviennent des réserves écrites, traitées en
> parallèle — jamais un prétexte pour bloquer, jamais un oubli.
>
> Chaque phase porte une liste **numérotée** de points. Un point est validé
> quand la personne compétente dit oui, explicitement. 70 % des points
> validés = la porte s'ouvre. C'est comptable, pas au ressenti.

**Nous sommes en phase 2.**

| # | Phase | Livrable | Qui valide | État | Validé |
|---|---|---|---|---|---|
| 0 | Connaître l'existant | L'audit | Pierre | ✅ | 1/1 |
| 1 | Cadrage | Le mouvement, les acteurs, les besoins | Pierre + Secrétariat National | 🟡 en cours | **3/6** |
| **2** | **Organisation du hub** | Un site ou plusieurs · les accès · les domaines | Pierre + Secrétariat National | 🔵 **en cours** | **2/7** |
| 3 | Cahier des charges | Le CDC, exigence par exigence | Secrétariat National + Pierre | 🟡 écrit | 0/7 |
| 4 | Maquettes | Les écrans, éprouvés sur téléphone réel | Pierre + Secrétariat National + 5 testeurs | 🟡 dessinées | 0/6 |
| 5 | Stack technique | La pile, et pourquoi | Pierre | 🟡 partielle | 1/5 |
| 6 | Plan de développement | Architecture · tests · lotissement, **avant de coder** | Pierre | ⬜ | 0/6 |
| 7 | Développement | Lot par lot | Pierre | ⬜ | — |

---

## Phase 0 — Connaître l'existant ✅

**Livrable :** [`00-AUDIT-EXISTANT.md`](00-AUDIT-EXISTANT.md).
67 204 lignes parcourues, mesurées, classées par gravité.

- [x] **0.1** L'audit décrit fidèlement l'existant.

---

## Phase 1 — Cadrage 🟡

**Livrable :** [`01-CAHIER-DES-CHARGES.md`](01-CAHIER-DES-CHARGES.md) §1 à §3.
**Question de la phase :** *pour qui construit-on, et pour répondre à quoi ?*

- [x] **1.1** Le mouvement est décrit fidèlement : vision décennale, devise,
      thème annuel, organisation du national à la cellule. **Hiérarchie
      complète fournie par Pierre le 9 sept. 2026** — SN, Conseil Exécutif,
      bureaux de ville, cellules, Amis. *(Pierre ; confirmation du Secrétariat National attendue)*
- [x] **1.2** Les acteurs correspondent à des rôles réels du mouvement.
      **Les cinq personas inventés ont été retirés** le 9 sept. 2026 ; les
      rôles viennent désormais de la description faite par Pierre.
      *(Pierre ; confirmation du Secrétariat National attendue)*
- [ ] **1.3** Toutes les activités du GBUM sont recensées. **Enrichie le
      9 sept. 2026** : études bibliques hebdomadaires **et communautaires**,
      **prière**, **masterclass** (formations), **sorties de détente**, sorties
      d'évangélisation, agapès, JTPA, **jeux bibliques et jeux**, camps.
      *(Secrétariat National)* — **liste explicitement ouverte.**
- [x] **1.4** Les manques identifiés sont réels. **Confirmé par Pierre le
      9 sept. 2026** : le canevas, les JTPA et la vision décennale existent
      bel et bien dans le mouvement, et ne sont nulle part dans l'outil.
      *(Pierre)*
- [ ] **1.5** Les objectifs sont les bons, et leurs cibles atteignables.
      **Scindés le 9 sept. 2026** en trois objectifs du **site public**
      (P1 visibilité, P2 mémoire ouverte, P3 actualisation régulière) et trois
      de l'**espace de travail** (T1 travailler ensemble, T2 ne pas ressaisir,
      T3 garder la trace). Cibles à fixer. *(Secrétariat National)*
- [ ] **1.6** Les non-objectifs de la v1 sont acceptés. *(Secrétariat National)*

---

## Phase 2 — Organisation du hub 🔵 **← nous sommes ici**

**Livrable :** [`02-ARCHITECTURE.md`](02-ARCHITECTURE.md) §1, §2, §4 et les ADR
qui en dépendent.
**Question de la phase :** *quelle forme prend le hub, et qui voit quoi ?*

C'est la phase qui décide de la **méthode**, avant toute technique.

- [x] **2.1** **Un seul site ou plusieurs ?** → **Deux surfaces, une seule
      source de vérité.** Décidé le 9 sept. 2026 sur l'examen d'IFES, UCCF,
      Scouts et Guides de France et Rotary. *(Pierre)* — [ADR-001](02-ARCHITECTURE.md)
- [ ] **2.2** **Comment se gèrent les accès ?** Le principe est posé par le
      mouvement — *le niveau n+1 accède à tout ce à quoi le niveau n accède,
      plus ce qui lui est propre ; le Secrétariat National accède à l'espace
      des Amis, l'inverse non*. **Reste la question entre pairs :** le bureau
      de Rabat voit-il le travail de celui de Fès ? *(Pierre + Secrétariat
      National)* — ADR-005, décision D11
- [ ] **2.3** Les **sections** sont complètes et correctement nommées : six
      pour le site public (A1–A6), six espaces par niveau (B1–B6) et douze
      sections transverses (C1–C12). *(Secrétariat National)*
- [x] **2.4** Le partage **public / membre** → **posture ouverte** : villes,
      campus, cellules, jours, heures, lieux et contacts de groupe sont
      publics, **la publication s'arrêtant à la ville** : les cellules sont
      nommées, mais aucun responsable de cellule n'est exposé, et le seul
      contact publié est celui du **responsable de ville**.
      Décidé le 9 sept. 2026. *(Pierre)* — [ADR-011](02-ARCHITECTURE.md)
      ⚠️ **Réserve R1** — ce point revient au Secrétariat National selon le présent échéancier.
      Sa confirmation est requise **avant toute mise en ligne portant de vrais
      noms**.
- [ ] **2.5** Le **périmètre de la v1** : quels domaines sortent en premier.
      *(Secrétariat National + Pierre)*
- [ ] **2.6** Le sort du **JTPA — Journées de Témoignage par Amitié** : dans le
      hub, cloisonné, ou hors du hub. *(Secrétariat National — décision du mouvement, pas une
      décision technique)* — **suppose la réserve R4 levée**.
- [ ] **2.7** Le sort de la **visioconférence** : la garder, un moteur ou deux.
      *(Pierre + Secrétariat National)* — ADR-004

---

## Phase 3 — Cahier des charges ⬜

**Livrable :** [`01-CAHIER-DES-CHARGES.md`](01-CAHIER-DES-CHARGES.md) en entier.
**Question de la phase :** *que doit faire le hub, exigence par exigence ?*

- [ ] **3.1** Exigences fonctionnelles des domaines prioritaires D1 à D4 —
      vitrine, socle, **canevas d'études**, pilotage. *(Secrétariat National)*
- [ ] **3.2** Exigences fonctionnelles des domaines D5 à D12. *(Secrétariat National)*
- [ ] **3.3** Exigences non fonctionnelles : performance, hors ligne, mobile,
      accessibilité, langues. *(Pierre)*
- [ ] **3.4** **Sécurité et protection des personnes** — le modèle de menace,
      les données sensibles, la conformité. *(Secrétariat National + Pierre)*
- [ ] **3.5** Les contraintes sont exactes : équipe, budget, exploitation,
      utilisateurs. *(Pierre + Secrétariat National)*
- [ ] **3.6** Les critères d'acceptation de la v1. *(Secrétariat National + Pierre)*
- [ ] **3.7** La stratégie de **reprise des données** existantes. *(Pierre)*

---

## Phase 4 — Maquettes ⬜

**Livrable :** les sept planches de [`../maquettes`](../maquettes), et celles
qui manqueront.
**Question de la phase :** *à quoi ressemble le hub, et est-ce utilisable ?*

- [ ] **4.1** La direction artistique — thème « Foyer » repris de l'existant.
      *(Pierre + Secrétariat National)*
- [ ] **4.2** Les six écrans prioritaires, un par un. *(Secrétariat National)*
- [ ] **4.3** Éprouvés **sur un téléphone réel, en connexion réelle**, par
      cinq GBUssiens de cinq villes. *(testeurs)*
- [ ] **4.4** Les états vides et d'erreur sont traités. *(Pierre)*
- [ ] **4.5** Contrastes et cibles tactiles vérifiés, WCAG 2.2 AA. *(Pierre)*
- [ ] **4.6** Les écrans manquants sont identifiés et priorisés. *(Secrétariat National + Pierre)*

> **Prérequis à réclamer au Secrétariat National :** le canevas d'études de
> l'année en cours, de vraies photos, les textes officiels de la vision et du
> thème. Sans le canevas réel, l'écran le plus important du hub reste
> maquetté à l'aveugle.

---

## Phase 5 — Stack technique 🟡

**Livrable :** [`02-ARCHITECTURE.md`](02-ARCHITECTURE.md) §3, §6.
**Question de la phase :** *avec quoi construit-on, et à quel coût ?*

- [x] **5.1** Le **langage** — TypeScript de bout en bout. *(Pierre, 8 sept. 2026)*
- [ ] **5.2** La **base de données** et sa stratégie de migration. — ADR-003
- [ ] **5.3** Le **temps réel** — moteur, hébergé ou géré. — ADR-004
- [ ] **5.4** L'**hébergement** — plateforme gérée ou VPS. — ADR-007
- [ ] **5.5** Le **coût mensuel** est acceptable et prévisible. *(Secrétariat National)*

---

## Phase 6 — Plan de développement ⬜

**Livrable :** un document à écrire, `06-PLAN-DE-DEVELOPPEMENT.md`.
**Question de la phase :** *comment écrit-on ce code, et comment prouve-t-on
qu'il marche — avant d'en écrire la première ligne ?*

- [ ] **6.1** L'**architecture du code** : contextes, frontières, règles de
      dépendance. Expliquée, pas seulement décrétée.
- [ ] **6.2** Le **modèle de données** complet : entités, relations,
      contraintes.
- [ ] **6.3** La **stratégie de test** : quoi tester, à quel niveau, ce qu'on
      ne teste pas.
- [ ] **6.4** Les **conventions** — [`03-CONVENTIONS-ET-QUALITE.md`](03-CONVENTIONS-ET-QUALITE.md).
- [ ] **6.5** Le **lotissement** du développement, et l'ordre des lots.
- [ ] **6.6** La **définition de « terminé »**.

---

## Phase 7 — Développement ⬜

Ne commence qu'à 70 % de la phase 6.

Le découpage ci-dessous est un **premier jet, à revoir en phase 6** — il a été
écrit avant que les phases 1 à 5 soient validées, et rien ne dit qu'il y
survivra.

| Lot | Contenu | Estimation |
|---|---|---|
| 0 | Fondations : dépôt, CI, base, authentification, politique d'accès | 12–16 j |
| 1 | Vitrine publique et accueil de rentrée | 16–22 j |
| 2 | Socle et **canevas d'études** | 26–34 j |
| 3 | Pilotage : rapports, plan d'action, tableaux de bord | 14–18 j |
| 4 | Reprise des données et bascule ⚠️ | 14–20 j |
| 5 | Camps, réunions, communication | 30–40 j |
| 6 | Finances, Amis, parcours | 26–34 j |
| 7 | Mémoire, langues, raffinements | 20–26 j |
| | **Total** | **158–210 j** |

**Traduction en calendrier**, pour un développeur bénévole :

| Rythme | Jusqu'au canevas (lot 2) | Total |
|---|---|---|
| ~1 jour/semaine | ~16 mois | ~4 ans |
| ~2 jours/semaine | ~8 mois | ~2 ans |
| ~3 jours/semaine | ~6 mois | ~16 mois |

---

## Le risque n°1 reste le calendrier

À un jour par semaine, le projet complet dépasse la durée d'études d'une
génération de GBUssiens. Ce n'est pas un problème technique, et il ne se
résout pas en codant plus vite. Quatre leviers, par efficacité décroissante :

1. **Livrer tôt et vraiment.** La vitrine et le canevas valent à eux seuls la
   peine d'exister. Ne jamais retarder une mise en ligne pour attendre une
   fonctionnalité de plus.
2. **Assumer de ne pas tout reprendre.** L'existant couvre douze domaines ;
   rien ne dit qu'ils servent tous. Mesurer l'usage réel avant de reprendre.
3. **Faire coexister les deux systèmes longtemps.** L'ancien hub n'a pas à
   mourir d'un coup.
4. **Chercher du renfort.** L'architecture cible est faite pour cela ; celle
   d'aujourd'hui l'interdit.

---

## Journal des phases

| Date | Phase | Événement |
|---|---|---|
| 7 sept. 2026 | 0 | Audit de l'existant livré |
| 8 sept. 2026 | 5 | Langage tranché : TypeScript |
| 8 sept. 2026 | — | Dépôt `gbum-hub` créé |
| 9 sept. 2026 | 2 | Point 2.1 tranché : deux surfaces, une seule source de vérité (ADR-001), sur précédents IFES / UCCF / SGDF / Rotary |
| 9 sept. 2026 | 1-2 | **Cahier des charges refondu (v2.0)** : deux produits aux objectifs séparés, sections par niveau, modèle d'accès cumulatif, mandats annuels, activités enrichies. Le canevas n'est plus présenté comme « le cœur » — c'était une lecture de la maîtrise d'œuvre |
| 9 sept. 2026 | 1 | [Note au Secrétariat National](07-NOTE-AU-SECRETARIAT-NATIONAL.md) rédigée : elle regroupe les points 1.5, 1.6, la réserve R1, la réserve R4 et les informations manquantes en une seule réunion |
| 9 sept. 2026 | 1 | Point 1.4 validé : les manques sont réels. **JTPA corrigé en « Journées de Témoignage par Amitié »** — réserve R4 ouverte sur sa forme. Composition du mouvement établie : la plupart des GBUssiens viennent des pays du GBUAF |
| 9 sept. 2026 | 1 | Rattachement IFES établi : **région MENA**. Une place est réservée à l'histoire du GBU et du GBUM (F1.11, D12), dont le contenu sera demandé au Secrétariat National |
| 9 sept. 2026 | 2 | Précision : une cellule publie **son nom et son nombre de membres**, rien d'autre |
| 9 sept. 2026 | 1 | Cadrage réécrit : hiérarchie réelle du GBUM fournie par Pierre ; histoire IFES/GBUAF sourcée ; **tous les indicateurs et personas inventés retirés** |
| 9 sept. 2026 | 2 | Point 2.4 précisé : la publication s'arrête à la ville. Point 2.4 orienté : posture de visibilité **ouverte** (ADR-011), sur le modèle de GBU France. Réserve R1 : confirmation du Secrétariat National avant mise en ligne de vrais noms |
| 9 sept. 2026 | — | **Échéancier réordonné en phases.** Le prototype de code écrit hors phase est supprimé : il anticipait les phases 6 et 7 sur des décisions non validées. |
