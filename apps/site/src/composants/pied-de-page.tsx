import { useTranslations } from "next-intl";
import { Link } from "../i18n/navigation";
import { PIED } from "./pages";

export function PiedDePage() {
  const t = useTranslations("navigation");
  const p = useTranslations("pied");

  return (
    <footer className="pied">
      <div className="pied-interieur">
        <Link href="/" className="marque">
          <span className="marque-jeton" aria-hidden="true">
            G
          </span>
          <span style={{ fontSize: "0.90625rem", fontWeight: 700 }}>{t("marque")}</span>
        </Link>

        <p
          className="titre-serif"
          style={{ marginTop: 18, marginBottom: 10, fontSize: "1.375rem" }}
        >
          {p("devise")}
        </p>
        <p className="petit second" style={{ margin: 0, maxWidth: 420 }}>
          {p("appartenance")}
        </p>

        <div className="pied-colonnes">
          {PIED.map((colonne) => (
            <div key={colonne.cle}>
              <p className="etiquette accent" style={{ marginBottom: 4 }}>
                {p(colonne.cle)}
              </p>
              {colonne.liens.map((lien) => (
                <Link key={`${colonne.cle}-${lien.cle}`} href={lien.chemin}>
                  {t.has(lien.cle) ? t(lien.cle) : p(lien.cle)}
                </Link>
              ))}
            </div>
          ))}
        </div>

        <div className="pied-bas">
          <span>{p("droits")}</span>
          <a href="#">{p("confidentialite")}</a>
          <a href="#">{p("donnees")}</a>
          <span style={{ flexGrow: 1 }} />
          <a href="#" className="accent" style={{ fontWeight: 700 }}>
            {p("espaceMembres")}
          </a>
        </div>
      </div>
    </footer>
  );
}
