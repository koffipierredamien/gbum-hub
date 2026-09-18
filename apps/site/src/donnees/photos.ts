import { z } from "zod";
import listeBrute from "../../public/photos/photos.json";

/**
 * Les photographies du site, déclarées dans `public/photos/photos.json`.
 *
 * Il n'y a pas encore d'écran de téléversement : on dépose les fichiers dans le
 * dossier et on les décrit à côté. C'est suffisant pour quatre à six images
 * choisies, et cela évite de construire un écran avant de savoir ce qu'il doit
 * faire.
 *
 * **La description est obligatoire.** Une image sans description n'est pas
 * affichée du tout — plutôt que d'être affichée muette. C'est le critère
 * WCAG 1.1.1 : une photographie que personne ne décrit n'existe pas pour qui
 * ne la voit pas.
 */
const Photo = z.object({
  fichier: z
    .string()
    .min(1)
    // Les mêmes caractères que le magasin de fichiers accepte : un nom avec
    // accent ou espace se comporte différemment selon le serveur qui le sert.
    .regex(/^[A-Za-z0-9._-]+$/, "nom de fichier : lettres, chiffres, . _ - seulement"),
  description: z.string().trim().min(3),
  usage: z.literal("accueil"),
});

export interface PhotoPubliee {
  readonly chemin: string;
  readonly description: string;
}

function lire(): readonly PhotoPubliee[] {
  const analyse = z.array(Photo).safeParse(listeBrute);
  if (!analyse.success) {
    // R2 — on ne masque pas : on dit ce qui est refusé, et le site continue
    // avec son ouverture sans photographie.
    console.error("photos.json est mal rempli", { detail: analyse.error.issues });
    return [];
  }
  return analyse.data.map((photo) => ({
    chemin: `/photos/${photo.fichier}`,
    description: photo.description,
  }));
}

const PHOTOS = lire();

export function photosDAccueil(): readonly PhotoPubliee[] {
  return PHOTOS.filter((photo) => photo.chemin !== "");
}
