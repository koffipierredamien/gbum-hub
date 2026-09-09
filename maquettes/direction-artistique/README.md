# « Foyer en mouvement » — proposition de direction artistique

Trois planches au format Design Component (`.dc.html`), disposées par
`canvas.json`. Le détail écrit est dans
[`docs/09-DIRECTION-ARTISTIQUE.md`](../../docs/09-DIRECTION-ARTISTIQUE.md).

| Fichier | Ce qu'elle montre | Largeur × hauteur |
|---|---|---|
| `Systeme.dc.html` | Le système : cinq surfaces mesurées, l'échelle typographique, les trois mouvements en fonctionnement, deux avant/après de composant | 1440 × 5627 |
| `AccueilV2.dc.html` | L'accueil recomposé avec les dix règles | 390 × 4555 |
| `VieDuMouvementV2.dc.html` | La même grammaire sur une seconde page | 390 × 2996 |

**Cette direction a été appliquée aux onze planches du lot 1 le 9 septembre
2026** (`../site-public/`). Ces trois planches restent comme trace de la
proposition : le système y est exposé règle par règle, avec ses mesures et ses
avant/après, ce que les planches finales ne montrent pas.

## Ce qui bouge réellement

Trois animations fonctionnent dans ces fichiers, elles ne sont pas décrites :

- le **défilé des villes** — 38 s en boucle, arrêt au survol ;
- l'**apparition en cascade** — planche A, démonstration 1 ;
- le **survol** des blocs — 120 ms.

Toutes s'éteignent sous `prefers-reduced-motion: reduce`, et la page reste
alors entière : rien n'est caché en attendant une animation qui ne viendra pas.

## Les mesures

Toutes les valeurs de couleur ont été calculées, aucune n'a été choisie à
l'œil. Les cinq surfaces et leurs textes sont dans le tableau de la règle D1.
Trois défauts ont été trouvés et corrigés **par la mesure**, pendant la
composition de ces planches :

| Ce qui a été trouvé | Mesure | Correction |
|---|---|---|
| `#B9AA98` (le secondaire d'Encre) réemployé sur Terre | 4,05:1 — sous le seuil | `#EFC9A6` — 5,94:1 |
| L'ambre clair `#F0A868` posé sur le voile d'une photo | 2,58:1 | Sur photo, crème uniquement ; un bloc qui a besoin de couleur pose son propre fond encre à 90 % — 5,82:1 |
| La bordure d'une puce de filtre, `#C3B49F` sur Sable | 1,71:1 — or c'est un **contrôle**, WCAG 1.4.11 exige 3:1 | `#8A7458` — 3,74:1 |

Deux autres défauts ont été trouvés **par le rendu**, en mesurant les planches
dans un navigateur plutôt qu'en les lisant : le titre « La vie du mouvement »
chevauchait son lien « Tout voir » à 390 px, et la bande Forêt de la planche C
venait buter directement sur le pied de page Encre, sans la respiration
qu'exige la règle D1.

## Régénérer le canevas

```bash
node <skill>/seed-canvas.mjs \
  --template <skill>/payload.template.html \
  --out foyer-en-mouvement.html --title "Foyer en mouvement" \
  --artboard Systeme.dc.html --artboard AccueilV2.dc.html \
  --artboard VieDuMouvementV2.dc.html --canvas canvas.json
```

Le fichier assemblé n'est pas versionné : régénérable.
