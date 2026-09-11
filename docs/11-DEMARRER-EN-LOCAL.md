# Faire tourner le projet sur votre machine

**10 septembre 2026.** Ce document a été écrit en jouant la manœuvre depuis
zéro — base effacée, `.env` supprimé, dossier de construction vidé. Les
commandes qui suivent sont celles qui ont réellement fonctionné, dans cet
ordre. Trois défauts ont été trouvés en le faisant, deux autres en le rejouant
sous Windows les 10 et 11 septembre ; tous sont corrigés.

---

## 1. Ce qu'il faut avoir

| | Pourquoi | Vérifier |
|---|---|---|
| **Node 22 ou plus** | Le projet s'appuie sur des fonctions de Node 22 | `node -v` |
| **pnpm** | Le gestionnaire de paquets de l'atelier | `pnpm -v` |
| **Docker Desktop** *ou* **PostgreSQL 16** | La base de données | `docker --version` |

Si pnpm manque : `corepack enable` suffit, il est livré avec Node.

**Sous Windows**, tout se lance depuis PowerShell ou le Terminal Windows, et
Docker Desktop doit être **démarré** (son icône dans la barre des tâches) avant
`pnpm mise-en-route`. Le projet a été rejoué sur une machine Windows : ce qui
en est ressorti est au §10.

**Sur Docker.** Il n'est pas obligatoire : il évite d'installer PostgreSQL sur
votre machine, et garantit que vous travaillez sur la **même version majeure**
qu'en production — c'est la règle S1 d'[ADR-012](02-ARCHITECTURE.md).
Si vous avez déjà PostgreSQL 16 installé, gardez-le : le §6 dit quoi changer.

---

## 2. Les quatre commandes

```bash
git clone https://github.com/koffipierredamien/gbum-hub.git
cd gbum-hub

pnpm install          # les dépendances
pnpm mise-en-route    # la configuration, la base, sa structure, un compte
pnpm dev              # le site
```

**`pnpm mise-en-route` fait quatre choses, et vous dit laquelle** :

1. crée `.env` à partir de `.env.example` — sans valeur secrète, et non versionné ;
2. démarre PostgreSQL si besoin, et **attend qu'il réponde vraiment** ;
3. rejoue les migrations, c'est-à-dire construit la structure de la base ;
4. crée votre compte d'administration, s'il n'y en a aucun.

Elle est **sans effet si tout est déjà fait**. On peut la relancer autant de
fois qu'on veut ; c'est ce qui la rend utile quand quelque chose a bougé.

Voici ce qu'elle affiche la première fois :

```
─── Mise en route du hub du GBUM ───

1/4  Configuration : .env créé à partir de .env.example.
2/4  Base de données : elle ne répond pas, on essaie de la démarrer…
     Elle répond. (PostgreSQL 16, dans un conteneur, port 5433.)
3/4  Structure de la base : on rejoue les migrations…
     À jour.
4/4  Comptes d'administration : aucun. Créons le premier.
     Il n'y a pas d'inscription dans l'espace d'administration.

     Courriel : …
     Nom : …
     Mot de passe (12 caractères au moins) : …

─── Prêt ───
```

---

## 3. Ce que vous devez voir

| Adresse | Ce que c'est |
|---|---|
| **http://localhost:3000/fr** | L'accueil, en français |
| http://localhost:3000/en | Le même, en anglais |
| http://localhost:3000/fr/le-mouvement | La page du mouvement, et sa frise |
| http://localhost:3000/fr/ou-nous-sommes | Les villes — vide au départ, et elle le dit |
| **http://localhost:3000/admin** | L'espace d'administration |

La première visite d'une page prend deux à dix secondes : en mode
développement, Next construit chaque page **au moment où on la demande**. Les
suivantes sont instantanées. Ce n'est pas la vitesse du site réel.

---

## 4. Le parcours qui vaut la peine d'être fait une fois

C'est celui qui décide si tout ce lot a servi à quelque chose. Comptez trois
minutes.

1. Ouvrez **http://localhost:3000/fr**. L'accueil annonce que le thème de
   l'année est *en cours d'écriture*.
2. Ouvrez **http://localhost:3000/admin** dans un autre onglet, connectez-vous.
3. **Les pages → Le thème de l'année.** Écrivez un thème dans le premier champ.
   **Enregistrer le brouillon.**
4. **Retournez sur l'accueil et rafraîchissez.** *Rien n'a changé.* C'est
   voulu : le panneau noir de droite dit « Modifications non publiées ».
5. **Publier la page.**
6. **Rafraîchissez l'accueil.** Le thème s'affiche.

Puis, si vous voulez voir la frise répondre à votre question :
**Les pages → Le mouvement**, remplissez *l'année de fondation du GBUM* et
*la fondation en quelques lignes*, publiez, et regardez
**/fr/le-mouvement** : le marqueur d'attente est devenu un point daté, entre
1968 et 2023.

