# Les livraisons, et ce que chacune enseigne

**14 septembre 2026.** Pierre : « il y a tellement de choses à expliquer que je
risque de stagner dans la compréhension, ce qui m'empêchera de continuer le
développement. Je dois comprendre, mais continuer à livrer. »

C'est le piège classique, et il a un nom dans le métier : **le projet de
compréhension**. On arrête de livrer pour apprendre, l'apprentissage n'a plus
de date de fin, et le projet meurt d'avoir trop bien voulu se faire
comprendre.

## La règle de cadence

**On livre d'abord. La compréhension voyage avec la livraison.**

Concrètement, à chaque chantier :

| | Ce qui est produit | Votre temps |
|---|---|---|
| **Le logiciel** | L'écran ou la fonction, vérifiée, poussée | — |
| **La fiche** | Une page, ici : ce qui est livré, comment l'essayer, **un seul concept**, son compromis, sa preuve | **5 minutes** |

Une fiche par chantier. Un concept par fiche — celui que le chantier **a
réellement utilisé**, pas celui qui vient ensuite dans un plan. Les modules du
[catalogue des concepts](14-CONCEPTS.md) se remplissent alors par en dessous,
comme un sous-produit du travail, et non comme un programme à finir avant de
reprendre.

**Ce qui disparaît :** le cours en six modules à terminer avant de coder. Le
catalogue reste, mais comme **ouvrage de référence** qu'on consulte, pas comme
cursus qui bloque.

---

## L1 — Les comptes *(14 septembre 2026)*

### Ce qui est livré

Un écran **Comptes** dans l'administration :

- **changer son mot de passe** — pour tout le monde, l'ancien étant exigé ;
- **créer un compte** — pour le rôle technique seul ;
- **retirer ou rendre un accès** — pour le rôle technique seul ;
- la liste des comptes, avec leur rôle, leur état et leur dernière venue.

### Pourquoi celui-ci d'abord

Il était le seul chantier qui **bloquait les autres personnes**. Avant lui, un
mot de passe oublié n'avait aucune issue, et donner un accès au Secrétariat
National demandait une ligne de commande sur ma machine. Impossible, donc, de
faire essayer le site à vos responsables.

### À essayer, deux minutes

```powershell
git pull
pnpm construire
pnpm --filter @gbum/site start
```

`http://localhost:3000/admin/comptes` → changez votre mot de passe (celui que
vous aviez collé dans la conversation), puis créez un compte au nom d'un membre
du Secrétariat National.

### Le concept du jour — l'invariant appartient au domaine

> *En anglais : domain invariant.*

**Le concept.** Un **invariant** est une phrase qui doit rester vraie quoi
qu'il arrive. Celui d'aujourd'hui : *il reste toujours au moins un compte
technique actif.* Sans lui, une désactivation de trop ferme la porte de
l'intérieur — plus personne ne peut créer de compte, et le seul recours est une
ligne de commande sur le serveur.

La question intéressante n'est pas *faut-il cette règle* : c'est **où
l'écrire**. Trois emplacements possibles, trois portées :

| Où | Ce que ça protège | Ce que ça laisse passer |
|---|---|---|
| Dans l'écran (cacher le bouton) | L'utilisateur pressé | Tout appel direct, toute action de serveur, tout second écran |
| Dans l'action de serveur | Cet appel-là | Le prochain écran, la prochaine commande, qui refont la vérification à leur façon — ou l'oublient |
| **Dans le domaine** (`packages/core`) | **Toutes les portes, présentes et futures** | Rien — à condition que chaque porte l'appelle |

La règle est donc écrite dans `packages/core/src/acces.ts`, en quatre lignes,
et **l'écran comme l'action l'interrogent**. Elle ne connaît ni la base, ni
React, ni l'écran : on peut la tester en mémoire, en millisecondes, et la
relire sans rien savoir de technique.

```ts
export function retirerLAcces(
  compte: { readonly role: Role; readonly actif: boolean },
  techniquesActifs: number,
): Resultat<void, RefusDeRetrait> {
  const dernierGardien =
    compte.role === "technique" && compte.actif && techniquesActifs <= 1;
  return dernierGardien ? echec("dernier-technique") : reussite(undefined);
}
```

**Le compromis.** La règle vit loin de l'endroit où elle s'applique : pour
comprendre le bouton, il faut ouvrir deux fichiers. C'est le prix de la
portée — et c'est pourquoi on ne met dans le domaine que ce qui doit tenir
**partout**, jamais le confort d'un écran.

**La preuve.** Quatre tests dans `packages/core/src/acces.test.ts`, dont
celui-ci : *refuse de retirer le dernier compte technique actif.* Ils tournent
en millisecondes et bloquent l'envoi du code s'ils échouent.

**Ailleurs.** C'est l'invariant d'agrégat de la conception pilotée par le
domaine (Evans) : la règle vit avec la donnée qu'elle protège, et non dans la
couche qui l'affiche. Le même raisonnement vaut pour « un panier ne peut pas
avoir un total négatif » ou « un virement ne peut pas laisser un solde sous le
découvert autorisé ».

### Un second geste, discret et important

Changer un mot de passe **ferme toutes les sessions du compte** — puis en
rouvre une pour le navigateur qui vient de faire la demande. Retirer un accès
ferme également les sessions de la personne.

Sans cela, quelqu'un qui change son mot de passe *parce qu'il le croit connu*
resterait vulnérable trente jours : les sessions déjà ouvertes continueraient
de fonctionner. C'est la moitié oubliée du geste — et elle est vérifiée par le
parcours au navigateur.

### Ce qui le prouve

Le parcours d'administration compte maintenant **vingt-six vérifications**,
rejouées dans un vrai navigateur contre une vraie base à chaque envoi de code,
dont neuf nouvelles :

```
ok   un mot de passe actuel faux est refusé
ok   un nouveau mot de passe trop court est refusé
ok   deux saisies différentes sont refusées
ok   le changement aboutit, et la session reste ouverte
ok   l'ancien mot de passe ne marche plus
ok   le nouveau mot de passe ouvre la session
ok   le compte créé apparaît dans la liste
ok   l'accès d'un compte se retire
ok   accessibilité de /admin/comptes
```

La dernière n'est pas décorative : le Secrétariat National n'est pas un public
de seconde zone.

### Ce que cette livraison a corrigé au passage

La règle des douze caractères vivait dans l'outil en ligne de commande, donc
hors de portée du site : l'écran aurait pu accepter un mot de passe que la
commande refusait. Elle est désormais dans `@gbum/identite`, avec ses tests, et
les deux chemins l'interrogent.

Elle n'impose **ni majuscule, ni chiffre, ni symbole** — et c'est une décision
mesurée, pas un relâchement : ces règles de composition produisent
« Rabat2026! » sur toutes les machines du mouvement et poussent à écrire le mot
de passe sur un papier. C'est la position du NIST (SP 800-63B) et de l'OWASP
depuis 2017 : exiger de la longueur, laisser tomber le reste.
