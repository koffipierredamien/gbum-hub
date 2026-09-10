import { getTranslations } from "next-intl/server";
import { preparerLangue } from "../../../i18n/langue";
import { Link } from "../../../i18n/navigation";
import { Bande } from "../../../composants/bande";
import { Attente } from "../../../composants/attente";
import { Photo } from "../../../composants/photo";
import { SectionTitre } from "../../../composants/section-titre";
import { RangNumerote } from "../../../composants/rang-numerote";
import { Fleche } from "../../../composants/fleche";

export async function generateMetadata() {
  const t = await getTranslations("laVieDuMouvement");
  return { title: t("titre") };
}

/** crème · sable · photo · crème · TERRE · crème · FORÊT · crème — D1 tenue. */
export default async function LaVieDuMouvement({
  params,
}: {
  params: Promise<{ langue: string }>;
}) {
  await preparerLangue(params);
  const t = await getTranslations("laVieDuMouvement");

  const filtres = [
    { cle: "filtreTout", actif: true },
    { cle: "filtreNational", actif: false },
    { cle: "filtreVille", actif: false },
    { cle: "filtreCellule", actif: false },
    { cle: "filtreSouvenirs", actif: false },
  ] as const;

  const echelles = ["filtreVille", "filtreCellule", "filtreNational"] as const;

  return (
    <>
      <SectionTitre
        eyebrow={t("eyebrow")}
        display={t("display")}
        accroche={t("accroche")}
      />

      <Bande surface="sable">
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {filtres.map((filtre) => (
            <button
              key={filtre.cle}
              type="button"
              className="puce"
              aria-pressed={filtre.actif}
            >
              {t(filtre.cle)}
            </button>
          ))}
        </div>
      </Bande>

      <Photo hauteur={260}>
        <div />
        <div>
          <p className="etiquette">{t("uneEyebrow")}</p>
          <p className="titre-serif vide-clair" style={{ margin: 0 }}>
            {t("uneTitre")}
          </p>
        </div>
      </Photo>

      <Bande surface="creme">
        <p className="petit second" style={{ maxWidth: "var(--largeur-texte)" }}>
          {t("uneTexte")}
        </p>
        <Attente titre={t("attenteTitre")} texte={t("attenteTexte")} />
      </Bande>

      <Bande surface="terre">
        <p className="etiquette accent">{t("tempsFortsEyebrow")}</p>
        {[1, 2, 3].map((n) => (
          <RangNumerote
            key={n}
            numero={n}
            titre={t(`tempsFort${String(n)}Titre`)}
            texte={t(`tempsFort${String(n)}Texte`)}
          />
        ))}
      </Bande>

      <Bande surface="creme">
        <h2 className="titre">{t("bilansTitre")}</h2>
        <p className="petit second" style={{ maxWidth: "var(--largeur-texte)" }}>
          {t("bilansTexte")}
        </p>
        <div style={{ marginTop: 20 }}>
          {echelles.map((echelle) => (
            <div className="rang" key={echelle} style={{ display: "block" }}>
              <p className="etiquette accent" style={{ marginBottom: 7 }}>
                {t(echelle)} ·{" "}
                <span className="vide" style={{ textTransform: "none" }}>
                  {t("date")}
                </span>
              </p>
              <p className="sous-titre vide">{t("bilanTitreVide")}</p>
              <p className="petit second" style={{ margin: 0 }}>
                {t("bilanResume")}
              </p>
            </div>
          ))}
        </div>
      </Bande>

      <Bande surface="foret">
        <p className="etiquette accent">{t("souvenirsEyebrow")}</p>
        <p className="titre-serif">{t("souvenirsTitre")}</p>
        <p className="corps second">{t("souvenirsTexte")}</p>
        <Link href="/nous-ecrire" className="cta">
          {t("souvenirsAction")} <Fleche />
        </Link>
      </Bande>

      <Bande surface="creme">
        <p className="etiquette accent">{t("voirAussi")}</p>
        <div className="rang" style={{ display: "block" }}>
          <Link href="/le-canevas">
            <p className="sous-titre">{t("voirCanevasTitre")}</p>
            <p className="petit second" style={{ margin: 0 }}>
              {t("voirCanevasTexte")}
            </p>
          </Link>
        </div>
        <div className="rang" style={{ display: "block" }}>
          <Link href="/agenda">
            <p className="sous-titre">{t("voirAgendaTitre")}</p>
            <p className="petit second" style={{ margin: 0 }}>
              {t("voirAgendaTexte")}
            </p>
          </Link>
        </div>
      </Bande>
    </>
  );
}
