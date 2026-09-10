import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { LANGUES, type Langue } from "./routage";

/**
 * Le premier geste de chaque page : fixer la langue de la requête, pour que
 * la page puisse être rendue à l'avance plutôt qu'à chaque visite.
 *
 * `setRequestLocale` est marquée dépréciée au profit de `next/root-params`,
 * qui demande aujourd'hui un drapeau expérimental de Next. On garde donc l'API
 * stable et documentée, en connaissance de cause — et à UN SEUL endroit, pour
 * que la migration soit une ligne à changer le jour où `next/root-params`
 * sortira de l'expérimental.
 */
export async function preparerLangue(
  params: Promise<{ langue: string }>,
): Promise<Langue> {
  const { langue } = await params;
  if (!hasLocale(LANGUES, langue)) notFound();
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  setRequestLocale(langue);
  return langue;
}
