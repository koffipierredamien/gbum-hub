import { getTranslations } from "next-intl/server";
import { preparerLangue } from "../../../../i18n/langue";
import { Link } from "../../../../i18n/navigation";
import { Bande } from "../../../../composants/bande";
import { BlocTheme } from "../../../../composants/bloc-theme";
import { SectionTitre } from "../../../../composants/section-titre";
import { RangNumerote } from "../../../../composants/rang-numerote";
import { Frise } from "../../../../composants/frise";
import { Fleche } from "../../../../composants/fleche";

export async function generateMetadata() {
  const t = await getTranslations("leMouvement");
  return { title: t("titre") };
}

/** crème · ENCRE · crème · sable · TERRE · crème — D1 tenue. */
export default async function LeMouvement({
  params,
}: {
  params: Promise<{ langue: string }>;
}) {
  await preparerLangue(params);
  const t = await getTranslations("leMouvement");
  const niveaux = [1, 2, 3, 4, 5];

  return (
    <>
      <SectionTitre
        eyebrow={t("eyebrow")}
        display={t("display")}
        accroche={t("accroche")}
      />

      <Bande surface="encre">
        <p className="etiquette accent">{t("deviseEyebrow")}</p>
        <p className="titre-serif" style={{ margin: 0 }}>
          {t("devise")}
        </p>
      </Bande>

      <Bande surface="creme">
        <p className="etiquette accent">{t("visionEyebrow")}</p>
        <h2 className="titre">{t("visionNom")}</h2>
        <p className="corps second">{t("visionTexte")}</p>

        {/* Dix segments : trois écoulés, sept à venir. C'est la seule chose
            que nous sachions compter avec certitude sur cette vision. */}
        <div className="jauge" aria-hidden="true">
          {Array.from({ length: 10 }, (_, index) => (
            <span key={index} data-ecoule={index < 3} />
          ))}
        </div>
        <p className="petit second">{t("visionAnnee")}</p>

        <div style={{ marginTop: 22 }}>
          <BlocTheme />
        </div>
      </Bande>

      <Bande surface="sable">
        <h2 className="titre">{t("histoireTitre")}</h2>
        <p className="petit second" style={{ marginBottom: 24 }}>
          {t("histoireTexte")}
        </p>
        <Frise />
      </Bande>

      <Bande surface="terre">
        <p className="etiquette accent">{t("organisationEyebrow")}</p>
        <h2 className="titre">{t("organisationTitre")}</h2>
        <div style={{ marginTop: 20 }}>
          {niveaux.map((n) => (
            <RangNumerote
              key={n}
              numero={n}
              titre={t(`niveau${String(n)}Titre`)}
              texte={t(`niveau${String(n)}Texte`)}
            />
          ))}
        </div>
      </Bande>

      <Bande surface="creme">
        <h2 className="titre">{t("renvoiTitre")}</h2>
        <p className="petit second" style={{ maxWidth: "var(--largeur-texte)" }}>
          {t("renvoiTexte")}
        </p>
        <Link href="/ou-nous-sommes" className="cta">
          {t("renvoiAction")} <Fleche />
        </Link>
        <p style={{ marginTop: 14 }}>
          <Link href="/le-canevas" className="lien-souligne">
            <span>{t("renvoiLien")}</span>
          </Link>
        </p>
      </Bande>
    </>
  );
}
