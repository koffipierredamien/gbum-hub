# Prendre le projet en main — chapitre par chapitre

**11 septembre 2026.** Ce document est écrit pour une personne qui n'a jamais
fait de site web. Il part de zéro, et il ne suppose rien.

**Ma promesse.** Chaque mot difficile est expliqué la première fois qu'il
apparaît, en une phrase, avec une image du quotidien. Si un mot vous arrête
quand même, dites-le-moi : je l'ajoute au dictionnaire du chapitre 0. Un mot
que vous ne comprenez pas n'est pas votre lacune, c'est mon défaut
d'explication.

**Comment lire.** Un chapitre par séance, dans l'ordre. À la fin de chaque
chapitre il y a **une chose à essayer sur votre machine** : c'est en voyant
bouger quelque chose qu'on retient.

---

## Chapitre 0 — Le dictionnaire

Voici les mots que j'ai employés sans les expliquer. Gardez cette page ouverte
pendant que vous lisez le reste.

### Les mots de l'atelier

| Mot | En une phrase | Dans votre projet |
|---|---|---|
| **Dépôt** (*repository*) | Le dossier de tout le projet, avec son histoire complète — qui a changé quoi, quand, et pourquoi | `gbum-hub` |
| **Git** | Le carnet qui retient cette histoire. Il permet de revenir en arrière, toujours | Invisible, mais il note tout |
| **Commit** | Une entrée dans ce carnet : un paquet de modifications, avec son explication | « fix(demarrage) : le projet démarre sous Windows » |
| **Branche** | Une version parallèle du projet, pour travailler sans casser la principale | On travaille sur `main`, la principale |
| **Pousser** (*push*) | Envoyer les commits de votre machine vers GitHub | `git push` |
| **GitHub** | Le site qui garde une copie du dépôt, hors de votre machine | `github.com/koffipierredamien/gbum-hub` |

### Les mots du programme

| Mot | En une phrase | Dans votre projet |
|---|---|---|
| **Code source** | Le texte que j'écris et que la machine exécute. C'est du texte, rien de plus | Tous les fichiers `.ts` et `.tsx` |
| **Paquet** (*package*) | Un morceau de programme séparé, avec un rôle précis, réutilisable ailleurs | `packages/core`, `packages/db`… |
| **Dépendance** | Un programme écrit par d'autres, que le nôtre utilise | Next.js, PostgreSQL… |
| **Bibliothèque** | Même chose : une boîte d'outils toute faite qu'on n'a pas à réécrire | `drizzle`, qui parle à la base |
| **TypeScript** | Le langage dans lequel le projet est écrit. Sa particularité : il vérifie qu'on ne se trompe pas de type de donnée | Un nombre là où on attend un texte = refusé avant même de lancer |
| **Fonction** | Une recette : elle prend des ingrédients, fait quelque chose, rend un résultat | `publierVille(ville)` rend la version publiable d'une ville |

### Les mots du web

| Mot | En une phrase | Dans votre projet |
|---|---|---|
| **Navigateur** | Le programme avec lequel vous regardez des sites : Chrome, Edge, Firefox | Celui où vous tapez l'adresse |
| **Serveur** | Un ordinateur qui répond aux demandes des navigateurs. Rien de magique : un ordinateur qui attend | `pnpm dev` en lance un sur votre machine |
| **Adresse** (*URL*) | Ce qu'on tape en haut du navigateur | `http://localhost:3000/fr` |
| **`localhost`** | « Cet ordinateur-ci ». Le site ne sort pas de votre machine | Personne d'autre ne peut le voir |
| **Port** | Une porte numérotée sur un ordinateur ; plusieurs programmes peuvent écouter, chacun à la sienne | `3000` = le site, `5433` = la base |
| **HTML** | Le texte d'une page, avec ses balises : ceci est un titre, ceci est un paragraphe | Ce que le serveur envoie |
| **CSS** | Les règles d'apparence : couleurs, tailles, espacements | `apps/site/src/styles/` |
| **Next.js** | La bibliothèque qui fabrique les pages du site | Elle fait tourner `pnpm dev` |

