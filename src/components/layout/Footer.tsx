import type { Category } from "@spree/sdk";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";
import { POLICY_LINKS } from "@/lib/constants/policies";
import { isWholesaleEnabled } from "@/lib/spree";
import { getStoreDescription, getStoreName } from "@/lib/store";
import { CurrentYear } from "./CurrentYear";

const storeName = getStoreName();
const storeDescription = getStoreDescription();

interface FooterProps {
  basePath: string;
  locale: Locale;
  categoryLinks: ReactNode;
}

interface FooterCategoryLinksProps {
  rootCategories: Category[];
  basePath: string;
}

export function FooterCategoryLinks({
  rootCategories,
  basePath,
}: FooterCategoryLinksProps) {
  return rootCategories.map((category) => (
    <li key={category.id}>
      <Link
        href={`${basePath}/c/${category.permalink}`}
        className="text-sm text-neutral-400 hover:text-neutral-200 transition-colors"
      >
        {category.name}
      </Link>
    </li>
  ));
}

export async function Footer({ basePath, locale, categoryLinks }: FooterProps) {
  const t = await getTranslations({ locale, namespace: "footer" });
  const tp = await getTranslations({ locale, namespace: "policies" });
  const wholesaleEnabled = isWholesaleEnabled();

  return (
    <footer className="bg-[#071d12] text-stone-300 border-t border-emerald-950/80">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-12 pb-12 border-b border-white/10">
          {/* Brand & Mission Column (5 cols) */}
          <div className="md:col-span-5">
            <Link href={basePath || "/"} className="inline-block text-xl font-bold tracking-tight text-white mb-3">
              {storeName}
            </Link>
            <p className="text-sm text-stone-400 max-w-sm leading-relaxed mb-6">
              {t("description") || storeDescription}
            </p>

            <div className="flex flex-col gap-2.5 text-xs">
              <a
                href="https://blog.freefalastin.de"
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-400 hover:text-emerald-300 transition-colors font-semibold inline-flex items-center gap-1.5"
              >
                <span>🍉 Zum FreeFalastin Blog</span>
                <span aria-hidden="true">&rarr;</span>
              </a>
              <a
                href="https://blog.freefalastin.de/mission"
                target="_blank"
                rel="noopener noreferrer"
                className="text-stone-300 hover:text-white transition-colors inline-flex items-center gap-1.5"
              >
                <span>❤️ Hilfsprojekte &amp; Spendenberichte</span>
              </a>
              <a
                href="https://blog.freefalastin.de/about"
                target="_blank"
                rel="noopener noreferrer"
                className="text-stone-400 hover:text-stone-200 transition-colors inline-flex items-center gap-1.5"
              >
                <span>📖 Über die Initiative</span>
              </a>
            </div>
          </div>

          {/* Shop Links (2 cols) */}
          <div className="md:col-span-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-4">
              {t("shop") || "Kollektionen"}
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  href={`${basePath}/products`}
                  className="text-stone-400 hover:text-white transition-colors"
                >
                  {t("allProducts") || "Alle Produkte"}
                </Link>
              </li>
              <li>
                <Link
                  href={`${basePath}/products?category=kufiya`}
                  className="text-stone-400 hover:text-white transition-colors"
                >
                  Kufiyas &amp; Schals
                </Link>
              </li>
              <li>
                <Link
                  href={`${basePath}/products?category=clothing`}
                  className="text-stone-400 hover:text-white transition-colors"
                >
                  Hoodies &amp; Shirts
                </Link>
              </li>
              <li>
                <Link
                  href={`${basePath}/products?category=accessories`}
                  className="text-stone-400 hover:text-white transition-colors"
                >
                  Accessoires &amp; Pins
                </Link>
              </li>
              {categoryLinks}
            </ul>
          </div>

          {/* Account & Service (2 cols) */}
          <div className="md:col-span-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-4">
              {t("account") || "Kundenservice"}
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  href={`${basePath}/account`}
                  className="text-stone-400 hover:text-white transition-colors"
                >
                  {t("myAccount")}
                </Link>
              </li>
              <li>
                <Link
                  href={`${basePath}/account/orders`}
                  className="text-stone-400 hover:text-white transition-colors"
                >
                  {t("orderHistory")}
                </Link>
              </li>
              <li>
                <Link
                  href={`${basePath}/cart`}
                  className="text-stone-400 hover:text-white transition-colors"
                >
                  {t("cart")}
                </Link>
              </li>
              {wholesaleEnabled && (
                <li>
                  <Link
                    href={`${basePath}/wholesale`}
                    className="text-stone-400 hover:text-white transition-colors"
                  >
                    {t("wholesale")}
                  </Link>
                </li>
              )}
            </ul>
          </div>

          {/* Policies & Trust (3 cols) */}
          <div className="md:col-span-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-4">
              {t("policies") || "Rechtliches"}
            </h3>
            <ul className="space-y-2.5 text-sm">
              {POLICY_LINKS.map((policy) => (
                <li key={policy.slug}>
                  <Link
                    href={`${basePath}/policies/${policy.slug}`}
                    className="text-stone-400 hover:text-white transition-colors"
                  >
                    {tp(policy.nameKey)}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="mt-6 pt-4 border-t border-white/5">
              <div className="text-[11px] font-medium text-stone-400 uppercase tracking-wider mb-2">
                Sichere Zahlung &amp; Expressversand
              </div>
              <p className="text-xs text-stone-500 leading-relaxed">
                SSL-Verschlüsselung, VISA, Mastercard, PayPal, Klarna &amp; Apple Pay.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-400">
          <p>
            &copy; <CurrentYear /> {storeName}. Solidarität tragen &amp; Hoffnung schenken.
          </p>
          <div className="flex items-center gap-4 text-stone-400">
            <span>Zuverlässiger Versand</span>
            <span aria-hidden="true">·</span>
            <span>Gemeinschaft &amp; Hilfe</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
