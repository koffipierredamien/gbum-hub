# Direction artistique — « Foyer en mouvement »

**Version 2 du système visuel. 9 septembre 2026.**
Elle succède au système « Foyer » qui tient les onze planches du lot 1
(`maquettes/site-public/`). Elle ne le remplace pas : elle lui ajoute ce qui
lui manque.

Ce document répond à une demande précise : *« c'est bon mais ça peut être
mieux. Je veux un truc plus vivant. Nous sommes des jeunes. »*

Il est organisé en trois temps : **pourquoi les planches actuelles sont
calmes** (le diagnostic, chiffré), **sur quoi on s'appuie** (des mouvements
de jeunesse qui ont fait ce chemin avant nous), et **les dix règles** qui
constituent la nouvelle direction. Chaque règle porte soit une mesure, soit
une référence. Aucune ne porte un goût.

---

## 1. Le diagnostic

Les planches actuelles ne sont pas ratées. Elles sont **lisibles, sobres et
honnêtes** — et c'est précisément ce qui les rend calmes. Six causes,
vérifiables sur les fichiers :

**1.1 — Une seule surface.** Onze planches, un seul fond (`#FBF6EF`), un seul
contenant (carte blanche, bordure 1 px, rayon 14 px). L'œil ne change jamais
d'altitude. La seule bande sombre de toute la série — « Le prochain temps
fort », fond `#2A211B` sur l'accueil — est aussi la chose la plus vivante des
onze planches. C'est la preuve par l'exemple : ce qui manque, c'est du
relief, pas de la décoration.

**1.2 — Un seul registre typographique.** Le plus gros caractère de l'accueil
fait 34 px, le plus petit 11,5 px. Un rapport de **3:1**. Une page éditoriale
vivante travaille à 8:1 ou plus. Sans écart d'échelle, rien ne domine, donc
rien n'attire.

**1.3 — Des icônes à la place des visages.** La section « Ce qu'on y fait »
aligne quatre pictogrammes dans quatre carrés arrondis de 38 px identiques.
Sur les onze planches, **aucune personne n'apparaît**. Un mouvement
d'étudiants qui ne montre pas d'étudiants se décrit au lieu de se montrer.

**1.4 — Tout est une carte.** La carte est un outil de *séparation* : elle dit
« ceci est une unité distincte, comparable à sa voisine ». Employée pour tout
— une activité, un article, un chiffre, une ville, un temps fort — elle met
l'important et l'accessoire au même niveau visuel.

**1.5 — Aucun mouvement, pas même suggéré.** Pas une diagonale, pas un
débord, pas un chevauchement. Chaque élément est posé dans la même gouttière
de 20 px. Le calme est total, y compris là où on ne le voulait pas.

**1.6 — Et le vide est réel.** Environ **40 %** de la surface des planches
porte le marqueur d'attente `.attente` : thème de l'année, histoire, chiffres,
photos. C'est **juste** — c'est l'exigence A1.3 appliquée, et il n'est pas
question d'y renoncer. Mais cela a une conséquence de conception :

> Tant que le contenu n'est pas arrivé, l'énergie de la page doit venir de sa
> **structure** — surfaces, échelle, rythme, mouvement. Et la structure doit
> être construite de telle sorte que l'arrivée du contenu l'**amplifie**, au
> lieu de simplement remplir des trous.

C'est la ligne directrice de tout ce qui suit.

---

## 2. Sur quoi on s'appuie

Conformément à la méthode que nous avons retenue — *s'appuyer sur ce qu'a
déjà fait un grand mouvement et qui a fait ses preuves* — voici les quatre
références qui fondent cette direction, et ce qu'on retient de chacune.

### 2.1 Les Scouts britanniques, refonte de 2018 (agence NotOnSunday)

Le cas le plus proche du nôtre : un mouvement de jeunesse plus que centenaire
qui devait redevenir *« cool again »* auprès des jeunes **sans renier son
héritage**. La refonte a introduit une palette plus vive articulée autour de
deux couleurs nommées — **Scouts Orange** et **Scouts Forest Green** — une
typographie accessible et libre de droits (Nunito Sans), et un logo retravaillé
plutôt que remplacé. La stratégie a été construite après deux ans d'échanges
avec les jeunes eux-mêmes.

**Ce qu'on en retient :** on ne devient pas vivant en changeant de couleur, on
le devient en **augmentant le nombre de surfaces**. Le GBUM a déjà son orange
(`#E8732A`). Il lui manque les autres surfaces qui le font ressortir. Et,
comme chez les Scouts, l'ajout se fait **sans jeter l'existant**.

