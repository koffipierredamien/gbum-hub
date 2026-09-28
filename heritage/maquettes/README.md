# Maquettes — Hub officiel du GBUM

Planches de conception au format **Design Component** (`.dc.html`), une par
artboard, disposées par `canvas.json` sur un canevas unique.

| Fichier | Écran | Largeur |
|---|---|---|
| `Main.dc.html` | L'étude de la semaine — Luc 19.1-10 | 390 |
| `Seance.dc.html` | Enregistrer la séance de cellule *(cliquable)* | 390 |
| `Rapport.dc.html` | Le rapport mensuel — cinq champs | 390 |
| `TrouverGroupe.dc.html` | Parcours d'accueil, trois étapes + cas « pas de groupe » | 390 |
| `Accueil.dc.html` | Accueil public — téléphone | 390 |
| `AccueilBureau.dc.html` | Accueil public — bureau | 1440 |
| `TableauBord.dc.html` | Tableau de bord national | 1440 |

## Direction artistique

Thème **« Foyer »**, repris de `static/css/app.css` de l'application existante —
mêmes jetons, mêmes deux familles de caractères, **et les deux corrections de
contraste que leur audit navigateur avait mesurées à l'écran** :

1. le texte sur l'ambre est en **encre** `#2A211B`, jamais en blanc
   (blanc : 3,04:1 — illisible ; encre : 5,19:1) ;
2. l'ambre vif `#E8732A` est la couleur des **actions**, jamais celle d'un
   **état** (un état se dit en orange foncé `#96430F`, 5,2:1, plus une barre
   latérale).

Voir [`../docs/05-PROMPT-CLAUDE-DESIGN.md`](../docs/05-PROMPT-CLAUDE-DESIGN.md)
pour la direction complète et les prompts par écran.

## Régénérer le canevas

```bash
node <skill>/seed-canvas.mjs \
  --template <skill>/payload.template.html \
  --out maquettes-hub-gbum.html \
  --title "Maquettes du Hub GBUM" \
  --artboard Main.dc.html --artboard Seance.dc.html \
  --artboard Rapport.dc.html --artboard TrouverGroupe.dc.html \
  --artboard Accueil.dc.html --artboard AccueilBureau.dc.html \
  --artboard TableauBord.dc.html \
  --canvas canvas.json
```

Le fichier produit `maquettes-hub-gbum.html` n'est pas versionné : il pèse
~2 Mo (l'éditeur y est embarqué) et se régénère à la commande ci-dessus.

## À obtenir du Secrétariat National

Les maquettes portent des emplacements marqués tant que ceci manque :

- le **canevas d'études de l'année en cours** — sans lui, l'écran le plus
  important du hub reste maquetté à l'aveugle ;
- des **photos réelles** : une cellule en séance, le camp d'Ifrane, un campus ;
- les **textes officiels** de la vision décennale et du thème de l'année.
