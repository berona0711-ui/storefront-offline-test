import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductListing } from "@/components/products/ProductListing";
import { getCollection, getCollectionProducts } from "@/lib/data/collections";
import { resolveCurrency } from "@/lib/data/markets";
import { getProductFilters } from "@/lib/data/products";
import { parseListingSearchParams } from "@/lib/utils/listing-search-params";
import { CollectionBanner } from "./CollectionBanner";

interface CollectionPageProps {
  params: Promise<{
    country: string;
    locale: string;
    permalink: string;
  }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export async function generateMetadata({
  params,
}: CollectionPageProps): Promise<Metadata> {
  const { permalink } = await params;
  const collection = await getCollection(permalink);

  if (!collection) {
    return { title: "Kollektion nicht gefunden" };
  }

  const title = `${collection.name} Kollektion | FreeFalastin Shop`;
  const description =
    collection.description ||
    `Entdecke die Kollektion ${collection.name} im offiziellen FreeFalastin Shop.`;
  const imageUrl = collection.image_url || "/social-image.png";

  return {
    title,
    description,
    openGraph: {
      siteName: "FreeFalastin Shop",
      title,
      description,
      type: "website",
      images: [
        {
          url: imageUrl,
          alt: `${collection.name} Kollektion – FreeFalastin Shop`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}

export default async function CollectionPage({
  params,
  searchParams,
}: CollectionPageProps) {
  const { country, locale, permalink } = await params;
  const rawSearchParams = await searchParams;
  const basePath = `/${country}/${locale}`;

  let collection;
  try {
    collection = await getCollection(permalink);
  } catch (error) {
    console.error("Failed to fetch collection:", error);
    notFound();
  }

  if (!collection) {
    notFound();
  }

  const currency = await resolveCurrency(country);
  const listingState = parseListingSearchParams(rawSearchParams);

  // Pre-bind collectionId onto the server action so InfiniteProductList gets a single-arg fetcher
  const fetchCollectionProducts = getCollectionProducts.bind(null, collection.id);

  return (
    <div>
      <CollectionBanner collection={collection} basePath={basePath} />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16">
        <ProductListing
          state={listingState}
          basePath={basePath}
          currency={currency}
          locale={locale as Locale}
          listId={`collection-${collection.id}`}
          listName={`Collection: ${collection.name}`}
          fetchProducts={fetchCollectionProducts}
          fetchFilters={getProductFilters}
        />
      </div>
    </div>
  );
}