### 2.2 UCCF : The Christian Unions, refonte d'identité (agence IE Brand)

Le mouvement étudiant chrétien britannique — l'équivalent direct du GBUM,
membre du même réseau IFES. Le besoin était formulé exactement comme le
nôtre : rafraîchir l'identité visuelle **pour parler aux étudiants chrétiens
tout en préservant cent ans d'héritage**. L'agence a simplifié l'architecture
de marque, produit une identité souple avec un logo dynamique, et déployé une
campagne d'abord numérique.

**Ce qu'on en retient :** « souple » et « dynamique » ne veulent pas dire
bruyant. Ils veulent dire que le système a plusieurs états — plusieurs
surfaces, plusieurs échelles — et sait choisir selon le contexte.

### 2.3 Alpha Youth

Sur le fond plutôt que sur la forme. La série Alpha Youth est *« faite pour
les jeunes par les jeunes »*, et combine récit filmé, questions honnêtes et
discussion authentique. Le constat qui la fonde : les jeunes d'aujourd'hui
sont ouverts, optimistes et curieux, veulent susciter le changement autour
d'eux, et **recherchent des espaces d'authenticité et d'intégrité**.

**Ce qu'on en retient :** c'est notre justification la plus solide. Ce qui
rendra ce site vivant, ce ne sont pas des animations — ce sont **des visages
et des voix d'étudiants du GBUM**. Et cela valide notre règle la plus stricte :
le refus d'inventer n'est pas un handicap face à ce public, c'est exactement
ce qu'il cherche. Il faut simplement que le vide **demande** au lieu de
s'excuser (règle D10).

### 2.4 Le W3C, et la contrainte de mouvement

Le mouvement d'une interface est encadré. Le critère **WCAG 2.3.3 (Animation
from Interactions)** demande que toute animation non essentielle déclenchée
par une interaction puisse être désactivée. Les mouvements de grande
amplitude — parallaxe, zoom, panneaux glissants — peuvent déclencher des
troubles vestibulaires (distraction, nausée). Les alternatives sûres sont
les **fondus d'opacité, les transitions de couleur et les durées courtes**.
La requête média `prefers-reduced-motion` lit un réglage système de
l'utilisateur (macOS, Windows, iOS, Android, Linux) et doit être respectée.

Pour les durées et les courbes, on s'aligne sur les jetons de **Material
Design 3**, qui distingue des durées *short / medium / long* et deux jeux de
courbes, *standard* et *emphasized* — cette dernière étant recommandée pour
la plupart des transitions.

**Ce qu'on en retient :** on aura du mouvement, mais **réglé et court**, avec
un interrupteur système qui l'éteint entièrement (règle D4).

---

## 3. Les dix règles

### D1 — Cinq surfaces au lieu d'une

La page cesse d'être un fond unique sur lequel on pose des cartes. Elle
devient une **suite de bandes pleine largeur**, chacune sur une surface
nommée. Les valeurs sont mesurées ; aucune n'est choisie à l'œil.

| Surface | Fond | Texte principal | Texte secondaire | Accent |
|---|---|---|---|---|
| **Crème** | `#FBF6EF` | `#2A211B` — **14,66:1** | `#5F5346` — 6,94:1 | `#7A3208` — 8,54:1 |
| **Sable** | `#F4EADC` | `#2A211B` — **13,25:1** | `#5F5346` — 6,28:1 | `#7A3208` — 7,72:1 |
| **Encre** | `#2A211B` | `#FBF6EF` — **14,66:1** | `#B9AA98` — 6,96:1 | `#F0A868` — 7,89:1 |
| **Terre** | `#7A3208` | `#FBF6EF` — **8,54:1** | `#EFC9A6` — 5,94:1 | — |
| **Forêt** | `#12432A` | `#FBF6EF` — **10,49:1** | `#9ED2B4` — 6,62:1 | — |

Deux couleurs sont nouvelles : **Terre** `#7A3208` (l'ambre poussé jusqu'à
pouvoir porter du texte clair) et **Forêt** `#12432A`. Le choix du vert n'est
pas décoratif : c'est le même couple que les Scouts ont retenu — un orange et
un vert forêt — et c'est aussi le couple du drapeau marocain lu en sourdine.

**Les règles d'emploi :**
- Jamais deux bandes voisines sur la même surface.
- Une bande va **d'un bord à l'autre**. Pas de gouttière, pas de rayon. La
  gouttière de 22 px est *intérieure* à la bande.
