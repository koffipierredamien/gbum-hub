# Ce qu'il reste pour que toutes les sections soient remplies

**11 septembre 2026.** Cet inventaire n'est pas écrit de mémoire : il a été
établi en lisant le code — les **vingt-trois marqueurs d'attente** posés dans
les pages, et les **dix-neuf champs** que l'espace d'administration sait déjà
écrire. Rien ici n'est une intention : chaque ligne correspond à un endroit
précis du site qui attend quelque chose de précis.

Il y a trois familles, et elles ne se traitent pas de la même manière :

| | Ce qui manque | Qui débloque | Délai |
|---|---|---|---|
| **A** | Des textes | **Vous**, ce soir, depuis l'espace d'administration | Immédiat |
| **B** | Des informations que le mouvement seul détient | Le **Secrétariat National** | Sa réponse |
| **C** | Des écrans qui n'existent pas encore | La **maîtrise d'œuvre** (moi) | Le lot 2 |

---

## A. Ce que vous pouvez remplir ce soir

Dix-neuf champs sont déjà branchés. Chacun est écrit en brouillon, relu, puis
publié — et **tant qu'il n'est pas publié, le site public ne change pas**.

| Écran | Champ | Ce qui disparaît du site quand il est publié |
|---|---|---|
| **Le thème de l'année** | Le thème, tel qu'on le dit | « Thème de l'année · en cours d'écriture », sur l'accueil **et** sur « Le mouvement » |
| | Ce que le thème veut dire | |
| **L'accueil** | La phrase d'ouverture | Le texte de démonstration |
| | Le paragraphe sous l'ouverture | |
| | Le témoignage d'un étudiant | « Trois à cinq témoignages attendus » |
| | Le prochain temps fort — nom et description | La bande vide de l'agenda |
| **Le mouvement** | La présentation du mouvement | Le texte de démonstration |
| | Le nom de la vision décennale, et la vision | |
| | **L'année de fondation du GBUM** | « La création du GBUM · date inconnue » — la frise gagne un troisième point daté, entre 1947 et 1968 |
| | La fondation, en quelques lignes | |
| **Le canevas** | Le titre du canevas de l'année | Une part de « Canevas attendu » |
| | Ce qu'est le canevas | |
| **L'agenda** | Le prochain temps fort — nom, description | |
| | Ses dates et informations pratiques | « Dates à venir », aux deux endroits où elle apparaît |
| **Soutenir** | Pourquoi soutenir le mouvement | Le texte de démonstration |
| | **Les moyens de don** | « Moyens de don à préciser » |
| **Les villes** | Le nom d'une ville, ses cellules, leur nombre de membres | « Liste à compléter », sur « Où nous sommes » **et** sur « Rejoindre » |
| | Le contact du bureau de ville | « Bureau en cours de renouvellement » |

**Une remarque sur les moyens de don.** Tant qu'ils ne sont pas écrits, aucun
bouton de paiement n'apparaît. Ce n'est pas un oubli : un don que l'on ne sait
pas recevoir ne se demande pas.

---

## B. Ce qui attend le mouvement — rien à coder

Ce sont les [sept informations de la note au Secrétariat
National](07-NOTE-AU-SECRETARIAT-NATIONAL.md), vues depuis le site fini. Chacune
a déjà sa place dessinée, à sa taille définitive.

| # | Ce qui est attendu | Où cela tombe | Ce que le site affiche en attendant |
|---|---|---|---|
| 1 | **Le canevas de l'année** — titre, introduction, liste des études, fichier | Page « Le canevas » | « Canevas attendu » |
| 2 | **Le thème de l'année** | Accueil et « Le mouvement » | « en cours d'écriture » |
| 3 | **L'histoire du GBUM** — l'année de sa création, son récit | La frise du mouvement | « date inconnue », à sa place chronologique |
| 4 | **Les chiffres** — villes, cellules, GBUssiens, Amis | Accueil, bande Terre | « Chiffres attendus » |
| 5 | **Quatre photographies**, avec accord écrit de publication | Le défilé de l'accueil | « Quatre photographies attendues » |
| 6 | **Trois à cinq témoignages** — prénom, ville, année, deux ou trois phrases, accord écrit | Accueil, bande Forêt | « Trois à cinq témoignages attendus » |
| 7 | **La liste exacte des villes**, dans l'ordre où le mouvement veut les citer | « Où nous sommes », « Rejoindre », le bandeau défilant | « Liste à compléter » |

