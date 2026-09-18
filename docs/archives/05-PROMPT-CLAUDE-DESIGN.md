# Prompt Claude Design — maquettes du Hub GBUM

> **Mode d'emploi.**
> 1. Le **§2** est le prompt maître : il se copie tel quel, en une fois. Il pose
>    le contexte, la direction artistique et les règles. **À donner en premier,
>    toujours.**
> 2. Le **§3** contient un prompt par écran : on les enchaîne dans la même
>    conversation, un à la fois, dans l'ordre de priorité.
> 3. Le **§4** donne les formules de relance quand un rendu n'est pas bon.
> 4. Le **§5** est la grille de recette : ce qu'on vérifie avant d'accepter.
>
> La direction artistique n'est pas inventée : elle **reprend et fait évoluer**
> le thème « Foyer » de l'application actuelle, y compris les corrections de
> contraste que son audit d'accessibilité a mesurées à l'écran. Ce travail est
> bon, il ne se jette pas.

---

## 1. Avant de commencer — ce qu'il faut avoir sous la main

| À fournir à Claude Design | Où le trouver |
|---|---|
| Le logo officiel du GBUM (fond détouré) | `static/img/gbum.png` |
| Le logo IFES | `static/img/ifes.png` |
| 3 à 5 photos réelles de cellules, camps, Ifrane | à demander au Secrétariat National |
| Le canevas d'études de l'année en cours (PDF) | à demander au Secrétariat National — **indispensable pour l'écran clé** |
| Un vrai rapport mensuel rempli | à demander à un responsable de cellule |

> **Sans le canevas réel, l'écran le plus important du hub sera maquetté à
> l'aveugle.** C'est la première chose à réclamer.

---

## 2. ⭐ PROMPT MAÎTRE — à copier tel quel

