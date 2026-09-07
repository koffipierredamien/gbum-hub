# Plan de route — Hub officiel du GBUM

> Estimations en **jours-homme effectifs**. Sur un projet bénévole à temps
> partiel, comptez **1,5 à 2,5 jours calendaires par jour-homme** selon la
> période universitaire.
> Les durées supposent un développeur **déjà à l'aise** avec la pile retenue ;
> ajoutez 15 à 20 jours de montée en compétence si ce n'est pas le cas.

---

## Principe de lotissement

Chaque lot **livre quelque chose d'utilisable**. On ne construit pas six mois
avant de montrer. La séquence suit la valeur pour le mouvement, pas la facilité
technique :

```
Lot 0  Fondations       → rien de visible, tout de solide
Lot 1  Vitrine          → le mouvement devient visible et joignable      ⭐ valeur immédiate
Lot 2  Socle + Canevas  → LE CŒUR : la mission entre dans l'outil        ⭐⭐⭐ raison d'être
Lot 3  Pilotage         → le national voit le terrain
Lot 4  Reprise & bascule→ l'ancien système s'éteint                      ⚠️ jalon critique
Lot 5  Camps, réunions, communication
Lot 6  Finances, Amis, parcours
Lot 7  Mémoire, multilingue, raffinements
```

---

## Lot 0 — Fondations · **12–16 j**

*Rien de visible. Tout ce qui rend le reste possible — et sûr.*

| # | Tâche | j |
|---|---|---|
| 0.1 | Dépôt, monorepo, conventions, configurations partagées | 2 |
| 0.2 | Chaîne CI complète : lint, types, tests, a11y, sécurité, performance | 3 |
| 0.3 | Schéma initial + migrations versionnées + jeu d'essai **anonymisé** | 2 |
| 0.4 | Authentification (lien magique, mot de passe, TOTP) + sessions | 3 |
| 0.5 | **Politique d'accès `peut()`** + test génératif rôle × portée (ADR-005) | 3 |
| 0.6 | Environnements, déploiement automatique, prévisualisation par PR | 2 |
| 0.7 | Observabilité : Sentry, journaux structurés, page de santé | 1 |

**Jalon 0 :** une page vide se déploie toute seule, sur trois environnements,
avec une CI qui refuse le code non conforme, et une politique d'accès déjà
testée. *C'est la fondation qui manque le plus à l'existant.*

---

## Lot 1 — Vitrine publique et accueil · **16–22 j** ⭐

*Le premier lot visible. Il sert le mouvement dès le jour de sa mise en ligne.*

| # | Tâche | Réf. CDC | j |
|---|---|---|---|
| 1.1 | Design system « Foyer v2 » : tokens, composants, thème clair/sombre | — | 5 |
| 1.2 | Accueil, présentation, vision décennale, devise, thème de l'année | F1.1 | 3 |
| 1.3 | « Nous trouver » : villes, campus, cellules publiques, carte | F1.2 | 2 |
| 1.4 | **Parcours d'accueil de rentrée** + relance à 72 h | **F1.3** | 4 |
| 1.5 | Agenda public, page « Soutenir », contact | F1.4–F1.7 | 3 |
| 1.6 | SEO complet, données structurées, `sitemap`, Open Graph | F1.9 | 2 |
| 1.7 | Contenus éditables par le SN sans développeur | F1.1 | 3 |

**Jalon 1 :** `gbu-maroc.org` est en ligne, rapide, indexée, et un étudiant qui
cherche un groupe est **mis en relation avec un responsable réel**.
*L'espace membre actuel continue de tourner en parallèle, intact.*

---

## Lot 2 — Socle et canevas · **26–34 j** ⭐⭐⭐

*Le cœur du projet. Ce lot met la mission dans l'outil.*

| # | Tâche | Réf. CDC | j |
|---|---|---|---|
| 2.1 | Personnes, structures, rattachements, rôles du GBUM | F2.1–F2.4 | 5 |
| 2.2 | Annuaire filtrable, paginé, cloisonné par portée | F2.5 | 3 |
| 2.3 | Comptes : invitation, activation, cycle de vie, 2FA | F2.8–F2.9 | 3 |
| 2.4 | **Canevas annuel : modèle, études, publication** | **F3.1–F3.2** | 5 |
| 2.5 | **Consultation du canevas + hors ligne (PWA, IndexedDB)** | **F3.3** | 5 |
| 2.6 | **Progression par cellule** | **F3.4** | 3 |
| 2.7 | **Séance de cellule : émargement rapide, hors ligne** | **F3.7–F3.8** | 4 |
| 2.8 | Préparation de l'animateur, retours de terrain | F3.5–F3.6 | 3 |
| 2.9 | Export PDF imprimable du canevas | F3.11 | 2 |
| 2.10 | « Voir à la place de » avec bandeau et journal | F2.10 | 2 |

