import { getTranslations } from "next-intl/server";
import { preparerLangue } from "../../../../i18n/langue";
import { Link } from "../../../../i18n/navigation";
import { Bande } from "../../../../composants/bande";
import { Attente } from "../../../../composants/attente";
import { SectionTitre } from "../../../../composants/section-titre";
import { Fleche } from "../../../../composants/fleche";

export async function generateMetadata() {
  const t = await getTranslations("leCanevas");
  return { title: t("titre") };
}

/** crème · TERRE · crème · sable — une seule bande sombre. */
export default async function LeCanevas({
  params,
}: {
  params: Promise<{ langue: string }>;
}) {
  await preparerLangue(params);
  const t = await getTranslations("leCanevas");
  const c = await getTranslations("commun");

  return (
    <>
      <SectionTitre
        eyebrow={t("eyebrow")}
        display={t("display")}
        accroche={t("accroche")}
      />

      <Bande surface="terre">
        <p className="etiquette accent">{t("anneeEyebrow")}</p>
        <p className="titre-serif">{t("anneeTitre")}</p>
        <Attente
          titre={t("anneeAttenteTitre")}
          texte={t("anneeAttenteTexte")}
          lien={{ texte: c("vousAvezCetteInformation"), href: "/nous-ecrire" }}
          surface="terre"
        />
      </Bande>

      <Bande surface="creme">
        <h2 className="titre">{t("archivesTitre")}</h2>
        <p className="petit second" style={{ maxWidth: "var(--largeur-texte)" }}>
          {t("archivesTexte")}
        </p>
        <div className="grille grille-3" style={{ margin: "20px 0" }}>
          {[1, 2, 3].map((n) => (
            <div className="carte" key={n}>
              <p className="sous-titre vide" style={{ fontSize: "1.125rem" }}>
                {t("archiveTitreVide")}
              </p>
              <p className="petit vide" style={{ margin: 0 }}>
                {t("archiveSousTitre")}
              </p>
            </div>
          ))}
        </div>
        <Attente titre={t("archivesAttenteTitre")} texte={t("archivesAttenteTexte")} />
      </Bande>

      <Bande surface="sable">
        <h2 className="titre">{t("ensembleTitre")}</h2>
        <p className="petit second" style={{ maxWidth: "var(--largeur-texte)" }}>
          {t("ensembleTexte")}
        </p>
        <Link href="/rejoindre" className="cta">
          {t("ensembleAction")} <Fleche />
        </Link>
        <p style={{ marginTop: 14 }}>
          <Link href="/la-vie-du-mouvement" className="lien-souligne">
            <span>{t("ensembleLien")}</span>
          </Link>
        </p>
      </Bande>
    </>
  );
}
