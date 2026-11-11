import { getTranslations } from "next-intl/server";

/**
 * La frise du mouvement : trois faits datés, 1947, 1968, 2023.
 *
 * Entre 1968 et 2023 manque la fondation du GBUM — le mouvement ne nous a pas
 * encore donné sa date. Un marqueur « à venir » occupait ce rang ; il a été
 * retiré. Sur un site public qu'on envoie à des étudiants, un encadré qui
 * annonce un contenu absent parle du chantier, pas du mouvement.
 *
 * La place reste tenue : dès que le Secrétariat National publie l'année ET le
 * récit depuis l'administration, le point apparaît à son rang chronologique,
 * entre 1968 et 2023, sans qu'une ligne change ici.
 */
export async function Frise() {
  const t = await getTranslations("leMouvement");

  const dates = [
    { annee: "1947", texte: t("frise1947") },
    { annee: "1968", texte: t("frise1968") },
  ];

  const annee = t("friseGbumAnnee");
  const recit = t("friseGbumTexte");

  return (
    <div className="frise">
      {dates.map((point) => (
        <div className="frise-point" key={point.annee}>
          <span className="frise-puce" aria-hidden="true" />
          <p className="frise-annee accent">{point.annee}</p>
          <p className="petit second" style={{ margin: "6px 0 0" }}>
            {point.texte}
          </p>
        </div>
      ))}

      {/* Le jour où le Secrétariat National donne l'année et le récit de la
          fondation du GBUM depuis l'espace d'administration, ce point cesse
          d'être une place réservée et devient un fait daté comme les autres.
          C'est la même règle que partout ailleurs : l'emplacement est dessiné
          avant que le contenu arrive, et il n'a rien à réapprendre. */}
      {annee === "" || recit === "" ? null : (
        <div className="frise-point" key="gbum">
          <span className="frise-puce" aria-hidden="true" />
          <p className="frise-annee accent">{annee}</p>
          <p className="petit second" style={{ margin: "6px 0 0" }}>
            {recit}
          </p>
        </div>
      )}

      <div className="frise-point frise-dernier" key="2023">
        <span className="frise-puce" aria-hidden="true" />
        <p className="frise-annee accent">2023</p>
        <p className="petit second" style={{ margin: "6px 0 0" }}>
          {t("frise2023")}
        </p>
      </div>
    </div>
  );
}
