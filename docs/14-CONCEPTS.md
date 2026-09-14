# Les concepts, et où ils se voient dans ce projet

**14 septembre 2026.** Pierre : « en tant qu'informaticien, je n'ai pas à
apprendre à coder tous les langages ; je dois comprendre les notions, concepts,
architecture. »

C'est la bonne demande, et elle change le format. Un langage s'oublie en deux
ans ; un concept se transporte d'un métier à l'autre pendant trente ans. Ce
document remplace le cours de syntaxe par un **catalogue de concepts**, chacun
ancré dans une décision réelle de ce projet.

[`13-PRISE-EN-MAIN.md`](13-PRISE-EN-MAIN.md) reste utile comme glossaire et
comme visite guidée. C'est ici que se fait le travail de fond.

---

## 1. La pédagogie, et sur quoi elle s'appuie

Quatre méthodes éprouvées, empruntées telles quelles.

| D'où elle vient | Ce qu'on lui prend |
|---|---|
| **Le modèle C4** (Simon Brown) | On comprend un système par **niveaux de zoom** — contexte, conteneurs, composants, code — et non fichier par fichier. On ne descend d'un niveau que lorsque le niveau du dessus est clair. |
| **Les ADR** (Michael Nygard, 2011) | Une décision s'enseigne avec son **contexte, ses options écartées et son compromis**. Une décision sans alternative n'est pas une décision : c'est un réflexe. |
| **Ports et adaptateurs** (Alistair Cockburn, 2005) et **le masquage d'information** (David Parnas, 1972) | Les deux idées qui expliquent la forme du dépôt. Presque tout le reste en découle. |
| **Les douze facteurs** (Heroku, 2011) | Le vocabulaire de l'exploitation : configuration, ressources attachées, parité des environnements. |

### La grille — chaque concept se présente en six points

C'est le format fixe du catalogue. Il est conçu pour l'architecte, pas pour le
débutant : il finit toujours par le compromis et le transfert.

| | Le point | Ce qu'il contient |
|---|---|---|
| **1** | **Le concept** | Son nom en français, **et son nom industriel en anglais** — celui que vous lirez dans un appel d'offres ou un article |
| **2** | **La panne qu'il empêche** | Le défaut réel qu'il évite, si possible tiré de l'audit de l'existant |
| **3** | **L'ancre ici** | Un fichier de ce projet, dix lignes au plus. Le code sert de **preuve**, pas de leçon de syntaxe |
| **4** | **Le compromis** | Ce qu'on a payé pour l'obtenir. Un concept sans coût est une publicité |
| **5** | **La preuve** | Ce qui casse, automatiquement, si quelqu'un viole le concept demain |
| **6** | **Ailleurs** | Le même concept dans d'autres piles techniques — Django, Spring, Rails — pour que la notion vous serve hors d'ici |

Le point 5 est ce qui distingue une architecture d'une intention. Une règle que
rien ne fait respecter n'est pas une règle : c'est un souhait.

### Comment on valide un module

Pas d'exercice de programmation : une **question de jugement**. Typiquement,
une demande plausible du Secrétariat National, et trois questions — *où cela se
place-t-il ? qu'est-ce qui casse si on le place ailleurs ? quel invariant
cette demande met-elle en danger ?* C'est l'exercice du métier d'architecte, et
il ne demande pas une ligne de code.

---

## 2. Le plan : quatre niveaux de zoom, six modules

### Les niveaux

| Niveau | Question à laquelle il répond | État |
|---|---|---|
| **1. Contexte** | Qui se sert du système, quels autres systèmes l'entourent, sous quelles contraintes | Module M1 |
| **2. Conteneurs** | Quelles choses tournent, où, et comment elles se parlent | Module M2 |
| **3. Composants** | Comment un conteneur est découpé, et pourquoi les dépendances vont dans ce sens | Module M3 |
| **4. Code** | Seulement lorsqu'un concept l'exige — jamais plus de dix lignes | Partout, en ancre |

### Les modules

| # | Module | Concepts couverts |
|---|---|---|
| **M1** | **Le système dans son monde** | Contexte C4 · parties prenantes · contraintes non fonctionnelles (bénévolat, budget nul, rentrée universitaire) · attributs de qualité |
| **M2** | **Ce qui tourne, et où** | Conteneurs C4 · client/serveur · rendu en avance, à la demande, incrémental · cache et invalidation · ressources attachées (12F/IV) · parité des environnements |
| **M3** | **La forme du dépôt** | Ports et adaptateurs · masquage d'information (Parnas) · sens des dépendances · langage omniprésent (DDD) · loi de Conway |
| **M4** | **Les secrets** *(livré ci-dessous)* | Fonction à sens unique · sel · coût paramétrable et agilité cryptographique · temps constant · jeton contre empreinte · défense en profondeur · moindre privilège |
| **M5** | **Les données et le temps** | Schéma comme code · migrations rejouables et irréversibles · invariants en base · états impossibles impossibles · brouillon/publié (content staging) · idempotence |
| **M6** | **La qualité exécutable** | Politique exécutable (lint comme règle) · barrière d'intégration continue · tests comme spécification · accessibilité mesurable · erreurs typées contre exceptions avalées |

