# Hub officiel du GBUM

Conception du hub du **GBUM** — Groupe Biblique Universitaire au Maroc.

> **Le lot 1 est complet** (10 septembre 2026) : les fondations, les huit pages
> du site public plus le parcours « Rejoindre » en deux langues, et l'espace
> d'administration qui permet au Secrétariat National de les remplir lui-même.
> Le site est encore presque vide — c'est voulu, et chaque emplacement dit ce
> qu'il attend et à qui le demander.
> Voir [`docs/08-PLAN-SITE-PUBLIC.md`](docs/08-PLAN-SITE-PUBLIC.md) et
> [`docs/10-PLAN-DES-FONDATIONS.md`](docs/10-PLAN-DES-FONDATIONS.md).

L'application actuelle, [`gbu-connect`](https://github.com/koffipierredamien/gbu-connect),
reste **en production** sur gbu-maroc.org. Elle n'est pas touchée, et devient la
**référence métier** : c'est d'elle qu'on lit les règles à transporter.

## Où en sommes-nous

| #     | Phase                   | État            |
| ----- | ----------------------- | --------------- |
| 0     | Connaître l'existant    | ✅ validée      |
| 1     | Cadrage                 | 🟡 à valider    |
| **2** | **Organisation du hub** | 🔵 **en cours** |
| 3     | Cahier des charges      | ⬜              |
| 4     | Maquettes               | ⬜              |
| 5     | Stack technique         | 🟡 partielle    |
| 6     | Plan de développement   | ⬜              |
| 7     | Développement           | ⬜              |

## Ce que contient le dépôt

```
docs/                       La réflexion — audit, cahier des charges,
                            architecture, conventions, échéancier,
                            direction artistique, plan des fondations
maquettes/site-public/      Les onze planches du lot 1
maquettes/direction-artistique/  Le système visuel, règle par règle
maquettes/                  Les sept écrans du hub (à refaire — réserve R2)
```

**Commencez par [`docs/README.md`](docs/README.md)**, qui indexe tout et dit ce
qui est décidé, ce qui est proposé, et ce qui attend un arbitrage.

## Faire tourner le projet

Il faut **Node 22**, **pnpm**, et **Docker Desktop** _ou_ PostgreSQL 16.

```bash
pnpm install            # les dépendances
pnpm mise-en-route      # la configuration, la base, sa structure, un compte
pnpm dev                # le site, sur http://localhost:3000
```

`pnpm mise-en-route` dit ce qu'elle fait à chaque étape, et se relance sans
dégât. Le guide complet — ce que vous devez voir, le parcours à essayer une
fois, et quoi faire quand ça coince — est dans
**[`docs/11-DEMARRER-EN-LOCAL.md`](docs/11-DEMARRER-EN-LOCAL.md)**.

Ce qui manque encore, vide par vide, et qui doit le fournir :
**[`docs/12-CE-QU-IL-RESTE.md`](docs/12-CE-QU-IL-RESTE.md)**.

Vous découvrez le projet, ou le développement en général ? Commencez ici :
**[`docs/13-PRISE-EN-MAIN.md`](docs/13-PRISE-EN-MAIN.md)** — un dictionnaire,
puis cinq chapitres qui ne supposent aucune connaissance technique.

Et la commande qui dit si tout va bien — la même que celle qui tourne en
intégration continue :

```bash
pnpm verifier           # types + linter + mise en forme + tests
pnpm verifier:acces     # WCAG 2.2 AA sur les 18 pages — bloquant
pnpm verifier:admin     # le parcours complet de l'administration — bloquant
```

Les deux dernières demandent que le site tourne (`pnpm dev` ou
`pnpm --filter @gbum/site start`).

`verifier:acces` vérifie trois choses d'un seul passage : aucun manquement
WCAG 2.2 AA, aucun débordement horizontal, aucune clé de traduction manquante.

`verifier:admin` joue le parcours qui décide si le lot 1 a atteint son but —
se connecter, écrire un brouillon, **vérifier que le site public n'a pas
changé**, publier, et vérifier qu'il a changé.

## L'espace d'administration

```bash
pnpm compte:creer       # crée un compte — il n'y a pas d'inscription
```

Puis `/admin`. Le Secrétariat National y modifie le texte du site en deux
langues, tient la liste des villes et de leurs cellules, et lit les messages
reçus par les formulaires.

**Publier est un geste distinct de celui d'enregistrer**, et c'est la
propriété que la vérification automatique protège : un brouillon ne change
rien en ligne.

### Vérifier que le stockage reste remplaçable

C'est la promesse d'[ADR-012](docs/02-ARCHITECTURE.md), et elle se vérifie
plutôt qu'elle ne se déclare :

```bash
createdb gbum_ailleurs
./outils/repetition-demenagement.sh \
  postgres://gbum:gbum@localhost:5433/gbum \
  postgres://gbum:gbum@localhost:5433/gbum_ailleurs
```

Le script sauvegarde, remonte la structure ailleurs **à partir des seules
migrations**, restaure, puis compare structure et contenu. Il tourne aussi à
chaque modification en intégration continue. S'il échoue, c'est qu'une base a
été modifiée à la main quelque part — et c'est ce jour-là qu'il faut
l'apprendre, pas le jour du vrai déménagement.

## Ce que contient l'atelier

| Paquet              | Ce qu'il contient                                         | Ce dont il dépend |
| ------------------- | --------------------------------------------------------- | ----------------- |
| `apps/site`         | Le site public, et l'espace d'administration              | de tout le reste  |
| `packages/core`     | **Le domaine** : ville, cellule, mandat, publication      | **de rien**       |
| `packages/db`       | Le schéma, les migrations, la seule porte vers PostgreSQL | de `core`         |
| `packages/stockage` | L'interface des fichiers, et ses implémentations          | de rien           |

La ligne qui compte est la deuxième : `packages/core` n'importe rien — ni
`next`, ni `react`, ni `drizzle`, ni le réseau. La règle est tenue par le
linter, pas par la bonne volonté.

## La méthode

1. On définit, on explique, on fait valider.
2. On ne passe à la phase suivante qu'à **70 % de la phase en cours** validés.
3. Les 30 % restants deviennent des réserves écrites, traitées en parallèle.
4. Le code vient en dernier — et son plan est expliqué et validé avant d'être écrit.