### Les mots des données

| Mot | En une phrase | Dans votre projet |
|---|---|---|
| **Base de données** | Un classeur électronique, très rapide, qui retient tout même éteint | PostgreSQL |
| **PostgreSQL** | Le nom du logiciel de base de données choisi. Gratuit, très solide, trente ans d'âge | Il tourne dans Docker, port 5433 |
| **Table** | Une feuille du classeur. Une par sorte de chose | `villes`, `cellules`, `comptes` |
| **Ligne** | Une fiche dans cette feuille | Une ville : Rabat |
| **Colonne** | Une case de la fiche, toujours la même pour toutes | `nom`, `bureauCourriel` |
| **Schéma** | La description de toutes les feuilles et de leurs cases | `packages/db/src/schema.ts` |
| **Migration** | Une instruction datée qui modifie la structure du classeur, rejouable partout | `packages/db/migrations/` |
| **Docker** | Un programme qui fait tourner PostgreSQL dans une boîte isolée, sans l'installer vraiment | `pnpm base:demarrer` |

### Les mots de la qualité

| Mot | En une phrase | Dans votre projet |
|---|---|---|
| **Test** | Un petit programme qui vérifie qu'un autre programme fait bien ce qu'il promet | 37 tests, `pnpm test` |
| **Linter** | Un relecteur automatique : il refuse le code qui enfreint les règles qu'on s'est données | `pnpm lint` |
| **Accessibilité** | Le fait qu'une page reste lisible et utilisable par tous, y compris malvoyants | 18 pages vérifiées |
| **WCAG 2.2 AA** | La norme internationale qui dit ce que « lisible par tous » veut dire, chiffres à l'appui | Contraste mesuré, jamais choisi à l'œil |
| **Intégration continue** | GitHub rejoue toutes les vérifications à chaque envoi de code | L'onglet « Actions » |

### Les mots de votre projet

| Mot | En une phrase |
|---|---|
| **Brouillon** | Ce que vous avez écrit, enregistré, mais que le public ne voit pas |
| **Publié** | Ce que vous avez décidé de montrer. Le site public ne lit **que** cela |
| **Section éditoriale** | Un des dix-neuf textes modifiables du site (le thème, la vision, les moyens de don…) |
| **Cellule** | Un groupe d'étudiants dans une ville. Le site publie son nom et son nombre de membres, rien d'autre |
| **Marqueur d'attente** | Le petit encadré qui dit « telle information est attendue, et qui doit la fournir » |

---

## Chapitre 1 — Ce qui se passe quand vous tapez une adresse

Prenons ce que vous avez fait hier : taper `http://localhost:3000/fr`.

