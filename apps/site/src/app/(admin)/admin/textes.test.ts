import { describe, expect, it } from "vitest";
import fr from "../../../../messages/fr.json";
import en from "../../../../messages/en.json";
import { PAGES_EDITABLES } from "./textes";

/**
 * Le garde-fou de l'écran « Les pages ».
 *
 * Un texte publié depuis l'administration RECOUVRE la clé de traduction du
 * même nom. Si cette clé n'existe nulle part, le texte est accepté,
 * enregistré, annoncé comme publié — et n'apparaît sur aucune page. Le
 * travail de quelqu'un disparaît sans un mot.
 *
 * C'est arrivé : après la réduction du site du 9 novembre 2026, l'écran
 * proposait encore d'écrire le témoignage d'un étudiant, le prochain temps
 * fort, et les pages « Agenda » et « Soutenir », toutes supprimées. Ce test
 * fait que cela ne peut plus arriver en silence.
 */
describe("ce que l'administration propose d'écrire", () => {
  const catalogues = { fr, en } as Record<string, Record<string, unknown>>;

  for (const page of PAGES_EDITABLES) {
    for (const section of page.sections) {
      for (const langue of ["fr", "en"]) {
        it(`${langue} : ${page.espace}.${section.cle} existe dans les textes du site`, () => {
          const espace = catalogues[langue]?.[page.espace];
          expect(espace, `l'espace « ${page.espace} » n'existe pas`).toBeTypeOf(
            "object",
          );
          expect(Object.keys(espace as object)).toContain(section.cle);
        });
      }
    }
  }
});
