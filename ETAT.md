# Où en est le projet

_18 septembre 2026. Une page, tenue à jour. Si vous ne lisez qu'un fichier, c'est
celui-ci._

## Ce qui marche aujourd'hui

- **Le site public** : 8 pages, en français et en anglais, sur téléphone comme sur
  ordinateur.
- **L'espace d'administration** : le Secrétariat National écrit, relit, publie —
  sans moi. Villes, cellules, textes, comptes, messages reçus.
- **La règle du site** : rien n'est inventé. Ce qu'on n'a pas, la page l'annonce et
  dit qui doit le fournir.

## Ce qui manque, et qui doit le fournir

| Ce qui manque                                                     | Qui                 | Bloque quoi                                |
| ----------------------------------------------------------------- | ------------------- | ------------------------------------------ |
| Les villes autres que Casablanca                                  | Le SN               | La liste, le bandeau défilant              |
| Des photos                                                        | **Vous**            | L'ouverture du site                        |
| Le thème de l'année, le canevas, les chiffres, l'histoire du GBUM | **Le SN**           | Cinq encadrés, qui resteront visibles      |
| Une adresse d'envoi de courriel                                   | Le SN               | L'alerte au bureau quand un étudiant écrit |
| Un serveur                                                        | **Vercel, gratuit** | Montrer le site                            |

## Le plan, en trois étapes

1. **Déployer sur Vercel** — la marche à suivre est dans
   [`docs/DEPLOIEMENT-VERCEL.md`](docs/DEPLOIEMENT-VERCEL.md), vingt minutes.
2. ~~**Afficher vos photos**~~ — fait le 18 septembre : quatre photographies des
   camps d'Ifrane et d'une rencontre défilent en ouverture.
3. **Remplir** tout ce qui ne dépend pas du SN, ensemble, depuis l'administration.
4. **Envoyer le formulaire au Secrétariat National** pour le reste —
   [`docs/FORMULAIRE-DE-COLLECTE.md`](docs/FORMULAIRE-DE-COLLECTE.md).

Ce qui dépend du SN restera marqué « attendu ». **C'est ce qu'il faut montrer** :
les responsables verront exactement quelles informations débloquent quelles pages.

## Ce que j'attends de vous

1. **Vos photos** : déposez-les dans `apps/site/public/photos/`, décrivez-les dans
   `photos.json` à côté. Le mode d'emploi est dans le même dossier.
2. Un **compte Vercel** gratuit, créé avec votre compte GitHub.

Casablanca et ses neuf cellules sont dans `donnees/villes.txt` :
`pnpm villes:importer` les charge, et la commande se rejoue sans dégât.

## Les documents

Cinq, plus celui-ci. Le reste est dans `docs/archives/` — utile un jour, inutile
aujourd'hui.

| Fichier                                   | Quand le lire                               |
| ----------------------------------------- | ------------------------------------------- |
| `docs/11-DEMARRER-EN-LOCAL.md`            | Faire tourner le projet chez vous           |
| `docs/16-REMPLIR-LE-SITE.md`              | Saisir les textes, les villes, les contacts |
| `docs/01-CAHIER-DES-CHARGES.md`           | Ce que le projet doit faire                 |
| `docs/02-ARCHITECTURE.md`                 | Pourquoi telle décision technique           |
| `docs/07-NOTE-AU-SECRETARIAT-NATIONAL.md` | Ce qu'il faut demander au SN                |