**Étape 1 — le navigateur demande.** Il découpe l'adresse en trois parties :
*à qui* je parle (`localhost` = cet ordinateur), *par quelle porte*
(`3000`), *et quelle page* (`/fr`, la page d'accueil en français). Puis il
envoie une demande écrite. Une carte postale, pas plus.

**Étape 2 — le serveur reçoit.** `pnpm dev` a lancé un programme qui attend
derrière la porte 3000. Il lit la demande : « on me réclame `/fr` ».

**Étape 3 — le serveur fabrique la page.** Il cherche le fichier chargé de
cette adresse. Chez nous, l'adresse et le fichier se correspondent
exactement — c'est la règle de Next.js :

```
/fr                → apps/site/src/app/(public)/[langue]/page.tsx
/fr/soutenir       → apps/site/src/app/(public)/[langue]/soutenir/page.tsx
/fr/ou-nous-sommes → apps/site/src/app/(public)/[langue]/ou-nous-sommes/page.tsx
```

`[langue]` entre crochets veut dire « n'importe quoi ici » : `fr` ou `en`
tombent tous les deux sur le même fichier, qui s'adapte.

**Étape 4 — le serveur répond**, en envoyant du HTML : du texte balisé.
Le navigateur le met en forme et vous voyez la page.

Tout cela prend quelques millièmes de seconde — sauf la toute première fois,
et voici pourquoi.

### Pourquoi la première page était si lente

Il existe deux façons de faire tourner le site.

**En mode atelier** (`pnpm dev`) : le serveur ne prépare rien à l'avance. Quand
vous demandez une page, il la fabrique **à ce moment-là**. La première a mis
seize secondes : elle a dû préparer tout le socle commun. En échange, quand je
modifie un fichier, vous voyez le résultat une seconde après, sans rien
relancer. C'est un atelier : encombré, mais on y travaille.

**En mode boutique** (`pnpm construire` puis `pnpm --filter @gbum/site start`)
: tout est fabriqué **d'avance**, une fois. La même page part alors en neuf
centièmes de seconde — cent soixante-dix fois plus vite. C'est ce que verra le
public.

La lenteur que vous avez vue n'est donc pas celle de votre site. C'est celle de
l'établi.

> **À essayer.** Lancez `pnpm construire`, puis
> `pnpm --filter @gbum/site start`, et rouvrez `http://localhost:3000/fr`.
> La différence se voit à l'œil nu, sans chronomètre.

---

## Chapitre 2 — Les cinq morceaux, et pourquoi cinq

Ouvrez le dossier du projet. Vous voyez ceci :

```
apps/site/        Le site : les pages, l'apparence, l'administration
packages/core/    Les règles du GBUM
packages/db/      Tout ce qui parle à la base de données
packages/identite/ Les mots de passe et les sessions
packages/stockage/ Les fichiers (photos, documents)
outils/           Les vérifications automatiques, la création de comptes
docs/             Le raisonnement : pourquoi chaque chose est ainsi
maquettes/        Les dessins des pages, avant qu'elles existent
```

Pourquoi ne pas tout mettre ensemble ? Parce que **les morceaux ne vieillissent
pas à la même vitesse**.

Les règles du GBUM — « la publication s'arrête à la ville », « un bureau dont
le mandat est fini n'a pas de contact affiché » — sont vraies quel que soit le
logiciel. Elles vivent dans `packages/core`, et ce dossier **ne dépend de
rien** : ni du site, ni de la base, ni d'internet. On peut le lire sans rien
savoir de technique.

À l'inverse, la base de données changera peut-être un jour. Tout ce qui la
concerne est donc enfermé dans `packages/db`, et **lui seul** lui parle. Le
jour du changement, un seul dossier bouge.

C'est le sens de la flèche ci-dessous : chacun connaît celui de droite, jamais
l'inverse.

```
apps/site  ──>  packages/db  ──>  PostgreSQL
     │
     └───────>  packages/core   (qui ne connaît personne)
```

Une règle de relecture automatique le garantit : si j'écrivais dans
`packages/core` la moindre ligne qui importe quelque chose d'extérieur, le
linter refuserait, et l'envoi vers GitHub échouerait. Ce n'est pas une
politesse entre développeurs, c'est une barrière.

> **À essayer.** Ouvrez `packages/core/src/publication.ts`. Cent lignes, dont
> la moitié sont des explications en français. C'est le cœur du site : ce qui a
> le droit de sortir d'une ville, et ce qui n'en sort jamais.

---

## Chapitre 3 — Le voyage d'une page, de la base à l'écran

Suivons « Où nous sommes », qui affiche la liste des villes. Six étapes.

**1. La demande arrive.** `/fr/ou-nous-sommes` →
`apps/site/src/app/(public)/[langue]/ou-nous-sommes/page.tsx`.

**2. La page demande les villes**, sans savoir où elles sont rangées. Elle
appelle une fonction de `apps/site/src/donnees/villes.ts`.

**3. Cette fonction passe par la seule porte** :
`packages/db/src/depot-villes.ts`. C'est le seul fichier du projet qui écrit
des requêtes vers PostgreSQL. Tout passe par lui, sans exception.

**4. PostgreSQL rend des lignes brutes** : le nom de la ville, le courriel du
bureau, les dates de son mandat, les cellules et leur nombre de membres. **Tout
le contenu**, y compris ce qui ne doit jamais être public.

**5. Le tri se fait ici**, et c'est l'étape importante. La fonction
`publierVille` de `packages/core` prend la ville complète et rend une ville
**publiable** : le nom, les cellules avec leur seul nombre de membres, et le
contact du bureau **uniquement si son mandat court encore**. Le jour, l'heure,
le lieu, le responsable : ils ne sont pas « masqués », ils **ne sont pas dans
le résultat**. On ne peut pas les afficher par accident, puisqu'ils ne sont
plus là.

**6. La page reçoit cette version publiable** et fabrique le HTML. Le
navigateur l'affiche.

### Pourquoi c'est fait ainsi, et pas plus simplement

On aurait pu écrire « n'affiche pas le responsable » directement dans la page.
Cela marcherait — jusqu'au jour où quelqu'un ajoute une page, oublie la
consigne, et publie un nom. Ici, **c'est impossible** : la page ne reçoit
jamais le nom. Un test vérifie d'ailleurs, à chaque envoi de code, que la
ville publiable ne contient **que** ces champs-là. Si j'en ajoutais un, le test
échouerait et l'envoi serait bloqué.

Et si la base ne répond pas ? La fonction ne rend pas « aucune ville ». Elle
rend un **échec** clairement identifié, et la page affiche « Liste
momentanément indisponible » — pas « le GBUM n'est présent nulle part ». Cette
distinction vient de l'audit de l'application actuelle, où un filtre cassé se
confondait avec un résultat vide.

---

## Chapitre 4 — Comment ce que vous écrivez arrive sur le site

C'est le mécanisme que vous avez essayé hier, et le plus important pour vous.

Chaque texte modifiable existe **en deux exemplaires** dans la base : un
**brouillon** et un **publié**. Deux cases, côte à côte, sur la même fiche.

| Ce que vous faites | Ce qui bouge | Ce que voit le public |
|---|---|---|
| Vous écrivez et vous **enregistrez** | Seul le brouillon change | **Rien** |
| Vous relisez, vous corrigez, vous enregistrez encore | Le brouillon change encore | **Rien** |
| Vous **publiez** | Le brouillon est recopié dans le publié | Le texte apparaît |

Le site public ne lit **que** la case « publié ». Il ne sait même pas que
l'autre existe.

Ce qui vous donne trois garanties concrètes : vous pouvez écrire à moitié et
revenir demain ; vous pouvez faire relire avant que quiconque voie quoi que ce
soit ; et rien ne part par accident — publier est un geste séparé, volontaire.

Quand vous publiez, le site est prévenu et refabrique les pages concernées.
C'est pour cela que le changement est visible immédiatement, sans redémarrage.

> **À essayer.** Écrivez le thème de l'année, enregistrez, rafraîchissez
> l'accueil : le marqueur d'attente est toujours là. Publiez, rafraîchissez :
> le thème apparaît. C'est toute la mécanique du site, en trente secondes.

---

## Chapitre 5 — Pourquoi autant de règles

Vous avez vu passer des refus : une ligne trop longue, une erreur ignorée, un
fichier trop gros. Ce ne sont pas des caprices. Chacune de ces règles vient
d'un défaut **constaté dans l'application actuelle du GBUM**, lors de l'audit.

| La règle | Ce qu'elle empêche |
|---|---|
| Aucune erreur ignorée | L'audit a relevé **57 endroits** où une panne était avalée en silence. Le filtre par ville de l'annuaire disparaissait ainsi, sans message |
| 400 lignes par fichier, 50 par fonction | Un fichier de 3 000 lignes que plus personne n'ose modifier |
| Le domaine ne dépend de rien | Des règles du mouvement noyées dans du code technique, impossibles à retrouver |
| Contrastes mesurés, jamais choisis à l'œil | Un texte gris clair illisible au soleil, sur un téléphone |
| Tout vérifié à chaque envoi | Une correction qui en casse une autre, découverte trois semaines plus tard |

Le principe commun : **une règle qu'il faut penser à appliquer finit par ne
plus l'être.** Celles-ci s'appliquent toutes seules, et refusent le travail
fautif — y compris le mien. Les sept limites qui ont sauté pendant la
construction étaient les miennes ; je les ai respectées en découpant mon code,
jamais en relevant la limite.

---

## Chapitre 6 — La base de données, et comment lire le code qui la décrit

Ce chapitre fait deux choses à la fois : il vous montre ce que la base
contient, **et** il vous apprend à lire du code. Le fichier que nous allons
lire est le plus simple du projet — il ne calcule rien, il décrit. C'est le
bon endroit pour commencer.

### 6.1 Six feuilles dans le classeur

Rappel du chapitre 0 : une **table** est une feuille du classeur, une **ligne**
une fiche, une **colonne** une case.

| La feuille | Ce qu'elle retient | Qui écrit dedans |
|---|---|---|
| `villes` | Une ville où le mouvement est présent, le contact de son bureau, les dates de son mandat, son rang d'affichage | Vous, écran « Les villes » |
| `cellules` | Un groupe d'étudiants : son nom, son effectif, et la ville dont il dépend | Vous, même écran |
| `demandes` | Un message envoyé par un visiteur, et s'il a été traité | Le site public, tout seul |
| `comptes` | Les personnes autorisées dans l'administration | La ligne de commande, jamais le site |
| `sessions` | Les connexions ouvertes en ce moment | Le site, à chaque connexion |
| `sections_editoriales` | Les dix-neuf textes modifiables, en brouillon et en publié | Vous, écran « Les pages » |

Tout cela est décrit dans **un seul fichier** :
`packages/db/src/schema.ts`. Ouvrez-le maintenant, et lisons-le ensemble.

### 6.2 La première table, mot à mot

Voici la table `villes`. J'en ai retiré quatre cases pour l'instant — les deux
dates du mandat et les deux dates de création — mais **tout ce qui suit est mot
pour mot dans le fichier** ; vous les retrouverez en l'ouvrant. Ne cherchez pas
à comprendre d'un coup : on va le démonter.

```ts
export const villes = pgTable("villes", {
  id: uuid("id").primaryKey().defaultRandom(),
  nom: text("nom").notNull(),
  bureauCourriel: text("bureau_courriel"),
  rang: integer("rang").notNull().default(0),
});
```

**Ligne par ligne.**

`export` — « ce qui suit peut être utilisé par d'autres fichiers ». Sans ce
mot, la table n'existerait que dans son fichier. C'est une porte ouverte.

`const villes` — « je crée une chose, elle s'appelle `villes`, et **elle ne
changera plus** ». `const` vient de *constant*. En TypeScript, on utilise
`const` presque partout : une valeur qui ne bouge pas est une valeur dont on
n'a pas à se méfier.

`=` — « c'est ceci ». Pas une égalité mathématique : une attribution.

`pgTable("villes", { … })` — un **appel de fonction**. Les parenthèses
signifient « fais-le, avec ceci ». `pgTable` veut dire « table PostgreSQL ».
On lui donne deux choses, séparées par une virgule : le nom de la feuille dans
la base (`"villes"`, entre guillemets car c'est du texte), puis la liste de ses
cases.

`{ … }` — les **accolades** entourent une liste de cases nommées. Chaque ligne
dedans a la forme `nom_de_la_case : description`, et se termine par une
virgule.

`id: uuid("id").primaryKey().defaultRandom()` — voici la case `id` :

- `uuid(…)` : son type. Un **uuid** est un identifiant unique, long et
  imprévisible, du genre `3f2b…-…`. On ne numérote pas les villes 1, 2, 3 :
  un identifiant qui se devine se manipule, et l'on peut alors compter les
  fiches d'un simple coup d'œil à l'adresse.
- `.primaryKey()` : « c'est par cette case qu'on retrouve une fiche ». Le
  **point** veut dire « et en plus ». On les enchaîne : `uuid` **puis** clé
  principale **puis** valeur par défaut.
- `.defaultRandom()` : « si personne ne le donne, tire-en un au hasard ».

`nom: text("nom").notNull()` — la case `nom` contient du texte, et
`.notNull()` veut dire **« vide interdit »**. Une ville sans nom ne peut pas
entrer dans la base : ce n'est pas le site qui le vérifie, c'est PostgreSQL
lui-même qui refuse. Une règle posée à cet endroit ne peut être contournée par
aucun écran, présent ou futur.

`bureauCourriel: text("bureau_courriel")` — du texte, **sans** `.notNull()` :
il a donc le droit d'être vide. C'est voulu : un bureau en cours de
renouvellement n'a pas de courriel à donner.

Vous remarquez deux orthographes : `bureauCourriel` dans le code,
`"bureau_courriel"` dans la base. Ce n'est pas une faute. Le monde du code
écrit les mots collés avec une majuscule au milieu ; le monde des bases de
données les sépare par des tirets bas. Cette ligne fait le pont entre les deux,
une fois pour toutes.

`rang: integer("rang").notNull().default(0)` — un nombre entier, jamais vide,
et qui vaut `0` si on ne dit rien. C'est l'ordre d'affichage des villes.

Les quatre cases que j'ai retirées ne diraient rien de plus : deux
`timestamp` — un instant daté — pour les bornes du mandat du bureau, et deux
autres pour savoir quand la fiche a été créée et modifiée.

`});` — on referme la liste des cases (`}`), puis l'appel de fonction (`)`),
puis on termine l'instruction (`;`). Ces trois signes se lisent comme un point
final.

### 6.3 Le dictionnaire des signes

Gardez-le : ces signes reviennent dans **tous** les fichiers.

| Signe | Ce qu'il veut dire | Se lit |
|---|---|---|
| `( )` | Un appel : fais quelque chose | « avec » |
| `{ }` | Un groupe de choses nommées | « contenant » |
| `[ ]` | Une liste ordonnée | « la liste de » |
| `.` | Et en plus, sur la même chose | « puis » |
| `,` | Séparateur d'éléments | « et » |
| `;` | Fin d'instruction | « point » |
| `:` | Le type, ou la valeur d'une case nommée | « est un » |
| `//` | Un commentaire sur une ligne — ignoré par la machine | « note » |
| `/** … */` | Un commentaire long, souvent l'explication du pourquoi | « note » |
| `=>` | « donne », dans une petite fonction sans nom | « donne » |

Et les mots qui reviennent sans cesse :

| Mot | Ce qu'il veut dire |
|---|---|
| `import` | « j'ai besoin de ceci, qui vient d'ailleurs » — toujours en haut du fichier |
| `export` | « ceci peut servir ailleurs » |
| `const` | « je nomme une chose, elle ne changera pas » |
| `function` | « voici une recette » |
| `async` / `await` | « cela prend du temps ; attends la réponse avant de continuer » — typiquement une lecture de base |
| `interface` / `type` | « voici la forme que doit avoir une donnée » |
| `readonly` | « une fois posé, on n'y touche plus » |

Avec ces deux tableaux, vous pouvez ouvrir n'importe quel fichier du projet et
suivre ce qu'il raconte. Pas l'écrire — le lire. C'est la première marche, et
c'est la plus haute.

### 6.4 Les cases qui manquent **exprès**

Regardez la table `cellules` dans le fichier. Elle contient : un identifiant,
la ville dont elle dépend, un nom, un effectif, un rang, deux dates.

Regardez maintenant ce qu'elle **ne contient pas** : ni jour, ni heure, ni
lieu, ni responsable.

Ce n'est pas un oubli, et c'est le point le plus important de tout ce chapitre.
**La colonne n'existe pas.** Donc :

- aucun écran ne peut l'afficher, même par erreur ;
- aucune sauvegarde partagée ne la contient ;
- aucun export ne la laisse fuir ;
- et le jour où quelqu'un voudrait vraiment publier ces informations, il
  devrait modifier la base, écrire une migration, et passer devant une
  relecture. Ce ne serait plus un accident, ce serait une décision.

C'est la différence entre écrire « ne pas afficher le responsable » dans une
consigne, et ne pas avoir de responsable à afficher. **Ce qui n'existe pas ne
fuit pas.**

Même raisonnement dans `sessions`. Quand vous vous connectez, le site vous
donne un jeton — une longue suite de caractères, gardée par votre navigateur.
La base, elle, ne retient que son **empreinte** : une trace calculée à partir
du jeton, dont on ne peut pas remonter au jeton. Si la base entière fuitait,
aucune session ne serait utilisable. C'est la même règle que pour les mots de
passe, et nous la verrons en détail au chapitre 7.

### 6.5 Comment les feuilles se tiennent entre elles

Une cellule appartient à une ville. Dans le code :

```ts
villeId: uuid("ville_id")
  .notNull()
  .references(() => villes.id, { onDelete: "cascade" }),
```

`.references(…)` crée un **lien** : la valeur de `ville_id` doit correspondre
à une ville qui existe vraiment. PostgreSQL refuse une cellule rattachée à une
ville inexistante — là encore, ce n'est pas le site qui vérifie.

`{ onDelete: "cascade" }` répond à la question « et si on supprime la ville ? ».
`cascade` veut dire : ses cellules partent avec elle. C'est juste — une cellule
sans ville n'a aucun sens.

Comparez avec les demandes :

```ts
villeId: uuid("ville_id").references(() => villes.id, { onDelete: "set null" }),
```

Ici, `set null` : si la ville disparaît, **le message reste**, il perd
seulement son rattachement. C'est juste aussi, et pour une autre raison — un
message envoyé par une personne réelle ne doit pas s'effacer parce qu'on a
réorganisé une liste de villes.

Deux liens, deux décisions opposées, chacune réfléchie. C'est ce genre de
choix que vous apprendrez à faire.

### 6.6 Une migration, concrètement

Quand je modifie `schema.ts`, la base ne change pas toute seule. Une commande
compare l'ancien état au nouveau et **écrit un fichier d'instructions**, daté et
numéroté. Le projet en a trois :

```
packages/db/migrations/0000_villes_et_cellules.sql
packages/db/migrations/0001_demandes.sql
packages/db/migrations/0002_comptes_et_editorial.sql
```

Ouvrez le premier. Vous y lirez, en clair :

```sql
CREATE TABLE "villes" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "nom" text NOT NULL,
  ...
);
```

C'est exactement ce que nous venons de lire en TypeScript, traduit dans la
langue de PostgreSQL. Ces fichiers sont **rejouables dans l'ordre, sur
n'importe quelle base vide** : c'est ce qui s'est passé sur votre machine
pendant `pnpm mise-en-route`, étape 3.

D'où la règle la plus sévère du projet : **on ne modifie jamais la base à la
main.** Pas une colonne ajoutée directement, pas une valeur corrigée en douce.
Sinon votre base et celle du serveur divergent, et plus rien ne garantit
qu'installer le projet ailleurs reproduise la même chose. Une commande vérifie
d'ailleurs cette promesse à chaque envoi de code : elle vide une base, rejoue
les trois migrations, et compare le résultat.

### 6.7 À essayer : regarder dans le classeur

Vous pouvez ouvrir la base et regarder vos propres données. Docker doit
tourner :

```powershell
docker compose exec base psql -U gbum -d gbum
```

Vous voilà devant l'invite `gbum=#`. Trois commandes suffisent :

```sql
\dt                      -- la liste des six feuilles
select nom, rang from villes order by rang;   -- vos villes
select page, cle, publie is not null as en_ligne from sections_editoriales;
\q                       -- quitter
```

La troisième est la plus parlante : elle vous montre, section par section, ce
qui est réellement en ligne — `t` pour vrai, `f` pour faux. Vous verrez de vos
yeux la différence entre ce que vous avez enregistré et ce que le public voit.

> **Ne modifiez rien ici.** Regarder est sans danger ; écrire violerait la
> règle du 6.6. Tout ce qui se modifie se modifie par un écran ou par une
> migration.

---

## Votre chemin vers l'autonomie

Vous m'avez dit vouloir être capable, à la fin, de réaliser un tel projet
seul. C'est un objectif juste, et atteignable. Voici comment il s'atteint
vraiment, sans vous raconter d'histoire.

**On n'apprend pas à programmer en lisant.** On apprend en trois temps, et il
n'y a pas de raccourci :

| | L'étape | Ce que vous faites | Ce que je fais |
|---|---|---|---|
| **1** | **Lire** | Ouvrir un fichier et suivre ce qu'il raconte | J'annote du vrai code, ligne par ligne, comme au 6.2 |
| **2** | **Modifier** | Changer une chose qui existe, voir l'effet, comprendre l'erreur quand elle vient | Je propose des modifications sûres, de plus en plus larges |
| **3** | **Écrire** | Ajouter quelque chose qui n'existait pas | Je relis, je dis pourquoi c'est juste ou pourquoi ça casse |

L'étape 2 est celle qui fait le développeur. Se tromper devant une machine qui
refuse poliment, comprendre pourquoi, recommencer : c'est cela, apprendre.
C'est aussi pour cela que ce projet refuse tant de choses — chaque refus est
une explication qui arrive avant la panne, pas après.

**Ce que le code contient déjà, et ce qu'il ne contiendra pas.** Les
commentaires du projet expliquent le **pourquoi** : pourquoi deux colonnes,
pourquoi cette couleur et pas une autre, quel incident a produit cette ligne.
Ils n'expliquent pas la **syntaxe** — sinon chaque fichier serait illisible
pour celui qui la connaît, et le projet deviendrait impossible à maintenir à
plusieurs. La syntaxe s'apprend ici, dans ce document, où l'explication reste
et ne gêne personne.

**Ce que je change à partir de maintenant :**

1. Chaque chapitre qui suit est bâti sur du **vrai code du projet**, annoté
   comme au 6.2 — jamais sur un exemple inventé.
2. Chaque chapitre finit par une **chose à faire vous-même**, et non seulement
   à lire.
3. À partir du chapitre 9, vous écrivez et je relis — l'inverse d'aujourd'hui.

**Une chose à ne pas croire.** Personne ne construit seul, de tête, un projet
de cette taille : on s'appuie sur des bibliothèques écrites par d'autres, sur
des normes, sur des relectures. Ce que vous pouvez viser — et ce que vous
aurez — c'est de **comprendre chaque décision, savoir où elle est écrite,
pouvoir la changer, et juger le travail de quiconque y touchera après vous.**
C'est exactement ce qui manque au GBUM aujourd'hui, et c'est ce qui rend un
projet durable.

---

## Ce qu'on verra ensuite

- **7.** Les mots de passe et les sessions : pourquoi le vôtre n'est stocké
  nulle part, même pas chiffré — et comment lire une fonction qui calcule
- **8.** Une page, de haut en bas : lire un fichier `.tsx` en entier
- **9.** Votre première modification : changer un texte, puis du code
- **10.** Votre première fonctionnalité, écrite par vous, relue par moi
- **11.** La mise en ligne : ce qu'il faut acheter, combien, et ce qui change

## Comment poser une question

Dites-moi simplement **le mot ou le passage qui coince**. Une question du
genre « c'est quoi une migration ? » ou « pourquoi deux cases et pas une ? »
est exactement ce qu'il faut. Je réponds, et j'ajoute la réponse ici : ce
document doit finir par contenir tout ce que vous avez eu besoin de demander.
