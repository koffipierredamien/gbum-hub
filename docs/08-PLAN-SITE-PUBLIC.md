# Plan du site public — lot 1

| | |
|---|---|
| **Objet** | `gbu-maroc.org` — la face publique du GBUM |
| **Décidé** | 9 septembre 2026 : c'est le premier lot |
| **Langues** | **Français et anglais.** Pas d'arabe. |
| **Objectifs servis** | P1 visibilité · P2 mémoire ouverte · P3 actualisation régulière |

> **Pourquoi ce lot en premier.** Il ne dépend d'**aucune donnée existante**, ne
> demande **aucune migration**, et rend le mouvement visible en quelques
> semaines. Aujourd'hui, ouvrir `gbu-maroc.org` mène à un écran de connexion.

---

## 1. Les pages

Huit pages. Pas davantage : un site que personne n'a le temps d'entretenir
meurt en trois mois.

| # | Page | Ce qu'elle répond | Contenu |
|---|---|---|---|
| **1** | **Accueil** | « Qu'est-ce que le GBUM, et est-ce pour moi ? » | Éditorial + extraits des autres pages |
| **2** | **Le mouvement** | Qui nous sommes : vision décennale, devise, thème de l'année, convictions, IFES et GBUAF, **notre histoire** | Éditorial |
| **3** | **Où nous sommes** | « Y a-t-il un groupe près de moi ? » | Base de données |
| **4** | **La vie du mouvement** | Ce qu'on fait, en images | Base de données — alimenté par l'espace de travail |
| **5** | **Agenda** | Les prochains temps forts ouverts | Base de données |
| **6** | **Le canevas** | L'année en cours et **toutes les archives** | Base de données |
| **7** | **Soutenir** | Comment aider le mouvement | Éditorial + formulaire |
| **8** | **Nous écrire** | Joindre le mouvement | Formulaire |

Plus, au pied de page : **Confidentialité et vos données**, et le lien vers
l'espace membres.

**L'ordre est celui du menu, et il a été décidé le 9 septembre 2026.** Il suit
le parcours du visiteur, pas l'organigramme du mouvement : **découvrir** (2, 3,
4), **participer** (5), **approfondir** (6), **s'engager** (7, 8). L'agenda
passe devant le canevas parce qu'une date est actionnable pour quelqu'un qui
découvre, là où une archive d'études récompense quelqu'un qui s'y intéresse
déjà. Et « Rejoindre le GBUM » n'est pas une entrée de menu : c'est l'action,
l'unique bouton ambre.

Le pied de page reprend le même ordre en trois colonnes — *Découvrir*,
*Participer*, *Soutenir*. Argumentation :
[`09-DIRECTION-ARTISTIQUE.md` §7.1](09-DIRECTION-ARTISTIQUE.md).

### Le parcours « Rejoindre le GBUM »

Ce n'est pas une page de plus : c'est un **chemin** qui traverse le site depuis
l'accueil et depuis « Où nous sommes ». Trois écrans au maximum — ville, puis
groupe, puis se présenter — conformément à [ADR-011](02-ARCHITECTURE.md) :
on s'arrête à la ville, et le contact publié est celui du responsable de ville.

---

## 2. D'où vient le contenu

C'est la question qui décide de l'architecture, et elle a une réponse simple.

| Nature | Source | Qui le met à jour |
|---|---|---|
| **Éditorial** — textes de présentation, histoire, convictions | Base de données | Le Secrétariat National, **depuis un espace d'administration** |
| **Structurel** — villes, cellules, contacts | Base de données | Le Secrétariat National et les bureaux de ville |
| **Vivant** — actualités, photos, vidéos, bilans d'activités | Base de données | Publié depuis l'espace de travail (C2.6) |
| **Documentaire** — canevas et archives | Base de données + fichiers | Le Secrétariat National |

> **Aucun contenu n'est écrit en dur dans le code.** C'est la condition de
> l'objectif P3 : un site qu'il faut un développeur pour modifier ne
> s'actualise jamais.

### ⚖️ La décision que ce lot impose

Le site public doit pouvoir être mis à jour **dès sa mise en ligne**. Il lui
faut donc, dès le lot 1, **un espace d'administration minimal** : modifier les
textes, ajouter une actualité, déposer des photos, tenir la liste des villes et
des cellules.

Ce n'est pas l'espace de travail complet — c'est le strict nécessaire pour que
le site vive. Le reste vient au lot 2.

**Alternative écartée :** livrer le site avec des textes figés et attendre le
lot 2 pour l'édition. Le site serait alors immobile pendant des mois — et un
site immobile ne remplit aucun des trois objectifs publics.

---

## 3. Ce qui n'est pas encore disponible

Ces contenus manquent et sont attendus du Secrétariat National. **Le site est
conçu avec leur emplacement**, et chaque emplacement vide **annonce qu'il est
en cours d'écriture** — jamais un blanc, jamais un texte de remplissage.

| Manquant | Page concernée |
|---|---|
| L'histoire des GBU et du GBUM | 2 — Le mouvement |
| Le thème de l'année | 1 et 2 |
| Le canevas de l'année et les archives | 5 — Le canevas |
| Les chiffres du mouvement | 1, 3 |
| De vraies photos — **quatre pour l'ouverture** | Toutes |
| Des témoignages d'étudiants | 1 |

---

## 4. Langues

**Français et anglais.** *(mouvement, 9 septembre 2026)*

- Le **français** est la langue première : la plupart des GBUssiens du Maroc
  viennent des pays du GBUAF.
