import { getTranslations } from "next-intl/server";
import { Bande } from "../composants/bande";
import { GaleriePaginee } from "../composants/galerie-paginee";
import { photosDeGalerie } from "../donnees/photos";

/**
 * La grille de photographies de l'accueil.
 *
 * Le défilé de l'ouverture RECADRE ses images pour remplir la bande : il ne
 * convient qu'aux plans serrés. Une photographie de groupe y perdrait ses deux
 * rangs du haut et ses deux colonnes des côtés. La grille, elle, garde les
 * proportions — et la photographie marquée `pleineLargeur` occupe toute la
 * largeur, parce que deux cents visages dans une vignette ne se reconnaissent
 * pas.
 *
 * Elle est PAGINÉE : six images à la fois. On peut en déposer trente dans
 * `photos.json` sans que la page d'accueil devienne interminable.
 *
 * La bande disparaît d'elle-même tant qu'aucune photographie n'est classée en
 * `galerie` : un titre au-dessus du vide vaut moins que rien.
 */
export async function Galerie() {
  const t = await getTranslations("accueil");
  const photos = photosDeGalerie();
  if (photos.length === 0) return null;

  return (
    <Bande surface="sable">
      <p className="etiquette accent">{t("galerieEyebrow")}</p>
      <h2 className="titre">{t("galerieTitre")}</h2>
      <GaleriePaginee photos={photos} />
    </Bande>
  );
}
