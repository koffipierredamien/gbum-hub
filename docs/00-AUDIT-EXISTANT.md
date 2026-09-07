# Audit de l'existant — GBU Connect

> Audit exhaustif du dépôt `koffipierredamien/gbu-connect` à la date du **7 septembre 2026**.
> Périmètre : 100 % des fichiers versionnés. Méthode : lecture du code, mesure,
> vérification des références croisées.
> Statut de l'application auditée : **en production** sur `https://gbu-maroc.org`.

---

## 1. Résumé pour décideur

L'application existante n'est pas un prototype. C'est un **produit réel, en
service, qui porte des données vivantes** : personnes, structures, budgets,
camps, comptes rendus de réunion. Toute refonte doit partir de ce fait — il n'y
a pas de page blanche, il y a une reprise.

Trois constats, dans l'ordre d'importance :

1. **La valeur est dans la connaissance métier, pas dans le code.** Le dépôt
   contient une modélisation du GBUM d'une finesse rare : la distinction
   soutien / versement / budget, la règle « le silence d'une cellule est une
   information », le rattachement qui déduit le rôle plutôt que de le saisir
   deux fois. **Cette connaissance est le vrai actif à sauver.**

2. **L'architecture ne tiendra pas une année de plus.** Un fichier de
   4 656 lignes, une persistance coupée en deux (SQLite + 18 fichiers JSON),
   des migrations de schéma écrites en dur dans le démarrage de
   l'application, un déploiement qui ne passe pas par Git. Ce ne sont pas des
   défauts de style : ce sont des mécanismes de perte de données et de
   régression silencieuse.

3. **Le cœur de la mission n'est pas dans le produit.** Le GBUM existe pour
   « connaître Christ et le faire connaître ». L'outil gère les camps, les
   budgets et la visioconférence — mais **le canevas d'études bibliques,
   l'activité hebdomadaire de chaque cellule dans chaque ville, n'existe
   nulle part** (voir §6.1).

**Verdict.** Refonte justifiée. Mais refonte *par reprise*, pas par
table rase : le modèle métier se transporte, le code ne se transporte pas.

---

## 2. Cartographie mesurée

### 2.1 Volumétrie

| Mesure | Valeur |
|---|---|
| Lignes totales (`py`, `html`, `css`, `js`, `sh`, `md`) | **67 204** |
| Fichiers Python | 98 (dont `app/` : **23 482 lignes**) |
| Gabarits Jinja2 | **88** |
| Feuilles de style | 9 (~4 900 lignes) |
| Scripts front | 15 (~9 800 lignes) |
| Routes HTTP déclarées | **194** |
| Fichiers de test | 24 (`tests/verif_*.py`, ~11 000 lignes) |
| Historique Git | **1 commit** (« first commit ») |

### 2.2 Les dix fichiers les plus lourds

| Fichier | Lignes | Nature du problème |
|---|---|---|
| `app/routes.py` | **4 656** | 126 routes, 176 fonctions — objet-dieu |
| `static/js/grande-salle.js` | 2 534 | Client LiveKit écrit à la main |
| `static/js/conference.js` | 2 202 | Signalisation WebRTC mesh maison |
| `app/camp.py` | 1 775 | Domaine entier dans un module |
| `static/conference.js` | 1 539 | **Code mort** (voir §4.4) |
| `static/css/salle.css` | 1 441 | CSS non scopé |
| `app/ressources.py` | 1 381 | Finances : domaine entier |
| `tests/verif_visio_serveur.py` | 1 245 | Test-script, pas test unitaire |
| `static/css/app.css` | 1 031 | Design system en CSS global |
| `app/routes_ressources.py` | 890 | Vues + logique métier mêlées |

### 2.3 Pile technique constatée

```
Navigateur ─ Jinja2 (SSR) + CSS global + JS impératif (pas de framework)
     │
nginx (TLS) ─── systemd ─── serve.py  (eventlet, PROCESSUS UNIQUE)
                              │
                              ├─ Flask 3 + Flask-SocketIO  (signalisation mesh)
                              ├─ SQLite `socle.db`         (3 tables + ~8 ajoutées)
                              ├─ 18 fichiers *.json        (état applicatif)
                              ├─ LiveKit (SFU) + Egress    (services séparés)
                              ├─ coturn                    (relais TURN)
                              ├─ faster-whisper            (transcription locale)
                              ├─ API Anthropic             (synthèse des CR)
                              └─ wa-sender                 (robot WhatsApp)
```

