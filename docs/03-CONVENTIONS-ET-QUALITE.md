# Conventions de code et exigences de qualité

> Ce document est **contraignant**. Ce qui peut être vérifié par une machine
> l'est, en intégration continue. Le reste est vérifié en revue.
> Une règle qu'on doit *penser* à appliquer finit par ne plus l'être.

---

## 1. La langue du code

Décision : **le domaine parle français, la technique parle anglais.**

```ts
// ✅ Le vocabulaire du GBUM, tel que le mouvement le dit
type Canevas = { annee: AnneeAcademique; etudes: readonly Etude[] };
type Rattachement = { personneId: PersonneId; structureId: StructureId };
function etatRemiseRapport(cellule: Structure, mois: Mois): EtatRemise {}

// ✅ La plomberie, en anglais comme tout l'écosystème
async function fetchWithRetry(url: string, options: RequestOptions) {}
export function useDebounce<T>(value: T, delay: number): T {}

// ❌ Traduire le domaine : on perd le mot que le mouvement emploie
type Outline = { year: AcademicYear; studies: readonly Study[] };

// ❌ Franciser la plomberie : on se coupe de tout l'écosystème
function recupererAvecNouvelEssai(adresse: string) {}
```

**Pourquoi.** Le GBUM dit « canevas », « cellule », « rattachement »,
« GBUssien », « agapè », « finissant », « Ami du GBU ». Ces mots n'ont pas de
traduction fidèle, et surtout : **le code doit pouvoir être lu à voix haute
devant le Secrétariat National.** C'est ce que le projet actuel a bien fait, et
c'est à conserver.

**Règles annexes :**
- Commentaires, messages d'erreur, journaux, tests : **en français**.
- Messages de commit : **en français**.
- Noms de fichiers et dossiers : `kebab-case` sans accent (`rapport-mensuel.ts`).
- Identifiants dans le code : `camelCase` sans accent (`etatRemise`, `annee`).
- Textes affichés : **jamais en dur** — clé de traduction obligatoire (ADR-008).

---

## 2. Les limites dures

Vérifiées automatiquement. Une pull request qui les dépasse ne passe pas.

| Limite | Valeur | Pourquoi |
|---|---|---|
| Lignes par fichier | **400** | `routes.py` en fait 4 656 et est devenu impossible à partager |
| Lignes par fonction | **50** | Au-delà, elle fait plus d'une chose |
| Paramètres d'une fonction | **4** | Au-delà, passer un objet nommé |
| Complexité cyclomatique | **10** | Au-delà, la fonction n'est plus testable exhaustivement |
| Profondeur d'imbrication | **3** | Sortir tôt, plutôt qu'imbriquer |
| Composant React | **150 lignes** | Au-delà, extraire un sous-composant |
| `any` | **0** | Sans exception. `unknown` + validation à la place |
| `@ts-ignore` | **0** | Un commentaire `@ts-expect-error` motivé, à défaut |
| Avertissements de linter | **0** | Un avertissement toléré devient invisible |

---

## 3. Les huit règles de fond

### R1 — Le domaine ne connaît pas la technique

`packages/core` n'importe **jamais** `next`, `react`, `drizzle`, `fetch` ni
aucun accès réseau. Une règle du GBUM se teste en mémoire, en millisecondes.
*Vérifié par un test de dépendances en CI.*

### R2 — Aucune erreur n'est avalée

L'existant compte **57 blocs `except …: pass`** et 36 `except Exception` dans
un seul fichier. Le code le constate lui-même : *« le filtre par ville de
l'annuaire disparaissait en silence, avalé par son try/except. »*

```ts
// ❌ interdit — une panne, une faute de frappe et un vrai refus
//    deviennent indiscernables
try { return await lireAmis(id); } catch { return []; }

// ✅ le résultat dit ce qui s'est passé, l'appelant décide
const amis = await lireAmis(id);            // Resultat<Ami[], ErreurLecture>
if (!amis.ok) {
  journal.error("lecture du carnet des Amis", { personneId: id, cause: amis.erreur });
  return reponseDegradee(amis.erreur);      // et l'écran le DIT à l'utilisateur
}
```

Un `catch` fait au moins l'une de ces trois choses : journaliser avec contexte,
transformer en erreur métier typée, remonter. **Jamais rien.**

### R3 — Les états impossibles doivent être impossibles

