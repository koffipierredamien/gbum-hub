import { getTranslations } from "next-intl/server";
import { Link } from "../i18n/navigation";
import { Bande } from "../composants/bande";
import { Attente } from "../composants/attente";
import { DefileImages } from "../composants/defile-images";
import { Photo } from "../composants/photo";
import { Fleche } from "../composants/fleche";
import { RangNumerote } from "../composants/rang-numerote";

/** L'ouverture : le défilé d'images, la barre posée dessus, l'unique Display. */
export async function Ouverture() {
  const t = await getTranslations("accueil");

  return (
    <div className="heros">
      <DefileImages />
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
        <div style={{ padding: "76px var(--gouttiere) 0" }}>
          <Attente titre={t("photoTitre")} texte={t("photoTexte")} surface="photo" />
        </div>
        <div style={{ flexGrow: 1 }} />
        <div style={{ padding: "0 var(--gouttiere) 62px" }}>
          <p className="etiquette" style={{ color: "var(--sur-encre)" }}>
            {t("eyebrow")}
          </p>
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

/** D8 — le chiffre a une taille : l'emplacement est dessiné avant le nombre. */
export async function Chiffres() {
  const t = await getTranslations("accueil");
  const cles = ["chiffresVilles", "chiffresCellules", "chiffresMembres"] as const;

  return (
    <Bande surface="terre">
      <p className="etiquette accent">{t("chiffresEyebrow")}</p>
      <div style={{ display: "flex", gap: 16, marginBottom: 20 }}>
        {cles.map((cle) => (
          <div key={cle} style={{ flex: 1 }}>
            <p className="second grand-chiffre">—</p>
            <p className="petit second" style={{ marginTop: 6 }}>
              {t(cle)}
            </p>
          </div>
        ))}
      </div>
      <Attente titre={t("chiffresTitre")} texte={t("chiffresTexte")} surface="terre" />
    </Bande>
  );
}

export async function VieDuMouvement() {
  const t = await getTranslations("accueil");
  const c = await getTranslations("commun");

  return (
    <>
      <Bande surface="creme">
        <h2 className="titre">{t("vieTitre")}</h2>
        <p className="petit second" style={{ maxWidth: "var(--largeur-texte)" }}>
          {t("vieTexte")}
        </p>
        <Link href="/la-vie-du-mouvement" className="lien-souligne">
          <span>{c("toutVoir")}</span>
        </Link>
      </Bande>

      <Photo hauteur={250}>
        <div />
        <div>
          <p className="etiquette">{t("vieEyebrow")}</p>
          <p className="titre-serif" style={{ margin: 0 }}>
            {t("vieDerniere")}
          </p>
        </div>
      </Photo>

      <Bande surface="creme">
        <Attente titre={t("viePublicationTitre")} texte={t("viePublicationTexte")} />
      </Bande>
    </>
  );
}

export async function Voix() {
  const t = await getTranslations("accueil");
  return (
    <Bande surface="foret">
      <p className="etiquette accent">{t("voixEyebrow")}</p>
      <p className="titre-serif" style={{ fontWeight: 500 }}>
        «&nbsp;<span className="second">{t("voixCitation")}</span>&nbsp;»
      </p>
      <Attente titre={t("voixTitre")} texte={t("voixTexte")} surface="foret" />
    </Bande>
  );
}

export async function CeQuiVient() {
  const t = await getTranslations("accueil");
  const a = await getTranslations("agenda");

  const prochains = [
    { titre: a("prochainNom"), sous: a("etiquetteNational") },
    { titre: a("evt4Titre"), sous: a("evt4Texte") },
  ];

  return (
    <Bande surface="sable">
      <div className="titre-et-lien">
        <h2 className="titre" style={{ margin: 0, minWidth: 0 }}>
          {t("agendaTitre")}
        </h2>
        <Link href="/agenda" className="lien-souligne">
          <span>{t("agendaLien")}</span>
        </Link>
      </div>
      <div style={{ marginTop: 16 }}>
        {prochains.map((entree) => (
          <div className="rang" key={entree.titre}>
            <p className="accent date-vide">—</p>
            <div>
              <p className="sous-titre">{entree.titre}</p>
              <p className="petit second" style={{ margin: 0 }}>
                {entree.sous}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Bande>
  );
}

export async function TempsFort() {
  const t = await getTranslations("accueil");
  const c = await getTranslations("commun");

  return (
    <Bande surface="encre">
      <p className="etiquette accent">{t("tempsFortEyebrow")}</p>
      <p className="titre-serif">{t("tempsFortNom")}</p>
      <p className="corps second">{t("tempsFortTexte")}</p>
      <Attente
        titre={t("tempsFortDatesTitre")}
        texte={t("tempsFortDatesTexte")}
        surface="encre"
      />
      <Link href="/agenda" className="cta">
        {c("enSavoirPlus")} <Fleche />
      </Link>
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
