# Plan des fondations — lot 1, étape 2

**9 septembre 2026.** Les maquettes sont faites. Voici ce qu'on pose sous
elles, dans quel ordre, et pourquoi.

Ce document est à lire **avant** que la première ligne de code soit écrite.
C'est la règle qu'on s'est donnée, et elle a déjà servi une fois : du code
avait été écrit trop tôt et a dû être supprimé.

---

## 1. Ce qu'on pose, et pourquoi maintenant

Une page web a besoin de quatre choses sous elle : un endroit où ranger le
code, un moyen de vérifier qu'il est bon, un endroit où ranger les données, et
un moyen de mettre le tout en ligne. Ce sont les fondations. Elles ne se
voient pas, et c'est justement pour ça qu'on les pose **avant** — une fondation
ajoutée après coup n'est jamais adoptée.

Trois faits de l'application actuelle expliquent chaque choix qui suit :

| Ce qui existe aujourd'hui | Ce que ça coûte |
|---|---|
| Les données sont éclatées sur **18 fichiers JSON** à côté d'une base SQLite | Aucune transaction : deux écritures simultanées se marchent dessus |
| Les changements de structure sont écrits **dans le démarrage de l'application** | On ne sait pas dans quel état est la base d'un serveur donné |
| Le déploiement **ne passe pas par Git** | On ne sait pas quelle version tourne, et on ne peut pas revenir en arrière |

Les fondations sont la réponse à ces trois lignes.

---

## 2. La contrainte que vous venez d'ajouter

> *« Il faut penser au fait qu'on risque de changer le stockage un jour si les
> responsables paient un cloud. »*

C'est la bonne question, posée au bon moment — c'est-à-dire **avant** d'écrire
le code, parce qu'après il est trop tard.

### 2.1 Ce qui enferme vraiment

Contrairement à ce qu'on croit, ce n'est presque jamais la base de données qui
enferme. Une base PostgreSQL se déménage avec deux commandes. Ce qui enferme,
ce sont **les extras** que les plateformes offrent gratuitement pour qu'on ne
puisse plus partir :

- leur système de comptes et de connexion ;
- leur API de fichiers, qui n'existe que chez eux ;
- leurs « fonctions » exécutées chez eux ;
- leur langage de requêtes maison.

Le jour où l'on quitte la plateforme, la base part en dix minutes — et il faut
réécrire six mois de travail pour tout le reste.

**Notre règle sera donc : on prend d'un hébergeur ses machines et son
PostgreSQL. Rien d'autre.** Pas ses comptes, pas ses fonctions, pas son API de
fichiers. Ce qu'on refuse aujourd'hui est ce qui nous laissera partir demain.

### 2.2 La règle qui a fait ses preuves

