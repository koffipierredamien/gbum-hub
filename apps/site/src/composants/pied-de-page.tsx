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
          {/* Le logo porte déjà « GBUM » et « Groupe Biblique Universitaire
              Maroc » dans son dessin, et le nom est écrit juste à côté. Il est
              donc DÉCORATIF : le nommer une seconde fois ferait répéter la
              marque à un lecteur d'écran. */}
          <img
            className="marque-jeton"
            src="/logo-gbum.png"
            alt=""
            width={34}
            height={34}
          />
          <span style={{ fontSize: "0.90625rem", fontWeight: 700 }}>{t("marque")}</span>
        </Link>

        <p
          className="titre-serif"
          style={{ marginTop: 18, marginBottom: 10, fontSize: "1.375rem" }}
        >
          {p("devise")}
        </p>
        <div className="appartenance">
          {/* Celui-ci N'EST PAS décoratif : il dit une appartenance que rien
              d'autre ne montre à l'image, et son nom est le sigle lui-même. */}
          <span className="appartenance-pastille">
            <img src="/logo-ifes.png" alt={p("ifes")} width={64} height={50} />
          </span>
          <p className="petit second" style={{ margin: 0, maxWidth: 420 }}>
            {p("appartenance")}
          </p>
        </div>

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

        {/* « Confidentialité » et « Vos données » pointaient vers « # » : trois
            liens qui ne menaient nulle part, sur un site qu'on envoie à des
            inconnus. Ils reviendront le jour où les pages existeront. Celui de
            l'espace membres, lui, mène à l'administration, qui existe. */}
        <div className="pied-bas">
          <span>{p("droits")}</span>
          <span style={{ flexGrow: 1 }} />
          <a href="/admin" className="accent" style={{ fontWeight: 700 }}>
            {p("espaceMembres")}
          </a>
        </div>
      </div>
    </footer>
  );
}
