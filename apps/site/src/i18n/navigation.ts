import { createNavigation } from "next-intl/navigation";
import { routage } from "./routage";

/**
 * Les liens du site passent par ici : ils portent la langue courante d'une
 * page à l'autre, sans qu'aucune page ait à y penser.
 */
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routage);
