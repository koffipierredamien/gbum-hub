/**
 * D5 — le défilé des villes.
 *
 * Le seul élément en mouvement continu du site, et le meilleur rapport
 * effet/coût de la direction artistique : la page bouge, et ce qu'elle dit en
 * bougeant est VRAI. Elle répond aussi à la seule question qu'un étudiant se
 * pose en arrivant — est-ce qu'il y en a un chez moi ?
 *
 * Arrêt au survol, et arrêt total sous prefers-reduced-motion.
 * Le second groupe est masqué aux lecteurs d'écran : c'est la copie qui rend
 * la boucle continue, pas un contenu de plus.
 */
export function DefileVilles({
  villes,
  mention,
}: {
  villes: readonly string[];
  mention?: string;
}) {
  const groupe = (cache: boolean) => (
    <div className="defile-groupe" aria-hidden={cache ? true : undefined}>
      {villes.map((ville) => (
        <span key={ville} style={{ display: "contents" }}>
          <span>{ville}</span>
          <span className="defile-point" aria-hidden="true">
            ·
          </span>
        </span>
      ))}
      {mention === undefined ? null : (
        <>
          <span
            className="petit second"
            style={{ fontFamily: "inherit", fontSize: "0.84375rem", fontWeight: 600 }}
          >
            {mention}
          </span>
          <span className="defile-point" aria-hidden="true">
            ·
          </span>
        </>
      )}
    </div>
  );

  return (
    <div className="defile">
      <div className="defile-piste">
        {groupe(false)}
        {groupe(true)}
      </div>
    </div>
  );
}
