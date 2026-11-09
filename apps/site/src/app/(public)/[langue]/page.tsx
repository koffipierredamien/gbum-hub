import { getTranslations } from "next-intl/server";
import { preparerLangue } from "../../../i18n/langue";
import { Bande } from "../../../composants/bande";
import { BlocTheme } from "../../../composants/bloc-theme";
import { DefileVilles } from "../../../composants/defile-villes";
import { lireVillesPubliees } from "../../../donnees/villes";
import { horlogeSysteme } from "@gbum/core";
// Chiffres, VieDuMouvement, Voix, CeQuiVient et TempsFort existent toujours
// dans « sections/accueil » : ils ne sont pas importés tant qu'ils n'ont rien
// à montrer. Les réimporter suffit à les remettre.
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
 *   photo · crème · [filet] · sable · crème · TERRE · crème · FORÊT · sable ·
 *   ENCRE · crème · [pied]
 */
export default async function Accueil({
  params,
}: {
  params: Promise<{ langue: string }>;
}) {
  await preparerLangue(params);
  const c = await getTranslations("commun");

  // Les villes réelles dès qu'il y en a une en base ; la liste provisoire,
  // marquée « liste exacte à confirmer », seulement tant que la base est vide.
  // L'accueil et « Où nous sommes » doivent dire la même chose : montrer une
  // ville où le mouvement n'est peut-être pas présent, c'est inventer.
  const lecture = await lireVillesPubliees(horlogeSysteme.maintenant());
  const reelles = lecture.ok ? lecture.valeur : [];
  const villes =
    reelles.length > 0
      ? reelles.map((entree) => entree.ville.nom)
      : (c.raw("villes") as readonly string[]);

  return (
    <>
      <Ouverture />
      <Accroche />
      <DefileVilles
        villes={villes}
        {...(reelles.length > 0 ? {} : { mention: c("listeVillesMention") })}
      />
      <Bande surface="sable">
        <BlocTheme />
      </Bande>
      <Pratiques />
      {/*
        Retirées le 9 novembre 2026, pour la mobilisation en ville : les
        chiffres du mouvement, la vie du mouvement, les témoignages, l'agenda
        et le prochain temps fort n'ont encore AUCUN contenu. Cinq encadrés
        « en attente » à la suite donnent d'un mouvement vivant l'image d'un
        mouvement vide — c'est l'inverse de ce qu'un étudiant invité doit voir.

        Elles reviennent dès que leur contenu arrive : il suffit de remettre
        leur ligne ici. Les composants ne sont pas supprimés.
      */}
      <AppelARejoindre />
    </>
  );
}
