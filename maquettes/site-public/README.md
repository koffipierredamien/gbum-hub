# Maquettes du site public — lot 1

Onze planches au format Design Component (`.dc.html`), disposées par
`canvas.json`. Voir le [plan du lot 1](../../docs/08-PLAN-SITE-PUBLIC.md) et la
[direction artistique](../../docs/09-DIRECTION-ARTISTIQUE.md).

**Recomposées le 9 septembre 2026** dans la direction
**« Foyer en mouvement »** : cinq surfaces au lieu d'une, un rapport
typographique de 8:1 au lieu de 3:1, des bandes pleine largeur à la place des
cartes, un mouvement mesuré, et un vide qui invite au lieu de s'excuser.

| Fichier | Écran | Largeur × hauteur |
|---|---|---|
| `Main.dc.html` | 1 · Accueil | 390 × 5072 |
| `LeMouvement.dc.html` | 2 · Le mouvement — devise, vision, histoire, organisation | 390 × 3778 |
| `OuNousSommes.dc.html` | 3 · Où nous sommes — villes, cellules, contact du bureau | 390 × 3341 |
| `VieDuMouvement.dc.html` | 4 · La vie du mouvement | 390 × 3525 |
| `Agenda.dc.html` | 5 · Agenda | 390 × 2848 |
| `Canevas.dc.html` | 6 · Le canevas et ses archives | 390 × 2494 |
| `Soutenir.dc.html` | 7 · Soutenir | 390 × 3236 |
| `NousEcrire.dc.html` | 8 · Nous écrire | 390 × 2406 |
| `Rejoindre.dc.html` | 9 · Le parcours « Rejoindre le GBUM » | 390 × 3895 |
| `AccueilBureau.dc.html` | 10 · Accueil — version bureau | 1440 × 3408 |
| `Administration.dc.html` | 11 · L'espace d'administration | 1440 × 1077 |

## L'ordre des pages

**Le mouvement · Où nous sommes · La vie du mouvement · Agenda · Le canevas ·
Soutenir · Nous écrire.** Il suit le parcours du visiteur — découvrir,
participer, approfondir, s'engager — et non l'organigramme du mouvement.
**« Rejoindre le GBUM » n'est pas une entrée de menu :** c'est l'action,
l'unique bouton ambre. Argumentation :
[`09-DIRECTION-ARTISTIQUE.md` §7.1](../../docs/09-DIRECTION-ARTISTIQUE.md).

## Les deux règles qui tiennent ces planches

**1. Rien n'est inventé.** Tout contenu que le mouvement n'a pas encore fourni
porte un marqueur d'attente — thème de l'année, histoire du GBUM, canevas,
chiffres des villes, photos, témoignages. Ce n'est pas un défaut de maquette :
c'est **l'exigence A1.3 montrée en action**.

Depuis la version 2, ce marqueur n'est plus un rectangle pointillé — la forme
visuelle d'un formulaire incomplet — mais un filet plein ouvert vers la page,
qui dit **qui** doit fournir **quoi**, et propose souvent au lecteur de le
fournir lui-même : *« Vous avez cette information ? »*

**2. La publication s'arrête à la ville** ([ADR-011](../../docs/02-ARCHITECTURE.md)).
Les cellules sont nommées avec leur seul effectif ; ni jour, ni heure, ni lieu,
ni responsable. Le seul contact publié est celui du bureau de ville.

## Ce qui bouge réellement

Trois animations fonctionnent dans ces fichiers :

- le **défilé d'images** de l'ouverture — quatre photographies en fondu, 7 s
  chacune, avec bouton pause, pastilles et arrêt au survol (WCAG 2.2.2) ;
- le **défilé des villes** — 38 s en boucle, arrêt au survol ;
- le **survol** des cartes et des boutons — 120 ms.

Toutes s'éteignent sous `prefers-reduced-motion: reduce`, et la page reste alors
entière : rien n'est caché en attendant une animation qui ne viendra pas.

## Un noyau de styles partagé

Les onze planches portent **le même bloc de styles**, à l'identique : les cinq
surfaces avec leurs couleurs de texte mesurées, l'échelle typographique, les
quatre variantes du marqueur d'attente, les contrôles. Une règle corrigée l'est
donc partout à la fois — et une valeur qui dérive se voit tout de suite.

## Régénérer le canevas

```bash
node <skill>/seed-canvas.mjs \
  --template <skill>/payload.template.html \
  --out site-public-gbum.html --title "Site public du GBUM" \
  --artboard Main.dc.html --artboard LeMouvement.dc.html \
  --artboard OuNousSommes.dc.html --artboard VieDuMouvement.dc.html \
  --artboard Agenda.dc.html --artboard Canevas.dc.html \
  --artboard Soutenir.dc.html --artboard NousEcrire.dc.html \
  --artboard Rejoindre.dc.html --artboard AccueilBureau.dc.html \
  --artboard Administration.dc.html --canvas canvas.json
```

Le fichier assemblé n'est pas versionné : ~2 Mo, régénérable.
