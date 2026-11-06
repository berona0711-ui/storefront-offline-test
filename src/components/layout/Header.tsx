import type { Category, Collection } from "@spree/sdk";
import { User } from "lucide-react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";
import { CartButton } from "@/components/layout/CartButton";
import { SearchToggle } from "@/components/layout/SearchToggle";
import { Button } from "@/components/ui/button";
import { isWholesaleEnabled } from "@/lib/spree";
import { getStoreName } from "@/lib/store";

const LazyMobileMenu = dynamic(
  () =>
    import("@/components/layout/MobileMenu").then((mod) => ({
      default: mod.MobileMenu,
    })),
  {
    loading: () => (
      <div className="inline-flex items-center justify-center h-10 w-10" />
    ),
  },
);

const LazyRegionPreferences = dynamic(
  () =>
    import("@/components/layout/RegionPreferences").then((mod) => ({
      default: mod.RegionPreferences,
    })),
  {
    loading: () => <div className="size-11" aria-hidden="true" />,
  },
);

const storeName = getStoreName();

interface HeaderProps {
  basePath: string;
  locale: Locale;
  mobileNavigation: ReactNode;
}

interface HeaderMobileMenuProps {
  rootCategories: Category[];
  collections?: Collection[];
  basePath: string;
}

export function HeaderMobileMenu({
  rootCategories,
  collections = [],
  basePath,
}: HeaderMobileMenuProps) {
  return (
    <LazyMobileMenu
      rootCategories={rootCategories}
      collections={collections}
      basePath={basePath}
      wholesaleEnabled={isWholesaleEnabled()}
    />
  );
}

export async function Header({
  basePath,
  locale,
  mobileNavigation,
}: HeaderProps) {
  const t = await getTranslations({ locale, namespace: "header" });
  const wholesaleEnabled = isWholesaleEnabled();

  return (
    <SearchToggle
      basePath={basePath}
      left={mobileNavigation}
      center={
        <Link href={basePath || "/"} className="flex items-center min-w-0 py-1">
          <Image
            src="/freefalastin-logo.svg"
            alt={storeName}
            width={160}
            height={38}
            className="max-w-full object-contain h-8 sm:h-9 w-auto"
            fetchPriority="high"
            loading="eager"
          />
        </Link>
      }
      navLinks={
        <>
          <Link
            href={`${basePath}/products`}
            className="text-stone-700 hover:text-[#005c2e] transition-colors whitespace-nowrap shrink-0 hover:underline hover:underline-offset-4 decoration-emerald-600"
          >
            {t("allProducts") || "Alle Produkte"}
          </Link>
          <Link
            href={`${basePath}/products?category=kufiya`}
            className="text-stone-700 hover:text-[#005c2e] transition-colors whitespace-nowrap shrink-0 hover:underline hover:underline-offset-4 decoration-emerald-600"
          >
            Kufiyas &amp; Schals
          </Link>
          <Link
            href={`${basePath}/products?category=clothing`}
            className="text-stone-700 hover:text-[#005c2e] transition-colors whitespace-nowrap shrink-0 hover:underline hover:underline-offset-4 decoration-emerald-600"
          >
            Hoodies &amp; Shirts
          </Link>
          <Link
            href={`${basePath}/products?category=accessories`}
            className="text-stone-700 hover:text-[#005c2e] transition-colors whitespace-nowrap shrink-0 hover:underline hover:underline-offset-4 decoration-emerald-600"
          >
            Accessoires &amp; Pins
          </Link>
          <a
            href="https://blog.freefalastin.de/mission"
            target="_blank"
            rel="noopener noreferrer"
            className="text-stone-700 hover:text-[#005c2e] transition-colors whitespace-nowrap shrink-0 hover:underline hover:underline-offset-4 decoration-emerald-600 inline-flex items-center gap-1"
          >
            <span>Über die Mission</span>
            <span className="text-xs text-stone-400">↗</span>
          </a>
        </>
      }
      rightStart={
        <div className="flex items-center gap-2">
          {/* Trade portal entry point */}
          {wholesaleEnabled && (
            <Link
              href={`${basePath}/wholesale`}
              className="hidden lg:inline-flex px-2.5 py-1 text-xs font-semibold text-slate-600 hover:text-slate-900 border border-slate-200 rounded-md hover:bg-slate-50 transition-colors whitespace-nowrap"
            >
              {t("wholesale")}
            </Link>
          )}
          <LazyRegionPreferences variant="header" />
        </div>
      }
      rightEnd={
        <>
          {/* Account - desktop only */}
          <div className="hidden md:block">
            <Button
              variant="ghost"
              size="icon-lg"
              className="text-stone-700 hover:text-stone-900 hover:bg-stone-100/80 rounded-full"
              asChild
            >
              <Link href={`${basePath}/account`} aria-label={t("account")}>
                <User className="size-5" />
              </Link>
            </Button>
          </div>

          {/* Cart */}
          <CartButton />
        </>
      }
    />
  );
}