S'y ajoutent deux choses qui ne figurent pas dans la note, et qui bloquent une
fonction chacune :

| Ce qui est attendu | Ce que cela débloque |
|---|---|
| **Une adresse d'expédition** (un compte d'envoi de courriel) | L'alerte automatique au bureau de ville quand un étudiant écrit. Aujourd'hui le message est enregistré et visible dans l'administration, mais personne n'est prévenu. |
| **Une décision de paiement** — hébergement et nom de domaine | La mise en ligne. Voir le point C9. |

Et une **confirmation** à obtenir avant que de vrais noms soient publiés : que
la publication s'arrête bien à la ville (ni jour, ni heure, ni lieu, ni nom de
responsable). C'est [ADR-011](02-ARCHITECTURE.md), et le code l'applique déjà —
mais c'est une décision du mouvement, pas de la technique.

---

## C. Ce qu'il reste à construire

Dans cet ordre. Les trois premiers sont ceux qui changent le plus la page, et
ils attendent tous une information de la colonne B : ce sont donc des chantiers
à lancer **dès que le Secrétariat National répond**, pas avant.

| # | Chantier | Pourquoi il n'est pas déjà fait | Dépend de |
|---|---|---|---|
| **C1** | **Les photographies** — téléverser, recadrer, légender ; le défilé de l'accueil et la photo de chaque ville | Le stockage est écrit et testé ([ADR-013](02-ARCHITECTURE.md)) ; il manque l'écran qui s'en sert, et surtout les images | B5 |
| **C2** | **Les témoignages** — trois à cinq, avec prénom, ville, année | Aujourd'hui un seul témoignage tient dans un champ de texte | B6 |
| **C3** | **Les chiffres du mouvement** — quatre nombres, et leur date de mise à jour | Aucun chiffre provisoire ne doit être affiché : mieux vaut l'emplacement vide | B4 |
| **C4** | **L'agenda** — plusieurs temps forts, chacun avec ses dates | Aujourd'hui, un seul temps fort, décrit en texte libre | — |
| **C5** | **Le canevas** — la liste des études, le fichier à télécharger, les archives des années passées | C'est l'écran central du hub ; le concevoir sans le canevas réel serait le concevoir à l'aveugle | B1 |
| **C6** | **La vie du mouvement** — un compte par ville, et la saisie d'une activité | C'est ce qui rend le site vivant **sans** que le national le nourrisse à la main. Le plus gros chantier du lot 2. | — |
| **C7** | **L'alerte au bureau de ville** quand un étudiant écrit | Il faut une adresse d'expédition | B |
| **C8** | **Les comptes** — changer son mot de passe, désactiver un compte, voir qui a publié quoi | La mise en route crée le premier compte ; elle ne sait pas encore en modifier un | — |
| **C9** | **La mise en ligne** — hébergement, nom de domaine, sauvegardes automatiques | [ADR-012](02-ARCHITECTURE.md) rend ce choix reportable sans dette : le jour où quelqu'un paie, seule l'adresse de la base change | Une décision de paiement |

**C8 est le plus urgent des trois derniers**, pour une raison bête : aujourd'hui,
un mot de passe oublié n'a aucune issue autre que la création d'un second
compte.

---

## Ce qui n'est pas dans cette liste, et pourquoi

**Les sept maquettes du premier hub** (`maquettes/`, planches antérieures au
lot 1) portent encore des données inventées — des noms, des chiffres, des
villes. Elles ne sont pas publiées et ne le seront pas en l'état : elles
servaient à poser des questions, pas à montrer le site. Quand le mouvement aura
répondu, elles seront refaites ou retirées.

**Certains « vides » n'en sont pas.** Quatre marqueurs resteront pour toujours,
parce qu'ils expliquent une décision plutôt que d'annoncer un manque :

- « Ce qui n'est pas publié, et pourquoi » — la limite d'ADR-011, dite au lecteur ;
- « Ton nom n'apparaît nulle part publiquement » — sur le formulaire de contact ;
- « Trois manières, et pas une de plus » — sur la page Soutenir ;
- « Bureau en cours de renouvellement » — un état réel du mouvement, pas un trou.

Un site qui explique ce qu'il ne fait pas inspire plus confiance qu'un site qui
fait semblant de tout faire.