### 2.4 Les 194 routes par domaine

| Domaine | Routes | Modules |
|---|---:|---|
| Vie du mouvement (activités, camps, galerie, prière, rapports) | ~62 | `routes.py`, `routes_camp.py`, `routes_rapports.py`, `routes_priere.py` |
| Visioconférence & grande salle | ~28 | `routes.py`, `realtime.py`, `sfu.py`, `salles.py` |
| Finances (budgets, versements, promesses, engagements) | ~24 | `routes_ressources.py`, `ressources.py` |
| Organisation (structures, personnes, bureaux, annuaire) | ~26 | `routes_socle.py`, `routes_gouv.py`, `socle.py` |
| Amis du GBU, finissants, place des Amis | ~12 | `amis.py`, `place.py`, `finissants.py` |
| Communication (live, envois, messages, annonces) | ~15 | `lives.py`, `envois.py`, `wa.py` |
| Comptes, sécurité, santé, recherche | ~13 | `auth.py`, `comptes.py`, `sante.py`, `recherche.py` |
| **Face publique** | **9** | `public.py` |
| Gouvernance, plan d'action, mes actions | ~5 | `gouvernance.py`, `plan.py` |

---

## 3. Ce qui est bien fait — et qui doit être préservé

Ce chapitre n'est pas une politesse. Ces éléments ont coûté du temps de
réflexion et **doivent être repris explicitement dans la cible**, sans quoi la
refonte sera une régression.

### 3.1 La modélisation du mouvement (`app/socle.py`)

Trois tables — `personne`, `structure` (arborescente, auto-référençante),
`rattachement` (personne × structure × rôle × niveau × période) — modélisent
correctement le GBUM du national à la cellule. **Le rôle applicatif est
déduit des rattachements, jamais saisi deux fois** (`app/auth.py:_depuis_socle`).
C'est la bonne décision, et elle est rare.

### 3.2 Le fuseau horaire traité comme un sujet métier

`app/__init__.py` force `Africa/Casablanca` avec un commentaire qui explique
la panne réelle qu'il corrige (une dépense saisie à 23h30 datée du lendemain)
et *pourquoi un décalage fixe ne suffit pas* (la règle marocaine du Ramadan).
Niveau de rigueur d'un système de production.

### 3.3 L'accessibilité mesurée, pas déclarée

`static/js/audit-ui.js` + `RECETTE_NAVIGATEUR.md` : un audit WCAG 2.1 exécuté
**dans le navigateur** (contraste calculé sur fonds translucides composés,
taille réelle des cibles à 44 px, nom accessible, `alt`, débordement
horizontal). Il a trouvé 50 manquements réels qu'aucun contrôle statique ne
voyait. **À reprendre tel quel dans la CI de la cible.**

### 3.4 Le durcissement sécurité (`app/securite.py`)

CSRF strict (le jeton est exigé même quand la session n'en porte pas encore —
le commentaire explique la faille que la version laxiste ouvrait), en-têtes de
sécurité, anti-force-brute à double clé (adresse IP **et** compte visé),
réponse identique dans les deux cas pour ne pas confirmer l'existence d'un
compte, `ProxyFix` pour que les liens d'activation ne partent pas en clair.
Bon niveau.

### 3.5 La doctrine « rien n'est public par défaut » (`app/public.py`)

Chaque page publique est ouverte **une par une, délibérément**, et n'expose
que ce qui est marqué `public` dans le socle. Aucune coordonnée personnelle ne
sort : on joint un responsable par formulaire. Pour un mouvement chrétien au
Maroc, ce n'est pas du confort, c'est de la protection des personnes.

### 3.6 Les commentaires qui racontent l'incident

Le code explique systématiquement *quel problème réel* une ligne corrige :
« 44 px de haut : mesure à l'écran, pas dans la feuille de style — la recette
du 01/09 a montré 41 px réels ». C'est de la documentation qui ne ment pas.
**Cette culture doit survivre à la refonte.**

