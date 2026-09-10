import { getTranslations } from "next-intl/server";
import { preparerLangue } from "../../../../i18n/langue";
import { Link } from "../../../../i18n/navigation";
import { Bande } from "../../../../composants/bande";
import { Attente } from "../../../../composants/attente";
import { SectionTitre } from "../../../../composants/section-titre";
import { Fleche } from "../../../../composants/fleche";

export async function generateMetadata() {
  const t = await getTranslations("soutenir");
  return { title: t("titre") };
}

/**
 * Les trois manières de soutenir, décidées le 9 septembre 2026 : prier,
 * donner, devenir Ami du GBU — du moins coûteux au plus engageant.
 *
 * Chacune tient SA PROPRE BANDE parce qu'elles ne se valent pas. Trois cartes
 * identiques diraient le contraire.
 *
 * Et pas de quatrième : ce sont les trois que le mouvement pratique
 * réellement. Une page qui invente une manière de donner ment sur ce qu'elle
 * fait de l'argent.
 */
export default async function Soutenir({
  params,
}: {
  params: Promise<{ langue: string }>;
}) {
  await preparerLangue(params);
  const t = await getTranslations("soutenir");
  const c = await getTranslations("commun");

  const enTeteNumerotee = (numero: string, eyebrow: string, titre: string) => (
    <>
      <div className="numero-et-etiquette">
        <span className="numero accent">{numero}</span>
        <p className="etiquette accent" style={{ margin: 0 }}>
          {eyebrow}
        </p>
      </div>
      <h2 className="titre">{titre}</h2>
    </>
  );

  return (
    <>
      <SectionTitre
        eyebrow={t("eyebrow")}
        display={t("display")}
        accroche={t("accroche")}
      />

      <Bande surface="foret">
        {enTeteNumerotee("01", t("prierEyebrow"), t("prierTitre"))}
        <p className="corps second">{t("prierTexte")}</p>
        <a className="cta" href="#">
          {t("prierAction")} <Fleche />
        </a>
      </Bande>

      <Bande surface="creme">
        {enTeteNumerotee("02", t("donnerEyebrow"), t("donnerTitre"))}
        <p className="corps second">{t("donnerTexte")}</p>
        <div style={{ maxWidth: "var(--largeur-texte)", marginBottom: 22 }}>
          <div className="rang">
            <div>
              <p className="sous-titre">{t("donPonctuelTitre")}</p>
              <p className="petit second" style={{ margin: 0 }}>
                {t("donPonctuelTexte")}
              </p>
            </div>
          </div>
          <div className="rang">
            <div>
              <p className="sous-titre">{t("donRegulierTitre")}</p>
              <p className="petit second" style={{ margin: 0 }}>
                {t("donRegulierTexte")}
              </p>
            </div>
          </div>
        </div>
        {/* Aucun bouton de paiement tant que les modalités ne sont pas
            connues : un don que l'on ne sait pas recevoir ne se demande pas. */}
        <Attente
          titre={t("donAttenteTitre")}
          texte={t("donAttenteTexte")}
          lien={{ texte: c("vousAvezCetteInformation"), href: "/nous-ecrire" }}
        />
      </Bande>

      <Bande surface="terre">
        {enTeteNumerotee("03", t("amisEyebrow"), t("amisTitre"))}
        <p className="corps second">{t("amisTexte")}</p>
        <Link href="/nous-ecrire" className="cta">
          {t("amisAction")} <Fleche />
        </Link>
      </Bande>

      <Bande surface="creme">
        <h2 className="titre">{t("ouVaTitre")}</h2>
        <p className="corps second">{t("ouVaTexte")}</p>
        <Link href="/la-vie-du-mouvement" className="lien-souligne">
          <span>{t("ouVaLien")}</span>
        </Link>
        <div style={{ marginTop: 22 }}>
          <Attente titre={t("troisTitre")} texte={t("troisTexte")} />
        </div>
      </Bande>
    </>
  );
}
