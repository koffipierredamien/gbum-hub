import { getTranslations } from "next-intl/server";
import { horlogeSysteme } from "@gbum/core";
import { preparerLangue } from "../../../i18n/langue";
import { Link } from "../../../i18n/navigation";
import { Bande } from "../../../composants/bande";
import { Attente } from "../../../composants/attente";
import { SectionTitre } from "../../../composants/section-titre";
import { DefileVilles } from "../../../composants/defile-villes";
import { Fleche } from "../../../composants/fleche";
import { lireVillesPubliees } from "../../../donnees/villes";
import { VueDeVille } from "../../../sections/vue-de-ville";

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

  const lecture = await lireVillesPubliees(horlogeSysteme.maintenant());
  const enPanne = !lecture.ok && lecture.erreur.type === "base-injoignable";
  const reelles = lecture.ok ? lecture.valeur : [];
  const provisoires = c.raw("villes") as readonly string[];

  return (
    <>
      <SectionTitre
        eyebrow={t("eyebrow")}
        display={t("display")}
        accroche={t("accroche")}
      />

      <DefileVilles
        villes={reelles.length > 0 ? reelles.map((e) => e.ville.nom) : provisoires}
        {...(reelles.length > 0 ? {} : { mention: c("listeVillesMention") })}
      />

      <Bande surface="creme">
        {enPanne ? (
          <div role="alert">
            <Attente titre={t("pannneTitre")} texte={t("pannneTexte")} />
            <Link href="/nous-ecrire" className="cta">
              {t("contactAction", { ville: "" }).trim()} <Fleche />
            </Link>
          </div>
        ) : (
          <>
            <div className="grille grille-2">
              {(reelles.length > 0
                ? reelles.map((e) => ({
                    nom: e.ville.nom,
                    cellules: `${String(e.ville.nombreDeCellules)} ${t("cellulesSuffixe")}`,
                  }))
                : provisoires.map((nom) => ({
                    nom,
                    cellules: t("cellulesInconnu"),
                  }))
              ).map((ville) => (
                <span className="carte" key={ville.nom}>
                  <span className="sous-titre" style={{ fontSize: "1.125rem" }}>
                    {ville.nom}
                  </span>
                  <span
                    className={reelles.length > 0 ? "petit second" : "petit vide"}
                    style={{ display: "block" }}
                  >
                    {ville.cellules}
                  </span>
                </span>
              ))}
            </div>
            <div style={{ marginTop: 18 }}>
              <Attente
                titre={t("listeTitre")}
                texte={t("listeTexte")}
                lien={{ texte: c("vousAvezCetteInformation"), href: "/nous-ecrire" }}
              />
            </div>
          </>
        )}
      </Bande>

      <VueDeVille ville={reelles[0]?.ville} nomDeSecours={provisoires[0] ?? ""} />

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