### 3.7 Le sens du produit

« Cinq champs, pas quinze » pour le rapport de cellule, parce qu'il se remplit
depuis un téléphone le soir après l'étude. « Le silence est une information » :
l'écran national montre les cellules muettes autant que les actives. Ce sont
des décisions de produit justes.

---

## 4. Les défauts structurels — par gravité

### 4.1 🔴 CRITIQUE — La persistance est coupée en deux

**18 fichiers JSON** portent de l'état applicatif à côté de SQLite :

```
accueil.json      activites.json    annonces.json     camps.json
comptes.json      consentements.json creneaux.json    demandes.json
diffusion.json    documents.json    engagements.json  envois_file.json
envois_journal.json galerie.json    lives.json        raccourcis.json
salles.json       sondage.json
```

Conséquences, toutes réelles :

- **Aucune transaction.** Une inscription à un camp qui touche `camps.json`
  *et* `socle.db` peut réussir à moitié. Rien ne le rattrape.
- **Aucune intégrité référentielle.** Supprimer une personne dans SQLite laisse
  son identifiant orphelin dans `engagements.json`, `camps.json`, `galerie.json`.
- **Écriture non atomique multi-processus.** Le motif est
  `threading.Lock` + écriture d'un `.tmp` + `os.replace` (`app/salles.py`).
  L'`os.replace` est atomique, mais **le cycle lire-modifier-écrire ne l'est
  pas** : deux requêtes concurrentes chargent le même état, et la seconde
  écrase la modification de la première. Le `threading.Lock` ne protège qu'à
  l'intérieur d'un processus — c'est d'ailleurs pourquoi l'application est
  contrainte au mono-processus (§4.2).
- **Le fichier entier est réécrit à chaque modification.** `camps.json` grossit
  à chaque camp ; l'écriture est en O(taille totale).
- **Non sauvegardable de façon cohérente.** `RESTAURATION.md` copie la base par
  sauvegarde SQLite cohérente, puis les JSON par `cp` — **il n'y a aucun
  instant où les deux sont cohérents entre eux.**

> **Ceci est le défaut n°1.** Il ne se corrige pas par du refactoring : il se
> corrige par une base de données unique et transactionnelle.

### 4.2 🔴 CRITIQUE — Le mono-processus est une impasse assumée

`RESTAURATION.md` le documente honnêtement : `realtime.py` garde l'état des
salles (`rooms`, `hotes`, `attente`) dans des **dictionnaires Python en
mémoire de processus**. Conséquences :

- Impossible d'ajouter un worker → **plafond dur de capacité**.
- **Tout redémarrage coupe toutes les réunions en cours.** Il n'existe aucun
  déploiement sans interruption.
- Une exception non rattrapée dans un greenlet peut emporter tout le service.
- Aucune redondance : le serveur est un point de défaillance unique.

La parade documentée (« orienter vers la grande salle LiveKit ») est un
contournement, pas une architecture.

### 4.3 🔴 CRITIQUE — Le déploiement ne passe pas par Git

`TRAVAILLER-A-DEUX.md` : « La production ne se déploie **jamais** depuis
GitHub. […] les fichiers sont déposés dans `/root/livraison` ». Et le dépôt
n'a qu'**un seul commit**.

Il en découle que :

- **Personne ne sait, à partir du dépôt, ce qui tourne réellement en
  production.** L'audit que vous lisez porte sur un état dont la
  correspondance avec la production n'est pas garantie.
- Aucun retour arrière fiable, aucune bissection, aucune traçabilité :
  « quand cette ligne a-t-elle changé, et pourquoi ? » est sans réponse.
- La revue de code ne protège rien, puisque le fusionné n'est pas le déployé.

### 4.4 🟠 MAJEUR — Code mort divergent

Vérifié par empreinte et par recherche de références dans les gabarits :

