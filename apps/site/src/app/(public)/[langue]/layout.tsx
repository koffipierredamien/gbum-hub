import type { ReactNode } from "react";
import { NextIntlClientProvider } from "next-intl";
import { getTranslations } from "next-intl/server";
import { LANGUES } from "../../../i18n/routage";
import { preparerLangue } from "../../../i18n/langue";
import { EnTete } from "../../../composants/en-tete";
import { PiedDePage } from "../../../composants/pied-de-page";
import { sans, serif } from "../../../fontes/fontes";
import "../../../styles/global.css";

export function generateStaticParams() {
  return LANGUES.map((langue) => ({ langue }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ langue: string }>;
}) {
  const { langue } = await params;
  const t = await getTranslations({ locale: langue, namespace: "navigation" });
  return {
    title: { default: t("marque"), template: `%s · ${t("marque")}` },
    description: t("marqueLong"),
  };
}

export default async function Disposition({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ langue: string }>;
}) {
  const langue = await preparerLangue(params);
  const t = await getTranslations({ locale: langue, namespace: "navigation" });

  return (
    <html lang={langue} className={`${serif.variable} ${sans.variable}`}>
      <body>
        <NextIntlClientProvider>
          {/* Premier élément focalisable de chaque page : un visiteur au
              clavier ne traverse pas sept entrées de menu avant d'atteindre
              le contenu. */}
          <a className="evitement" href="#contenu">
            {t("evitement")}
          </a>
          <EnTete />
          <main id="contenu">{children}</main>
          <PiedDePage />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