M4 est livré tout de suite, en entier, pour que vous jugiez le format avant que
j'écrive les cinq autres.

---

## 3. Module M4 — Les secrets

**La question du module :** comment un système peut-il vérifier un mot de passe
qu'il ne connaît pas, et reconnaître une session dont il n'a pas le jeton ?

---

### C1 — La fonction à sens unique

> *En anglais : one-way function, cryptographic hash.*

**Le concept.** Une fonction facile à calculer dans un sens, impraticable à
inverser. On ne range pas le mot de passe : on range le résultat d'un calcul
fait sur lui. À la connexion suivante, on refait le calcul et on compare les
résultats. Le système **vérifie sans savoir**.

La distinction qui compte : **hacher n'est pas chiffrer**. Ce qui est chiffré
est destiné à être déchiffré — il existe donc une clé, qui peut fuir. Un
condensat n'a pas de clé, parce qu'il n'a pas de retour.

**La panne qu'il empêche.** La fuite d'une base de données transforme, sans
cela, chaque compte en compte compromis — et bien au-delà du site, puisque les
gens réemploient leurs mots de passe.

**L'ancre ici.** `packages/identite/src/mot-de-passe.ts` :

```ts
export async function hacher(motDePasse: string): Promise<string> {
  const sel = randomBytes(16);
  const condensat = await derive(motDePasse.normalize("NFKC"), sel, LONGUEUR, { … });
  return ["scrypt", N, R, P, sel.toString("base64url"), condensat.toString("base64url")].join("$");
}
```

**Le compromis.** On ne peut plus jamais retrouver un mot de passe oublié : on
ne peut que le remplacer. C'est un coût de fonctionnement réel — et c'est
pourquoi « réinitialiser un mot de passe » figure parmi les chantiers
restants.

**La preuve.** La colonne `mot_de_passe` de la table `comptes` ne contient
jamais autre chose que le résultat de cette fonction : c'est le seul endroit du
projet qui écrit dedans.

**Ailleurs.** Django range `algorithme$itérations$sel$condensat` — exactement la
même idée de format autodescriptif ; PHP le fait avec `password_hash()` ; les
recommandations de l'OWASP classent Argon2id, puis scrypt, puis bcrypt.

---

### C2 — Le sel

> *En anglais : salt.*

**Le concept.** Une valeur aléatoire, différente pour chaque compte, mêlée au
mot de passe avant le calcul. Elle n'est pas secrète — elle est rangée en clair
à côté du condensat.

**La panne qu'il empêche.** Sans sel, deux personnes ayant le même mot de passe
ont le même condensat : la base devient une table de correspondance. Et surtout,
un attaquant peut précalculer une fois pour toutes les condensats des mots de
passe courants et les comparer à toute la base d'un coup. Le sel rend ce
précalcul **inutilisable, compte par compte**.

**L'ancre ici.** `randomBytes(16)`, une ligne plus haut — un sel neuf à chaque
appel de `hacher`.

**Le compromis.** Aucun, en dehors de seize octets par compte. C'est l'un des
rares concepts sans contrepartie.

**La preuve.** Le test « produit un condensat différent à chaque fois, pour le
même mot de passe » hache deux fois la même chaîne et exige deux résultats
distincts. Si quelqu'un figeait le sel, ce test échouerait avant l'envoi du
code.

**Ailleurs.** Universel : aucun système sérieux ne stocke un condensat de mot
de passe sans sel depuis les années 1970 — c'est la réponse aux tables
arc-en-ciel.

---

### C3 — Le coût paramétrable, et l'agilité cryptographique

> *En anglais : work factor, cryptographic agility.*

**Le concept.** Un condensat de mot de passe doit être **lent à calculer, à
dessein**. `scrypt` est réglé pour prendre environ un dixième de seconde et
soixante-quatre mégaoctets de mémoire par vérification. Imperceptible pour la
personne qui se connecte ; ruineux pour qui essaie des milliards de
combinaisons.

Et comme le matériel progresse, les réglages doivent pouvoir se durcir. D'où
la seconde moitié du concept : **les paramètres sont écrits dans le condensat
lui-même**.

