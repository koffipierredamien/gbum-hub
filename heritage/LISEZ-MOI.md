# Héritage de `koffipierredamien/gbu-connect`

**28 septembre 2026.** Ce dépôt GitHub a été supprimé par son propriétaire, la
version de référence du hub privé étant désormais `nikiemaesa/gbu-connect`.

Cette branche conserve ce qui n'existait **que** là, et qui n'a pas d'autre
copie connue :

| Dossier                          | Ce que c'est                                                                                                                                                                                               |
| -------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `hub-lot0/`                      | Le lot 0 de la réécriture TypeScript : la politique d'accès `peut(acteur, action, ressource, ctx)` — seul point de décision —, l'organisation arborescente, leurs tests, la configuration stricte et la CI |
| `maquettes/`                     | Les sept maquettes du Hub privé                                                                                                                                                                            |
| `02-ARCHITECTURE-gbu-connect.md` | La version des ADR telle qu'elle vivait dans ce dépôt (ADR-002 pile technique, ADR-009 dépôt, ADR-010 monolithe modulaire)                                                                                 |

Les six documents de conception (audit, cahier des charges, architecture,
conventions, feuille de route, prompt de design) étaient déjà dans `docs/` et
`docs/archives/` de ce dépôt-ci : ils ne sont pas dupliqués ici.

**Cette branche n'est pas destinée à être fusionnée.** C'est un coffre. Si
`nikiemaesa/gbu-connect` contient déjà tout cela, elle peut être supprimée
sans regret :

```bash
git push origin --delete sauvegarde/hub-lot0
```
