import { getRequestConfig } from "next-intl/server";
import { hasLocale } from "next-intl";
import { LANGUES, routage } from "./routage";
import fr from "../../messages/fr.json";
import en from "../../messages/en.json";

const MESSAGES = { fr, en } as const;

// `requestLocale` est marquée dépréciée au profit de `next/root-params`, qui
// demande aujourd'hui un drapeau expérimental de Next. On garde donc l'API
// stable et documentée, en connaissance de cause : la migration se fera quand
// `next/root-params` sortira de l'expérimental, et ce commentaire est là pour
// qu'on n'oublie pas qu'elle est due.
// eslint-disable-next-line @typescript-eslint/no-deprecated
export default getRequestConfig(async ({ requestLocale }) => {
  const demandee = await requestLocale;
  const langue = hasLocale(LANGUES, demandee) ? demandee : routage.defaultLocale;

  return {
    locale: langue,
    // Le français est toujours chargé sous l'anglais : c'est le repli.
    messages: { ...MESSAGES.fr, ...MESSAGES[langue] },

    /**
     * Quand une traduction anglaise manque, on affiche le français plutôt
     * qu'une clé technique ou un vide. C'est ce que montre la planche 11 des
     * maquettes — « Anglais absent : le français s'affichera à sa place ».
     *
     * Une clé qui manque DANS LES DEUX langues est une faute de frappe, pas un
     * contenu qui attend : on la rend visible au lieu de la masquer.
     */
    getMessageFallback: ({ key, namespace }) => {
      const chemin = namespace === undefined ? key : `${namespace}.${key}`;
      return `[texte manquant : ${chemin}]`;
    },

    timeZone: "Africa/Casablanca",
  };
});
