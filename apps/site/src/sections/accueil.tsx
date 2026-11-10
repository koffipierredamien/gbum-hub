import { getTranslations } from "next-intl/server";
import { Link } from "../i18n/navigation";
import { Bande } from "../composants/bande";
import { DefileImages } from "../composants/defile-images";
import { Fleche } from "../composants/fleche";
import { photosDAccueil } from "../donnees/photos";
import { RangNumerote } from "../composants/rang-numerote";

/** L'ouverture : le défilé d'images, la barre posée dessus, l'unique Display. */
export async function Ouverture() {
  const t = await getTranslations("accueil");
  const photos = photosDAccueil();

  return (
    <div className="heros">
      <DefileImages photos={photos} />
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(42,33,27,.66)",
          zIndex: 1,
        }}
      />
      <div className="heros-contenu">
        <div style={{ flexGrow: 1 }} />
        <div style={{ padding: "0 var(--gouttiere) 92px" }}>
          <h1 className="display">{t("display")}</h1>
        </div>
      </div>
    </div>
  );
}

export async function Accroche() {
  const t = await getTranslations("accueil");
  return (
    <Bande surface="creme">
      <p className="corps">{t("accroche")}</p>
      <Link href="/rejoindre" className="cta">
        {t("trouverMonGroupe")} <Fleche />
      </Link>
      <p className="petit second" style={{ marginTop: 11 }}>
        {t("sansCompte")}
      </p>
    </Bande>
  );
}

export async function Pratiques() {
  const t = await getTranslations("accueil");
  return (
    <Bande surface="creme">
      <p className="etiquette accent">{t("pratiquesEyebrow")}</p>
      <h2 className="titre">{t("pratiquesTitre")}</h2>
      <div style={{ marginTop: 22 }}>
        {[1, 2, 3, 4].map((n) => (
          <RangNumerote
            key={n}
            numero={n}
            titre={t(`pratique${String(n)}Titre`)}
            texte={t(`pratique${String(n)}Texte`)}
          />
        ))}
      </div>
    </Bande>
  );
}

export async function AppelARejoindre() {
  const t = await getTranslations("accueil");
  return (
    <Bande surface="creme">
      <h2 className="titre">{t("rejoindreTitre")}</h2>
      <p className="petit second" style={{ maxWidth: "var(--largeur-texte)" }}>
        {t("rejoindreTexte")}
      </p>
      <Link href="/rejoindre" className="cta">
        {t("trouverMonGroupe")} <Fleche />
      </Link>
    </Bande>
  );
}