```
Tu es directeur artistique et designer produit. Nous concevons ensemble le
Hub officiel du GBUM — le Groupe Biblique Universitaire au Maroc.

═══════════════════════════════════════════════════════════════════
LE MOUVEMENT
═══════════════════════════════════════════════════════════════════

Le GBUM rassemble des étudiants qui vivent et approfondissent leur foi
chrétienne pendant leurs années d'études, dans les villes universitaires du
Maroc. Il est membre de l'IFES, la communauté internationale des mouvements
bibliques universitaires.

  • Devise         : « Connaître Christ et Le faire connaître »
  • Vision 2023-2033 : « Éclaireurs des campus pour Christ »
  • Cœur de la vie  : l'étude biblique hebdomadaire en cellule, sur un
                      canevas édité chaque année
  • Temps forts     : le camp d'Ifrane, le camp des responsables, le camp des
                      témoins, les agapès, les sorties d'évangélisation
  • Organisation    : Secrétariat National → Conseil Exécutif → conseillers de
                      ville → bureaux de ville → cellules → GBUssiens
                      + les « Amis du GBU » (anciens diplômés qui soutiennent)

Un mouvement d'étudiants, animé par des étudiants. Il se renouvelle
intégralement tous les quatre ou cinq ans.

═══════════════════════════════════════════════════════════════════
QUI UTILISE, ET DANS QUELLES CONDITIONS
═══════════════════════════════════════════════════════════════════

  • Des étudiants de 18 à 25 ans, sur téléphone Android d'entrée ou de milieu
    de gamme, en 3G/4G instable, avec un forfait de données limité.
  • Amina, 19 ans, vient d'arriver à Fès et ne connaît personne : elle cherche
    s'il existe un groupe sur SON campus. Deux minutes, pas plus.
  • Yann, 22 ans, anime la cellule du jeudi : il prépare son étude le mercredi
    soir dans le train, SANS RÉSEAU, et remplit son rapport mensuel le soir,
    fatigué, sur son téléphone.
  • Sarah, 27 ans, secrétaire nationale : elle doit savoir le lundi matin
    quelles cellules vivent et lesquelles s'éteignent.
  • Jean-Marc, 34 ans, ancien devenu Ami du GBU : il donne, il prie, il veut
    voir où va son soutien.

Le mobile n'est pas un cas à traiter : c'est LE cas. Le bureau est l'exception.

═══════════════════════════════════════════════════════════════════
CE QUE LE DESIGN DOIT FAIRE RESSENTIR
═══════════════════════════════════════════════════════════════════

Trois mots, dans cet ordre :

  1. ACCUEIL. Un étudiant qui arrive seul dans une ville inconnue doit sentir
     qu'il y a quelqu'un ici. Chaleur, hospitalité, lumière. JAMAIS
     l'administration, jamais le formulaire froid.

  2. SÉRIEUX. C'est le hub OFFICIEL d'un mouvement national membre d'une
     fédération internationale. On y gère des budgets, des camps et des
     personnes. Il doit inspirer confiance à un doyen d'université comme à un
     donateur.

  3. VIVANT. Le mouvement est jeune, en marche, joyeux. Le design doit
     respirer, pas peser. Moderne sans être à la mode ; il doit tenir dix ans.

À ÉVITER ABSOLUMENT :
  ✗ l'esthétique « paroisse années 90 » : ornements, dorures, calligraphies
  ✗ l'esthétique « SaaS d'entreprise » : gris, froid, interchangeable
  ✗ l'imagerie religieuse littérale : croix, colombes, mains jointes, rayons
  ✗ l'iconographie américaine du christianisme évangélique
  ✗ les dégradés bavards, les ombres épaisses, le verre dépoli

La foi se dit ici par le SOIN apporté aux choses et par l'hospitalité de
l'interface — jamais par des symboles posés sur l'écran.

═══════════════════════════════════════════════════════════════════
DIRECTION ARTISTIQUE — thème « Foyer »
═══════════════════════════════════════════════════════════════════

Elle existe déjà et a été validée à l'usage. Tu la REPRENDS et tu
l'AFFINES ; tu ne repars pas de zéro.

L'idée : un foyer. Le lieu chaud où l'on se retrouve. La couleur naît de
l'ambre du logo du GBUM ; les fonds sont crème et papier, jamais le blanc
clinique ni le gris d'entreprise.

── Couleurs (mode clair — palette de référence) ──────────────────

  Fonds       --bg        #FBF6EF   crème, fond de page
              --panel     #FFFFFF   cartes
              --panel2    #F4EADC   fond secondaire, en-têtes
              --soft      #FBF1E6   survol, états doux
  Traits      --border    #E5D9C9   bordures
              --line      #F0E6D8   séparateurs
  Texte       --text      #2A211B   encre — texte principal
              --muted     #5F5346   secondaire (7,5:1 — vérifié)
              --faint     #6E6053   tertiaire (5,1:1 — PLANCHER ABSOLU)
  Ambre       --primary   #E8732A   couleur des ACTIONS
              --hover     #FF8A1E
              --press     #96430F   texte ambre sur fond clair (6,8:1)
              --on-primary #2A211B  ← texte sur l'ambre : ENCRE, PAS BLANC
  Sémantique  --ok        #226B42   --live #A81F12   --focus #8F3A1C

  DEUX RÈGLES APPRISES À LA DURE, mesurées à l'écran, non négociables :

  1. Le texte sur l'ambre est en ENCRE (#2A211B), jamais en blanc.
     Le blanc donnait 3,04:1 — illisible. L'encre donne 5,19:1.

  2. L'ambre vif est la couleur des ACTIONS, jamais celle d'un ÉTAT.
     Un élément de menu actif en ambre sur crème donnait 2,72:1. Un état se
     dit avec l'orange foncé (--press, 5,2:1) et une barre latérale.

  Il faut aussi un MODE SOMBRE complet : les études se préparent le soir.
  Ce n'est pas une inversion mécanique — c'est une palette à part entière,
  qui garde la chaleur du foyer (fonds bruns chauds, pas gris-bleu).

── Typographie ───────────────────────────────────────────────────

  Titres  : Newsreader (serif) — humaine, littéraire. On lit un texte ancien
            ensemble ; la serif le dit sans le crier.
  Interface : Hanken Grotesk (sans) — nette, chaleureuse, très lisible en petit.
  Base    : 15-16 px (l'existant est à 14 px : trop petit sur téléphone).
  Échelle : 12 / 14 / 16 / 18 / 22 / 28 / 36 / 48
  Passages bibliques : Newsreader, interlignage 1.7, mesure ≤ 68 caractères.
                       Un texte qu'on lit à voix haute en groupe se compose
                       comme un livre, pas comme une interface.

── Formes et matière ─────────────────────────────────────────────

  Rayons    : 8 px (contrôles) · 12 px (cartes) · 16 px (panneaux) · 999 px (pastilles)
  Ombres    : basses et chaudes — 0 10px 30px rgba(42,33,27,.10). Jamais de noir pur.
  Espacement: grille de 4 px. Généreux : l'air est ce qui distingue le soin
              de l'entassement.
  Icônes    : trait 1,8 px, arrondi, style Lucide. Jamais pleines.
  Photos    : de vraies personnes, de vrais campus marocains. Jamais de banque
              d'images. Coins arrondis 12 px, léger voile chaud à l'incrustation.

── Mouvement ─────────────────────────────────────────────────────

  Sobre et utile : 150-250 ms, courbe douce. On anime ce qui APPARAÎT et ce
  qui CHANGE D'ÉTAT, jamais ce qui décore. Respecter prefers-reduced-motion.

═══════════════════════════════════════════════════════════════════
RÈGLES NON NÉGOCIABLES
═══════════════════════════════════════════════════════════════════

 1. MOBILE D'ABORD. Tu maquettes 375 px EN PREMIER, toujours. La version
    bureau vient après, et elle est dérivée — jamais l'inverse.

 2. ACCESSIBILITÉ WCAG 2.2 AA, SANS EXCEPTION.
    • contraste ≥ 4,5:1 (≥ 3:1 pour le grand texte), calculé sur le fond
      RÉEL, y compris sous les voiles translucides ;
    • cibles tactiles ≥ 44 × 44 px, mesurées — pas déclarées ;
    • focus clavier visible et net sur tout élément interactif ;
    • jamais la couleur seule pour porter une information.
    → Pour chaque écran, tu ANNONCES les ratios de contraste des textes
      secondaires. Si tu ne peux pas les garantir, tu changes la couleur.

 3. RTL — l'arabe viendra. Compose en logique start/end, jamais
    gauche/droite. Aucune mise en page ne doit casser en miroir.

 4. FRUGALITÉ. Forfaits limités, téléphones anciens. Peu d'images, pas
    d'effets coûteux, pas de police superflue. Deux familles, c'est tout.

 5. TOUS LES ÉTATS. Pour chaque écran : nominal, CHARGEMENT, ERREUR, et
    surtout VIDE. L'état vide d'un mouvement étudiant est fréquent (une
    cellule qui démarre, un canevas pas encore publié) et c'est là qu'on
    accueille ou qu'on décourage. Ne le traite jamais en dernier.

 6. PAS DE FAUSSE DONNÉE PLAUSIBLE. Utilise des noms et des villes réels du
    contexte : Rabat, Casablanca, Fès, Marrakech, Agadir, Tanger, Kénitra,
    Oujda, Meknès. Des prénoms marocains et subsahariens. Des montants en MAD.
    Des références bibliques réelles. Une maquette avec du faux texte ne
    permet aucune décision.

═══════════════════════════════════════════════════════════════════
CE QUE JE TE DEMANDE
═══════════════════════════════════════════════════════════════════

Nous allons avancer ÉCRAN PAR ÉCRAN, dans l'ordre que je te donnerai.
Pour chaque écran :

  1. la version 375 px (téléphone) — d'abord, toujours ;
  2. la version 1280 px (bureau) — dérivée ;
  3. les états chargement / erreur / vide ;
  4. les ratios de contraste des textes secondaires, annoncés ;
  5. une phrase par décision non évidente : pourquoi celle-là.

Commence par me confirmer que tu as compris la direction, en une réponse
courte, et propose-moi deux ou trois pistes d'ambiance pour le thème « Foyer »
version 2026 — sans encore maquetter d'écran.
```

