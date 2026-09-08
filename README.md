# gbum-hub

Hub officiel du **GBUM** — Groupe Biblique Universitaire au Maroc.
Reconstruction de [`gbu-connect`](../README.md), qui reste en production.

> **Où vit ce code.** Il est pour l'instant sous `hub/` dans le dépôt
> existant : cela ne touche à aucune ligne de la production. Une fois
> [ADR-009](../docs/02-ARCHITECTURE.md) ratifié, il s'extrait vers son propre
> dépôt en une commande :
> `git subtree split --prefix=hub -b gbum-hub`

## Décisions qui gouvernent ce code

| | |
|---|---|
| [ADR-001](../docs/02-ARCHITECTURE.md) | Monorepo, deux surfaces (vitrine publique, espace membre) |
| [ADR-002](../docs/02-ARCHITECTURE.md) | **TypeScript de bout en bout** ✅ |
| [ADR-005](../docs/02-ARCHITECTURE.md) | **Politique d'accès unique, rôle × portée** ✅ implémentée |
| [ADR-010](../docs/02-ARCHITECTURE.md) | **Monolithe modulaire**, pas microservices ✅ |

## Démarrer

```bash
corepack enable && pnpm install
pnpm verifier          # typage + linter + tests — ce que la CI exige
```

## État du lot 0

| # | Tâche | État |
|---|---|---|
| 0.1 | Monorepo, conventions, configurations partagées | ✅ |
| 0.2 | CI : typage, lint, tests | ✅ *(a11y, sécurité, perf : à venir)* |
| 0.3 | Schéma + migrations + jeu d'essai anonymisé | ⬜ |
| 0.4 | Authentification (lien magique, mot de passe, TOTP) | ⬜ |
| 0.5 | **Politique d'accès `peut()` + audit IDOR génératif** | ✅ |
| 0.6 | Environnements, déploiement, prévisualisation par PR | ⬜ |
| 0.7 | Observabilité : Sentry, journaux, page de santé | ⬜ |

## `packages/core` — le domaine

Du TypeScript pur. **Aucune dépendance à Next, React, à un pilote de base ou
au réseau** — et ce n'est pas une intention, c'est un test
(`test/dependances.test.ts`). C'est ce qui permet de tester une règle du GBUM
en millisecondes, et de changer de cadre technique dans dix ans sans
réécrire le mouvement.

```
src/
  partage/        identifiants marqués, Résultat
  organisation/   Personne · Structure · Rattachement · Rôle · Portée
  acces/          LA politique — peut(acteur, action, ressource, ctx)
```

### La politique d'accès

L'application actuelle éparpille la même question entre `login_required`,
`admin_required`, `role_required`, `est_admin()`, `_est_national()`,
`_voit_amis()`, `_place_amis()` et des conditions dans les gabarits — et son
propre code en tire la leçon : *« deux règles recopiées finissent toujours par
diverger, et c'est alors une porte de trop »*. Son rôle est en outre
**binaire et sans portée** : le responsable d'une cellule de Fès et le
Secrétaire national y portent la même étiquette.

Ici, une seule fonction décide, et **toute ressource porte sa structure** —
le type interdit d'écrire une vérification qui oublie le cloisonnement.

```ts
peut(acteur, "creer", { type: "rapport", structureId: agdal }, ctx)
// → { autorise: true }
// → { autorise: false, motif: "hors_perimetre" }
```

Quatre régimes, dans cet ordre :

1. **le cloisonnement fort** — le suivi JTPA décide seul, aucun rôle n'y ouvre
   de porte ;
2. **l'état de la ressource** — un budget validé ne bouge plus, même pour
   l'administrateur ;
3. **ce qui appartient à la personne** — chacun lit et corrige sa fiche ;
4. **ses habilitations** — rôle × portée × période.

### L'audit IDOR, en continu

Le dépôt actuel contient un `tests/audit_idor.py` : la preuve que le risque est
connu. Mais il se lance à la main, en SSH, **après** la livraison.

`test/acces-genere.test.ts` énumère à chaque pull request
**4 portées × 10 rôles × 6 actions × 9 ressources = 2 160 combinaisons**, et
vérifie qu'aucune n'ouvre un accès hors périmètre. S'y ajoutent trois
invariants : une habilitation inactive ne donne rien, le GBUssien n'écrit
nulle part, le suivi JTPA d'autrui ne sort jamais.

## Conventions

Voir [`docs/03-CONVENTIONS-ET-QUALITE.md`](../docs/03-CONVENTIONS-ET-QUALITE.md).
En bref : le domaine parle **français**, la plomberie parle anglais ; aucun
fichier au-delà de 400 lignes, aucune fonction au-delà de 50 ; zéro `any`,
zéro erreur avalée ; le commentaire raconte l'incident, pas le code.
