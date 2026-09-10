import { redirect } from "next/navigation";
import { compteConnecte } from "../../../../auth/session";
import { FormulaireConnexion } from "./formulaire";
import { T } from "../textes";

export const dynamic = "force-dynamic";

export default async function Connexion() {
  // Déjà connecté : inutile de redemander.
  if ((await compteConnecte()) !== null) redirect("/admin");

  return (
    <main className="connexion">
      <h1 className="titre-admin">{T.connexion.titre}</h1>
      <p className="accroche-admin">{T.connexion.accroche}</p>
      <FormulaireConnexion />
    </main>
  );
}
