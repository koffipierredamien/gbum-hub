# Le contrat entre les deux hubs — version 1

Ce dossier est la forme neutre du contrat décidé par ADR-014
(`docs/02-ARCHITECTURE.md`). Il est lu par le site public (TypeScript) **et**
copié tel quel dans le hub privé (Python).

| Fichier                    | Sens             | Ce qu'il porte                                     |
| -------------------------- | ---------------- | -------------------------------------------------- |
| `publications.schema.json` | hub privé → site | villes, cellules (nom, effectif)                   |
| `demandes.schema.json`     | site → hub privé | « Rejoindre », « Nous écrire »                     |
| `exemples/`                | —                | exemples acceptés et refusés, vecteur de signature |

**La source est `packages/contrat`.** Ne modifiez pas ces fichiers à la main :
changez le schéma zod, puis `pnpm --filter @gbum/contrat generer` et
`pnpm format`. Un test échoue si les deux divergent.

**La signature** : `X-GBUM-Horodatage` (secondes, UTC) et
`X-GBUM-Signature: sha256=<hex>`, HMAC-SHA256 de `horodatage + "." + corps`
avec la clé partagée. Refus au-delà de cinq minutes d'écart. La clé vit dans
l'environnement des deux serveurs, jamais dans un dépôt ; celle de
`exemples/signature.json` ne sert qu'aux tests.

**Changer le contrat** se fait par une version nouvelle (`v2/`), jamais en
modifiant `v1/` une fois les deux hubs en service.
