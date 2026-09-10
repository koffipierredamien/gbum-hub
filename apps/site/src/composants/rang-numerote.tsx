/**
 * D6 — les voix, pas les icônes ; D9 — la carte se mérite.
 *
 * Une suite numérotée séparée par des filets remplace les cartes à
 * pictogramme : quatre cartes identiques mettent l'important et l'accessoire
 * au même niveau, une suite numérotée ne le fait pas.
 */
export function RangNumerote({
  numero,
  titre,
  texte,
}: {
  numero: number;
  titre: string;
  texte: string;
}) {
  return (
    <div className="rang">
      <span className="numero accent">
        {numero < 10 ? `0${String(numero)}` : numero}
      </span>
      <div>
        <p className="sous-titre">{titre}</p>
        <p className="petit second" style={{ margin: 0 }}>
          {texte}
        </p>
      </div>
    </div>
  );
}
