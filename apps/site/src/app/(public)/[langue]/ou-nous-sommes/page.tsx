import { getTranslations } from "next-intl/server";
import { horlogeSysteme } from "@gbum/core";
import { preparerLangue } from "../../../../i18n/langue";
import { Link } from "../../../../i18n/navigation";
import { Bande } from "../../../../composants/bande";
import { SectionTitre } from "../../../../composants/section-titre";
import { DefileVilles } from "../../../../composants/defile-villes";
import { Fleche } from "../../../../composants/fleche";
import { lireVillesPubliees, villesAAfficher } from "../../../../donnees/villes";

export const revalidate = 300;

export async function generateMetadata() {
  const t = await getTranslations("ouNousSommes");
  return { title: t("titre") };
}

/**
 * Les dix-neuf villes du mouvement, et rien d'autre.
 *
 * La liste vient du DÉPÔT, pas de la base : une base vide ou injoignable ne
 * peut donc pas faire disparaître une ville, et le visiteur ne lit jamais une
 * liste trompeuse. Ce que la base contient en plus — une ville ouverte depuis
 * — s'y ajoute.
 *
 * La page ne promet aucun contact : la publication s'arrête au nom de la
 * ville (ADR-011). Qui veut joindre quelqu'un passe par « Rejoindre ».
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
  // lui-même, et la base ne peut que la COMPLÉTER, jamais la réduire.
  const lecture = await lireVillesPubliees(horlogeSysteme.maintenant());
  const villes = villesAAfficher(
    lecture.ok ? lecture.valeur : [],
    c.raw("villes") as readonly string[],
  );

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