- **Deux bandes sombres ne se suivent jamais** : entre deux surfaces Encre,
  Terre ou Forêt, il faut au moins **400 px** de surface claire.
  Ne sont pas des bandes, et n'entrent donc pas dans ce compte : l'en-tête et
  le pied de page (ce sont les bords de la page, pas son contenu), le défilé
  des villes (c'est un filet), et les photographies pleine largeur (ce sont
  du contenu, pas une surface). Mais la règle d'adjacence, elle, vaut aussi
  contre le pied de page : une bande Forêt ne doit pas venir buter
  directement sur un pied de page Encre. C'est la vérification par le rendu
  qui a fait apparaître ce cas sur la seconde planche ; une bande claire a
  été intercalée.
- Une bande sombre a une fonction : elle marque ce qui compte le plus.
- Le texte secondaire dépend de la surface, il n'est pas transposable :
  `#B9AA98` convient sur Encre (6,96:1) mais **pas** sur Terre, où il ne
  mesure que **4,05:1**. Sur Terre, c'est `#EFC9A6`.

### D2 — Le titre devient un objet

| Rôle | Mobile | Bureau | Fonte |
|---|---|---|---|
| Display | **46 px** | **92 px** | Newsreader 500, interligne 1,02, approche −0,02 em |
| Titre | 30 px | 40 px | Newsreader 600, interligne 1,14 |
| Sous-titre | 20 px | 24 px | Hanken Grotesk 600 |
| Corps | 16 px | 17 px | Hanken Grotesk 400, interligne 1,62 |
| Étiquette | 11,5 px | 12 px | Hanken Grotesk 700, capitales, approche 0,08 em |

Le rapport passe de 3:1 à **4:1 sur mobile et 8:1 au bureau**. Une seule
occurrence de *Display* par page — celle qui dit ce qu'est le GBUM. S'il y en
a deux, il n'y en a plus aucune.

### D3 — La photographie porte la page, elle ne l'illustre pas

- Une photo pleine largeur, **jamais dans une carte**, jamais moins de
  **240 px** de haut ; l'image d'ouverture est en **4:5** sur mobile.
- Des **personnes reconnaissables à l'échelle** — pas des mains, pas des
  livres, pas des bâtiments vides.
- Du texte par-dessus une photo n'est permis que sur un **voile encre à 66 %
  minimum**. Mesure : `#2A211B` à 66 % sur la photo la plus claire concevable
  (blanc pur) donne `#726C69` ; la crème `#FBF6EF` par-dessus mesure
  **4,81:1**. C'est le pire cas, et il passe. *(Un voile à 45 % ne donnerait
  que 2,56:1 — c'est le défaut corrigé lors de la première relecture.)*
- **Corollaire, et il est strict : sur un voile, le texte est en crème et
  seulement en crème.** L'ambre clair `#F0A868` n'y mesure que **2,58:1** —
  le voile a été calculé pour la crème, pas pour un accent. Un bloc qui a
  besoin de couleur au-dessus d'une photo doit poser **son propre fond
  opaque** : encre à 90 %, ce qui donne `#3F3732` dans le pire cas et remonte
  l'ambre clair à **5,82:1**. C'est ce que fait le marqueur d'attente posé
  sur la photo d'ouverture.

### D4 — Le mouvement existe, et il est réglé

| Jeton | Valeur | Emploi |
|---|---|---|
| `duree-courte` | 120 ms | survol, changement de couleur |
| `duree-moyenne` | 320 ms | apparition d'un bloc |
| `duree-longue` | 520 ms | ouverture d'une bande |
| `courbe` | `cubic-bezier(.05,.7,.1,1)` | décélération accentuée (MD3 *emphasized decelerate*) |
| `cascade` | 60 ms, 5 éléments au plus | entrée d'une liste |

- **Apparition** : opacité 0 → 1 avec une translation verticale de **12 px**,
  pas davantage. Amplitude volontairement faible : c'est un mouvement de
  grande amplitude qui pose problème, pas le principe du mouvement.
