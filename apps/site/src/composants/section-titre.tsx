import { Bande } from "./bande";

/**
 * L'ouverture d'une page intérieure : l'étiquette, l'UNIQUE Display de la
 * page (D2), et l'accroche. Les huit pages partagent cette forme — c'est ce
 * qui fait qu'on les reconnaît comme un même site.
 */
export function SectionTitre({
  eyebrow,
  display,
  accroche,
}: {
  eyebrow: string;
  display: string;
  accroche: string;
}) {
  return (
    <Bande surface="creme">
      <p className="etiquette accent">{eyebrow}</p>
      <h1 className="display">{display}</h1>
      <p className="corps second" style={{ marginTop: 18 }}>
        {accroche}
      </p>
    </Bande>
  );
}
