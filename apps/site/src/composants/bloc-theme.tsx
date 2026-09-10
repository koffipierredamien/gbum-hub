import { getTranslations } from "next-intl/server";
import { Attente } from "./attente";

/**
 * Le thème de l'année, sur l'accueil et sur « Le mouvement ».
 *
 * Un seul composant pour les deux pages (R5) : le jour où le Secrétariat
 * National saisit le thème, il apparaît aux deux endroits à la fois, et
 * personne n'a à se souvenir du second.
 */
export async function BlocTheme() {
  const c = await getTranslations("commun");
  const nom = c("themeNom");

  if (nom === "") {
    return (
      <Attente
        titre={c("themeTitre")}
        texte={c("themeTexte")}
        lien={{ texte: c("vousAvezCetteInformation"), href: "/nous-ecrire" }}
      />
    );
  }

  return (
    <>
      <p className="etiquette accent">{c("themeEtiquette")}</p>
      <p className="titre-serif" style={{ margin: 0 }}>
        {nom}
      </p>
      {c("themeTexte") === "" ? null : (
        <p className="corps second" style={{ marginTop: 12 }}>
          {c("themeTexte")}
        </p>
      )}
    </>
  );
}