- **Aucune parallaxe. Aucun zoom. Aucun panneau glissant.**
- Un élément n'apparaît **qu'une fois**. Rien ne rejoue au défilement inverse.
- **Interrupteur obligatoire** :

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: .01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: .01ms !important;
  }
}
```
Sous ce réglage, le site reste **complet et lisible** : rien n'est caché en
attendant une animation qui ne viendra pas. C'est la condition pour que
l'apparition soit un agrément et non un obstacle.

### D5 — Le défilé des villes

Une bande sur fond Encre où défilent lentement les noms des villes où le GBUM
est présent — Rabat, Casablanca, Fès, Kénitra, Marrakech… — séparés par un
point ambre. **38 secondes** par cycle, linéaire, en boucle ; arrêt au survol ;
arrêt total sous `prefers-reduced-motion`.

C'est le seul élément en mouvement continu de tout le site, et c'est le
meilleur rapport effet/coût de cette direction : la page bouge, et ce qu'elle
dit en bougeant est **vrai** — les noms de villes sont des faits, pas des
chiffres inventés. Elle dit aussi la seule chose qu'un étudiant veut savoir
en premier : *est-ce qu'il y en a un chez moi ?*

### D6 — Les voix, pas les icônes

Les quatre cartes à pictogramme de « Ce qu'on y fait » disparaissent au profit
de deux choses :

1. **Une bande Terre numérotée** — les quatre pratiques, en chiffres
   *Display*, séparées par des filets, sans carte ni icône.
2. **Une bande Forêt « Les voix »** — une citation d'étudiant en Newsreader
   28 px, avec prénom, ville et année d'études.

Aucune citation n'existe encore : l'emplacement porte le marqueur d'attente.
Cela ajoute **une demande** à la note au Secrétariat National — *recueillir
trois à cinq témoignages courts d'étudiants, avec accord écrit de publication*
— et c'est la demande la plus rentable de toute la liste.

### D7 — L'ambre reste le geste, jamais l'ambiance

La règle mesurée du système « Foyer » survit **intacte**, et gagne un
corollaire rendu nécessaire par D1 :

- **L'ambre `#E8732A` ne porte que des actions.** Texte du bouton en encre
  `#2A211B` — **5,19:1**. Le blanc sur ambre reste interdit : **3,04:1**.
- **Corollaire :** maintenant qu'il existe des surfaces colorées, la tentation
  de peindre une section en ambre doit être refusée explicitement. L'ambre
  n'est jamais un fond de bande. Si tout est ambre, plus rien n'est cliquable.
- La couleur d'ambiance chaude, c'est **Terre** `#7A3208`. C'est à cela qu'elle
  sert.

### D8 — Le chiffre a une taille

Quand les vrais nombres arriveront — villes, cellules, GBUssiens — ils ne
seront pas du texte courant dans une carte. Ils seront des **chiffres
*Display* sur une bande colorée**.

L'emplacement est **dessiné dès maintenant, à sa taille définitive**, avec le
marqueur d'attente à l'intérieur. Le jour où le Secrétariat National donne le
nombre, il tombe dans une forme déjà faite pour lui — sans nouvelle
maquette, sans nouvelle discussion. C'est la manière de tenir la règle « rien
n'est inventé » **sans** que la page soit condamnée à rester plate.

### D9 — La carte se mérite

Une carte, désormais, seulement pour ce qui est **énumérable et comparable** :
une liste de villes, une liste d'archives du canevas, un agenda. Tout le
reste devient une bande, un filet, ou du texte posé sur la page. Sur
l'accueil, cela fait passer le nombre de cartes de **sept à deux**.

Une conséquence à ne pas manquer : ce qui reste enfermé dans une bordure est
désormais, pour l'essentiel, **un contrôle** — une puce de filtre, un
sélecteur. Or la bordure d'un contrôle est soumise au critère WCAG 1.4.11 et
doit mesurer **3:1** contre son fond, là où un simple filet décoratif n'y est
pas tenu. Les bordures claires héritées du système d'origine ne suffisent
donc plus : sur Sable, la bordure d'une puce est `#8A7458` — **3,74:1**.

### D10 — Le vide invite, il ne s'excuse pas

C'est la règle qui change le plus la sensation d'ensemble, parce qu'elle
touche 40 % de la surface.

Le marqueur `.attente` actuel est un rectangle pointillé — la forme visuelle
d'un formulaire incomplet. Il est honnête, mais il est **passif**. Nouvelle
forme :

- un filet plein de 3 px en Terre à gauche, plutôt qu'un pointillé tout autour ;
- une étiquette en capitales, en Terre `#7A3208` sur crème — **8,54:1** ;
- la phrase, en corps normal, qui dit **qui** doit fournir et **quoi** ;
- et, quand c'est pertinent, un lien : **« Vous avez cette information ? »**

