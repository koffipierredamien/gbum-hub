#!/usr/bin/env bash
# L'installation du navigateur de vérification, qui ne tombe pas avec le réseau.
#
# POURQUOI CE SCRIPT EXISTE. Le 11 novembre 2026, trois contrôles sur six ont
# échoué deux fois de suite sur « main », chacun après dix minutes d'attente :
#
#   Temporary failure resolving 'archive.ubuntu.com'
#   Temporary failure resolving 'security.ubuntu.com'
#   E: Unable to fetch some archives
#   Failed to install browsers
#
# Rien à voir avec le site : « playwright install --with-deps » installe des
# paquets système (des polices, surtout) par apt, et les miroirs Ubuntu
# n'étaient pas joignables depuis les serveurs de GitHub. Trois contrôles de
# qualité tombaient donc pour une panne qui n'était pas la nôtre, et le
# mouvement se retrouvait devant une chaîne rouge sans défaut à corriger.
#
# CE QU'IL FAIT. Il réessaie trois fois, puis se rabat sur l'installation du
# seul navigateur, sans paquets système : l'image des serveurs de GitHub porte
# déjà les bibliothèques dont Chromium a besoin, et les polices manquantes
# changent l'aspect d'une capture, pas le résultat d'un contrôle.
#
# CE QU'IL NE FAIT PAS. Il ne masque jamais un échec : si même le navigateur
# seul ne s'installe pas, il sort en erreur. Et s'il s'installe mais refuse de
# démarrer, c'est l'étape suivante qui le dira — aucun contrôle n'est sauté.

set -euo pipefail

essais=3
attente=10

for essai in $(seq 1 "$essais"); do
  if pnpm exec playwright install --with-deps chromium; then
    exit 0
  fi
  if [ "$essai" -lt "$essais" ]; then
    echo "Installation du navigateur : échec ${essai}/${essais}, nouvelle tentative dans ${attente} s." >&2
    sleep "$attente"
    attente=$((attente * 2))
  fi
done

echo "Les paquets système restent injoignables après ${essais} tentatives." >&2
echo "On installe le navigateur seul : les contrôles tiennent, seules les" >&2
echo "polices système manquent." >&2
pnpm exec playwright install chromium
