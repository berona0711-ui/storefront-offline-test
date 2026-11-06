import type { Category } from "@spree/sdk";
import Link from "next/link";
import { connection } from "next/server";
import { cache, Suspense } from "react";
import { Footer, FooterCategoryLinks } from "@/components/layout/Footer";
import { Header, HeaderMobileMenu } from "@/components/layout/Header";
import { getCategories } from "@/lib/data/categories";
import { getCollections } from "@/lib/data/collections";

interface StorefrontLayoutProps {
  children: React.ReactNode;
  params: Promise<{ country: string; locale: string }>;
}

interface StorefrontNavigationProps {
  basePath: string;
  country: string;
  locale: string;
}

const EMPTY_CATEGORIES: Category[] = [];

function MobileNavigationFallback() {
  return (
    <div
      aria-hidden="true"
      className="size-10 rounded-md bg-gray-100 animate-pulse motion-reduce:animate-none"
    />
  );
}

function FooterCategoryLinksFallback() {
  return (
    <li aria-hidden="true">
      <span className="block h-4 w-24 rounded bg-white/10 animate-pulse motion-reduce:animate-none" />
    </li>
  );
}

/**
 * Navigation categories are optional chrome, so defer their first load until
 * there is a real request instead of making every prerendered page contact the
 * Store API. Primitive arguments let React deduplicate category navigation
 * consumers within the request; successful responses keep using the persistent
 * cache in getCategories.
 */
const getRootCategories = cache(async (country: string, locale: string) => {
  await connection();

  return getCategories(
    {
      depth_eq: 0,
      expand: ["children.children"],
    },
    { country, locale },
  )
    .then((res) => res.data)
    .catch((error) => {
      console.error("StorefrontLayout: failed to load categories", error);
      return EMPTY_CATEGORIES;
    });
});

const getStoreCollections = cache(async (country: string, locale: string) => {
  await connection();
  return getCollections({ country, locale })
    .then((res) => res.data)
    .catch(() => []);
});

function CategoryLinks({
  categories,
  basePath,
}: {
  categories: Category[];
  basePath: string;
}) {
  return (
    <ul>
      {categories.map((category) => (
        <li key={category.id}>
          <Link href={`${basePath}/c/${category.permalink}`}>
            {category.name}
          </Link>
          {category.children && category.children.length > 0 && (
            <CategoryLinks categories={category.children} basePath={basePath} />
          )}
        </li>
      ))}
    </ul>
  );
}

async function StorefrontMobileNavigation({
  basePath,
  country,
  locale,
}: StorefrontNavigationProps) {
  const [rootCategories, collections] = await Promise.all([
    getRootCategories(country, locale),
    getStoreCollections(country, locale),
  ]);

  return (
    <HeaderMobileMenu
      rootCategories={rootCategories}
      collections={collections}
      basePath={basePath}
    />
  );
}

async function StorefrontCategoryNavigation({
  basePath,
  country,
  locale,
}: StorefrontNavigationProps) {
  const rootCategories = await getRootCategories(country, locale);

  if (rootCategories.length === 0) return null;

  return (
    <nav aria-label="Category navigation" className="sr-only">
      <CategoryLinks categories={rootCategories} basePath={basePath} />
    </nav>
  );
}

async function StorefrontFooterCategoryLinks({
  basePath,
  country,
  locale,
}: StorefrontNavigationProps) {
  const rootCategories = await getRootCategories(country, locale);

  return (
    <FooterCategoryLinks rootCategories={rootCategories} basePath={basePath} />
  );
}

export default async function StorefrontLayout({
  children,
  params,
}: StorefrontLayoutProps) {
  const { country, locale } = await params;
  const basePath = `/${country}/${locale}`;

  return (
    <>
      <aside
        aria-label="Ankündigung"
        className="bg-[#0b2416] text-emerald-100/90 text-xs py-2 px-4 border-b border-emerald-950/80 font-medium tracking-wide"
      >
        <div className="container mx-auto flex items-center justify-center gap-3 text-center flex-wrap">
          <span className="inline-flex items-center gap-1.5 font-semibold text-white">
            <span aria-hidden="true">🍉</span>
            <span>FreeFalastin Shop</span>
          </span>
          <span className="hidden sm:inline text-emerald-500/60" aria-hidden="true">·</span>
          <span className="text-emerald-100/80">
            Kleidung mit Haltung. Jeder Kauf unterstützt Hilfsprojekte für Palästina.
          </span>
          <span className="hidden md:inline text-emerald-500/60" aria-hidden="true">·</span>
          <a
            href="https://blog.freefalastin.de"
            target="_blank"
            rel="noopener noreferrer"
            className="text-emerald-300 hover:text-white transition-colors underline underline-offset-4 font-medium inline-flex items-center gap-1"
          >
            Blog & Spendenberichte &rarr;
          </a>
        </div>
      </aside>
      <Header
        basePath={basePath}
        locale={locale as Locale}
        mobileNavigation={
          <Suspense fallback={<MobileNavigationFallback />}>
            <StorefrontMobileNavigation
              basePath={basePath}
              country={country}
              locale={locale}
            />
          </Suspense>
        }
      />
      <Suspense fallback={null}>
        <StorefrontCategoryNavigation
          basePath={basePath}
          country={country}
          locale={locale}
        />
      </Suspense>
      <main className="flex-1">{children}</main>
      <Footer
        basePath={basePath}
        locale={locale as Locale}
        categoryLinks={
          <Suspense fallback={<FooterCategoryLinksFallback />}>
            <StorefrontFooterCategoryLinks
              basePath={basePath}
              country={country}
              locale={locale}
            />
          </Suspense>
        }
      />
    </>
  );
}