Le vide passe ainsi du statut de trou à celui d'appel à contribution. Pour un
mouvement d'étudiants, une page qui dit *« cette partie de notre histoire
n'est pas encore écrite — écris-la avec nous »* est plus vivante qu'une page
pleine. Et c'est vrai.

### D11 — Le défilé d'images

*Ajoutée le 9 septembre 2026, à la demande du mouvement : « j'aimerais qu'il y
ait plusieurs images qui défilent ».*

L'ouverture de l'accueil ne porte pas une photographie, mais **quatre**, qui se
succèdent. C'est la bonne réponse à un besoin réel : une seule image ne peut pas
dire à la fois *des étudiants*, *plusieurs villes* et *plusieurs manières de se
retrouver*. Quatre le peuvent.

Les règles, et elles sont strictes, parce qu'un carrousel est l'endroit où les
sites se rendent inutilisables :

- **Fondu d'opacité seulement.** Ni glissement, ni zoom, ni panoramique. C'est
  la même raison qu'en D4 : ce sont les mouvements de grande amplitude qui
  déclenchent les troubles vestibulaires, et le fondu est l'alternative sûre.
- **Sept secondes par image, 900 ms de fondu.** Assez lent pour qu'on ne le
  remarque pas comme un effet ; assez vivant pour que la page respire.
- **Un moyen de l'arrêter — obligatoire.** Le critère **WCAG 2.2.2 (Pause,
  Stop, Hide)** s'applique à tout contenu qui se met à jour tout seul. Il y en a
  trois ici : le bouton pause, les pastilles (choisir une image arrête le
  défilé), et l'arrêt au survol.
- **Sous `prefers-reduced-motion`, une seule image reste** — la première — et la
  page ne perd rien : le texte, le voile et les commandes sont identiques.
- **Le voile de D3 s'applique à chaque image**, pas à la première seulement :
  c'est le pire cas de la série qui décide, jamais la plus sombre.

Cela ajoute une précision à la demande N1 : ce ne sont pas une photographie
qu'il faut, mais **quatre**, et elles doivent se tenir ensemble — même lumière,
même distance aux visages, même honnêteté.

---

## 4. Ce qui ne change pas

Pour être clair sur le périmètre :

- **Rien n'est inventé.** A1.3 est renforcée par D10, pas assouplie.
- **La publication s'arrête à la ville** (ADR-011). D5 nomme les villes ;
  jamais les cellules, jamais les responsables.
- **Français et anglais seulement** (ADR-008 amendée).
- **Les deux règles mesurées de « Foyer »** : texte sur ambre en encre, jamais
  en blanc ; l'ambre ne colore jamais un état.
- **Les fontes** : Newsreader et Hanken Grotesk. Aucune n'est remplacée. On
  utilise mieux celles qu'on a — c'est le sens de D2.
- **La palette d'origine** est conservée en entier. Deux valeurs s'y ajoutent.

---

## 5. Ce que cela demande au mouvement

Cette direction ne tient ses promesses que si trois choses arrivent. Elles
s'ajoutent à la note au Secrétariat National (`07-NOTE-AU-SECRETARIAT-NATIONAL.md`).

| # | Demande | Pourquoi elle est décisive |
|---|---|---|
| **N1** | **Des photographies d'étudiants du GBUM**, avec accord écrit de publication — **quatre pour l'ouverture**, qui se tiennent ensemble, et une par temps fort. | D3 et D11. Sans elles, la page d'accueil s'ouvre sur un dégradé. C'est la demande la plus importante des trois. |
| **N2** | **Trois à cinq témoignages courts** — prénom, ville, année d'études, deux ou trois phrases. | D6. C'est ce que le public visé cherche : de l'authenticité, pas de la mise en page. |
| **N3** | **La liste exacte des villes**, dans l'ordre où le mouvement veut les citer. | D5. Le défilé ne peut pas fonctionner sur une liste approximative. |

---

## 6. La démonstration, puis l'application

Trois planches de démonstration, dans `maquettes/direction-artistique/` :

| Fichier | Ce qu'elle montre |
|---|---|
| `Systeme.dc.html` | Le système lui-même : les cinq surfaces mesurées, l'échelle typographique, les trois mouvements en fonctionnement, et un avant/après de composant. |
| `AccueilV2.dc.html` | L'accueil recomposé avec les dix règles — à comparer directement avec `site-public/Main.dc.html`. |
| `VieDuMouvementV2.dc.html` | La même grammaire sur une seconde page, pour vérifier qu'elle tient ailleurs que sur l'accueil. |

