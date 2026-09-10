import { horlogeSysteme } from "@gbum/core";

/**
 * La page du chantier.
 *
 * Elle ne dit pas « bientôt disponible » : elle dit ce qui est posé et ce qui
 * ne l'est pas. C'est la même règle que sur les maquettes — un emplacement
 * vide ANNONCE qu'il attend (A1.3), il ne se meuble pas.
 *
 * L'import de `@gbum/core` n'est pas décoratif : il prouve que l'atelier est
 * câblé, que le domaine est atteignable depuis le site, et que la chaîne de
 * types tient d'un bout à l'autre.
 */
export default function Chantier() {
  const demarrage = new Date(horlogeSysteme.maintenant()).toISOString();

  return (
    <main style={{ maxWidth: 640, margin: "0 auto", padding: "72px 22px" }}>
      <p
        style={{
          fontSize: 11.5,
          fontWeight: 700,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: "var(--terre)",
          margin: "0 0 16px",
        }}
      >
        Chantier · lot 1, étape 2
      </p>

      <h1
        style={{
          fontFamily: "Newsreader, Georgia, serif",
          fontSize: 46,
          lineHeight: 1.02,
          letterSpacing: "-0.02em",
          fontWeight: 500,
          margin: 0,
        }}
      >
        Les fondations sont posées.
      </h1>

      <p style={{ fontSize: 16, lineHeight: 1.62, color: "var(--texte-second)" }}>
        Il n&apos;y a rien à voir ici, et c&apos;est normal : les fondations ne se
        voient pas. Les huit pages du site public viennent ensuite, puis l&apos;espace
        d&apos;administration.
      </p>

      <ul style={{ fontSize: 15, lineHeight: 1.8, color: "var(--texte-second)" }}>
        <li>le domaine, qui ne dépend de rien</li>
        <li>la chaîne de qualité, qui bloque</li>
        <li>la base et ses migrations rejouables</li>
        <li>le stockage des fichiers, remplaçable</li>
      </ul>

      <p style={{ fontSize: 13, color: "var(--texte-second)", marginTop: 40 }}>
        Rendu le <time dateTime={demarrage}>{demarrage}</time>
      </p>
    </main>
  );
}
