import { getTranslations } from "next-intl/server";
import { preparerLangue } from "../../../i18n/langue";
import { Bande } from "../../../composants/bande";
import { BlocTheme } from "../../../composants/bloc-theme";
import { DefileVilles } from "../../../composants/defile-villes";
import { lireVillesPubliees, villesAAfficher } from "../../../donnees/villes";
import { Galerie } from "../../../sections/galerie";
import { horlogeSysteme } from "@gbum/core";
import {
  Accroche,
  AppelARejoindre,
  Ouverture,
  Pratiques,
} from "../../../sections/accueil";

export async function generateMetadata() {
  const t = await getTranslations("accueil");
  return { title: t("titre") };
}

/**
 * L'accueil.
 *
 * L'ordre des bandes tient D1 : DEUX BANDES SOMBRES NE SE SUIVENT JAMAIS, et
 * il faut au moins une bande claire entre elles. Le défilé des villes ne
 * compte pas — c'est un filet, pas une bande ; l'ouverture non plus — c'est
 * une photographie.
 *
 *   photo · crème · [filet] · sable · crème · sable · crème · [pied]
 */
export default async function Accueil({
  params,
}: {
  params: Promise<{ langue: string }>;
}) {
  await preparerLangue(params);
  const c = await getTranslations("commun");

  // La liste du mouvement, complétée par ce que la base apporte en plus.
  const lecture = await lireVillesPubliees(horlogeSysteme.maintenant());
  const villes = villesAAfficher(
    lecture.ok ? lecture.valeur : [],
    c.raw("villes") as readonly string[],
  );

  return (
    <>
      <Ouverture />
      <Accroche />
      <DefileVilles villes={villes} />
      <Bande surface="sable">
        <BlocTheme />
      </Bande>
      <Pratiques />
      <Galerie />
      {/*
        Cinq sections ont été retirées le 9 novembre 2026, pour la mobilisation
        en ville : les chiffres du mouvement, la vie du mouvement, les
        témoignages, l'agenda et le prochain temps fort n'avaient AUCUN
        contenu. Cinq encadrés « en attente » à la suite donnent d'un mouvement
        vivant l'image d'un mouvement vide — c'est l'inverse de ce qu'un
        étudiant invité doit voir. Leur mise en page est dans l'historique du
        dépôt, le jour où le contenu arrivera.
      */}
      <AppelARejoindre />
    </>
  );
}
