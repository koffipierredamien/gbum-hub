#!/usr/bin/env bash
# Répétition de déménagement — ADR-012, §2.5 du plan des fondations.
#
# Une promesse de portabilité qu'on ne teste jamais est fausse au bout de trois
# mois. Ce script fait le déménagement pour de bon, sur une base vide qui tient
# lieu d'« ailleurs » : il rejoue les migrations, restaure la sauvegarde, et
# compare. Si quelque chose s'est glissé dans la base à la main, la comparaison
# des structures le dit.
#
#   usage : outils/repetition-demenagement.sh <url-source> <url-destination>
#
# La destination DOIT être vide. Elle est écrasée.

set -euo pipefail

SOURCE="${1:?url de la base actuelle}"
DESTINATION="${2:?url de la base de destination, qui doit être vide}"
TRAVAIL="$(mktemp -d)"
trap 'rm -rf "$TRAVAIL"' EXIT

# --- Le client doit parler la même version que le serveur -------------------
#
# pg_dump écrit un fichier POUR LA VERSION QU'IL CONNAÎT. Un pg_dump 17 y met
# « SET transaction_timeout = 0 » ; PostgreSQL 16 ne connaît pas ce paramètre,
# et la restauration s'arrête sur cette ligne. La règle est celle de la
# documentation PostgreSQL : on restaure avec un client de la version du
# serveur, jamais plus récent.
#
# Trouvé le 10 novembre 2026 : l'image des serveurs de GitHub est passée au
# client 17 pendant que la base de la répétition restait en 16. La répétition
# échouait depuis le 1er octobre et personne ne le voyait — une vérification
# rouge qu'on ne regarde plus ne vérifie rien.
#
# `outils/sauvegarde.sh` n'a pas ce problème : il tourne DANS le conteneur
# PostgreSQL, donc avec le client de ce serveur-là, par construction.
majeure_du_serveur() {
  psql --quiet --no-align --tuples-only "$1" -c 'show server_version_num' \
    | awk '{ print int($1 / 10000) }'
}
majeure_du_client() {
  pg_dump --version | awk '{ print $3 }' | cut -d. -f1
}

SERVEUR_SOURCE="$(majeure_du_serveur "$SOURCE")"
SERVEUR_DESTINATION="$(majeure_du_serveur "$DESTINATION")"
if [ "$SERVEUR_SOURCE" != "$SERVEUR_DESTINATION" ]; then
  echo "Le serveur de départ est en version $SERVEUR_SOURCE et celui d'arrivée en" >&2
  echo "version $SERVEUR_DESTINATION. Cette répétition compare deux structures :" >&2
  echo "entre deux versions majeures, elles diffèrent légitimement et la" >&2
  echo "comparaison ne voudrait plus rien dire. Déménagez d'abord, changez de" >&2
  echo "version ensuite." >&2
  exit 2
fi

CLIENT="$(majeure_du_client)"
if [ "$CLIENT" != "$SERVEUR_SOURCE" ]; then
  # Plusieurs versions cohabitent souvent sur une même machine, rangées par
  # version. On prend celle qui convient avant de se plaindre.
  for DOSSIER_CLIENT in \
    "/usr/lib/postgresql/$SERVEUR_SOURCE/bin" \
    "/opt/homebrew/opt/postgresql@$SERVEUR_SOURCE/bin" \
    "/usr/local/opt/postgresql@$SERVEUR_SOURCE/bin"; do
    if [ -x "$DOSSIER_CLIENT/pg_dump" ]; then
      PATH="$DOSSIER_CLIENT:$PATH"
      export PATH
      break
    fi
  done
  CLIENT="$(majeure_du_client)"
fi

