import { getTranslations } from "next-intl/server";
import { preparerLangue } from "../../../../i18n/langue";
import { Link } from "../../../../i18n/navigation";
import { Bande } from "../../../../composants/bande";
import { SectionTitre } from "../../../../composants/section-titre";
import { Fleche } from "../../../../composants/fleche";
import { CANEVAS, nombreDEtudes } from "../../../../donnees/canevas";

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

  return (
    <>
      <SectionTitre
        eyebrow={t("eyebrow")}
        display={t("display")}
        accroche={t("accroche")}
      />

      <Bande surface="terre">
        <p className="etiquette accent">
          {t("anneeEyebrow")} · {CANEVAS.annee}
        </p>
        <h2 className="titre-serif">{CANEVAS.titre}</h2>
        <p className="etiquette att-terre">{CANEVAS.reference}</p>
        <p
          className="petit"
          style={{ maxWidth: "var(--largeur-texte)", marginTop: 14 }}
        >
          {CANEVAS.presentation}
        </p>

        <p className="etiquette att-terre" style={{ marginTop: 26 }}>
          {t("etudesCompte", { combien: nombreDEtudes(CANEVAS) })}
        </p>

        {CANEVAS.parties.map((partie) => (
          <div key={partie.nom} style={{ marginTop: 18 }}>
            <p className="sous-titre" style={{ margin: 0 }}>
              {partie.nom}
            </p>
            <ul className="liste-etudes">
              {partie.etudes.map((etude) => (
                <li key={etude}>{etude}</li>
              ))}
            </ul>
          </div>
        ))}

        <a
          className="cta"
          href={CANEVAS.document}
          style={{ marginTop: 26, display: "inline-flex" }}
        >
          {t("telecharger")} <Fleche />
        </a>
      </Bande>

      <Bande surface="creme">
        <h2 className="titre">{t("archivesTitre")}</h2>
        <p className="petit second" style={{ maxWidth: "var(--largeur-texte)" }}>
          {t("archivesTexte")}
        </p>
      </Bande>

      <Bande surface="sable">
        <h2 className="titre">{t("ensembleTitre")}</h2>
        <p className="petit second" style={{ maxWidth: "var(--largeur-texte)" }}>
          {t("ensembleTexte")}
        </p>
        <Link href="/rejoindre" className="cta">
          {t("ensembleAction")} <Fleche />
        </Link>
      </Bande>
    </>
  );
}