| Fichier racine | Chargé par un gabarit ? | Fichier réellement servi | Verdict |
|---|---|---|---|
| `static/conference.js` (1 539 l.) | **Non** | `static/js/conference.js` (2 202 l.) | mort, divergent |
| `static/salle.css` (909 l.) | **Non** | `static/css/salle.css` (1 441 l.) | mort, divergent |
| `static/ui-appel.js` | **Non** | `static/js/ui-appel.js` | mort, divergent |
| `static/app.css` | **Non** | `static/css/app.css` | mort, divergent |
| `static/js/salle.css` | **Non** | `static/css/salle.css` | mort (CSS rangé dans `js/`) |
| `presentation_pdf.py` (racine) | — | `outils/presentation_pdf.py` | doublon divergent |
| `recette.py` (racine) | — | `tests/recette.py` | doublon divergent |

**≈ 106 Ko de code mort**, et le risque concret est ailleurs : *un correctif
appliqué au mauvais exemplaire semble ne rien faire.* C'est une heure perdue à
chaque fois, et une confiance perdue dans l'outil.

### 4.5 🟠 MAJEUR — Migrations de schéma écrites dans le démarrage

`app/__init__.py` exécute, à chaque `create_app()`, une boucle de
`PRAGMA table_info` + `ALTER TABLE ADD COLUMN` pour 8 colonnes ajoutées après
coup (`promotion`, `filiere`, `contact_durable`, `consent_amis`,
`structure_id`, `secteur`, `ville_actuelle`, `salle`).

- Pas de versionnement de schéma, pas de `down`, pas d'historique.
- Une migration qui échoue à moitié laisse la base dans un état indéterminé.
- Le fichier grossit à chaque évolution ; il en portera cinquante dans deux ans.
- `socle.structure_amis()` est enveloppé dans `except Exception: pass` avec ce
  commentaire : « une base à demi migrée ne doit pas empêcher le service de
  démarrer ». **Le fait que ce cas ait dû être prévu dit tout.**

### 4.6 🟠 MAJEUR — `routes.py` : 4 656 lignes, 126 routes, 176 fonctions

Un seul module porte les deux tiers des routes de l'application. À
l'intérieur, la logique métier (`_est_national()`, `_voit_amis()`,
`_place_amis()`, calculs de budget, règles de camp) est **mêlée au rendu**.

Effets mesurables :
- Impossible de tester une règle métier sans monter une requête HTTP.
- Impossible de travailler à deux dessus — `TRAVAILLER-A-DEUX.md` le
  reconnaît : « `app/routes.py` […] est gros et touché souvent. Avant de
  commencer un chantier, on se dit quels fichiers on prend ». **Un fichier est
  devenu un jeton de concurrence entre humains.**
- La règle d'autorisation est réimplémentée par écran, ce qui mène à §4.7.

### 4.7 🟠 MAJEUR — Le modèle d'autorisation est implicite et dispersé

Il n'existe pas de politique d'accès unique. On trouve, empilés :

- `login_required`, `admin_required`, `role_required("Responsable")` ;
- `est_admin()` qui interroge *deux* sources (`data.ADMINS` **et** le socle) ;
- `_est_national()`, `_voit_amis()`, `_place_amis()`, `_bloques()` — helpers
  privés de `routes.py`, chacun avec sa propre règle ;
- un rôle dérivé binaire : `"Responsable" if dirige else "Membre"`.

Trois faiblesses en découlent :

1. **Rôle binaire.** Le responsable d'une cellule de Fès et le Secrétaire
   national portent la même étiquette « Responsable ». La portée
   (*quelle structure ?*) n'est pas dans le rôle — elle est recalculée, ou
   oubliée, à chaque écran. **C'est le terrain classique de l'IDOR.** Le dépôt
   contient d'ailleurs `tests/audit_idor.py`, ce qui confirme que le risque est
   connu.
2. **Règles dupliquées.** Le code le dit lui-même : « Deux règles recopiées
   finissent toujours par diverger, et c'est alors une porte de trop. » Le
   commentaire est juste ; le remède (tout centraliser) n'est appliqué qu'en
   partie.
3. **Décision dans le gabarit.** `base.html` filtre la navigation avec
   `bloques`, calculé côté Python — deux définitions de la même règle, à
   maintenir en phase à la main.

### 4.8 🟠 MAJEUR — Aucun garde-fou automatisé