---

## 3. Les prompts par écran

> À enchaîner **dans cet ordre**, dans la même conversation, un par message.
> L'ordre n'est pas esthétique : il suit la valeur pour le mouvement.

### 3.1 ⭐⭐⭐ L'étude de la semaine — *l'écran qui justifie le hub*

```
Écran n°1 — L'ÉTUDE DE LA SEMAINE. C'est l'écran le plus important du produit :
c'est pour lui que le hub existe.

CONTEXTE D'USAGE, à prendre au sérieux :
Yann, 22 ans, anime la cellule de Rabat-Agdal. Il ouvre cet écran DEUX fois :
  • le mercredi soir, dans le train, SANS RÉSEAU, pour préparer ;
  • le jeudi à 18 h, en cellule, sur un campus où le réseau ne passe pas,
    avec huit étudiants assis autour de lui.
Dans le second cas, il ne regarde pas son écran : il anime. L'écran doit se
laisser consulter d'un coup d'œil, entre deux phrases.

CONTENU À COMPOSER :
  • Étude 7 sur 24 — « Le Fils de l'homme est venu chercher » — Luc 19.1-10
  • le canevas : « Éclaireurs — Rencontres qui transforment », année 2026-2027
  • le TEXTE BIBLIQUE en entier, lisible, respirant
  • trois blocs de questions : Observation · Interprétation · Application
  • les notes de l'animateur (repliées par défaut)
  • un bouton « Marquer cette étude comme traitée »
  • un indicateur discret : disponible hors ligne
  • la progression de la cellule : 6 études sur 24

CE QUI COMPTE :
  • Le texte biblique doit être BEAU à lire. C'est un texte qu'on lit à voix
    haute, ensemble. Newsreader, interlignage large, mesure courte. Il ne
    ressemble à aucun autre bloc de l'application.
  • Les questions doivent se distinguer nettement du texte, sans le concurrencer.
  • Passer d'une question à l'autre doit être possible d'un seul pouce.
  • L'état hors ligne se dit sans inquiéter : c'est une bonne nouvelle.

Donne-moi le 375 px d'abord. Montre aussi l'état « canevas pas encore publié ».
```

