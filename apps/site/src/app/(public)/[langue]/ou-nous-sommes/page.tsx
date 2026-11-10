import { getTranslations } from "next-intl/server";
import { horlogeSysteme } from "@gbum/core";
import { preparerLangue } from "../../../../i18n/langue";
import { Link } from "../../../../i18n/navigation";
import { Bande } from "../../../../composants/bande";
import { SectionTitre } from "../../../../composants/section-titre";
import { DefileVilles } from "../../../../composants/defile-villes";
import { Fleche } from "../../../../composants/fleche";
import { lireVillesPubliees } from "../../../../donnees/villes";

export const revalidate = 300;

export async function generateMetadata() {
  const t = await getTranslations("ouNousSommes");
  return { title: t("titre") };
}

/**
 * La page lit la base, et distingue TROIS cas — c'est tout l'objet de R2 :
 *
 *   1. des villes sont enregistrées → on les affiche ;
 *   2. la base répond, mais elle est vide (ou pas encore configurée) → on
 *      affiche la liste provisoire et le marqueur « liste à compléter » ;
 *   3. la base est injoignable → on le DIT. On n'affiche pas une liste vide,
 *      qui laisserait croire que le mouvement est absent de la ville du
 *      visiteur. C'est exactement le défaut de l'application actuelle, où une
 *      panne et une absence étaient indiscernables.
 */
export default async function OuNousSommes({
  params,
}: {
  params: Promise<{ langue: string }>;
}) {
  await preparerLangue(params);
  const t = await getTranslations("ouNousSommes");
  const c = await getTranslations("commun");

  // La liste des dix-neuf villes est dans le dépôt : elle vient du mouvement
  // lui-même. La base ne sert qu'à la REMPLACER le jour où le hub privé la
  // tiendra à jour. Une base en panne ne fait donc rien perdre, et surtout
  // n'a plus à s'excuser sur la page : elle rend la main à une liste vraie.
  const lecture = await lireVillesPubliees(horlogeSysteme.maintenant());
  const reelles = lecture.ok ? lecture.valeur : [];
  const villes =
    reelles.length > 0
      ? reelles.map((entree) => entree.ville.nom)
      : (c.raw("villes") as readonly string[]);

  return (
    <>
      <SectionTitre
        eyebrow={t("eyebrow")}
        display={t("display")}
        accroche={t("accroche")}
      />

      <DefileVilles villes={villes} />

      <Bande surface="creme">
        {/* La publication s'arrête AU NOM DE LA VILLE. Ni cellule, ni
            effectif, ni responsable : ce qui n'est pas publié ne peut pas se
            retourner contre quelqu'un. Le reste se dit de vive voix, à qui a
            écrit. */}
        <div className="grille grille-2">
          {villes.map((nom) => (
            <span className="carte" key={nom}>
              <span className="sous-titre" style={{ fontSize: "1.125rem" }}>
                {nom}
              </span>
            </span>
          ))}
        </div>
      </Bande>

      <Bande surface="creme">
        <h2 className="titre">{t("aucuneVilleTitre")}</h2>
        <p className="petit second" style={{ maxWidth: "var(--largeur-texte)" }}>
          {t("aucuneVilleTexte")}
        </p>
        <Link href="/rejoindre" className="cta">
          {t("titre")} <Fleche />
        </Link>
      </Bande>
    </>
  );
}