| Attendu | État |
|---|---|
| Intégration continue | **absente** (pas de `.github/`) |
| Linter (`ruff`, `flake8`) | **absent** |
| Formateur (`black`) | **absent** |
| Typage statique (`mypy`, annotations) | **absent** — aucune annotation dans `app/` |
| Tests unitaires (`pytest`) | **absents** |
| Gestion de dépendances verrouillée | **absente** (`requirements.txt` en `>=`, pas de lock) |

Ce qui existe : 24 scripts `tests/verif_*.py` (~11 000 lignes) qui **écrivent
dans une vraie base**, exigent `gbu.env`, et se lancent à la main en SSH sur le
serveur. C'est du test d'acceptation, précieux — mais :
- il ne tourne pas sur les postes de développement ;
- il ne tourne pas sur les pull requests ;
- il ne peut rien empêcher d'entrer, puisqu'il s'exécute *après* la livraison.

Le garde-fou (`if "recette" not in RACINE: sys.exit(2)`) est astucieux et
confirme le danger qu'il pare : **ces tests peuvent détruire la production.**

### 4.9 🟡 MODÉRÉ — Erreurs avalées en silence

**57 blocs `except …: pass`** et des `except Exception` larges (36 dans le seul
`routes.py`). Le motif dominant :

```python
try:
    …
except Exception:
    return False          # ou : pass
```

Une base indisponible, une faute de frappe et un vrai refus d'accès deviennent
**indiscernables**. Le code le note lui-même : « le filtre par ville de
l'annuaire disparaissait en silence, avalé par son try/except ». Le diagnostic
est posé, la pratique demeure.

### 4.10 🟡 MODÉRÉ — Front sans architecture

- Pas de framework, pas de bundler, pas d'étape de construction : les fichiers
  sont servis tels quels.
- **9 800 lignes de JavaScript impératif** manipulant le DOM à la main, dont
  4 736 pour la visioconférence.
- CSS **entièrement global** : trois feuilles chargées sur toutes les pages
  (`app.css`, `recherche.css`, `finition.css`) ; le nom `finition.css` désigne
  précisément la feuille des correctifs par-dessus — la dette rendue visible.
- Aucun composant réutilisable : les motifs (carte, tableau, badge, modale)
  sont recopiés à travers **88 gabarits**.
- Le cache est contourné par une empreinte `mtime` en paramètre d'URL — astucieux,
  mais c'est la fonction d'un bundler.

### 4.11 🟡 MODÉRÉ — Deux moteurs de visio à maintenir

`README.md` défend le choix (mesh chiffré de bout en bout pour ≤ 8 personnes,
SFU LiveKit au-delà). L'argument était valable ; **il ne l'est plus** :
LiveKit prend aujourd'hui en charge le chiffrement de bout en bout
(*insertable streams*). Maintenir 4 736 lignes de client WebRTC maison pour un
bénéfice que le SFU offre nativement n'est plus justifiable à une personne.

### 4.12 🟡 MODÉRÉ — Sauvegardes et secrets

- Les sauvegardes vivent **sur le disque qu'elles protègent**
  (`RESTAURATION.md` le signale honnêtement). Un incident emporte les deux.
- La seule copie hors serveur est **manuelle**, sur un poste Windows personnel,
  « à rafraîchir ».
- `gbu.env` (clés LiveKit, WhatsApp, clé de session, clé Anthropic) est dans
  l'archive de sauvegarde ; celle-ci circule par `scp` vers un poste personnel.
- Aucune rotation de secret documentée.

### 4.13 🟡 MODÉRÉ — Données personnelles sensibles sans cadre formel

L'application stocke, pour des étudiants au Maroc : identité, téléphone,
courriel, ville, campus, **et l'appartenance à un mouvement chrétien**.

En droit marocain (loi 09-08, CNDP) comme au RGPD (l'IFES et les Amis sont en
Europe), **les convictions religieuses sont une donnée sensible**. Il existe
bien `app/consentement.py` et un champ `consent_amis`, mais il manque : registre
des traitements, durées de conservation, procédure d'effacement, politique de
confidentialité publiée, chiffrement au repos, analyse d'impact.