### 3.2 ⭐⭐⭐ La séance de cellule — *trois minutes, pas plus*

```
Écran n°2 — ENREGISTRER LA SÉANCE.

Yann vient de terminer l'étude. Il est 20 h 15, il range les chaises, il a son
téléphone dans une main. Il doit enregistrer la séance en MOINS DE TROIS
MINUTES, sinon il ne le fera pas — et un rapport non rempli ne vaut rien.

CONTENU :
  • date et lieu, pré-remplis (jeudi 12 mars, Campus Agdal — modifiables)
  • ÉMARGEMENT : 14 membres de la cellule, en cartes-avatars à taper.
    Présent / absent en un geste. La liste doit tenir sans défilement infini.
  • l'étude traitée, pré-sélectionnée sur celle de la semaine
  • sujets de prière : champ libre, court
  • enregistrer

CE QUI COMPTE :
  • L'émargement est 80 % du temps de saisie : c'est là que tout se joue.
    Cherche la solution la plus rapide possible au pouce.
  • Ne JAMAIS donner l'impression d'un contrôle de présence. Le libellé et le
    ton doivent dire « qui était là », pas « qui a manqué ». Cette nuance est
    essentielle dans un mouvement d'étudiants bénévoles.
  • L'écran doit fonctionner hors ligne et le dire calmement : « enregistré,
    sera envoyé au retour du réseau ».

375 px uniquement, c'est un écran de téléphone. Montre l'état hors ligne.
```

### 3.3 ⭐⭐ La vitrine publique — *la page d'accueil*

```
Écran n°3 — PAGE D'ACCUEIL PUBLIQUE de gbu-maroc.org.

Amina, 19 ans, vient d'arriver à Fès. Une amie lui a parlé du GBU. Elle
cherche sur son téléphone, en 4G, forfait limité. Elle a DEUX MINUTES et une
seule question : « est-ce qu'il y a un groupe sur mon campus, et à qui
j'écris ? »

Ce n'est pas une plaquette institutionnelle. C'est une porte ouverte.

CONTENU :
  • une bannière : une vraie photo d'étudiants (pas une banque d'images),
    l'accroche « Des étudiants, une Parole, tout le Maroc. »,
    et un appel à l'action DOMINANT : « Trouver mon groupe »
  • en quatre lignes : ce qu'est le GBUM
  • les quatre piliers : l'étude de la Bible · la prière · l'entraide ·
    les temps forts
  • les villes où le GBUM est présent, avec le nombre de cellules
  • le prochain temps fort (le camp d'Ifrane) avec une vraie photo
  • un témoignage court d'un étudiant
  • pied de page : IFES, contact, soutenir, espace membres

CE QUI COMPTE :
  • Le poids. Moins de 150 Ko compressé. Une seule grande image, optimisée.
  • « Trouver mon groupe » doit être la chose la plus visible de la page,
    au-dessus de la ligne de flottaison, sur téléphone.
  • Chaleur et crédibilité en même temps. Pas d'esthétique religieuse
    littérale. La foi se dit par le soin, pas par les symboles.
  • Elle doit donner envie de pousser la porte, à quelqu'un qui n'a jamais
    entendu parler d'un GBU.

375 px puis 1280 px.
```

### 3.4 ⭐⭐ Le tableau de bord national — *où le silence se voit*

