# L'image de production du hub du GBUM.
#
# Deux étages, et la raison est économique autant que technique :
#
#   « constructeur » porte l'atelier complet — pnpm, TypeScript, les sources.
#   Il sert à construire le site, et à REJOUER LES MIGRATIONS le jour du
#   déploiement (c'est la cible utilisée par le service « migrations »).
#
#   « execution » ne porte que le serveur et les fichiers qu'il utilise
#   vraiment. Ni pnpm, ni compilateur, ni sources : moins de choses installées,
#   c'est moins de surface à attaquer et une image qui se télécharge vite sur
#   une machine modeste.
#
# S6 (ADR-012) : on ne prend de la plateforme que des machines et PostgreSQL.
# Cette image tourne à l'identique sur un serveur loué à cinq euros, sur une
# machine du mouvement, ou chez un hébergeur qui la remplacerait un jour.

FROM node:22-alpine AS constructeur
WORKDIR /atelier

RUN corepack enable

# Les manifestes d'abord : tant qu'ils ne changent pas, Docker réutilise
# l'installation des dépendances au lieu de la refaire. C'est la différence
# entre une construction de trois minutes et une de trente secondes.
COPY pnpm-workspace.yaml pnpm-lock.yaml package.json ./
COPY apps/site/package.json apps/site/
COPY packages/core/package.json packages/core/
COPY packages/db/package.json packages/db/
COPY packages/identite/package.json packages/identite/
COPY packages/stockage/package.json packages/stockage/
COPY outils/administration/package.json outils/administration/
COPY outils/eslint-regles/package.json outils/eslint-regles/
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm --filter @gbum/site build

FROM node:22-alpine AS execution
WORKDIR /site
ENV NODE_ENV=production

# Le serveur ne tourne pas en root. Si une faille permettait d'exécuter
# quelque chose, elle l'exécuterait sans les droits de la machine.
RUN addgroup -g 1001 gbum && adduser -u 1001 -G gbum -D gbum

# Le dossier « standalone » contient le serveur et ses dépendances tracées.
# Les deux copies suivantes ne sont PAS facultatives : Next laisse les
# ressources statiques et le dossier public en dehors du tracé, et un site
# sans elles se charge sans aucun style — panne classique, et déroutante.
COPY --from=constructeur --chown=gbum:gbum /atelier/apps/site/.next/standalone ./
COPY --from=constructeur --chown=gbum:gbum /atelier/apps/site/.next/static ./apps/site/.next/static
COPY --from=constructeur --chown=gbum:gbum /atelier/apps/site/public ./apps/site/public

USER gbum
EXPOSE 3000
ENV PORT=3000 HOSTNAME=0.0.0.0

CMD ["node", "apps/site/server.js"]
