# Maquettes du site public — lot 1

Onze planches au format Design Component (`.dc.html`), disposées par
`canvas.json`. Voir le [plan du lot 1](../../docs/08-PLAN-SITE-PUBLIC.md).

| Fichier | Écran | Largeur |
|---|---|---|
| `Main.dc.html` | 1 · Accueil | 390 |
| `LeMouvement.dc.html` | 2 · Le mouvement — devise, vision, histoire, organisation | 390 |
| `OuNousSommes.dc.html` | 3 · Où nous sommes — villes, cellules, contact du bureau | 390 |
| `VieDuMouvement.dc.html` | 4 · La vie du mouvement | 390 |
| `Canevas.dc.html` | 5 · Le canevas et ses archives | 390 |
| `Agenda.dc.html` | 6 · Agenda | 390 |
| `Soutenir.dc.html` | 7 · Soutenir | 390 |
| `NousEcrire.dc.html` | 8 · Nous écrire | 390 |
| `Rejoindre.dc.html` | 9 · Le parcours « Rejoindre le GBUM » | 390 |
| `AccueilBureau.dc.html` | 10 · Accueil — version bureau | 1440 |
| `Administration.dc.html` | 11 · L'espace d'administration | 1440 |

## Les deux règles qui tiennent ces planches

**1. Rien n'est inventé.** Tout contenu que le mouvement n'a pas encore fourni
porte l'encadré pointillé « en cours d'écriture » — thème de l'année, histoire
du GBUM, canevas, chiffres des villes, photos. Ce n'est pas un défaut de
maquette : c'est **l'exigence A1.3 montrée en action**.

Cela corrige la série précédente, où « 9 villes, 27 cellules, 312 GBUssiens »
étaient des nombres fabriqués qu'un lecteur pressé aurait pris pour des faits.

**2. La publication s'arrête à la ville** ([ADR-011](../../docs/02-ARCHITECTURE.md)).
Les cellules sont nommées avec leur seul effectif ; ni jour, ni heure, ni lieu,
ni responsable. Le seul contact publié est celui du bureau de ville.

## Régénérer le canevas

```bash
node <skill>/seed-canvas.mjs \
  --template <skill>/payload.template.html \
  --out site-public-gbum.html --title "Site public du GBUM" \
  --artboard Main.dc.html --artboard LeMouvement.dc.html \
  --artboard OuNousSommes.dc.html --artboard VieDuMouvement.dc.html \
  --artboard Canevas.dc.html --artboard Agenda.dc.html \
  --artboard Soutenir.dc.html --artboard NousEcrire.dc.html \
  --artboard Rejoindre.dc.html --artboard AccueilBureau.dc.html \
  --artboard Administration.dc.html --canvas canvas.json
```

Le fichier assemblé n'est pas versionné : ~2 Mo, régénérable.
