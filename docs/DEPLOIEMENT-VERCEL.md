# Mettre le site en ligne sur Vercel

_Gratuit, sans carte bancaire. Comptez vingt minutes la première fois._

## 1. Brancher le projet (5 min)

1. **vercel.com** → **Add New…** → **Project**
2. Importez le dépôt **`gbum-hub`**
3. **Root Directory** → cliquez **Edit** → choisissez **`apps/site`**
   _C'est l'étape qu'on rate. Sans elle, Vercel cherche le site à la racine et
   la construction échoue._
4. **Environment Variables** → ajoutez :

   | Name | Value |
   |---|---|
   | `DATABASE_URL` | la chaîne Neon, celle qui contient **`-pooler`** |

   Cochez les trois cases : Production, Preview, Development.
5. **Deploy**

Neon donne deux chaînes. Celle avec `-pooler` supporte les nombreuses
connexions courtes d'un hébergement sans serveur : c'est celle du site.

## 2. Monter la base (5 min, depuis votre machine)

Le site est en ligne, mais sa base est vide. Dans PowerShell, **dans le dossier
du projet** :

```powershell
$env:DATABASE_URL="postgres://…votre chaîne Neon…"

pnpm base:migrer        # crée les six tables
pnpm villes:importer    # Casablanca et ses neuf cellules

$env:COMPTE_COURRIEL="vous@exemple.org"
$env:COMPTE_NOM="Votre nom"
$env:COMPTE_MOT_DE_PASSE="douze caracteres au moins"
$env:COMPTE_ROLE="technique"
pnpm compte:creer       # votre compte d'administration
```

Puis **revenez à votre base locale**, sinon vos prochaines commandes
travailleront en ligne sans que vous y pensiez :

```powershell
Remove-Item Env:DATABASE_URL
Remove-Item Env:COMPTE_MOT_DE_PASSE
```

## 3. Rafraîchir le site (1 min)

Les pages ont été fabriquées avant que la base contienne quoi que ce soit.
Sur Vercel : **Deployments** → le dernier → **⋯** → **Redeploy**.

Ensuite, plus besoin : publier une section depuis l'administration rafraîchit
les pages concernées toute seule.

## 4. Vérifier

| À ouvrir | Ce qu'on doit voir |
|---|---|
| `votre-site.vercel.app/fr` | Les photos défilent, Casablanca apparaît |
| `votre-site.vercel.app/fr/ou-nous-sommes` | Casablanca et ses neuf cellules |
| `votre-site.vercel.app/admin` | L'écran de connexion, cadenas fermé |

## La règle de sécurité

La chaîne Neon est **un mot de passe**. Elle vit dans Vercel et dans votre
terminal, jamais dans un fichier du dépôt, jamais dans un message. Si elle
fuite, Neon permet de la remplacer en un clic (Reset password) — il faut alors
la recoller dans Vercel.

## Si la construction échoue

Copiez le message d'erreur de Vercel tel quel et envoyez-le-moi. Les deux
causes probables sont le **Root Directory** oublié à l'étape 1.3, et une
chaîne `DATABASE_URL` incomplète (il manque souvent la fin, `?sslmode=require`).
