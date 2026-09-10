import { getTranslations } from "next-intl/server";
import { horlogeSysteme } from "@gbum/core";
import { preparerLangue } from "../../../i18n/langue";
import { Link } from "../../../i18n/navigation";
import { Bande } from "../../../composants/bande";
import { SectionTitre } from "../../../composants/section-titre";
import { FormulaireDemande } from "../../../composants/formulaire-demande";
import { Fleche } from "../../../composants/fleche";
import { lireVillesPubliees } from "../../../donnees/villes";

/**
 * La page lit la liste des villes : elle ne peut donc pas être figée une fois
 * pour toutes. Cinq minutes de cache — le contenu change quelques fois par an,
 * et un site public doit être rapide et bon marché.
 */
export const revalidate = 300;

export async function generateMetadata() {
  const t = await getTranslations("nousEcrire");
  return { title: t("titre") };
}

/** crème · sable · ENCRE · crème — une seule bande sombre. */
export default async function NousEcrire({
  params,
}: {
  params: Promise<{ langue: string }>;
}) {
  await preparerLangue(params);
  const t = await getTranslations("nousEcrire");
  const lecture = await lireVillesPubliees(horlogeSysteme.maintenant());

  return (
    <>
      <SectionTitre
        eyebrow={t("eyebrow")}
        display={t("display")}
        accroche={t("accroche")}
      />

      <Bande surface="sable">
        <FormulaireDemande
          sujet="question"
          action={t("envoyer")}
          villes={
            lecture.ok
              ? lecture.valeur.map((entree) => ({
                  id: entree.id,
                  nom: entree.ville.nom,
                }))
              : []
          }
          champs={[
            { nom: "nom", etiquette: t("nom"), indice: t("nomIndice") },
            { nom: "contact", etiquette: t("joindre"), indice: t("joindreIndice") },
            {
              nom: "message",
              etiquette: t("message"),
              indice: t("messageIndice"),
              zone: true,
            },
          ]}
        />
      </Bande>

      <Bande surface="encre">
        <p className="etiquette accent">{t("devenirEyebrow")}</p>
        <p className="titre-serif">{t("devenirTitre")}</p>
        <p className="petit second" style={{ maxWidth: "var(--largeur-texte)" }}>
          {t("devenirTexte")}
        </p>
        <a className="lien-souligne" href="#">
          <span>{t("devenirLien")}</span>
        </a>
      </Bande>

      <Bande surface="creme">
        <h2 className="titre">{t("chercheGroupeTitre")}</h2>
        <p className="petit second" style={{ maxWidth: "var(--largeur-texte)" }}>
          {t("chercheGroupeTexte")}
        </p>
        <Link href="/rejoindre" className="cta">
          {t("titre")} <Fleche />
        </Link>
      </Bande>
    </>
  );
}
