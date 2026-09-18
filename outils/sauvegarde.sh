#!/bin/sh
#
# La sauvegarde quotidienne, et sa vérification.
#
# Une sauvegarde qu'on n'a jamais restaurée n'est pas une sauvegarde : c'est
# un fichier. Ce script fait donc DEUX choses — il copie, puis il relit ce
# qu'il vient d'écrire en le restaurant dans une base jetable et en comptant
# les lignes. Si la relecture échoue, il se plaint bruyamment plutôt que de
# laisser croire que tout va bien.
#
# Écrit en sh POSIX, et non en bash : il tourne DANS le conteneur PostgreSQL,
# qui n'embarque pas bash. C'est aussi là qu'il doit tourner — le serveur n'a
# alors aucun outil PostgreSQL à installer, et la base n'a pas à s'ouvrir vers
# l'extérieur pour être sauvegardée.
#
# usage : sh outils/sauvegarde.sh <url-de-la-base> <dossier> [jours-a-garder]
set -eu

URL="${1:?adresse de la base attendue}"
DOSSIER="${2:?dossier de destination attendu}"
JOURS="${3:-30}"

mkdir -p "$DOSSIER"
HORODATAGE=$(date -u +%Y-%m-%dT%H%M%SZ)
FICHIER="$DOSSIER/gbum-$HORODATAGE.sql.gz"

# --clean --if-exists : la copie sait se réinstaller par-dessus une base
# existante. Sans ces options, une restauration sur une base non vide échoue
# au pire moment — celui où l'on restaure.
# Sans « set -o pipefail » (absent de sh), un pg_dump en échec laisserait un
# fichier gzip valide et VIDE. On écrit donc d'abord sans compression, on
# vérifie que pg_dump a réussi, puis on comprime.
pg_dump "$URL" --clean --if-exists --no-owner --no-privileges > "$FICHIER.brut"
gzip -9 -c "$FICHIER.brut" > "$FICHIER"
rm -f "$FICHIER.brut"
echo "sauvegarde écrite : $FICHIER ($(du -h "$FICHIER" | cut -f1))"

# --- La relecture ---------------------------------------------------------
TEMOIN="gbum_relecture_$$"
ADMIN="${URL%/*}/postgres"

psql "$ADMIN" -q -c "create database \"$TEMOIN\"" >/dev/null
nettoyer() { psql "$ADMIN" -q -c "drop database if exists \"$TEMOIN\"" >/dev/null 2>&1 || true; }
trap nettoyer EXIT

gunzip -c "$FICHIER" | psql "${URL%/*}/$TEMOIN" -q -v ON_ERROR_STOP=1 >/dev/null

compter() {
  psql "$1" -tA -c "
    select coalesce(sum((xpath('/row/c/text()', x))[1]::text::bigint), 0)
    from (
      select query_to_xml('select count(*) as c from ' || quote_ident(tablename), false, true, '') as x
      from pg_tables where schemaname = 'public'
    ) t"
}

ORIGINE=$(compter "$URL")
COPIE=$(compter "${URL%/*}/$TEMOIN")

if [ "$ORIGINE" != "$COPIE" ]; then
  echo "ÉCHEC : la copie ne contient pas les mêmes lignes ($ORIGINE contre $COPIE)." >&2
  exit 1
fi
echo "relecture vérifiée : $ORIGINE lignes, à l'identique."

# --- L'oubli, volontaire --------------------------------------------------
# Garder toutes les sauvegardes remplit le disque, et un disque plein arrête
# la base : la sauvegarde deviendrait la panne.
find "$DOSSIER" -name 'gbum-*.sql.gz' -type f -mtime "+$JOURS" -print | while read -r vieux; do
  rm -f "$vieux"
done