---

## 5. Pourquoi la première page est lente — et ce qu'elle vaut vraiment

`pnpm dev` **construit chaque page au moment où vous la demandez**. C'est fait
exprès : c'est ce qui permet de modifier un fichier et de voir le résultat une
seconde plus tard, sans rien relancer. Le prix est la première visite.

Mesuré le 11 septembre 2026, sur la même machine, avec les mêmes pages
(temps de réponse du serveur, dossier de construction vidé avant chaque série) :

| Page | `pnpm dev` (1re visite) | `pnpm dev` (ensuite) | Construite (1re) | Construite (ensuite) |
|---|---|---|---|---|
| Accueil | **16,0 s** | 0,05 s | **0,09 s** | 0,008 s |
| Le mouvement | 0,40 s | 0,02 s | 0,011 s | 0,005 s |
| Où nous sommes | 0,41 s | 0,02 s | 0,011 s | 0,005 s |
| Agenda | 0,40 s | 0,02 s | 0,010 s | 0,005 s |

La première page paie pour toutes les autres : elle compile le socle commun.
Ensuite, le développement est instantané.

**Pour voir le site tel que le public l'aura** — c'est-à-dire la colonne de
droite, environ **170 fois plus rapide** à la première visite :

```bash
pnpm construire        # une trentaine de secondes
pnpm --filter @gbum/site start
```

Sous Windows, comptez davantage : l'antivirus inspecte chaque fichier écrit
pendant la construction. Exclure le dossier du projet de l'analyse en temps
réel change beaucoup les choses, si votre politique interne le permet.

**Ce que cela veut dire pour la suite.** La lenteur que vous avez vue n'est pas
celle du site : c'est celle de l'atelier. Le site, lui, est rendu **en avance**
(les huit pages sont construites une fois, pas à chaque visite) — c'est la
raison pour laquelle il tiendra sur un hébergement modeste.

---

## 6. Si vous préférez votre propre PostgreSQL

Créez une base `gbum`, puis changez **une seule ligne** dans `.env` :

```
DATABASE_URL=postgres://VOTRE_UTILISATEUR:VOTRE_MOT_DE_PASSE@localhost:5432/gbum
```

`5432` est le port habituel de PostgreSQL ; `5433` est celui du conteneur,
choisi exprès pour ne pas entrer en conflit avec une installation existante.

Relancez `pnpm mise-en-route` : elle verra que la base répond et passera à la
suite. **Rien d'autre ne change** — c'est exactement la promesse d'ADR-012, et
c'est la première fois qu'elle sert.

---

## 7. Les commandes utiles

```bash
pnpm dev                # le site, avec rechargement à chaud
pnpm construire         # le site tel que le public l'aura (voir §5)
pnpm verifier           # types + linter + mise en forme + tests + construction
pnpm verifier:acces     # WCAG 2.2 AA sur les 18 pages
pnpm verifier:admin     # le parcours complet de l'administration
pnpm compte:creer       # un compte d'administration de plus
pnpm base:demarrer      # PostgreSQL seul, sans le reste
pnpm base:migrer        # rejouer les migrations
```

Les deux `verifier:` demandent que le site tourne dans une autre fenêtre. Ce
sont exactement celles qui tournent en intégration continue : ce qui passe
chez vous passe sur GitHub.

---

## 8. Quand ça ne marche pas

| Ce que vous voyez | Ce que c'est | Le remède |
|---|---|---|
| `Docker n'est pas disponible` | Docker Desktop n'est pas lancé | Le lancer, ou passer par le §5 |
| `DATABASE_URL n'est pas définie` | `.env` absent | `pnpm mise-en-route` |
| `ECONNREFUSED … 5433` | La base ne tourne pas | `pnpm base:demarrer` |
| Le port 3000 est déjà pris | Un autre projet tourne | Fermer l'autre, ou `pnpm --filter @gbum/site dev -- -p 3001` |
| La page met dix secondes | Construction à la demande | Normal en développement, seulement la première fois |
| `Courriel ou mot de passe incorrect` alors qu'il est bon | Le compte est dans une **autre** base | Vérifier `DATABASE_URL` dans `.env` |
| Un chemin doublé, `C:\C:\Users\…` | Un défaut corrigé le 11 septembre 2026 | Mettre à jour : `git pull` |
| `docker : commande introuvable` sous Windows | Docker Desktop n'est pas lancé | Le démarrer, attendre qu'il dise « running », relancer |

**Repartir de zéro**, si quelque chose est vraiment coincé :

```bash
docker compose down -v     # efface la base et son contenu
rm -f .env
pnpm mise-en-route
```

---

## 9. Où est quoi