Puis les **onze planches du lot 1**, dans `maquettes/site-public/`, toutes
recomposées dans cette direction le 9 septembre 2026. Elles partagent un noyau
de styles identique — les cinq surfaces, l'échelle, les marqueurs, les
contrôles — de sorte qu'une règle corrigée l'est partout à la fois.

Les trois planches de démonstration restent dans
`maquettes/direction-artistique/` comme trace de la proposition.

---

## 7. Ce que l'application a tranché

*Le 9 septembre 2026, la direction a été appliquée aux onze planches du lot 1.
Trois décisions ont dû être prises en chemin ; elles l'ont été, et elles sont
rectifiables.*

### 7.1 L'ordre des pages

**Le mouvement · Où nous sommes · La vie du mouvement · Agenda · Le canevas ·
Soutenir · Nous écrire.**

L'ordre suit le parcours d'un visiteur, pas l'organigramme du mouvement :
**découvrir** (qui nous sommes, où nous sommes, ce que nous vivons), puis
**participer** (ce qui vient), puis **approfondir** (le canevas), puis
**s'engager** (soutenir, écrire).

Un seul changement par rapport à l'ordre précédent : **l'agenda passe devant le
canevas**. Une date est actionnable pour quelqu'un qui découvre le mouvement ;
une archive d'études récompense quelqu'un qui s'y intéresse déjà. Mettre la
seconde avant la première fait payer au visiteur pressé le prix du visiteur
patient.

Et une règle qui n'était pas écrite : **« Rejoindre le GBUM » n'est pas une page
de menu.** C'est l'action — l'unique bouton ambre, présent dans l'en-tête au
bureau et à la fin de chaque page. Un menu à huit entrées dont l'une est un
verbe n'a plus de hiérarchie.

Le pied de page reprend le même ordre, en trois colonnes : *Découvrir*,
*Participer*, *Soutenir*.

### 7.2 Les manières de soutenir

**Trois, dans cet ordre : prier, donner, devenir Ami du GBU.** Elles sont
classées du moins coûteux au plus engageant, et chacune tient sa propre bande —
elles ne sont pas trois cartes interchangeables, parce qu'elles ne se valent
pas.

| # | | Pourquoi à cette place |
|---|---|---|
| **01** | **Prier** — recevoir la lettre de prière | Elle ne coûte rien, elle est la plus demandée dans un mouvement étudiant, et c'est la seule que tout le monde peut faire aujourd'hui. Bande **Forêt**. |
| **02** | **Donner** — ponctuel ou régulier | Les dons financent les camps, les déplacements de ceux qui n'en ont pas les moyens, et la formation des responsables. Bande **Crème**. |
| **03** | **Devenir Ami du GBU** | Pour les anciens GBUssiens. C'est un niveau à part entière du mouvement (§4 du cahier des charges), pas une liste de diffusion. Bande **Terre**. |

**Et pas de quatrième.** Ce sont les trois manières que le mouvement pratique
réellement ; en ajouter une serait l'inventer. Une page qui invente une manière
de donner ment sur ce qu'elle fait de l'argent — c'est le seul endroit du site
où la règle « rien n'est inventé » a une conséquence financière.

Les **modalités de don ne sont pas connues**. Tant qu'elles ne le sont pas,
**aucun bouton de paiement n'est affiché** : un don que l'on ne sait pas
recevoir ne se demande pas. C'est le marqueur d'attente qui tient la place.

### 7.3 Le point manquant de la frise

La frise de la page *Le mouvement* porte trois faits datés — 1947 (fondation de
l'IFES), 1968 (naissance du GBUAF), 2023 (le camp d'Ifrane et la vision
décennale). Entre 1968 et 2023 il manque **la fondation du GBUM** : le mouvement
ne nous a pas encore donné sa date, et rien n'en est publié en ligne.

La question était : *où placer ce point sans date ?* La réponse retenue :
**nulle part comme point.** Un point vide sur une frise se lit comme une erreur
de saisie — le lecteur croit à un bug, pas à un manque assumé. À sa place, **à
son rang chronologique entre 1968 et 2023**, il y a un marqueur d'attente, avec
un cercle creux au lieu d'un cercle plein : il dit ce qui manque, à qui le
demander, et propose de le fournir.

La frise reste exacte, le manque reste visible, et il devient une invitation
plutôt qu'un trou. C'est D10 appliquée à un cas particulier.
