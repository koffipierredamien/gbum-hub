import { getTranslations } from "next-intl/server";
import { horlogeSysteme } from "@gbum/core";
import { preparerLangue } from "../../../i18n/langue";
import { Link } from "../../../i18n/navigation";
import { Bande } from "../../../composants/bande";
import { Attente } from "../../../composants/attente";
import { Photo } from "../../../composants/photo";
import { RangNumerote } from "../../../composants/rang-numerote";
import { FormulaireDemande } from "../../../composants/formulaire-demande";
import { Fleche } from "../../../composants/fleche";
import { lireVillesPubliees } from "../../../donnees/villes";

export const revalidate = 300;

export async function generateMetadata() {
  const t = await getTranslations("rejoindre");
  return { title: t("titre") };
}

/**
 * Le parcours d'accueil, en trois étapes et sans compte.
 *
 * Le cas « aucun groupe dans ta ville » est traité avec le MÊME soin que le
 * cas nominal, sur sa propre bande : c'est là qu'on perd quelqu'un, ou qu'on
 * le rattrape.
 */
export default async function Rejoindre({
  params,
}: {
  params: Promise<{ langue: string }>;
}) {
  await preparerLangue(params);
  const t = await getTranslations("rejoindre");
  const c = await getTranslations("commun");

  const lecture = await lireVillesPubliees(horlogeSysteme.maintenant());
  const reelles = lecture.ok ? lecture.valeur : [];
  const noms =
    reelles.length > 0
      ? reelles.map((entree) => entree.ville.nom)
      : (c.raw("villes") as readonly string[]);
  const premiere = noms[0] ?? "";
  const cellules = reelles[0]?.ville.cellules ?? [];
  const choixDeVille = reelles.map((entree) => ({
    id: entree.id,
    nom: entree.ville.nom,
  }));

  return (
    <>
      <Bande surface="creme">
        <div className="jauge" aria-hidden="true">
          {Array.from({ length: 3 }, (_, index) => (
            <span key={index} data-ecoule={index < 1} />
          ))}
        </div>
        <p className="etiquette accent">{t("etape", { numero: 1 })}</p>
        <h1 className="display">{t("display")}</h1>
        <p className="corps second" style={{ marginTop: 18 }}>
          {t("accroche")}
        </p>
        <div className="grille grille-2" style={{ margin: "22px 0" }}>
          {noms.map((nom) => (
            <span className="carte" key={nom}>
              <span className="sous-titre" style={{ fontSize: "1.125rem" }}>
                {nom}
              </span>
            </span>
          ))}
        </div>
        <Attente titre={t("listeAttenteTitre")} texte={t("listeAttenteTexte")} />
      </Bande>

      <Photo hauteur={240}>
        <Attente titre={t("photoTitre")} texte={t("photoTexte")} surface="photo" />
        <div>
          <p className="etiquette">{t("etape", { numero: 2 })}</p>
          <p className="titre-serif" style={{ margin: 0 }}>
            {t("etape2Titre", { ville: premiere })}
          </p>
        </div>
      </Photo>

      <Bande surface="sable">
        <p className="corps second">{t("etape2Texte")}</p>
        <p className="etiquette accent" style={{ marginTop: 22 }}>
          {t("cellulesDe", { ville: premiere })}
        </p>
        {cellules.length > 0 ? (
          cellules.map((cellule) => (
            <div className="rang" key={cellule.nom}>
              <span style={{ flexGrow: 1 }} className="sous-titre">
                {cellule.nom}
              </span>
              <span className="petit second">{cellule.nombreDeMembres}</span>
            </div>
          ))
        ) : (
          <div className="rang">
            <span style={{ flexGrow: 1 }} className="sous-titre vide">
              —
            </span>
            <span className="petit vide">{t("membresInconnu")}</span>
          </div>
        )}
        <p className="petit second" style={{ marginTop: 20 }}>
          {t("cellulesNote")}
        </p>
      </Bande>

      <Bande surface="creme">
        <p className="etiquette accent">{t("etape", { numero: 3 })}</p>
        <h2 className="titre">{t("etape3Titre")}</h2>
        <p className="petit second" style={{ marginBottom: 22 }}>
          {t("etape3Texte")}
        </p>
        <div style={{ marginBottom: 20 }}>
          <Attente titre={t("viePriveeTitre")} texte={t("viePriveeTexte")} />
        </div>
        <FormulaireDemande
          sujet="rejoindre"
          action={t("envoyer")}
          villes={choixDeVille}
          champs={[
            { nom: "nom", etiquette: t("prenom"), indice: t("prenomIndice") },
            { nom: "contact", etiquette: t("joindre"), indice: t("joindreIndice") },
            { nom: "villeLibre", etiquette: t("campus"), indice: t("campusIndice") },
            { nom: "message", etiquette: t("mot"), indice: t("motIndice"), zone: true },
          ]}
        />
      </Bande>

      <Bande surface="foret">
        <p className="etiquette accent">{t("autreCasEyebrow")}</p>
        <p className="titre-serif">{t("autreCasTitre")}</p>
        <p className="corps second">{t("autreCasTexte")}</p>
        {[1, 2, 3].map((n) => (
          <RangNumerote
            key={n}
            numero={n}
            titre={t(`option${String(n)}Titre`)}
            texte={t(`option${String(n)}Texte`)}
          />
        ))}
      </Bande>

      <Bande surface="creme">
        <h2 className="titre">{t("informeTitre")}</h2>
        <p className="petit second" style={{ maxWidth: "var(--largeur-texte)" }}>
          {t("informeTexte")}
        </p>
        <Link href="/nous-ecrire" className="cta">
          {t("informeAction")} <Fleche />
        </Link>
      </Bande>
    </>
  );
}
