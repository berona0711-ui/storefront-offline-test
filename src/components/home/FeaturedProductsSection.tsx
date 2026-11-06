import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Suspense } from "react";
import { FeaturedProducts } from "@/components/products/FeaturedProducts";
import { ProductCardSkeleton } from "@/components/products/ProductCardSkeleton";
import { Button } from "@/components/ui/button";

function CarouselSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {[...Array(4)].map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

interface FeaturedProductsSectionProps {
  basePath: string;
  locale: string;
  country: string;
  currency?: string;
}

export async function FeaturedProductsSection({
  basePath,
  locale,
  country,
  currency,
}: FeaturedProductsSectionProps) {
  const t = await getTranslations({
    locale: locale as Locale,
    namespace: "home",
  });

  return (
    <section className="py-16 md:py-24 bg-white border-b border-stone-200/80 featured-products">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 pb-4 border-b border-stone-200/60">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-emerald-800 mb-1.5">
              Community Favoriten
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
              {t("featuredProducts") || "Beliebte Artikel & Statement-Pieces"}
            </h2>
            <p className="mt-1 text-sm text-stone-600">
              Kufiyas, Streetwear und Accessoires, die ein klares Zeichen setzen.
            </p>
          </div>
          <Button
            variant="ghost"
            className="text-[#005c2e] hover:text-emerald-800 hover:bg-emerald-50 text-sm font-semibold gap-1.5 self-start sm:self-auto rounded-lg px-3 py-2"
            asChild
          >
            <Link href={`${basePath}/products`}>
              <span>{t("viewAll") || "Alle Produkte ansehen"}</span>
              <span aria-hidden="true">&rarr;</span>
            </Link>
          </Button>
        </div>
        <Suspense fallback={<CarouselSkeleton />}>
          <FeaturedProducts
            basePath={basePath}
            locale={locale}
            country={country}
            currency={currency}
          />
        </Suspense>
      </div>
    </section>
  );
}
