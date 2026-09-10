import type { ReactNode } from "react";
import { NextIntlClientProvider } from "next-intl";
import { getTranslations } from "next-intl/server";
import { LANGUES } from "../../../i18n/routage";
import { preparerLangue } from "../../../i18n/langue";
import { EnTete } from "../../../composants/en-tete";
import { PiedDePage } from "../../../composants/pied-de-page";
import { Hanken_Grotesk, Newsreader } from "next/font/google";
import "../../../styles/global.css";

/**
 * Les deux fontes sont TÉLÉCHARGÉES À LA CONSTRUCTION et servies par le site
 * lui-même. Un `@import` vers Google aurait fait partir, à chaque visite, une
 * requête vers un tiers : plus lente depuis le Maroc, et qui apprend à ce
 * tiers qui lit nos pages. C'est la règle S6 appliquée aux fontes — on ne
 * construit pas sur ce qu'on ne peut pas emporter.
 */
const serif = Newsreader({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--police-serif-chargee",
  display: "swap",
});
const sans = Hanken_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--police-sans-chargee",
  display: "swap",
});

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