Le README écrit : « Le GBU est un mouvement qui peut être visé. » **Le modèle
de menace est donc reconnu, mais nulle part formalisé.**

### 4.14 🟢 MINEUR — Divers

- **Pas d'internationalisation.** Tout est en français en dur, y compris les
  dates (`app/dates_fr.py`). Ni arabe, ni anglais — voir §6.7.
- **Pas de pagination.** L'annuaire et les listes chargent tout.
- `app/data.py` (662 lignes) est décrit comme « données de démonstration à
  remplacer par une vraie base » — et sert toujours de source pour les six
  comptes du Secrétariat national, en parallèle du socle.
- Le fichier `serve.py` (production) et `flask_app.py` (dev) divergent sur le
  port, le mode debug et le monkey-patching : deux chemins de démarrage.

---

## 5. Ce que le produit couvre aujourd'hui

Inventaire fonctionnel, pour ne rien perdre à la reprise.

| Domaine | Couverture | Qualité du modèle |
|---|---|---|
| Personnes, structures, rattachements | Complète | **Excellente** |
| Camps (inscriptions, chambres, transport, finances, boutique, attestations) | Complète | **Excellente** — 1 775 lignes de métier réel |
| Finances (budgets multi-niveaux, versements, promesses, engagements, revue) | Complète | **Excellente** |
| Visioconférence (mesh + SFU, enregistrement, modération, sous-groupes) | Complète | Bonne, mais double moteur |
| Comptes rendus (transcription locale + synthèse IA + export PDF/Word/PPT) | Complète | Très bonne |
| Rapports mensuels de cellule | Complète | **Excellente** (5 champs, silence = information) |
| Amis du GBU, finissants, place des Amis | Complète | Très bonne |
| Gouvernance, plan d'action, décisions, mes actions | Complète | Bonne |
| Lettres de prière | Complète | Bonne |
| Communication (live, envois ciblés, WhatsApp, annonces) | Complète | Bonne |
| Galerie, documents, calendrier, agenda | Complète | Correcte |
| Accompagnement, parcours, kit du bureau | Partielle | Légère (129–311 l.) |
| Face publique (7 pages) | Minimale | Correcte, mais vitrine pauvre |
| Comptes, sécurité, santé du service, recherche | Complète | Bonne |

---

## 6. Ce qui manque — les besoins non exprimés

Cette section répond à la demande : *« voir les besoins que je n'ai pas encore
soulignés »*. Elle croise la description du GBUM avec le code réellement écrit.

### 6.1 🔴 Le canevas d'études bibliques — **absent**

C'est **la lacune majeure**, et elle est structurante.

Le GBUM se définit par l'étude biblique hebdomadaire en cellule, sur un
**canevas édité chaque année**. C'est l'activité première du mouvement, celle
que vivent chaque semaine tous les GBUssiens de toutes les villes.

Résultat de la recherche exhaustive dans le code :

| Occurrence | Nature |
|---|---|
| `app/kit_bureau.py:162,170,174` | Texte de conseil (« encourager à prier selon le canevas ») |
| `app/audio.py:56` | Mot du lexique de transcription |
| `app/gouvernance.py:437` | Commentaire de code |
| `templates/presentation.html:629` | Diapositive : *« Les études bibliques : le canevas de l'année, sa diffusion […] »* — une **intention affichée** |
| `templates/rapports_cellule.html:108` | Champ texte libre `placeholder="Où en est le canevas"` |

**Il n'existe aucune entité, aucune table, aucun écran, aucune route.**
Le canevas n'est qu'une chaîne de caractères saisie à la main dans un champ
libre du rapport mensuel.

Conséquences :
- Le mouvement ne peut pas savoir **où en est chaque cellule** dans le canevas.
- Le canevas annuel n'est pas diffusé par l'outil (il circule sans doute en PDF
  par WhatsApp).
- Un responsable de cellule ne prépare pas son étude dans le hub.
- Aucune mémoire : les canevas des années passées ne sont nulle part.
- Aucun retour du terrain vers les auteurs du canevas suivant.

> **Un hub du GBUM qui ne porte pas le canevas d'études bibliques gère
> l'intendance du mouvement sans porter sa mission.** C'est la fonctionnalité
> n°1 de la refonte.