```
scrypt$16384$8$1$<sel>$<condensat>
```

**La panne qu'il empêche.** Deux, en fait. Un condensat rapide — SHA-256 nu,
par exemple — se casse à la force brute sur du matériel ordinaire. Et un
réglage figé dans le code oblige, le jour où on le durcit, à invalider tous les
mots de passe existants : chaque ancien condensat porte ses propres
paramètres, donc chacun reste vérifiable.

**Le compromis.** Chaque connexion coûte cent millisecondes de processeur et
soixante-quatre mégaoctets. Sur un serveur modeste, cela **plafonne le nombre
de connexions simultanées** — ce qui est, d'ailleurs, une forme de protection.

**La preuve.** Un test lit le condensat produit et vérifie qu'il **commence par
ses propres paramètres**. Le jour où on durcit le réglage, ce test dit
immédiatement si les anciens condensats restent lisibles.

**Ailleurs.** C'est le `cost` de bcrypt, les `iterations` de PBKDF2, les
paramètres `m`, `t`, `p` d'Argon2. Le format autodescriptif est la norme de
fait dans tout l'écosystème.

---

### C4 — La comparaison à temps constant

> *En anglais : constant-time comparison, timing attack.*

**Le concept.** Une comparaison ordinaire s'arrête au premier octet différent.
Le **temps** qu'elle met révèle donc combien d'octets étaient justes. En
mesurant des milliers de tentatives, on reconstitue la valeur attendue octet
par octet. On compare donc avec une fonction qui parcourt **toujours** toute la
longueur.

**La panne qu'il empêche.** Une attaque par canal auxiliaire : l'information ne
fuit pas par le contenu de la réponse, mais par le **temps** qu'elle met à
venir. C'est la famille d'attaques qu'on oublie, parce qu'elle n'apparaît dans
aucune fonctionnalité.

**L'ancre ici.**

```ts
if (obtenu.length !== attendu.length) return false;
return timingSafeEqual(obtenu, attendu);
```

**Le compromis.** La fonction est un peu plus lente, et il faut y penser. Le
piège classique est de croire qu'on l'a appliquée : `===` sur deux chaînes,
dans le même fichier, suffirait à annuler la protection.

**La preuve — et il n'y en a pas.** Aucun test, aucune règle de relecture ne
garantit aujourd'hui qu'un futur `===` ne remplacera pas cet appel : le résultat
serait identique dans les deux cas, et seul le temps de réponse changerait.
C'est une **faiblesse réelle de ce projet**, et je la signale plutôt que de la
taire — elle est du ressort du module M6. Retenez le critère : *un concept
dont la violation ne casse rien ne tient que par la vigilance.*

**Ailleurs.** `hmac.compare_digest` en Python, `hash_equals` en PHP,
`MessageDigest.isEqual` en Java. Le concept est le même partout ; seul le nom
change.

---

### C5 — Le jeton et son empreinte

> *En anglais : bearer token, token hashing at rest.*

**Le concept.** Après la connexion, le navigateur reçoit un **jeton au
porteur** : quiconque le détient est reconnu. Le serveur, lui, n'a pas besoin
du jeton — seulement de savoir **le reconnaître**. Il range donc son empreinte,
et jette l'original.

**La panne qu'il empêche.** Une base volée contient, sinon, des sessions
immédiatement utilisables : un attaquant se connecte sans jamais casser un seul
mot de passe. Hacher les mots de passe tout en rangeant les jetons en clair
laisse la porte de derrière ouverte.

**L'ancre ici.** `packages/identite/src/session.ts` :

```ts
export function creerJeton(): string {
  return randomBytes(32).toString("base64url");
}
export function empreinte(jeton: string): string {
  return createHash("sha256").update(jeton).digest("base64url");
}
```

**Une subtilité qui vaut le détour.** Ici, SHA-256 **suffit**, alors que les
mots de passe exigent scrypt. Pourquoi ? Parce qu'un jeton est déjà trente-deux
octets tirés au sort : il n'y a rien à deviner, donc rien à ralentir. Un mot de
passe, lui, est court et choisi par un humain. **Le bon outil dépend de
l'entropie de l'entrée, pas de la sensibilité du champ** — c'est le genre de
raisonnement qui sépare l'application d'une recette de la compréhension d'un
concept.

**Le compromis.** Le serveur ne peut plus retrouver la session d'une personne à
partir de son jeton perdu — mais ce besoin n'existe pas.

**La preuve.** Deux tests : « n'en tire jamais deux fois le même » et « range
une empreinte, jamais le jeton », ce dernier comparant explicitement la valeur
stockée au jeton d'origine.

