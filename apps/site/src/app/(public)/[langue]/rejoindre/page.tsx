import { getTranslations } from "next-intl/server";
import { horlogeSysteme } from "@gbum/core";
import { preparerLangue } from "../../../../i18n/langue";
import { Link } from "../../../../i18n/navigation";
import { Bande } from "../../../../composants/bande";
import { Attente } from "../../../../composants/attente";
import { SectionTitre } from "../../../../composants/section-titre";
import { RangNumerote } from "../../../../composants/rang-numerote";
import { FormulaireDemande } from "../../../../composants/formulaire-demande";
import { Fleche } from "../../../../composants/fleche";
import { choixDeVilles, lireVillesPubliees } from "../../../../donnees/villes";

export const revalidate = 300;

export async function generateMetadata() {
  const t = await getTranslations("rejoindre");
  return { title: t("titre") };
}

/**
 * Le parcours d'accueil : un formulaire, et rien d'autre à faire.
 *
 * IL N'Y A PLUS D'ÉTAPES. La page annonçait « Étape 1 sur 3 », puis affichait
 * une grille de villes qui n'était pas cliquable, puis une bande qui disait
 * « Le GBU est présent à … » en nommant la PREMIÈRE ville de la liste —
 * jamais celle du visiteur, puisque rien n'avait été choisi. Une cérémonie en
 * trois temps qui ne demandait rien et confirmait un choix qui n'existait
 * pas. Le choix de la ville est devenu ce qu'il est : une ligne du
 * formulaire.
 *
 * Le cas « aucun groupe dans ta ville » garde sa bande entière : c'est là
 * qu'on perd quelqu'un, ou qu'on le rattrape.
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
  const villes = choixDeVilles(
    lecture.ok ? lecture.valeur : [],
    c.raw("villes") as readonly string[],
  );

  return (
    <>
      <SectionTitre
        eyebrow={t("eyebrow")}
        display={t("display")}
        accroche={t("accroche")}
      />

      <Bande surface="sable">
        <h2 className="titre">{t("formulaireTitre")}</h2>
        <p className="petit second" style={{ marginBottom: 22 }}>
          {t("formulaireTexte")}
        </p>
        <div style={{ marginBottom: 20 }}>
          <Attente titre={t("viePriveeTitre")} texte={t("viePriveeTexte")} />
        </div>
        <FormulaireDemande
          sujet="rejoindre"
          action={t("envoyer")}
          villes={villes}
          champs={[
            { nom: "nom", etiquette: t("prenom"), indice: t("prenomIndice") },
            { nom: "contact", etiquette: t("joindre"), indice: t("joindreIndice") },
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