```
Écran n°4 — TABLEAU DE BORD NATIONAL.

Sarah, secrétaire nationale, ouvre cet écran le lundi matin. Elle a une
question : « quelles cellules vivent, et lesquelles s'éteignent ? »

RÈGLE DE CONCEPTION FONDAMENTALE, à respecter absolument :
LE SILENCE EST UNE INFORMATION. Une cellule qui n'a pas rendu son rapport
n'est pas une donnée manquante : c'est le signal qu'elle a besoin d'aide.
Les cellules MUETTES doivent être aussi visibles que les cellules actives —
c'est même l'information la plus utile de l'écran. Ne les relègue jamais
en bas, en gris, en « données indisponibles ».

CONTENU :
  • 9 villes, 27 cellules, 312 GBUssiens
  • rapports du mois : 19 rendus sur 27
  • ⚠ 3 cellules muettes depuis 3 mois ou plus — MISES EN AVANT, avec le nom
    du responsable et un moyen de le joindre
  • avancement du canevas par ville (certaines à l'étude 9, d'autres à la 4)
  • budget national consommé : 62 %
  • le prochain temps fort
  • les objectifs du thème de l'année et où on en est

CE QUI COMPTE :
  • Dense mais respirant. Sarah lit vite, elle ne veut pas fouiller.
  • L'alerte des cellules muettes ne doit pas être punitive : elle appelle à
    aller chercher quelqu'un, pas à sanctionner. Le ton compte.
  • Utilisable aussi sur téléphone : Sarah voyage.
  • Pas de graphique décoratif. Chaque chiffre doit servir une décision.

1280 px d'abord (c'est un écran de bureau), puis l'adaptation 375 px.
```

### 3.5 ⭐ Le rapport mensuel — *cinq champs, pas quinze*

```
Écran n°5 — RAPPORT MENSUEL DE CELLULE.

Contrainte absolue, apprise à l'usage : CINQ CHAMPS, PAS QUINZE. Il se remplit
depuis un téléphone, le soir, après l'étude. Un formulaire long ne sera JAMAIS
rempli — et un rapport non rempli ne vaut rien.

CONTENU (mars 2026, cellule de Rabat-Agdal) :
  • présents en moyenne
  • rencontres tenues dans le mois
  • où en est le canevas (pré-rempli depuis les séances déjà enregistrées)
  • sujets de prière
  • difficultés / appui souhaité

CE QUI COMPTE :
  • Ce qui est déjà connu est PRÉ-REMPLI. Yann corrige, il ne resaisit pas.
  • L'écran doit donner l'impression de « c'est presque fait », pas de « voilà
    un formulaire ».
  • Une barre de progression honnête, un enregistrement automatique du
    brouillon.
  • Le remplir deux fois corrige le premier, ça ne crée pas un second : dis-le
    dans l'interface.

375 px. Montre l'état « déjà rendu ce mois-ci ».
```

### 3.6 ⭐ Trouver mon groupe — *le parcours d'accueil*

```
Écran n°6 — PARCOURS « TROUVER MON GROUPE » (public, sans compte).

C'est le tunnel d'entrée du mouvement. Chaque rentrée, c'est par là que les
nouveaux arrivent. Aujourd'hui, il n'existe pas.

TROIS ÉTAPES, pas une de plus :
  1. Où étudies-tu ? → ville, puis campus
  2. Voici le groupe le plus proche → jour, heure, lieu, une photo,
     le prénom du responsable (JAMAIS ses coordonnées)
  3. Se présenter → prénom, un moyen de contact, un mot libre

Puis un écran de confirmation qui rassure vraiment : « Yann, responsable à
Agdal, va te répondre. En attendant, voici à quoi ressemble une soirée. »

CE QUI COMPTE :
  • Aucun compte à créer. Aucune inscription. C'est une main tendue.
  • Le cas « pas de groupe sur ton campus » doit être traité avec autant de
    soin que le cas nominal : c'est une déception, il faut la rattraper
    (le groupe de la ville voisine, les temps forts nationaux, rester informé).
  • Rassurer sur la confidentialité, sobrement, sans inquiéter.
  • Trois étapes maximum. Chaque étape supplémentaire perd du monde.

375 px. Montre les trois étapes, la confirmation, et le cas « pas de groupe ».
```

### 3.7 Les écrans suivants

À enchaîner ensuite, avec la même structure de prompt (contexte d'usage réel →
contenu concret → ce qui compte → livrables) :