**Ailleurs.** C'est la recommandation de l'OWASP pour les identifiants de
session, et la pratique de tout système qui délivre des jetons d'API : on montre
le jeton une fois, on ne range que son empreinte.

---

### C6 — La défense en profondeur

> *En anglais : defence in depth.*

**Le concept.** Aucune protection n'est supposée tenir seule. Le cookie de
session porte trois attributs indépendants, et chacun couvre ce que les autres
ne couvrent pas :

| Attribut | Ce qu'il empêche |
|---|---|
| `httpOnly` | Qu'un script lise le jeton — donc qu'une faille d'injection le vole |
| `sameSite` | Qu'un autre site déclenche une action en votre nom (CSRF) |
| `secure` | Qu'il circule sur une connexion non chiffrée |

**La panne qu'il empêche.** La monoculture : une seule barrière, et sa chute
donne tout. Trois barrières indépendantes exigent trois fautes simultanées.

**Le compromis, et un incident réel.** Ces attributs se contredisent parfois
avec l'environnement. `secure` vrai sur `http://localhost` **fait disparaître
le cookie en silence** : le mot de passe était bon, la session était bien
ouverte en base, et l'écran revenait à la page de connexion sans rien dire.
C'est arrivé pendant la construction, et la panne a l'air d'un bug
d'authentification alors qu'elle n'en est pas un. L'attribut est désormais
déduit de l'hôte.

Retenez cet incident : **une protection mal placée ne se signale pas comme une
protection.** Elle se signale comme une panne inexplicable.

**La preuve — partielle.** Le parcours d'administration, rejoué dans un vrai
navigateur à chaque envoi de code, prouve que la session s'ouvre, tient, et
disparaît à la déconnexion ; il ne vérifie pas les trois attributs eux-mêmes.
Deuxième faiblesse notée pour M6.

**Ailleurs.** `SESSION_COOKIE_SECURE` et `SESSION_COOKIE_SAMESITE` en Django,
les mêmes réglages dans Rails et Spring Session, et la fiche de l'OWASP sur la
gestion des sessions.

---

### C7 — La surface de fuite, ou le moindre privilège appliqué aux données

> *En anglais : attack surface, data minimisation.*

**Le concept.** La façon la plus fiable de protéger une donnée est de **ne pas
l'avoir**. Ce projet applique cette idée à trois niveaux, et les trois
apparaissent dans M4 et M5 :

1. **la base** ne porte pas de colonne pour le jour, le lieu ni le responsable
   d'une cellule ;
2. **le type** de la ville publiable ne peut pas porter ces champs ;
3. **la sauvegarde** qu'on partagerait ne peut donc pas les contenir.

**La panne qu'il empêche.** Le contournement futur. Une consigne — « n'affiche
pas le responsable » — tient tant que personne n'ajoute d'écran. Une colonne
absente tient toujours.

**La preuve.** Un test énumère les champs de la ville publiable et compare la
liste à l'attendu. Y ajouter un champ fait échouer le test, donc l'envoi du
code. C'est un invariant **exécutable**, pas une note dans un cahier des
charges.

**Ailleurs.** C'est la minimisation des données du RGPD, énoncée comme principe
juridique — et appliquée ici par la structure plutôt que par la discipline.

---

### La question de contrôle du module M4

Le Secrétariat National demande : *« Pour éviter les oublis de mot de passe,
pourrait-on se connecter par un lien envoyé sur le courriel ? »*

Trois questions, dans l'ordre :

1. Parmi C1 à C7, **lesquels deviennent sans objet, lesquels restent, et
   lequel change de nature ?**
2. Quelle **nouvelle dépendance** cette demande introduit-elle, et quel facteur
   des douze concerne-t-elle ?
3. Le lien magique déplace la sécurité vers la boîte de courriel. **Est-ce un
   gain ou une perte** pour le GBUM en particulier — et de quoi dépend la
   réponse ?

Répondez comme vous voulez, même en trois lignes. Je réponds ensuite, et nous
comparons : c'est la comparaison qui instruit, pas la note.

---

## 4. Ce que je vous demande de valider

Avant que j'écrive M1, M2, M3, M5 et M6 :

1. **La grille en six points** vous convient-elle, ou faut-il déplacer le
   compromis avant l'ancre ?
2. **L'ordre des modules** : je propose M3 (la forme du dépôt) juste après M4,
   parce que c'est le module qui porte le plus de transfert. M1 et M2, plus
   descriptifs, viendraient ensuite.
3. **La colonne « Ailleurs »** : utile, ou bruit ? Elle coûte du volume ; elle
   fait le transfert.

Dites-moi, et j'ajuste avant d'écrire la suite — plutôt que de produire cinq
modules dans un format que vous auriez corrigé au premier.
