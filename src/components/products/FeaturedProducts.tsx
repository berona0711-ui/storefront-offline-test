import dynamic from "next/dynamic";
import type { Product } from "@spree/sdk";
import { ProductCardSkeleton } from "@/components/products/ProductCardSkeleton";
import { PRODUCT_CARD_FIELDS } from "@/lib/data/cached";
import { cachedListProducts } from "@/lib/data/products";
import { getAccessToken, getClient } from "@/lib/spree";

const LazyProductCarousel = dynamic(
  () =>
    import("@/components/products/ProductCarousel").then((mod) => ({
      default: mod.ProductCarousel,
    })),
  {
    loading: () => (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    ),
  },
);

interface FeaturedProductsProps {
  basePath: string;
  locale: string;
  country: string;
  currency?: string;
}

export async function FeaturedProducts({
  basePath,
  locale,
  country,
  currency = "EUR",
}: FeaturedProductsProps) {
  let products: Product[] = [];
  try {
    const userToken = await getAccessToken();
    const client = getClient();

    // 1. Zuerst versuchen, die manuell sortierte Kollektion "Startseite" zu laden
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const collectionsClient = client.collections as any;
      if (collectionsClient?.products?.list) {
        // Sucht nach der Kollektion 'Startseite' (ID coll_V0dXmZF31w oder Permalink liberta)
        const colRes = await collectionsClient.products.list(
          "coll_V0dXmZF31w",
          { limit: 20, fields: PRODUCT_CARD_FIELDS },
          { locale, country },
        );
        if (colRes?.data && Array.isArray(colRes.data) && colRes.data.length > 0) {
          products = colRes.data;
        }
      }
    } catch {
      // Fallback zur Standard-Produktliste, falls Kollektion nicht erreichbar
    }

    // 2. Fallback: Wenn keine Kollektions-Produkte geladen werden konnten
    if (products.length === 0) {
      const productsResponse = await cachedListProducts(
        { limit: 8, fields: PRODUCT_CARD_FIELDS },
        { locale, country },
        "dtc",
        userToken,
      );
      if (productsResponse?.data && Array.isArray(productsResponse.data)) {
        products = productsResponse.data;
      }
    }
  } catch {
    products = [];
  }

  return (
    <LazyProductCarousel
      products={products}
      basePath={basePath}
      currency={currency}
    />
  );
}
