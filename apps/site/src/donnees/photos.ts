import { z } from "zod";
import listeBrute from "../../public/photos/photos.json";

/**
 * Les photographies du site, déclarées dans `public/photos/photos.json`.
 *
 * Il n'y a pas encore d'écran de téléversement : on dépose les fichiers dans le
 * dossier et on les décrit à côté. C'est suffisant pour la dizaine d'images
 * d'une campagne, et cela évite de construire un écran avant de savoir ce
 * qu'il doit faire.
 *
 * **La description est obligatoire.** Une image sans description n'est pas
 * affichée du tout — plutôt que d'être affichée muette. C'est le critère
 * WCAG 1.1.1 : une photographie que personne ne décrit n'existe pas pour qui
 * ne la voit pas.
 *
 * Deux usages, parce qu'une photographie ne se regarde pas partout de la même
 * façon :
 *
 *   `accueil` — le défilé de l'ouverture. L'image est RECADRÉE pour remplir la
 *     bande ; une photographie où l'essentiel touche les bords y perd ses
 *     bords. Réservé aux plans serrés.
 *   `galerie` — la grille, plus bas. L'image garde ses proportions. C'est là
 *     que vont les photographies de groupe et les montages, qu'un recadrage
 *     décapiterait.
 */
const Photo = z.object({
  fichier: z
    .string()
    .min(1)
    // Les mêmes caractères que le magasin de fichiers accepte : un nom avec
    // accent ou espace se comporte différemment selon le serveur qui le sert.
    .regex(/^[A-Za-z0-9._-]+$/, "nom de fichier : lettres, chiffres, . _ - seulement"),
  description: z.string().trim().min(3),
  /**
   * L'étiquette posée SUR la photo : « Camp d'Ifrane 2026 », « Sidi Othmane ».
   * Courte, factuelle, jamais un slogan — elle dit où et quand, ce que la
   * description ne peut pas porter seule pour qui voit l'image.
   */
  etiquette: z.string().trim().min(2).max(40).optional(),
  usage: z.enum(["accueil", "galerie"]),
  /**
   * Dans la grille seulement : l'image occupe toute la largeur au lieu d'une
   * case. Pour la photographie de groupe — deux cents visages dans une
   * vignette, personne n'y reconnaît personne.
   */
  pleineLargeur: z.boolean().optional(),
});

export interface PhotoPubliee {
  readonly chemin: string;
  readonly description: string;
  readonly etiquette?: string;
  readonly pleineLargeur?: boolean;
}

interface PhotoClassee extends PhotoPubliee {
  readonly usage: "accueil" | "galerie";
}

function lire(): readonly PhotoClassee[] {
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
    usage: photo.usage,
    ...(photo.etiquette === undefined ? {} : { etiquette: photo.etiquette }),
    ...(photo.pleineLargeur === undefined ? {} : { pleineLargeur: photo.pleineLargeur }),
  }));
}

const PHOTOS = lire();

function pour(usage: "accueil" | "galerie"): readonly PhotoPubliee[] {
  return PHOTOS.filter((photo) => photo.usage === usage);
}

export function photosDAccueil(): readonly PhotoPubliee[] {
  return pour("accueil");
}

export function photosDeGalerie(): readonly PhotoPubliee[] {
  return pour("galerie");
}