if [ "$CLIENT" != "$SERVEUR_SOURCE" ]; then
  echo "Les outils PostgreSQL installés sont en version $CLIENT, les bases en" >&2
  echo "version $SERVEUR_SOURCE. Il faut la même version majeure des deux côtés :" >&2
  echo "un fichier écrit par un pg_dump d'une autre version ne se restaure pas de" >&2
  echo "façon fiable, et la sauvegarde serait illisible le jour où l'on en a" >&2
  echo "besoin. Installez le client $SERVEUR_SOURCE :" >&2
  echo "  Debian/Ubuntu   sudo apt-get install -y postgresql-client-$SERVEUR_SOURCE" >&2
  echo "  macOS           brew install postgresql@$SERVEUR_SOURCE" >&2
  exit 2
fi

echo "0/5  client et serveurs PostgreSQL en version $SERVEUR_SOURCE"

echo "1/5  sauvegarde de la base actuelle"
# On exclut le schéma « drizzle » : il contient le registre des migrations
# déjà appliquées, et ce registre appartient à la base d'ARRIVÉE, qui vient de
# le remplir elle-même à l'étape 2. Le restaurer par-dessus fait échouer la
# restauration sur une clé en double — trouvé à la première répétition, le
# 10 septembre 2026, ce qui est précisément à quoi sert cette répétition.
pg_dump --data-only --no-owner --no-privileges --exclude-schema=drizzle "$SOURCE" \
  > "$TRAVAIL/donnees.sql"
pg_dump --schema-only --no-owner --no-privileges "$SOURCE" > "$TRAVAIL/structure-source.sql"

echo "2/5  reconstruction de la structure ailleurs, à partir des seules migrations"
DATABASE_URL="$DESTINATION" pnpm --filter @gbum/db migrer >/dev/null

echo "3/5  restauration des données"
psql --quiet --set ON_ERROR_STOP=1 "$DESTINATION" < "$TRAVAIL/donnees.sql" >/dev/null

echo "4/5  comparaison des structures"
pg_dump --schema-only --no-owner --no-privileges "$DESTINATION" > "$TRAVAIL/structure-arrivee.sql"
# On compare les définitions de tables, pas le bruit (commentaires d'en-tête,
# horodatages du dump). Une différence ici signifie qu'une base a été modifiée
# à la main quelque part — c'est exactement ce que S4 interdit, et c'est ce
# jour-là qu'il faut l'apprendre, pas le jour du vrai déménagement.
# On retire aussi les lignes \restrict / \unrestrict : pg_dump y met un jeton
# aléatoire à chaque exécution, différent d'un dump à l'autre par construction.
# Les comparer reviendrait à comparer deux nombres tirés au sort.
normaliser() {
  grep -v '^--' "$1" | grep -v '^$' | grep -v '^\\\(un\)\?restrict ' | sort
}
if ! diff <(normaliser "$TRAVAIL/structure-source.sql") \
          <(normaliser "$TRAVAIL/structure-arrivee.sql") > "$TRAVAIL/ecart.txt"; then
  echo "ÉCART DE STRUCTURE — la base d'arrivée ne correspond pas aux migrations :"
  cat "$TRAVAIL/ecart.txt"
  exit 1
fi

echo "5/5  comparaison des contenus"
# On compte TOUTES les tables du schéma public, pas une liste écrite à la main :
# une liste écrite à la main ne grandit pas avec le schéma, et le jour où l'on
# ajoute une table, la comparaison cesse de la voir sans rien dire.
compter() {
  psql --quiet --no-align --tuples-only "$1" -c "
    select string_agg(ligne, E'\n' order by ligne) from (
      select format('%s=%s', c.relname,
                    (xpath('/row/c/text()',
                           query_to_xml(format('select count(*) as c from public.%I', c.relname),
                                        false, true, '')))[1]::text) as ligne
      from pg_class c join pg_namespace n on n.oid = c.relnamespace
      where n.nspname = 'public' and c.relkind = 'r'
    ) t"
}
if ! diff <(compter "$SOURCE") <(compter "$DESTINATION"); then
  echo "ÉCART DE CONTENU — la restauration a perdu des lignes."
  exit 1
fi

echo
echo "Déménagement réussi : structure identique, contenu identique."
echo "Rien d'autre à changer qu'une variable d'environnement."
