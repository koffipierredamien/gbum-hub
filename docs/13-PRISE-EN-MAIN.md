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

## Ce qu'on verra ensuite

Quand ces cinq chapitres seront digérés :

- **6.** La base de données en détail : les six tables, ce que chacune retient
- **7.** Les mots de passe et les sessions : pourquoi le vôtre n'est stocké
  nulle part, même pas chiffré
- **8.** La mise en ligne : ce qu'il faut acheter, combien, et ce qui change
- **9.** Modifier quelque chose vous-même, du texte au code

## Comment poser une question

Dites-moi simplement **le mot ou le passage qui coince**. Une question du
genre « c'est quoi une migration ? » ou « pourquoi deux cases et pas une ? »
est exactement ce qu'il faut. Je réponds, et j'ajoute la réponse ici : ce
document doit finir par contenir tout ce que vous avez eu besoin de demander.