```ts
// ❌ quatre états représentables, dont deux absurdes
type Etat = { chargement: boolean; donnees?: Camp; erreur?: string };

// ✅ trois états, tous valides — le compilateur force à tous les traiter
type Etat =
  | { readonly type: "chargement" }
  | { readonly type: "pret"; readonly camp: Camp }
  | { readonly type: "erreur"; readonly cause: ErreurMetier };
```

*C'est P4 : la sécurité et l'exactitude par le type, pas par la vigilance.*

### R4 — Valider aux frontières, faire confiance à l'intérieur

Toute donnée entrante (formulaire, URL, API, fichier, webhook) est validée par
un schéma **Zod** à la frontière, et devient un type sûr. Le cœur ne
re-vérifie pas : il **sait**.

### R5 — Une règle écrite une seule fois

> *« Deux règles recopiées finissent toujours par diverger, et c'est alors une
> porte de trop. »* — `app/routes.py`, GBU Connect

Le diagnostic de l'existant est juste ; le remède doit être appliqué
intégralement. Toute règle d'accès vit dans `packages/core/acces`. Toute règle
de calcul vit dans son contexte. **La duplication d'une règle métier est un
défaut bloquant en revue**, même si le code fonctionne.

### R6 — Le commentaire raconte l'incident, pas le code

C'est la meilleure pratique de l'existant, et elle est conservée telle quelle.

```ts
// ❌ paraphrase — n'apprend rien
// Fixe la hauteur minimale à 44 pixels
const HAUTEUR_MIN_CIBLE = 44;

// ✅ raconte pourquoi cette valeur, et ce qu'on a appris
// 44 px MESURÉS À L'ÉCRAN, pas déclarés dans la feuille de style : la recette
// navigateur du 01/09/2026 a relevé 41 px réels une fois la grille appliquée.
// Sous le doigt d'un étudiant sur téléphone, trois pixels manquants font une
// commande ratée — et un rapport mensuel non rendu.
const HAUTEUR_MIN_CIBLE = 44;
```

**Ce qui mérite un commentaire :** une décision non évidente, un contournement
et sa cause, une règle métier subtile, une contrainte externe, **un incident
réel corrigé**. Rien d'autre.

### R7 — L'immuabilité par défaut

`readonly` sur les propriétés, `readonly T[]` sur les tableaux, `const`
partout. Une fonction ne modifie jamais ses arguments. *L'existant a connu le
bug inverse : deux requêtes concurrentes chargeaient le même état JSON, la
seconde écrasait la première.*

### R8 — Le temps est explicite

Aucune lecture de `Date.now()` dans le domaine : l'instant est **injecté**.
Une règle qui dépend de l'heure se teste alors sans attendre.