**Jalon 2 :** un responsable de cellule ouvre le canevas de la semaine **dans
le train, sans réseau**, anime son étude, et enregistre sa séance en trois
gestes. **C'est le moment où le hub sert la mission.**

---

## Lot 3 — Pilotage · **14–18 j**

| # | Tâche | Réf. CDC | j |
|---|---|---|---|
| 3.1 | Rapport mensuel « cinq champs » | F4.1 | 3 |
| 3.2 | **Le silence est une information** : écran des cellules muettes | F4.2 | 2 |
| 3.3 | Vision décennale → thème annuel → objectifs → activités | F4.3 | 4 |
| 3.4 | Plan d'action décentralisé | F4.4 | 3 |
| 3.5 | Tableaux de bord cellule / ville / national | F4.5 | 4 |
| 3.6 | Recherche globale filtrée par les droits | FT.2 | 2 |

**Jalon 3 :** le Secrétariat National ouvre un écran le lundi matin et sait
**quelles cellules vivent, lesquelles s'éteignent, et où en est le canevas.**

---

## Lot 4 — ⚠️ Reprise des données et bascule · **14–20 j**

*Le lot le plus risqué du projet. Il ne se rattrape pas.*

| # | Tâche | j |
|---|---|---|
| 4.1 | Extracteur : SQLite + **18 fichiers JSON** → format intermédiaire documenté | 4 |
| 4.2 | Réconciliation, dédoublonnage, **rapport d'anomalies relu par le SN** | 4 |
| 4.3 | Chargement avec contrôles d'intégrité bloquants | 3 |
| 4.4 | **Trois répétitions à blanc**, chronométrées | 3 |
| 4.5 | Bascule DNS, ancien système en lecture seule, retour arrière préparé | 3 |
| 4.6 | Accompagnement des utilisateurs, documentation, permanence | 3 |

**Jalon 4 :** `hub.gbu-maroc.org` porte les vraies données. L'ancien système
passe en lecture seule pour **90 jours**, puis est archivé.

> **Règles non négociables de ce lot :** aucune donnée perdue, aucune donnée
> devinée, toute anomalie signalée et arbitrée par un humain, retour arrière
> testé **avant** la bascule.

---

## Lot 5 — Camps, réunions, communication · **30–40 j**

| # | Tâche | Réf. CDC | j |
|---|---|---|---|
| 5.1 | Camps : dossier, participants, chambres, transport | F6.1–F6.5 | 8 |
| 5.2 | Camps : finances, boutique, attestations, programme | F6.6–F6.10 | 6 |
| 5.3 | Réunions : moteur unique LiveKit, E2EE, salle d'attente, modération | F7.1–F7.6 | 8 |
| 5.4 | Enregistrement, transcription, compte rendu assisté, exports | F7.7–F7.9 | 5 |
| 5.5 | Annonces, envois ciblés, préférences de contact, canaux | F8.1–F8.5 | 6 |
| 5.6 | Documents, galerie, calendrier, iCal | F8.7–F8.8 | 4 |

**Jalon 5 :** une réunion nationale à 200 participants se tient sans incident,
**et un redémarrage du serveur ne la coupe pas.**

---

## Lot 6 — Finances, Amis, parcours · **26–34 j**

| # | Tâche | Réf. CDC | j |
|---|---|---|---|
| 6.1 | Soutiens, versements, budgets multi-niveaux, validation | F9.1–F9.4 | 8 |
| 6.2 | Engagements, promesses, relances, taux de tenue | F9.5 | 4 |
| 6.3 | **Journal d'audit inaltérable des écritures financières** | F9.7 | 3 |
| 6.4 | Finissants, consentement, passage aux Amis | F10.2 | 4 |
| 6.5 | Espace et place des Amis, cartographie du réseau | F10.3–F10.5 | 5 |
| 6.6 | Parcours, formations, relève, passation | F11.1–F11.6 | 6 |
| 6.7 | Activités typées, agapè, sorties, **JTPA cloisonné** | F5.1–F5.7 | 5 |

**Jalon 6 :** parité fonctionnelle complète avec l'existant, **plus** ce qui
lui manquait.

---

## Lot 7 — Mémoire, langues, raffinements · **20–26 j**

