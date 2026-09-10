import { getTranslations } from "next-intl/server";
import type { VillePubliee } from "@gbum/core";
import { Bande } from "../composants/bande";
import { Attente } from "../composants/attente";
import { Photo } from "../composants/photo";
import { Fleche } from "../composants/fleche";
import { Link } from "../i18n/navigation";

/**
 * Une ville, telle qu'un visiteur la voit.
 *
 * Les cellules y sont nommées avec leur seul effectif. Ni jour, ni heure, ni
 * lieu, ni responsable — et ce n'est pas un oubli de cette page : le type
 * `VillePubliee` ne les porte pas, et la table `cellules` n'a pas ces
 * colonnes. Ce qui n'existe pas ne fuit pas (ADR-011).
 *
 * Le contact du bureau suit son mandat, qui est annuel. Hors mandat, la page
 * DIT que le bureau est en cours de renouvellement — elle n'affiche ni un vide
 * ni l'adresse de l'année précédente.
 */
export async function VueDeVille({
  ville,
  nomDeSecours,
}: {
  ville: VillePubliee | undefined;
  nomDeSecours: string;
}) {
  const t = await getTranslations("ouNousSommes");
  const nom = ville?.nom ?? nomDeSecours;
  const cellules = ville?.cellules ?? [];

  return (
    <>
      <Photo hauteur={230}>
        <Attente titre={t("vueEyebrow")} texte={t("nonPublieTexte")} surface="photo" />
        <div>
          <p className="etiquette">{t("vueEyebrow")}</p>
          <p className="titre-serif" style={{ margin: 0 }}>
            {nom}
          </p>
        </div>
      </Photo>

      <Bande surface="sable">
        <p className="etiquette accent">{t("cellulesEyebrow")}</p>
        {cellules.length > 0 ? (
          cellules.map((cellule) => (
            <div className="rang" key={cellule.nom}>
              <span className="sous-titre" style={{ flexGrow: 1 }}>
                {cellule.nom}
              </span>
              <span className="petit second">{cellule.nombreDeMembres}</span>
            </div>
          ))
        ) : (
          <div className="rang">
            <span className="sous-titre vide" style={{ flexGrow: 1 }}>
              —
            </span>
            <span className="petit vide">{t("membresInconnu")}</span>
          </div>
        )}
        <div style={{ marginTop: 22 }}>
          <Attente titre={t("nonPublieTitre")} texte={t("nonPublieTexte")} />
        </div>
      </Bande>

      <Bande surface="terre">
        <p className="etiquette accent">{t("contactEyebrow")}</p>
        <h2 className="titre">{t("contactTitre", { ville: nom })}</h2>
        {ville !== undefined && ville.contact.type === "disponible" ? (
          <>
            <p className="corps second">{t("contactTexte")}</p>
            <a className="cta" href={`mailto:${ville.contact.courriel}`}>
              {t("contactAction", { ville: nom })} <Fleche />
            </a>
          </>
        ) : (
          <>
            <Attente
              titre={t("mandatEchuTitre")}
              texte={t("mandatEchuTexte")}
              surface="terre"
            />
            <Link href="/nous-ecrire" className="cta">
              {t("contactAction", { ville: nom })} <Fleche />
            </Link>
          </>
        )}
      </Bande>
    </>
  );
}
