import { listerComptes } from "@gbum/db";
import { exigerCompte } from "../../../../auth/garde";
import { T } from "../textes";
import { MonMotDePasse } from "./mon-mot-de-passe";
import { NouveauCompte } from "./nouveau-compte";
import { LigneDeCompte } from "./ligne-de-compte";

export const dynamic = "force-dynamic";

export default async function Comptes() {
  const moi = await exigerCompte();
  const jePeuxGerer = moi.role === "technique";

  const comptes = await listerComptes().catch((cause: unknown) => {
    console.error("lecture des comptes", { cause });
    return [];
  });

  return (
    <main className="corps-admin">
      <h1 className="titre-admin">{T.comptes.titre}</h1>
      <p className="accroche-admin">{T.comptes.accroche}</p>

      <MonMotDePasse />

      {jePeuxGerer ? <NouveauCompte /> : null}

      <p className="etiquette-admin" style={{ marginTop: 26 }}>
        {T.comptes.liste}
      </p>
      {comptes.map((compte) => (
        <LigneDeCompte
          key={compte.id}
          compte={compte}
          cestMoi={compte.id === moi.id}
          jePeuxGerer={jePeuxGerer}
        />
      ))}

      {jePeuxGerer ? null : (
        <div className="filet">
          <p className="filet-texte">{T.comptes.lectureSeule}</p>
        </div>
      )}
    </main>
  );
}
