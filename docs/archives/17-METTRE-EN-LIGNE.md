# Mettre le site en ligne

**18 septembre 2026.** Tout ce qui pouvait être préparé sans décision d'achat
l'est. Ce document dit ce qu'il reste à faire, dans l'ordre, et ce que cela
coûte.

---

## 1. Ce qu'il faut, et ce que ça coûte

| | Quoi | Ordre de prix | Pourquoi |
|---|---|---|---|
| **Une machine** | Un serveur loué, 2 Go de mémoire au moins | **4 à 6 € par mois** | Elle fait tourner le site et la base |
| **Un nom** | Un nom de domaine | **10 à 15 € par an** | `gbum.ma`, ou ce que le mouvement choisira |
| **Le reste** | — | **0 €** | Le chiffrement est gratuit et automatique (Let's Encrypt) |

**On ne prend de l'hébergeur que deux choses : une machine et PostgreSQL.**
C'est la règle S6 d'[ADR-012](02-ARCHITECTURE.md), posée le premier jour. Ni
son système de comptes, ni sa base maison, ni ses fonctions propres — sinon
déménager coûterait une réécriture, et le mouvement serait captif d'une
facture qu'il ne maîtrise pas.

**Deux Go de mémoire, et non un**, parce que la construction du site en demande
davantage que son fonctionnement. Si le mouvement ne veut payer qu'un serveur
minimal, la construction se fait sur votre machine et l'image est envoyée
toute faite — c'est un peu plus long à expliquer, et je le ferai ce jour-là.

---

## 2. Ce qui tourne, une fois en ligne

```
    Internet
       │  https://gbum.ma
       ▼
   ┌─────────┐   Caddy : le certificat, renouvelé tout seul
   │  Caddy  │
   └────┬────┘
        │  http://127.0.0.1:3000   (jamais exposé à l'extérieur)
   ┌────▼────┐   ┌──────────────┐   ┌────────────┐
   │  site   │──▶│     base     │◀──│ migrations │ (une fois, puis s'arrête)
   └─────────┘   │ PostgreSQL16 │   └────────────┘
                 └──────┬───────┘
                        │  une fois par nuit
                 ┌──────▼───────┐
                 │ sauvegardes  │  copiées, puis RELUES
                 └──────────────┘
```

Trois points méritent d'être compris plutôt que recopiés :

**Le site n'est pas exposé à internet.** Il n'écoute que sur `127.0.0.1` —
c'est-à-dire sur la machine elle-même. Seul Caddy parle au monde extérieur, et
il ne parle qu'en `https`. Sans cela, les mots de passe du Secrétariat National
traverseraient le réseau en clair.

**Les migrations démarrent avant le site, et le site ne démarre que si elles
ont réussi.** Un site qui tourne sur une base dont la structure est en retard
donne des pannes incompréhensibles, une page sur trois. Mieux vaut ne pas
démarrer.

**La sauvegarde se relit elle-même.** Voir le §5 : c'est le seul point où je
me méfie autant de mon propre travail.

---

## 3. La marche à suivre, sur le serveur

Une fois la machine louée et le nom de domaine pointé vers elle :

```bash
# 1. Docker, une fois pour toutes
curl -fsSL https://get.docker.com | sh

# 2. Le projet
git clone https://github.com/koffipierredamien/gbum-hub.git
cd gbum-hub

# 3. La configuration du serveur — voir .env.production.exemple
cp .env.production.exemple .env
nano .env        # le mot de passe de la base, tiré au sort, et le domaine

# 4. Construire et démarrer
docker compose -f docker-compose.production.yml up -d --build

# 5. Le premier compte
docker compose -f docker-compose.production.yml run --rm \
  -e COMPTE_COURRIEL=vous@exemple.org \
  -e COMPTE_NOM="Votre nom" \
  -e COMPTE_MOT_DE_PASSE="douze caracteres au moins" \
  -e COMPTE_ROLE=technique \
  migrations pnpm compte:creer
```

Puis le serveur web public, avec son certificat automatique :

```bash
# 6. Caddy
apt install -y caddy
cat > /etc/caddy/Caddyfile <<'FIN'
gbum.ma {
  encode gzip
  reverse_proxy 127.0.0.1:3000
}
FIN
systemctl reload caddy
```

C'est tout. Caddy demande le certificat, l'installe et le renouvellera seul,
à condition que les ports 80 et 443 soient ouverts et que le domaine pointe
bien vers la machine.

---

## 4. Ce que j'ai répété, et ce que je n'ai pas pu répéter

Je ne vous dis jamais qu'une chose marche sans l'avoir jouée. Voici la limite
exacte.

| | Répété ici | Résultat |
|---|---|---|
| Le dossier autonome que l'image embarque | oui | Le serveur démarre en 314 ms, **avec pour seul environnement les variables du §3** |
| Les styles et les scripts servis par ce dossier | oui | Feuille de style 23 ko, scripts servis — c'est le piège classique de ce mode de construction, et il est écarté |
| Le parcours d'administration complet | oui | **26 vérifications sur 26**, dans un vrai navigateur, contre le paquet de production |
| Les 18 pages publiques | oui | Aucun manquement d'accessibilité |
| La sauvegarde, sa relecture, sa restauration | oui | Restaurée dans une base neuve : les comptes sont revenus, à l'identique |
| **La construction de l'image Docker** | **non** | Le réseau de mon atelier bloque le registre d'images public. C'est la **première chose à faire sur le serveur**, et la seule étape dont je ne peux pas garantir qu'elle passe du premier coup |

Si l'étape 4 échoue, envoyez-moi le message tel quel, comme vous l'avez fait
pour Windows : c'est exactement ce qu'il me faut.

---

## 5. Les sauvegardes

Une sauvegarde qu'on n'a jamais restaurée n'est pas une sauvegarde : c'est un
fichier. Le script fait donc deux choses — il copie, **puis il relit sa copie**
en la restaurant dans une base jetable et en comparant le nombre de lignes. Si
les comptes ne tombent pas juste, il échoue bruyamment.

Une ligne à ajouter dans le planificateur du serveur (`crontab -e`), pour une
copie chaque nuit à 3 h, gardée trente jours :

```
0 3 * * * cd /root/gbum-hub && docker compose -f docker-compose.production.yml exec -T base sh /outils/sauvegarde.sh "$DATABASE_URL" /sauvegardes 30 >> /var/log/gbum-sauvegarde.log 2>&1
```

Le script tourne **dans le conteneur de la base** : le serveur n'a donc aucun
outil PostgreSQL à installer, et la base n'a pas à s'ouvrir vers l'extérieur
pour être sauvegardée.

**Pour restaurer** — le jour où cela arrivera, on ne veut pas chercher :

```bash
gunzip -c .sauvegardes/gbum-AAAA-MM-JJ...sql.gz | \
  docker compose -f docker-compose.production.yml exec -T base \
  psql "$DATABASE_URL" -v ON_ERROR_STOP=1
```

Puis — et c'est le piège vérifié le 14 septembre — **publiez n'importe quelle
section depuis l'administration**, ou reconstruisez : les pages déjà fabriquées
ne savent pas que la base a changé sous elles.

---

## 6. Après la mise en ligne

1. **Vérifiez le site en vrai** : `https://votre-domaine/fr`, puis
   `/admin/connexion`. Le cadenas doit être fermé.
2. **Créez un compte pour chaque personne du Secrétariat National**, depuis
   l'écran Comptes. Rôle « Secrétariat National » — le rôle technique ne sert
   qu'à gérer les comptes.
3. **Remplissez**, en suivant [`16-REMPLIR-LE-SITE.md`](16-REMPLIR-LE-SITE.md).
4. **Montrez-le.** Les encadrés d'attente ne sont pas une faiblesse à cacher :
   ce sont eux qui feront repartir la réunion avec les sept informations que le
   mouvement seul détient.

---

## 7. Ce que la mise en ligne ne résout pas

Elle ne fait apparaître **ni les photographies** (l'écran de téléversement
n'existe pas : chantier C1), **ni l'alerte au bureau de ville** quand un
étudiant écrit — il y faut une adresse d'expédition que le mouvement n'a pas
encore fournie.

Le message, lui, est bien enregistré et visible dans l'administration. Un
bureau qui ne consulte pas l'écran ne saura donc pas qu'on lui a écrit : **à
dire clairement aux responsables** le jour de la démonstration, plutôt que de
le découvrir sur un message resté sans réponse.