Toutes les dates sont stockées en UTC et affichées en **`Africa/Casablanca`** —
avec la règle marocaine du Ramadan, que seule la base de fuseaux connaît.
*(Reprise directe de l'existant, qui documente la panne que cela a corrigée.)*

---

## 4. Stratégie de tests

### Ce qu'on teste, et à quel niveau

| Niveau | Quoi | Outil | Cible |
|---|---|---|---|
| **Domaine** | Les règles du GBUM, en mémoire | Vitest | **≥ 80 %**, obligatoire |
| **Intégration** | Domaine + base réelle, transactions | Vitest + PostgreSQL éphémère | Chemins critiques |
| **Bout en bout** | Parcours utilisateur complets | Playwright | Les 12 parcours clés |
| **Accessibilité** | WCAG 2.2 AA | axe-core, **sur chaque écran** | **0 manquement**, bloquant |
| **Sécurité** | Accès hors périmètre (IDOR) | Test génératif rôle × portée | **0 accès**, bloquant |
| **Performance** | Budget de poids et de vitesse | Lighthouse CI | **≥ 95**, bloquant |

### Les douze parcours à couvrir de bout en bout

1. Un visiteur trouve la cellule de son campus et écrit au responsable.
2. Une demande d'accueil est prise en charge, puis relancée si elle ne l'est pas.
3. Un responsable ouvre le canevas de la semaine **sans réseau**.
4. Un responsable saisit une séance de cellule hors ligne ; elle se synchronise.
5. Un responsable remplit le rapport mensuel **en moins de 3 minutes**.
6. Le national voit les cellules muettes depuis 3 mois.
7. Un membre s'inscrit à un camp, est affecté à une chambre, reçoit son attestation.
8. Un bureau soumet un budget ; le Conseil Exécutif le valide ; il ne bouge plus.
9. Une réunion à 30 participants avec modération et sous-groupes.
10. Un finissant consent, devient Ami, reçoit la lettre de prière.
11. Un administrateur « voit à la place de » quelqu'un ; c'est journalisé.
12. **Un utilisateur tente d'accéder à une ressource hors de sa portée, et échoue.**

### Ce qu'on ne teste pas

Le rendu exact d'un composant, les bibliothèques tierces, le code généré.
*Un test qui casse à chaque changement de maquette sera supprimé ou ignoré —
et un test ignoré est pire que pas de test.*

---

## 5. Git

### Branches

```
main                      protégée · toujours déployable · déployée automatiquement
  └── feat/canevas-hors-ligne     une branche par sujet, courte (< 3 jours)
  └── fix/rapport-mois-precedent
  └── docs/cahier-des-charges
```

### Messages de commit — *Conventional Commits*, en français

```
feat(canevas): consultation hors ligne des études

Le canevas doit être lisible en cellule, sur un campus où le réseau ne
passe pas. Pré-chargement à la première connexion, IndexedDB via Dexie,
révision par empreinte du contenu.

Ne met pas en cache les données nominatives : un téléphone volé ne doit
pas livrer l'annuaire (voir CDC §7.1).

Réf: F3.3, ADR-006
```

Préfixes : `feat`, `fix`, `refactor`, `perf`, `test`, `docs`, `chore`, `ci`.
**Le corps explique le *pourquoi*.** Le *quoi* est dans le diff.

### Pull requests

- **Petites.** Au-delà de 400 lignes modifiées, on découpe.
- Décrivent le problème, la solution, et **ce qui a été vérifié à la main**.
- Captures d'écran avant/après pour tout changement visible.
- **CI verte obligatoire.** Aucune dérogation, jamais.

---

## 6. Grille de revue

Passée sur **chaque** pull request. Une seule case cochée « non » bloque.

**Exactitude**
- [ ] Le code fait ce que la pull request annonce, et rien de plus.
- [ ] Les cas limites sont traités : vide, un seul, beaucoup, null, concurrent.
- [ ] Aucune erreur n'est avalée (R2).
- [ ] Aucun état impossible n'est représentable (R3).

**Sécurité**
- [ ] Toute lecture et toute écriture passent par `peut()` (ADR-005).
- [ ] La ressource porte bien sa structure de rattachement.
- [ ] Les entrées sont validées à la frontière (R4).
- [ ] Aucun secret, aucune donnée réelle dans le code ou les tests.
- [ ] Les actions sensibles sont journalisées.

**Domaine**
- [ ] La règle métier est dans `packages/core`, pas dans un écran (R1).
- [ ] Elle n'est écrite qu'une fois (R5).
- [ ] Le vocabulaire est celui du GBUM (§1).

**Interface**
- [ ] Testé à 360 px de large ; aucun débordement horizontal.
- [ ] Cibles tactiles **mesurées** ≥ 44 px.
- [ ] Navigable au clavier, focus visible.
- [ ] Contrastes vérifiés sur le fond composé réel.
- [ ] États de chargement, d'erreur et **vide** traités.
- [ ] Aucune chaîne en dur (ADR-008).

**Tenue**
- [ ] Fichier < 400 lignes, fonction < 50.
- [ ] Les commentaires expliquent le *pourquoi* (R6).
- [ ] Les tests couvrent la règle, pas l'implémentation.
- [ ] La documentation utilisateur est à jour si le comportement change.

---

## 7. Définition de « terminé »

Une fonctionnalité est terminée quand les **sept** points sont vrais :

1. Le code est fusionné dans `main` par pull request relue.
2. Les tests couvrent la règle métier et passent.
3. L'audit d'accessibilité passe sur les écrans touchés.
4. La fonctionnalité est déployée en production.
5. La documentation utilisateur est à jour.
6. **Un GBUssien réel l'a utilisée sans qu'on lui explique.**
7. Elle est retirable : on sait revenir en arrière sans perdre de données.

> Le point 6 n'est pas négociable. **Une fonctionnalité que personne n'utilise
> n'a pas été livrée** — elle a seulement été écrite.
