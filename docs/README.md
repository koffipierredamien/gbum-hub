# Hub officiel du GBUM — dossier de conception

> Documentation de conception de la refonte du hub du **GBUM** — Groupe
> Biblique Universitaire au Maroc.
>
> **Ces documents ne modifient aucune ligne de l'application en production.**
> Ils vivent dans `docs/`, sur la branche `claude/gbum-official-hub-qp17ca`, et
> se transportent d'une commande vers un dépôt dédié une fois la décision prise
> (voir [ADR-009](02-ARCHITECTURE.md#11--adr-009--le-dépôt)).

---

## Les documents

| # | Document | Ce qu'il répond | Pour qui |
|---|---|---|---|
| **00** | [Audit de l'existant](00-AUDIT-EXISTANT.md) | Qu'a-t-on aujourd'hui ? Que faut-il garder, jeter, et que manque-t-il ? | Pierre, SN |
| **01** | [Cahier des charges](01-CAHIER-DES-CHARGES.md) | Que doit faire le hub, pour qui, avec quelles exigences ? | **Secrétariat National + Pierre** |
| **02** | [Architecture et décisions](02-ARCHITECTURE.md) | Un site ou plusieurs ? Quelle pile ? Quels arbitrages, et pourquoi ? | Pierre |
| **03** | [Conventions et qualité](03-CONVENTIONS-ET-QUALITE.md) | Comment écrit-on le code ? Qu'est-ce qui bloque une PR ? | Pierre |
| **04** | [Plan de route](04-ROADMAP.md) | Dans quel ordre ? Combien de temps ? Quels risques ? | **Secrétariat National + Pierre** |
| **05** | [Prompt Claude Design](05-PROMPT-CLAUDE-DESIGN.md) | Comment faire produire les maquettes ? | Pierre |
| **07** | [Note au Secrétariat National](07-NOTE-AU-SECRETARIAT-NATIONAL.md) | Quatre décisions, cinq informations, deux désignations attendues du Secrétariat National | **SN** |

**Ordre de lecture conseillé :** 00 → 01 → 02 → 04 → 03 → 05.
**Si vous n'avez qu'une heure :** 00 §1 et §6, puis 01 §4 et §12, puis 04.

---

## Les cinq conclusions de l'audit

1. **L'existant n'est pas un prototype.** C'est un produit en service, qui
   porte des données vivantes, et dont la modélisation métier est par endroits
   excellente. **Cette connaissance est le vrai actif** — le code ne l'est pas.

2. **L'architecture ne tiendra pas.** Persistance éclatée sur 18 fichiers JSON
   à côté d'une base SQLite, mono-processus obligatoire, migrations écrites
   dans le démarrage, déploiement qui ne passe pas par Git. Coût de remise à
   niveau : **67 à 96 jours** — sans rien apporter de neuf.

3. **Deux produits, deux raisons d'être.** Le **site public** doit rendre le
   mouvement visible et **conserver sa mémoire largement ouverte** ; l'**espace
   de travail** doit faire travailler ensemble des niveaux qui se renouvellent
   chaque année. Ce sont deux besoins distincts, et le cahier des charges les
   traite séparément.

4. **Un site ou plusieurs ? Ni l'un ni l'autre exactement :** un produit, un
   dépôt, **deux surfaces** — c'est ce que font IFES, UCCF, les Scouts et
   Guides de France et Rotary — une vitrine publique optimisée pour le référencement
   et la vitesse, un espace membre riche et authentifié, **une seule source de
   vérité** dessous.

5. **Le risque n°1 n'est pas technique, il est de calendrier.** 158 à 210
   jours-homme pour l'ensemble. À un jour par semaine, cela dépasse la durée
   d'études d'une génération de GBUssiens. La parade est le périmètre et la
   livraison précoce, pas la vitesse de frappe.

---

## Les décisions — état réel

> Une décision n'est « tranchée » que si Pierre ou le Secrétariat National
> l'a dit explicitement. Trois le sont ; les autres attendent leur phase.

| # | Décision | État | Phase |
|---|---|---|---|
| **D1** | Un site ou plusieurs ? | ✅ **deux surfaces, une seule base** — 9 sept. 2026 | 2.1 |
| **D2** | Pile technique | ✅ **TypeScript de bout en bout** — 8 sept. 2026 | 5.1 |
| **D3** | Dépôt | ✅ **`gbum-hub`** — 8 sept. 2026 | — |
| **D4** | Périmètre de la v1 | ⬜ à trancher | 2.5 |
| **D10** | Posture de visibilité publique | ✅ **ouverte** — 9 sept. 2026 *(réserve : confirmation du Secrétariat National)* | 2.4 |
| **D5** | Bascule progressive ou non | ⬜ à trancher | 3.7 |
| **D6** | Langues de la v1 | ⬜ à trancher | 3.3 |
| **D7** | Hébergement | ⬜ à trancher | 5.4 |
| **D8** | Le JTPA dans le hub ? | ⬜ à trancher — **décision du mouvement** | 2.6 |
| **D9** | Monolithe ou microservices ? | ✅ **monolithe modulaire** — 8 sept. 2026 | 2.2 |

Détail et argumentation : [cahier des charges §12](01-CAHIER-DES-CHARGES.md#12-décisions-à-arbitrer).

---

## Prochaines étapes

Nous sommes en **phase 2 — Organisation du hub** ([`04-ROADMAP.md`](04-ROADMAP.md)).

1. Trancher les **sept points de la phase 2**, à commencer par le premier :
   un seul site ou plusieurs ?
2. **Réclamer au Secrétariat National** le canevas d'études de l'année, de
   vraies photos, et les textes officiels de la vision et du thème.
3. **Désigner** un responsable produit au Secrétariat National et cinq testeurs GBUssiens dans
   cinq villes différentes.
4. Ouvrir la phase 3 dès que la phase 2 est validée à 70 %.

---

*Documents vivants. Toute modification passe par une pull request et est datée.*
*Rédigés le 7 septembre 2026, réordonnés en phases le 9 septembre 2026.*
