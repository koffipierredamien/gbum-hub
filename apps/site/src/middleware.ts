import createMiddleware from "next-intl/middleware";
import { routage } from "./i18n/routage";

export default createMiddleware(routage);

export const config = {
  // Tout sauf les fichiers de Next, l'API et les fichiers servis tels quels.
  matcher: ["/((?!api|_next|_vercel|fichiers|.*\\..*).*)"],
};
