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
| **01** | [Cahier des charges](01-CAHIER-DES-CHARGES.md) | Que doit faire le hub, pour qui, avec quelles exigences ? | **SN + Pierre** |
| **02** | [Architecture et décisions](02-ARCHITECTURE.md) | Un site ou plusieurs ? Quelle pile ? Quels arbitrages, et pourquoi ? | Pierre |
| **03** | [Conventions et qualité](03-CONVENTIONS-ET-QUALITE.md) | Comment écrit-on le code ? Qu'est-ce qui bloque une PR ? | Pierre |
| **04** | [Plan de route](04-ROADMAP.md) | Dans quel ordre ? Combien de temps ? Quels risques ? | **SN + Pierre** |
| **05** | [Prompt Claude Design](05-PROMPT-CLAUDE-DESIGN.md) | Comment faire produire les maquettes ? | Pierre |

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

3. **Le cœur de la mission manque.** « Connaître Christ et Le faire
   connaître. » Le **canevas d'études bibliques n'existe nulle part** dans le
   produit — ni entité, ni écran, ni route. Le JTPA non plus. La vision
   décennale non plus. C'est la lacune n°1, et elle est structurante.

4. **Un site ou plusieurs ? Ni l'un ni l'autre exactement :** un produit, un
   dépôt, **deux surfaces** — une vitrine publique optimisée pour le référencement
   et la vitesse, un espace membre riche et authentifié, **une seule source de
   vérité** dessous.

5. **Le risque n°1 n'est pas technique, il est de calendrier.** 158 à 210
   jours-homme pour l'ensemble. À un jour par semaine, cela dépasse la durée
   d'études d'une génération de GBUssiens. La parade est le périmètre et la
   livraison précoce, pas la vitesse de frappe.

---

## Les décisions en attente

| # | Décision | Recommandation |
|---|---|---|
| **D1** | Un site ou plusieurs ? | Un produit, un dépôt, **deux surfaces** |
| **D2** | Pile technique | **TypeScript de bout en bout** — *sauf si votre maîtrise de Python est nettement supérieure* |
| **D3** | Dépôt | **Nouveau dépôt `gbum-hub`** ; l'actuel reste en production, puis devient archive de référence |
| **D4** | Périmètre du lot 1 | Vitrine + socle + **canevas** + pilotage |
| **D5** | Bascule | **Progressive**, ancien système en lecture seule 90 jours |
| **D6** | Langues v1 | **Français seul**, mais architecture i18n + **RTL posée dès la première ligne** |
| **D7** | Hébergement | **Plateforme gérée** plutôt que le VPS auto-administré |
| **D8** | Le JTPA dans le hub ? | **Oui, mais cloisonné et chiffré à part** — arbitrage du SN |

Détail et argumentation : [cahier des charges §12](01-CAHIER-DES-CHARGES.md#12-décisions-à-arbitrer).

---

## Prochaines étapes

1. **Arbitrer D1 à D8** (Pierre pour la technique, le Secrétariat National pour
   le périmètre et le JTPA).
2. **Faire valider le cahier des charges par le Secrétariat National** — en
   particulier les objectifs métier (§2.1) et le chapitre sur la protection des
   personnes (§7).
3. **Réclamer au SN** : le canevas de l'année en cours, les textes officiels de
   la vision et du thème, de vraies photos. *Sans le canevas réel, l'écran le
   plus important du hub sera maquetté à l'aveugle.*
4. **Lancer les maquettes** avec le [prompt maître](05-PROMPT-CLAUDE-DESIGN.md#2--prompt-maître--à-copier-tel-quel).
5. **Désigner** un responsable produit au SN et cinq testeurs GBUssiens dans
   cinq villes différentes.
6. **Démarrer le lot 0** (fondations) une fois D2 tranchée.

---

*Documents vivants. Toute modification passe par une pull request et est datée.*
*Rédigés le 7 septembre 2026.*