| # | Tâche | Réf. CDC | j |
|---|---|---|---|
| 7.1 | Chronologie, archives, témoignages, photothèque | F12.1–F12.4 | 7 |
| 7.2 | **Arabe (RTL) et anglais** | F1.10, NF5 | 8 |
| 7.3 | Notifications *push*, centre de notifications | FT.6 | 3 |
| 7.4 | Export complet, réversibilité, conformité (registre, AIPD) | FT.7, C1–C8 | 5 |

---

## Récapitulatif

| Lot | Contenu | Jours-homme | Cumul |
|---|---|---:|---:|
| 0 | Fondations | 12–16 | 16 |
| 1 | Vitrine et accueil ⭐ | 16–22 | 38 |
| 2 | Socle et canevas ⭐⭐⭐ | 26–34 | 72 |
| 3 | Pilotage | 14–18 | 90 |
| 4 | Reprise et bascule ⚠️ | 14–20 | 110 |
| 5 | Camps, réunions, communication | 30–40 | 150 |
| 6 | Finances, Amis, parcours | 26–34 | 184 |
| 7 | Mémoire, langues, raffinements | 20–26 | 210 |
| | **Total** | **158–210 j** | |

**Traduction en calendrier réaliste**, pour un développeur bénévole :

| Rythme | Jusqu'au jalon 2 (le canevas) | Jusqu'au jalon 4 (bascule) | Total |
|---|---|---|---|
| ~1 jour/semaine | ~16 mois | ~26 mois | ~4 ans |
| ~2 jours/semaine | ~8 mois | ~13 mois | ~2 ans |
| ~3 jours/semaine | ~6 mois | ~9 mois | ~16 mois |
| Temps plein | ~3,5 mois | ~5,5 mois | ~10 mois |

> **La lecture honnête de ce tableau.** À un jour par semaine, le projet
> complet dépasse la durée d'études d'une génération de GBUssiens. **C'est le
> risque n°1 du projet — bien avant la technique.**

---

## Comment réduire ce risque

Quatre leviers, par ordre d'efficacité :

**1. Livrer tôt, et vraiment.** Les jalons 1 et 2 valent déjà, à eux seuls, la
peine d'exister : la vitrine et le canevas servent le mouvement dès la
première mise en ligne, sans attendre le reste. **Ne jamais retarder une mise
en ligne pour attendre une fonctionnalité de plus.**

**2. Assumer de ne pas tout reprendre.** L'existant couvre douze domaines. Il
n'est pas certain qu'ils soient tous utilisés. Avant le lot 5, **mesurer
l'usage réel** de chaque écran de la production : ce qui n'est pas utilisé
n'est pas repris. Il est probable que 30 à 40 % du périmètre disparaisse ainsi
— c'est autant de gagné.

**3. Faire coexister les deux systèmes longtemps.** L'ancien hub n'a pas à
mourir au lot 4. Il peut porter les camps, les finances et la visio pendant
que le nouveau porte la vitrine, le socle et le canevas, **reliés par une
authentification commune**. La bascule devient progressive et sans date
couperet.

**4. Chercher du renfort.** Un second développeur, même à temps très partiel,
change la nature du projet. La cible est justement conçue pour cela : contextes
isolés, fichiers courts, types stricts, CI qui protège. **L'architecture
actuelle, elle, l'interdit** — `TRAVAILLER-A-DEUX.md` demande explicitement de
se répartir les *fichiers* pour ne pas se marcher dessus.

---

## Ordre des risques

| Risque | Prob. | Impact | Parade |
|---|---|---|---|
| **Le projet n'aboutit pas faute de temps** | **Élevée** | **Critique** | Jalons livrables, périmètre réduit, coexistence longue |
| Perte de données à la bascule | Moyenne | Critique | 3 répétitions, rapport d'anomalies, retour arrière testé |
| Montée en compétence sous-estimée | Moyenne | Élevé | Choisir la pile qu'on maîtrise **déjà** (ADR-002 §3.4) |
| Fuite de données personnelles | Faible | **Critique** | `peut()` unique, test IDOR génératif, audit externe |
| Rejet par les utilisateurs | Moyenne | Élevé | 5 testeurs réels dès le lot 1, DoD point 6 |
| Contenus éditoriaux jamais fournis par le SN | **Élevée** | Moyen | Textes provisoires marqués, relances, responsable produit désigné |
| Dérive de l'écosystème JS | Moyenne | Faible | Versions verrouillées, mises à jour planifiées |

> **Le risque n°1 n'est pas technique.** Il est de calendrier, et il se traite
> par le périmètre — pas par la vitesse de frappe.