| # | Écran | Ce qui compte particulièrement |
|---|---|---|
| 7 | Structure de navigation du hub (menu, recherche, profil) | 24 entrées aujourd'hui : à réduire. Ce qu'on ouvre chaque jour doit être à un geste |
| 8 | Annuaire et fiche personne | Densité, filtres, respect de la confidentialité selon le rôle |
| 9 | Dossier de camp (Ifrane) | Beaucoup de données, beaucoup de rôles : hiérarchie de l'information |
| 10 | Réunion en visioconférence | Contrôles atteignables au pouce, en réunion, sans réfléchir |
| 11 | Budget de structure | Rigueur, lisibilité des chiffres, prévu vs réel |
| 12 | Espace Ami du GBU | Reconnaissance et transparence : montrer où va le soutien |
| 13 | Plan d'action et thème de l'année | Relier chaque objectif à la vision décennale : donner du sens |
| 14 | Écrans d'erreur, hors ligne, 404 | Ce sont des écrans d'accueil comme les autres |

---

## 4. Relances utiles

Quand un rendu n'est pas au niveau, ces formulations fonctionnent mieux que
« refais » :

| Symptôme | Ce qu'il faut dire |
|---|---|
| Trop froid, trop « SaaS » | « C'est correct mais ça pourrait être n'importe quel outil d'entreprise. Rappelle-toi : un étudiant seul dans une ville inconnue doit sentir qu'il y a quelqu'un ici. Réchauffe : plus de crème, moins de blanc, plus d'air, une photo de vraies personnes. » |
| Trop chargé | « Retire un tiers des éléments. Ne garde que ce qui sert la question que l'utilisateur se pose en ouvrant cet écran. » |
| Trop « religieux » | « Enlève tout symbole religieux explicite. Ici, la foi se dit par le soin apporté aux choses, pas par une icône. » |
| Bureau d'abord | « Tu as maquetté le bureau. Reprends à 375 px et dérive le bureau ensuite — c'est le téléphone qui décide. » |
| États manquants | « Montre-moi l'état vide et l'état d'erreur. L'état vide est le plus fréquent au démarrage d'une cellule, et c'est là qu'on accueille ou qu'on décourage. » |
| Contraste douteux | « Donne-moi les ratios de contraste de chaque texte secondaire, calculés sur le fond réel. Tout ce qui est sous 4,5:1 change de couleur. » |
| Faux contenu | « Remplace le texte de remplissage par du contenu réel : Luc 19.1-10, la cellule de Rabat-Agdal, 340 MAD, des prénoms marocains et subsahariens. » |
| Trop mode | « Ce design aura l'air daté dans trois ans. Enlève l'effet, garde la structure. Le mouvement en vivra dix. » |

---

## 5. Grille de recette d'une maquette

Une maquette n'est acceptée que si **tout** est vrai :

- [ ] Une version 375 px existe, et elle a été conçue en premier.
- [ ] Aucun débordement horizontal à 375 px.
- [ ] Toutes les cibles tactiles font ≥ 44 × 44 px.
- [ ] Les ratios de contraste sont **annoncés** et tous ≥ 4,5:1 (≥ 3:1 grand texte).
- [ ] Le focus clavier est visible sur tous les éléments interactifs.
- [ ] Aucune information n'est portée par la couleur seule.
- [ ] Les états chargement / erreur / **vide** sont maquettés.
- [ ] Le contenu est réel : vrais noms, vraies villes, vraies références, MAD.
- [ ] La mise en page tient en miroir (RTL) sans casser.
- [ ] Deux familles de polices, pas trois.
- [ ] Aucun symbole religieux littéral.
- [ ] Un mode sombre est proposé (au moins sur les écrans du hub).
- [ ] **Test du pouce** : les actions fréquentes sont atteignables d'une main.
- [ ] **Test des cinq secondes** : on comprend à quoi sert l'écran en 5 s.

---

## 6. Après les maquettes

Les maquettes ne sont pas le livrable final. Ce qu'il faut en extraire :

1. **Les tokens définitifs** (couleurs clair et sombre, typographie, espacement,
   rayons, ombres, durées) → `packages/ui/tokens`.
2. **L'inventaire des composants** — chaque composant apparu dans les maquettes,
   avec tous ses états → `packages/ui`.
3. **Les règles de mise en page** : grille, points de rupture, densités.
4. **Les décisions écrites** : pourquoi telle hiérarchie, telle couleur, tel mot.
   *C'est ce qui permettra, dans deux ans, de rester cohérent sans redemander.*

> Ces quatre livrables constituent le **document maître du design**. Il vit dans
> le dépôt, à côté du code, et il est mis à jour par pull request comme le
> reste. Une charte qui vit ailleurs que dans le dépôt cesse d'être respectée
> en six mois.