### 6.2 🔴 L'évangélisation et le JTPA — **absents**

`JTPA` : **0 occurrence**. « Évangélisation » n'apparaît que comme mot dans des
listes d'activités et un conseil du kit du bureau.

Manquent : le suivi des sorties d'évangélisation, et surtout
**l'évangélisation par amitié (JTPA)** — un accompagnement relationnel dans la
durée : qui accompagne qui, depuis quand, sujets de prière, discrétion absolue.
C'est le second pilier de la devise (« … et le faire connaître ») et il n'a
aucun support.

Ce domaine porte une exigence de confidentialité **supérieure à tout le reste
de l'application** : la liste des personnes approchées, dans le contexte
marocain, est la donnée la plus sensible que le mouvement puisse détenir. Elle
appelle un traitement à part (voir CDC §sécurité).

### 6.3 🟠 La vision décennale et le thème annuel — non portés

« Éclaireurs des campus pour Christ » (vision décennale née à Ifrane 2023) :
**0 occurrence**. Le thème annuel qui porte la vision : pas d'entité non plus.

Il existe `app/plan.py` (plan d'action, objectifs par structure), mais
**rien ne relie un objectif de cellule à la vision décennale ni au thème de
l'année**. Le plan d'action flotte sans ciel.

Manque : une entité `Vision` (2023-2033) → `ThèmeAnnuel` → `Objectif` (par
structure) → `Activité`, avec la redescente narrative jusqu'à l'écran d'accueil
de chaque GBUssien.

### 6.4 🟠 Le parcours du GBUssien — non modélisé

Le cycle de vie décrit par le mouvement est :

```
nouveau venu → GBUssien → responsable de cellule → responsable de ville
             → membre du bureau → finissant → Ami du GBU
```

avec des **jalons de formation** : camp des responsables, camp des témoins,
camp d'Ifrane.

Le socle sait dire *où quelqu'un est rattaché aujourd'hui*. Il ne sait pas dire
*ce qu'il a traversé*. `app/parcours.py` (129 lignes) et
`app/accompagnement.py` (156 lignes) effleurent le sujet.

Manque : un historique de parcours, les formations suivies, la relève
identifiée. C'est ce qui permet au national de répondre à « qui peut reprendre
la ville de Rabat l'an prochain ? ».

### 6.5 🟠 L'accueil de la rentrée — le moment le plus important, non outillé

Chaque rentrée universitaire est le pic annuel du mouvement : des étudiants
arrivent, souvent seuls dans un pays qu'ils ne connaissent pas
(`app/public.py` le dit très bien : « Arriver seul dans un pays qu'on ne
connaît pas est rude. Le groupe est souvent la première famille. »).

Or il n'existe **aucun parcours d'accueil** : pas d'inscription publique, pas
d'orientation vers la cellule la plus proche, pas de prise en charge, pas de
relance. Le formulaire de contact public (`/contact`) dépose une demande dans
`demandes.json` — et s'arrête là.

Manque : « Je cherche un groupe » → géolocalisation / choix de ville et campus
→ mise en relation avec le responsable → suivi de la prise de contact →
intégration dans la cellule. **C'est le tunnel de croissance du mouvement.**

### 6.6 🟠 La mémoire du mouvement — absente

Vous mentionnez « date de création, etc. ». Rien dans le code : ni histoire, ni
archives, ni anciens responsables, ni témoignages, ni photos historiques
indexées, ni chronologie. La galerie stocke des fichiers sans récit.

Pour un mouvement qui se renouvelle **intégralement tous les 4 à 5 ans** (les
étudiants sortent), la mémoire n'est pas un ornement : c'est la seule chose qui
empêche de repartir de zéro à chaque génération.

### 6.7 🟠 Langues — le français seul

Tout est en français en dur. Or le GBUM réunit : étudiants marocains
(**arabe**, français), étudiants subsahariens (français), étudiants
internationaux et partenaires IFES (**anglais**).

L'internationalisation, et surtout **le support RTL de l'arabe**, est une
décision d'architecture **qui doit être prise avant la première ligne de
code** : la rétro-adapter coûte dix fois plus cher.

### 6.8 🟡 Autres manques

| Manque | Pourquoi c'est important |
|---|---|
| **Mobile** | PWA minimale (manifeste + `sw.js` de 2,7 Ko, sans stratégie hors ligne). Les étudiants sont sur téléphone, souvent en connexion faible. |
| **Hors ligne** | Le canevas d'étude doit être consultable sans réseau, en cellule, sur un campus. |
| **Notifications** | WhatsApp uniquement, via un robot maison hors dépôt. Pas de notification web, pas de courriel transactionnel. |
| **Agapè, sorties, JTPA** | `agape` : 0 occurrence. Les activités sont génériques, sans typologie GBUM. |
| **Conseillers de ville** | `conseiller` : 0 occurrence. Le rôle décrit dans l'organisation n'existe pas dans le modèle. |
| **Recherche** | Balayage SQL sans index plein texte ; l'écran doit être enregistré à la main dans `ECRANS` (`app/recherche.py`). |
| **Journal d'audit** | `connexions.py` trace les connexions ; **les actions métier sensibles (finances, suppressions) ne sont pas tracées**. |
| **Pagination / performance** | Aucune. Tient à 200 personnes, pas à 2 000. |
| **Export / réversibilité** | Exports CSV ponctuels sur les camps ; pas d'export global. Les données du mouvement ne sont pas récupérables simplement. |

---

## 7. Dette technique chiffrée

Estimation du coût de remise à niveau **de l'existant** (sans refonte) :

| Chantier | Effort | Risque si non fait |
|---|---|---|
| Unifier la persistance (18 JSON → base transactionnelle) | 15–20 j | Perte de données |
| Sortir l'état des salles de la mémoire | 8–12 j | Plafond de capacité, coupures |
| Découper `routes.py` (126 routes) | 10–15 j | Blocage à deux développeurs |
| Politique d'autorisation unifiée + audit IDOR | 8–10 j | Fuite de données personnelles |
| Migrations versionnées | 3–5 j | Corruption de schéma |
| CI + lint + typage + tests unitaires | 8–10 j | Régressions silencieuses |
| Déploiement depuis Git, sans coupure | 5–8 j | Aucune traçabilité |
| Supprimer le code mort, dédupliquer | 2–3 j | Correctifs appliqués à côté |
| Sauvegardes hors site, rotation des secrets | 3–5 j | Perte totale sur incident |
| Cadre données personnelles (registre, conservation, effacement) | 5–8 j | Exposition juridique **et humaine** |
| **Total remise à niveau seule** | **≈ 67–96 jours** | |

À quoi s'ajouterait, **sans avoir rien apporté de neuf** : le canevas, le JTPA,
l'accueil de rentrée, le multilingue, le mobile.

### La conclusion qu'il faut en tirer

Le coût de la remise à niveau approche celui d'une reconstruction — **et laisse
un produit dont l'architecture reste celle d'un monolithe mono-processus.**

La bonne décision n'est ni « on répare » ni « on jette », c'est :

> **On reconstruit l'architecture, on transporte le modèle métier.**

Les 23 482 lignes de `app/` contiennent peut-être 4 000 lignes de *règles
métier vraies* (le reste est plomberie, rendu et redites). Ce sont ces 4 000
lignes qu'il faut lire, comprendre, et réécrire proprement. **Ce dépôt est le
meilleur cahier des charges dont vous disposiez** — mieux qu'un document, il
dit ce qui a été essayé et ce qui a résisté à l'usage.

---

## 8. Suite

- Le cahier des charges : [`01-CAHIER-DES-CHARGES.md`](01-CAHIER-DES-CHARGES.md)
- L'architecture cible et les décisions : [`02-ARCHITECTURE.md`](02-ARCHITECTURE.md)
- Les conventions de code : [`03-CONVENTIONS-ET-QUALITE.md`](03-CONVENTIONS-ET-QUALITE.md)
- Le plan de route : [`04-ROADMAP.md`](04-ROADMAP.md)
- Le prompt Claude Design : [`05-PROMPT-CLAUDE-DESIGN.md`](05-PROMPT-CLAUDE-DESIGN.md)
