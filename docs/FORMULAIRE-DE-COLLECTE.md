# Le formulaire pour les responsables

_Un lien secret, pas un compte. Ils répondent depuis leur téléphone, en dix
minutes, et vous relisez avant que rien ne paraisse._

## 1. Choisir une clé

Elle protège le lien. Tirez-la au sort, longue, et gardez-la :

```powershell
# une clé au hasard
-join ((48..57) + (97..122) | Get-Random -Count 32 | % {[char]$_})
```

- **En local** : ajoutez-la dans `.env` → `CLE_COLLECTE=…`
- **Sur Vercel** : Settings → Environment Variables → `CLE_COLLECTE` → Redeploy

Tant qu'elle est vide, **le formulaire est fermé**. Une garde qui s'annule
quand on oublie de la configurer ne garde rien.

## 2. Envoyer le lien

```
https://votre-site.vercel.app/collecte?cle=LA-CLÉ
```

Message à copier :

> Bonjour. Le site du GBUM est en construction : les pages existent, et
> certaines attendent des informations que vous seuls avez. Ce lien ouvre un
> formulaire — répondez à ce que vous savez, laissez le reste vide, rien ne
> sera inventé à la place. Vous pouvez revenir le compléter plus tard avec le
> même lien.

## 3. Lire les réponses

Administration → **Réponses reçues**. Groupées par question, la plus récente
d'abord, avec qui a répondu et quand.

**Rien n'est recopié tout seul.** Vous relisez, vous collez dans « Les pages »,
vous publiez. Le chemin brouillon → publié reste le seul par lequel un texte
devient public.

## Ce que le formulaire demande

Les sept informations de la note au Secrétariat National, plus les deux qui
bloquent une fonction : le thème, les villes, les chiffres, l'année de
fondation et son récit, le canevas, le prochain temps fort, les moyens de don,
une adresse d'expédition — et une case pour dire autre chose.

## Si la clé fuite

Changez-la : ancienne clé, ancien lien mort. Les réponses déjà reçues restent.
