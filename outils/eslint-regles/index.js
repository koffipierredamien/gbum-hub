/**
 * Règles ESLint propres au GBUM.
 *
 * Une seule pour l'instant, et c'est la plus importante du projet : R2.
 *
 * L'audit de l'application existante a relevé **57 blocs `except …: pass`** et
 * 36 `except Exception` dans un seul fichier. Le code le constatait lui-même :
 * « le filtre par ville de l'annuaire disparaissait en silence, avalé par son
 * try/except. » Une règle qu'on doit *penser* à appliquer finit par ne plus
 * l'être — celle-ci s'applique toute seule.
 */

/** @type {import('eslint').Rule.RuleModule} */
const aucuneErreurAvalee = {
  meta: {
    type: "problem",
    docs: {
      description:
        "Un catch journalise, transforme en erreur métier, ou remonte. Jamais rien.",
    },
    schema: [],
    messages: {
      avalee:
        "R2 — cette erreur est avalée. Un catch fait au moins l'une de ces trois " +
        "choses : journaliser avec contexte, la transformer en erreur métier typée, " +
        "ou la remonter. Ne rien faire rend une panne, une faute de frappe et un " +
        "vrai refus indiscernables.",
    },
  },

  create(context) {
    /**
     * Le corps du catch utilise-t-il l'erreur, ou en fabrique-t-il une autre ?
     * On ne cherche pas à deviner l'intention : on vérifie qu'il se passe
     * quelque chose de traçable. Trois signes suffisent, et ils couvrent les
     * trois issues autorisées par R2.
     */
    function traiteLErreur(node) {
      const source = context.sourceCode;
      const texte = source.getText(node.body);

      // 1. Elle remonte — `throw` sous n'importe quelle forme.
      if (/\bthrow\b/.test(texte)) return true;

      // 2. Elle est journalisée. On accepte tout appel dont le nom évoque un
      //    journal ; nommer autrement son enregistreur est un choix qu'il faut
      //    alors assumer devant la revue.
      if (/\b(journal|logger|log|console)\s*\.\s*\w+\s*\(/.test(texte)) return true;

      // 3. Le paramètre du catch est cité quelque part — donc l'erreur n'est
      //    pas perdue : elle est enveloppée, convertie, ou renvoyée.
      const parametre = node.param;
      if (parametre && parametre.type === "Identifier") {
        const dansLeCorps = new RegExp(`\\b${parametre.name}\\b`);
        if (dansLeCorps.test(texte)) return true;
      }

      return false;
    }

    return {
      CatchClause(node) {
        if (!traiteLErreur(node)) {
          context.report({ node, messageId: "avalee" });
        }
      },
    };
  },
};

export default {
  rules: { "aucune-erreur-avalee": aucuneErreurAvalee },
};