- L'**anglais** sert les étudiants internationaux et les partenaires de l'IFES.
- **L'arabe est écarté**, et avec lui toute l'exigence RTL.

> **Une discipline conservée malgré tout.** La mise en page reste écrite en
> propriétés logiques — `début`/`fin` plutôt que gauche/droite. Cela ne coûte
> rien aujourd'hui et garde la porte ouverte si l'arabe revenait un jour.
> Rétro-adapter coûterait dix fois plus.

Aucun texte visible n'est écrit dans le code : tout passe par un fichier de
traduction. Le contenu éditorial existe en deux versions ; **quand la version
anglaise manque, la page affiche le français** plutôt qu'un vide.

---

## 5. Design et comportement

### Responsive
Conçu **à partir du téléphone**. Points de rupture 360 / 768 / 1024 / 1440 px.
Aucun débordement horizontal à aucune largeur. Cibles tactiles ≥ 44 × 44 px,
**mesurées à l'écran**.

### Direction artistique
Système **« Foyer en mouvement »** — la version 2 du thème « Foyer », appliquée
aux onze planches le 9 septembre 2026 : cinq surfaces au lieu d'une, un rapport
typographique de 8:1, des bandes pleine largeur à la place des cartes, un
mouvement mesuré qu'un réglage système éteint entièrement, et un vide qui
invite au lieu de s'excuser.

Les deux corrections de contraste héritées de l'audit de l'application
existante tiennent toujours, intactes : le texte sur l'ambre est en encre
jamais en blanc, et l'ambre est la couleur des actions jamais celle d'un état.
Les onze règles, avec leurs mesures et leurs références :
[`09-DIRECTION-ARTISTIQUE.md`](09-DIRECTION-ARTISTIQUE.md).

### Performance
Première page utile en **moins de 2 secondes** sur un téléphone en 4G.
**Moins de 150 Ko** compressé. Images en formats modernes, dimensionnées,
chargées à la demande.

### Accessibilité
**WCAG 2.2 niveau AA sur toutes les pages**, vérifié automatiquement et de
façon bloquante.

### Être trouvé
Métadonnées, données structurées, `sitemap`, URL lisibles, aperçu correct au
partage. **Rendu depuis le serveur** — c'est ce qui manque le plus aujourd'hui.

---

## 6. Comment on le construit

Quatre étapes. **Chacune se montre avant de passer à la suivante.**

| # | Étape | Livrable | Ce qui le valide |
|---|---|---|---|
| **1** | **Les maquettes** | Les 8 pages dessinées, téléphone puis bureau | ✅ faite — 9 sept. 2026, puis recomposées dans « Foyer en mouvement » |
| **2** | **Les fondations** | Dépôt, chaîne de qualité, base de données, stockage | ✅ faite — 10 sept. 2026, la chaîne est au vert |
| **3** | **Les pages** | Les 8 pages, plus le parcours « Rejoindre », avec leurs deux langues | ✅ faite — 10 sept. 2026, 18 pages sans manquement WCAG 2.2 AA |
| **4** | **L'administration** | L'espace minimal de mise à jour | ✅ faite — 10 sept. 2026, le parcours complet est vérifié à chaque modification |

> La réserve **R2** ne porte plus que sur les sept écrans du *hub*
> (`maquettes/`), qui gardent des données inventées et seront refaits quand
> l'espace de travail viendra. Les onze planches du site public l'ont levée le
> 9 septembre 2026.

**Ce que l'étape 3 a livré**, et qui n'était pas prévu à ce niveau de détail :

- les 8 pages **plus le parcours « Rejoindre »**, en français et en anglais,
  soit 18 pages ;
- le repli de traduction : quand l'anglais manque, le français s'affiche à sa
  place — et une clé absente des DEUX langues s'affiche en clair, pour qu'une
  faute de frappe se voie au lieu de se cacher ;
- un formulaire réellement branché : validation à la frontière, piège à robots,
  enregistrement en base, et les trois issues DITES à l'utilisateur — envoyé,
  champs incomplets, base injoignable. Répondre « envoyé » quand rien n'est
  parti serait la pire des réponses ;
- les deux fontes servies par le site lui-même, et non chargées chez un tiers
  à chaque visite ;
- une vérification d'accessibilité **versionnée et bloquante** :
  `pnpm verifier:acces` passe les 18 pages au crible de WCAG 2.2 AA, du
  débordement horizontal et des traductions manquantes.

## 7. Ce qui prouve que c'est bon

Avant de dire qu'une page est finie :

- [ ] elle s'affiche sans débordement à 360 px de large ;
- [ ] ses contrastes et ses cibles tactiles passent le contrôle automatique ;
- [ ] elle existe en français et en anglais ;
- [ ] elle se charge en moins de 2 s sur une connexion bridée ;
- [ ] son contenu vient de la base, **jamais du code** ;
- [ ] un emplacement sans contenu **annonce qu'il est en cours d'écriture** ;
- [ ] **une personne du mouvement l'a regardée** et n'a pas eu besoin d'explication.

---

## 8. Ce que ce lot ne fait pas

Pour protéger le calendrier, et le dire clairement :

- pas de compte utilisateur, pas de connexion — sauf le lien vers l'espace
  membres, qui viendra au lot 2 ;
- pas d'annuaire, pas de finances, pas de visioconférence ;
- pas d'arabe ;
- pas d'application à installer — le site fonctionne dans le navigateur.