Ce n'est pas une intuition : c'est le **facteur IV** de la
[méthode des douze facteurs](https://12factor.net/backing-services), écrite
chez Heroku et suivie depuis quinze ans par une bonne partie de l'industrie.
Elle dit exactement ce que vous demandez :

> Le code ne fait aucune distinction entre un service local et un service
> tiers. Pour l'application, les deux sont des **ressources attachées**,
> jointes par une adresse et des identifiants rangés dans la configuration.
> Un déploiement doit pouvoir remplacer une base locale par une base gérée par
> un tiers **sans aucun changement dans le code** : seule l'adresse change.

C'est mot pour mot notre situation : base locale aujourd'hui, base payée par
le mouvement demain, **et pas une ligne de code à réécrire entre les deux**.

### 2.3 Les six règles qu'on s'impose

| # | Règle | Ce qu'elle rend possible |
|---|---|---|
| **S1** | **Le même moteur partout** : PostgreSQL sur mon poste, sur le serveur, et chez n'importe quel hébergeur. | Déménager = un export, un import. Pas de traduction. |
| **S2** | **L'adresse de la base est une variable d'environnement**, jamais écrite dans le code, jamais versionnée. | Changer d'hébergeur = changer une ligne de configuration. |
| **S3** | **Une seule porte vers la base** : le paquet `packages/db`. Aucune autre partie du code n'écrit de SQL. | Si le moteur changeait un jour, un seul dossier change. |
| **S4** | **La structure de la base est un fichier versionné**, jamais une modification faite à la main. | Un nouvel hébergeur se remonte en rejouant les migrations. |
| **S5** | **Les fichiers ne sont pas dans la base** — ils sont derrière une interface à quatre méthodes, avec deux implémentations. | Passer du disque au cloud = changer la configuration. |
| **S6** | **On ne prend d'une plateforme que ses machines et son PostgreSQL.** | On ne construit jamais sur ce qu'on ne peut pas emporter. |

### 2.4 Ce que votre contrainte change, et c'est heureux

Une décision était ouverte depuis le début : **ADR-007 — serveur auto-géré ou
plateforme gérée ?** Elle était pénible parce qu'elle demandait de deviner
aujourd'hui un budget de demain.

Si les six règles ci-dessus sont tenues, **cette décision cesse d'être une
décision d'architecture.** Elle devient une décision de facture, que prendront
plus tard ceux qui paient, sans nous demander notre avis et sans rien casser.

C'est le meilleur résultat possible : votre contrainte n'ajoute pas de travail,
elle en supprime.

### 2.5 Et on le vérifiera, au lieu de le promettre

Une promesse de portabilité qu'on ne teste jamais est fausse au bout de trois
mois. On fera donc, **une fois par lot, une répétition de déménagement** :

1. monter une base vide ailleurs (une autre machine, ou un compte d'essai) ;
2. y rejouer les migrations ;
3. y restaurer la dernière sauvegarde ;
4. changer les deux variables d'environnement ;
5. vérifier que le site fonctionne.

**Si ça prend plus d'une heure, c'est qu'on s'est enfermés quelque part** — et
on le découvre ce jour-là, pas le jour où il faut vraiment partir.

---

## 3. Les cinq fondations, dans l'ordre

### F1 — Le squelette du dépôt

Un seul dépôt, plusieurs paquets — c'est le monolithe modulaire d'ADR-010.

| Paquet | Ce qu'il contient | Ce dont il dépend |
|---|---|---|
| `apps/site` | Le site public : les pages, l'administration | de tout le reste |
| `packages/core` | **Le domaine** : ce qu'est une ville, une cellule, une activité, un droit | **de rien** |
| `packages/db` | Le schéma, les migrations, et **la seule porte vers PostgreSQL** | de `core` |
| `packages/stockage` | L'interface des fichiers et ses deux implémentations | de rien |

La ligne qui compte est la deuxième : **`core` ne dépend de rien.** Ni du site,
ni de la base, ni d'internet. C'est là que vivent les règles du GBUM — qu'un
bureau de ville est renouvelé chaque année, qu'un droit est daté, qu'on ne
publie pas au-delà de la ville. Ces règles se testent en une milliseconde, sans
base de données, et elles survivront à tous les changements de mode technique.

### F2 — La chaîne de qualité

Ce qui s'exécute automatiquement à chaque modification, et **bloque** si ça ne
passe pas :

| Outil | Ce qu'il vérifie |
|---|---|
| TypeScript en mode strict | Qu'aucun type n'est approximatif — zéro `any` |
| ESLint | Les huit règles de [`03-CONVENTIONS-ET-QUALITE.md`](03-CONVENTIONS-ET-QUALITE.md) |
| Prettier | La mise en forme, pour qu'on ne discute jamais de virgules |
| Vitest | Que les règles du domaine font ce qu'elles disent |
| GitHub Actions | Que tout ce qui précède tourne sur chaque proposition de modification |

Et les limites dures, refusées automatiquement : **400 lignes par fichier, 50
par fonction, complexité 10, zéro erreur silencieusement avalée.**

Pourquoi maintenant et pas plus tard : une chaîne de qualité ajoutée sur du
code existant trouve trois cents problèmes le premier jour, et on la désactive.
Ajoutée sur un dépôt vide, elle n'en trouve jamais plus d'un à la fois.

### F3 — La base de données et ses migrations

**PostgreSQL** — c'est ADR-003, et c'est S1.

Le point qui compte est la manière dont sa structure évolue. Aujourd'hui, dans
l'application existante, les changements de structure sont écrits dans le code
de démarrage : personne ne sait dans quel état est la base d'un serveur donné.

À la place : **une migration est un fichier.** Numéroté, écrit en SQL, rangé
dans le dépôt, relu comme du code, rejouable sur une base vide.

```
packages/db/migrations/
  0000_villes_et_cellules.sql      ← écrite le 10 septembre 2026
  0001_pages_editoriales.sql       ← viendra avec les écrans qui l'utilisent
  0002_activites.sql
```

*(La numérotation commence à 0000 : c'est celle de l'outil, et on ne se bat pas
avec un outil pour un chiffre. Le nom, lui, est réécrit à la main — un fichier
de migration qui s'appelle `0000_lumpy_red_ghost.sql` n'est pas relisible.)*

Trois conséquences immédiates :

- on remonte la base **à neuf** n'importe où, en rejouant les fichiers dans
  l'ordre — c'est exactement ce que demande une répétition de déménagement ;
- on sait à quelle migration s'arrête chaque serveur ;
- **on ne modifie jamais la base à la main.** Jamais. C'est la règle qui rend
  toutes les autres vraies.

Sur mon poste, PostgreSQL tourne dans un conteneur, **à la même version qu'en
production**, lancé par une commande. « Ça marchait chez moi » cesse d'exister.

### F4 — Le stockage des fichiers

Les photos du camp, les PDF des canevas. Deux règles.

**Ils ne vont pas dans la base.** Une base gonflée de binaires devient lente à
sauvegarder, lente à restaurer, et pénible à déménager — ce qui contredit tout
ce qui précède.

**Ils passent par une interface à quatre méthodes**, et rien d'autre du code ne
sait où ils sont réellement :

```ts
interface Stockage {
  ecrire(chemin: string, contenu: Uint8Array): Promise<void>
  lire(chemin: string): Promise<Uint8Array>
  supprimer(chemin: string): Promise<void>
  url(chemin: string): string
}
```

Deux implémentations, choisies par une variable d'environnement :

- **`StockageDisque`** — aujourd'hui, un dossier sur le serveur ;
- **`StockageS3`** — le jour où le mouvement paie.

Pourquoi S3 et pas autre chose : ce n'est pas un produit d'Amazon, c'est
devenu **le langage commun du stockage de fichiers**. Scaleway, OVH, Cloudflare
R2, Backblaze et une dizaine d'autres le parlent à l'identique. Écrire
`StockageS3` une fois, c'est pouvoir choisir plus tard le moins cher, et en
changer sans rien réécrire.

### F5 — La mise en ligne, et les sauvegardes

**Le déploiement passe par Git.** C'est ce qui manque le plus à l'application
actuelle. Une version marquée dans le dépôt part en ligne ; on sait toujours
quelle version tourne ; on revient en arrière en une commande.

**La configuration est dans l'environnement**, jamais dans le dépôt : l'adresse
de la base, les clés du stockage, rien de tout cela n'est versionné. C'est S2,
et c'est aussi ce qui permet d'avoir un serveur d'essai et un serveur réel avec
**exactement le même code**.

**Les sauvegardes, et le point que presque tout le monde rate :**

- sauvegarde quotidienne de la base et des fichiers ;
- conservation d'un mois ;
- **et une restauration réellement essayée.** Une sauvegarde qu'on n'a jamais
  restaurée n'est pas une sauvegarde, c'est un fichier. La répétition de
  déménagement du §2.5 sert aussi à ça : elle teste la restauration en même
  temps qu'elle teste la portabilité.

Le vrai risque de ce projet n'est pas de mal choisir un hébergeur. C'est de
perdre la mémoire du mouvement — qui est précisément ce que le site doit
conserver.

---

## 4. Ce que ça donne

```
gbum-hub/
├── apps/
│   └── site/                 Le site public + l'administration
├── packages/
│   ├── core/                 Le domaine. Ne dépend de rien.
│   ├── db/                   Schéma, migrations, la seule porte vers Postgres
│   └── stockage/             L'interface des fichiers, et ses deux mises en œuvre
├── docs/                     Ce dossier
├── maquettes/                Les planches
├── .github/workflows/        La chaîne de qualité
├── docker-compose.yml        PostgreSQL local, à la version de production
└── .env.example              Les variables attendues — sans aucune valeur réelle
```

---

## 5. Ce qui n'est **pas** dans les fondations

Pour qu'on soit d'accord sur ce que je ne ferai pas :

- **aucune page, aucun visuel** — les fondations ne se voient pas ;
- **aucune authentification** — le site public n'en a pas besoin ; elle viendra
  avec l'espace de travail, et c'est justement le genre de chose qu'on n'emprunte
  pas à une plateforme (S6) ;
- **pas de visioconférence, pas de recherche, pas de notifications** ;
- **aucun contenu réel** — les fondations sont vides, par construction.

---

## 6. Le coût, et le point de validation

| Fondation | Effort |
|---|---|
| F1 — le squelette | ~1 jour |
| F2 — la chaîne de qualité | ~1 jour |
| F3 — la base et ses migrations | ~2 jours |
| F4 — le stockage des fichiers | ~1 jour |
| F5 — mise en ligne et sauvegardes | ~1,5 jour |
| **Total** | **~6,5 jours-homme** |

**Un seul point de validation, à la fin** — pas cinq. Ce que vous pourrez
vérifier vous-même, sans rien connaître au code :

1. `git pull` puis une commande, et le site vide s'ouvre sur votre machine ;
2. la chaîne de qualité passe au vert sur GitHub, visible dans le dépôt ;
3. **la répétition de déménagement du §2.5 est faite devant vous et documentée** ;
4. une sauvegarde est prise, puis restaurée, et le résultat est identique.

Le point 3 est celui qui prouve que votre contrainte est tenue. Les autres
prouvent que les fondations existent.

---

## 7. Votre seconde phrase, et ce qu'elle change

> *« Une fois que le site sera fait, je saurai, en visualisant, quoi exactement
> te donner comme informations pour parfaire. »*

C'est exactement ainsi qu'il faut procéder, et c'est déjà ce que l'ordre du lot
prévoit — mais cela vaut d'être dit, parce que ça change la manière de juger
les étapes suivantes.

L'ordre reste : **fondations → les huit pages → l'administration.** Les pages
sortiront **vides**, avec leurs marqueurs d'attente à leur place définitive.
C'est fait exprès : une page vide dont on voit la forme pose une question
précise — *« il manque quatre photos de campus »* — là où une liste de demandes
dans un document ne pose qu'une question vague.

Et l'espace d'administration arrive juste derrière, pour que ce que vous
découvrez en regardant, vous puissiez le saisir vous-même le jour où vous
l'obtenez — sans repasser par moi. C'est la raison d'être du lot 1 tout entier.

**Ce qui n'est donc pas bloqué par l'attente du Secrétariat National :** les
fondations, les huit pages, et l'administration. C'est-à-dire tout ce qui
suit.

---

## 8. État au 10 septembre 2026

| | Fondation | État |
|---|---|---|
| **F1** | Le squelette du dépôt | ✅ posée — quatre paquets, `packages/core` sans aucune dépendance |
| **F2** | La chaîne de qualité | ✅ posée — et **elle mord** : les deux règles maison ont été mises à l'épreuve sur du code fautif avant d'être déclarées bonnes |
| **F3** | La base et ses migrations | ✅ posée — première migration écrite, appliquée sur un PostgreSQL 16 réel, et rejouée sans dégât |
| **F4** | Le stockage des fichiers | ✅ posée — interface, implémentation disque, et la garde contre la remontée de dossier |
| **F5** | Mise en ligne et sauvegardes | 🟡 **la moitié** — voir ci-dessous |

**Ce qui manque à F5, et pourquoi ce n'est pas un retard.** La configuration
par l'environnement est en place, la sauvegarde et sa restauration sont
éprouvées par la répétition de déménagement. Ce qui reste — le déploiement
automatique — a besoin d'une chose que nous n'avons pas encore : **une adresse
où déployer.** C'est précisément la décision qu'ADR-012 permet de reporter. Ce
n'est donc pas une dette : c'est la conséquence voulue.

**Deux choses que la répétition de déménagement a trouvées du premier coup**,
et qui auraient été des pannes silencieuses le jour du vrai déménagement :

1. la sauvegarde des données emportait aussi **le registre des migrations** —
   or ce registre appartient à la base d'arrivée, qui vient de le remplir
   elle-même. La restauration échouait sur une clé en double ;
2. l'implémentation disque rendait un **`Buffer` de Node** au lieu du
   `Uint8Array` promis par l'interface. Les deux se ressemblent — et le jour du
   basculement vers S3, la panne serait apparue ailleurs que dans le code
   changé.

**Et une décision prise en chemin :** la répétition ne tourne plus une fois par
lot, mais **à chaque modification**, en intégration continue. Cela ne coûte pas
plus cher, et vaut beaucoup mieux : c'est un mardi ordinaire qu'on s'enferme,
pas le jour du déménagement.
