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