```
apps/site/          Le site public et l'administration
  src/app/(public)/   Les 8 pages + « Rejoindre », en /fr et /en
  src/app/(admin)/    L'espace d'administration, en français
  src/composants/     Les briques partagées (bandes, marqueurs, défilés)
  src/styles/         « Foyer en mouvement » — toutes les couleurs mesurées
  messages/           Les textes du site, fr.json et en.json

packages/core/      Le domaine du GBUM. Ne dépend de RIEN.
packages/db/        Le schéma, les migrations, la seule porte vers PostgreSQL
packages/identite/  Mots de passe et sessions
packages/stockage/  Les fichiers, derrière une interface remplaçable

outils/             Les vérifications, et la création de comptes
docs/               Le raisonnement : audit, cahier des charges, décisions
maquettes/          Les planches, telles qu'elles ont été dessinées
```

**Le fichier à lire en premier**, si vous n'en lisez qu'un :
[`packages/core/src/publication.ts`](../packages/core/src/publication.ts).
Cinquante lignes de code — et autant d'explications — qui portent la décision
centrale du site — la publication
s'arrête à la ville — et qui expliquent pourquoi aucune page ne *peut* la
trahir.

---

## 10. Ce que cette répétition a trouvé

Le document n'aurait pas eu de valeur si je l'avais écrit de mémoire. En le
jouant depuis zéro — puis sur une machine qui n'était pas la mienne — cinq choses ont
cassé :

1. **Rien ne lisait le fichier `.env`.** Le projet le documentait, les
   commandes échouaient sur « DATABASE_URL n'est pas définie » alors que la
   ligne était là, sous les yeux. Next, lui, ne lit que le `.env` de
   `apps/site` — pas celui de la racine. Il y a désormais un chargeur, à un
   seul endroit, qui n'écrase jamais une variable déjà définie.

2. **Il n'y avait pas de première commande.** Sept commandes à enchaîner, dont
   la quatrième échouait en silence, suffisent à décourager. `pnpm
   mise-en-route` les enchaîne, dit ce qu'elle fait, et se relance sans dégât.

3. **`pnpm types` ne regardait pas les outils.** `outils/administration`
   n'était pas dans les références du `tsconfig.json` de la racine : le CLI
   n'était donc jamais typé par la chaîne de vérification. Un appel à une
   fonction jamais importée y a survécu — c'est le linter, et non le
   compilateur, qui a fini par le voir. La référence manquante est ajoutée :
   la chaîne couvre maintenant tout le code TypeScript du dépôt.

4. **Le projet ne démarrait pas du tout sous Windows.** `pnpm mise-en-route`
   s'arrêtait à la première étape sur un chemin doublé :
   `C:\C:\Users\lenovo\Downloads\gbum-hub\.env.example`. La cause tient en
   un mot : `new URL(…).pathname` rend `/C:/Users/…`, que Node relit ensuite
   comme un chemin relatif à la racine du disque courant. La conversion juste
   des deux côtés est `fileURLToPath()` — elle décode aussi les espaces d'un
   dossier « Mes documents ».

   Trois fichiers faisaient la même faute, et **deux n'étaient pas celui qui a
   échoué** : la corriger là où ça cassait aurait déplacé la panne d'une étape.
   Il y a donc désormais une règle de lint qui refuse `new URL(…).pathname`
   dans tout le dépôt — vérifiée en la faisant échouer sur du code fautif.

   Une seconde marche attendait juste derrière : sous Windows `pnpm` est un
   script `.cmd`, et depuis un correctif de sécurité de Node (CVE-2024-27980)
   un `.cmd` ne se lance qu'à travers l'interpréteur de commandes. L'étape des
   migrations aurait échoué à son tour ; elle est corrigée en même temps.

5. **Un avertissement de sécurité de Node, DEP0190.** Pour rejouer les
   migrations, la mise en route lançait `pnpm base:migrer` — une commande
   externe, donc l'interpréteur de commandes sous Windows, donc des arguments
   concaténés au lieu d'être passés tels quels. Node le signale, et il a
   raison. La réponse n'est pas de faire taire l'avertissement : les migrations
   s'appliquent maintenant **dans le même processus**, par un appel de
   fonction. Plus d'interpréteur, plus de concaténation, plus d'avertissement —
   et un message d'erreur lisible si quelque chose casse.

   En déplaçant ce code, la construction du site s'est mise à échouer :
   webpack traite `new URL("…", import.meta.url)` comme une ressource à
   empaqueter. Deux corrections en sont sorties — une porte dédiée
   (`@gbum/db/migrations`), que le site n'emprunte jamais, et un chemin
   assemblé à la main. Surtout, `pnpm verifier` **construit désormais le site**
   à la fin : la chaîne n'aurait pas vu cette panne, et c'est l'intégration
   continue qui me l'aurait apprise après coup.

C'est la même règle que pour la répétition de déménagement : **une manœuvre
qu'on n'a jamais jouée ne marche pas.**
