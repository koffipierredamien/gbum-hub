import { getTranslations } from "next-intl/server";
import { preparerLangue } from "../../../i18n/langue";
import { Bande } from "../../../composants/bande";
import { Attente } from "../../../composants/attente";
import { SectionTitre } from "../../../composants/section-titre";
import { Fleche } from "../../../composants/fleche";

export async function generateMetadata() {
  const t = await getTranslations("agenda");
  return { title: t("titre") };
}

/** crème · ENCRE · sable · crème — une seule bande sombre. */
export default async function Agenda({
  params,
}: {
  params: Promise<{ langue: string }>;
}) {
  await preparerLangue(params);
  const t = await getTranslations("agenda");
  const c = await getTranslations("commun");

  const evenements = [
    { n: 1, etiquette: t("etiquetteCamp") },
    { n: 2, etiquette: t("etiquetteCamp") },
    { n: 3, etiquette: t("etiquetteConvention") },
    { n: 4, etiquette: t("etiquetteNational") },
  ];

  return (
    <>
      <SectionTitre
        eyebrow={t("eyebrow")}
        display={t("display")}
        accroche={t("accroche")}
      />

      <Bande surface="encre">
        <p className="etiquette accent">{t("prochainEyebrow")}</p>
        <p className="titre-serif">{t("prochainNom")}</p>
        <p className="corps second">{t("prochainTexte")}</p>
        <Attente titre={t("datesTitre")} texte={t("datesTexte")} surface="encre" />
      </Bande>

      <Bande surface="sable">
        <h2 className="titre">{t("autresTitre")}</h2>
        <p className="petit second" style={{ maxWidth: "var(--largeur-texte)" }}>
          {t("autresTexte")}
        </p>
        <div style={{ marginTop: 16, marginBottom: 22 }}>
          {evenements.map((evenement) => (
            <div className="rang" key={evenement.n}>
              <div style={{ width: 56, flexShrink: 0 }}>
                <p className="accent date-vide">—</p>
                <p className="petit second" style={{ margin: 0 }}>
                  {t("mois")}
                </p>
              </div>
              <div>
                <p className="etiquette accent" style={{ marginBottom: 4 }}>
                  {evenement.etiquette}
                </p>
                <p className="sous-titre">{t(`evt${String(evenement.n)}Titre`)}</p>
                <p className="petit second" style={{ margin: 0 }}>
                  {t(`evt${String(evenement.n)}Texte`)}
                </p>
              </div>
            </div>
          ))}
        </div>
        <Attente
          titre={t("attenteTitre")}
          texte={t("attenteTexte")}
          lien={{ texte: c("vousAvezCetteInformation"), href: "/nous-ecrire" }}
        />
      </Bande>

      <Bande surface="creme">
        <h2 className="titre">{t("calendrierTitre")}</h2>
        <p className="petit second" style={{ maxWidth: "var(--largeur-texte)" }}>
          {t("calendrierTexte")}
        </p>
        <a className="cta" href="#">
          {t("calendrierAction")} <Fleche />
        </a>
        <p style={{ marginTop: 14 }}>
          <a className="lien-souligne" href="#">
            <span>{t("lettreDePriere")}</span>
          </a>
        </p>
      </Bande>
    </>
  );
}
