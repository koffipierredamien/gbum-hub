import { getTranslations } from "next-intl/server";
import { Attente } from "./attente";

/**
 * La frise du mouvement — et son point manquant.
 *
 * Trois faits datés : 1947, 1968, 2023. Entre 1968 et 2023 il manque la
 * fondation du GBUM : le mouvement ne nous a pas encore donné sa date, et rien
 * n'en est publié en ligne.
 *
 * On n'y met PAS un point vide. Un point vide sur une frise se lit comme une
 * erreur de saisie — le lecteur croit à un bogue, pas à un manque assumé. À
 * son rang chronologique, il y a un marqueur d'attente avec un cercle CREUX :
 * il dit ce qui manque, à qui le demander, et propose de le fournir. La frise
 * reste exacte, et le manque devient une invitation (D10).
 */
export async function Frise() {
  const t = await getTranslations("leMouvement");
  const c = await getTranslations("commun");

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
      {annee !== "" && recit !== "" ? (
        <div className="frise-point" key="gbum">
          <span className="frise-puce" aria-hidden="true" />
          <p className="frise-annee accent">{annee}</p>
          <p className="petit second" style={{ margin: "6px 0 0" }}>
            {recit}
          </p>
        </div>
      ) : (
        <div className="frise-point" key="manquant">
          <span className="frise-puce frise-puce-creuse" aria-hidden="true" />
          <Attente
            titre={t("friseManquantTitre")}
            texte={t("friseManquantTexte")}
            lien={{ texte: c("vousAvezCetteInformation"), href: "/nous-ecrire" }}
          />
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
