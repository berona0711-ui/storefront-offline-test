import type { Metadata } from "next";
import { getCachedCategory } from "@/lib/data/cached";
import { cachedGetCategory } from "@/lib/data/categories";
import {
  buildLocalizedAlternates,
  translationFingerprint,
} from "@/lib/metadata/alternates";
import { SOCIAL_IMAGE_PATH } from "@/lib/seo";
import { getStoreName, getStoreUrl } from "@/lib/store";

export interface CategoryMetadataParams {
  country: string;
  locale: string;
  permalink: string[];
}

export async function generateCategoryMetadata({
  country,
  locale,
  permalink,
}: CategoryMetadataParams): Promise<Metadata> {
  const fullPermalink = permalink.join("/");

  let category;
  try {
    category = await getCachedCategory(fullPermalink, [
      "ancestors",
      "children",
    ]);
  } catch {
    return { title: "Category Not Found" };
  }

  if (!category) {
    return { title: "Category Not Found" };
  }

  const title = category.meta_title || category.name;
  const description =
    category.meta_description ||
    category.description ||
    `Entdecke authentische Produkte der Kategorie ${category.name} im offiziellen FreeFalastin Shop.`;

  const storeUrl = getStoreUrl();
  const localizedAlternates = storeUrl
    ? await buildLocalizedAlternates({
        storeUrl,
        country,
        locale,
        path: `/c/${category.permalink}`,
        currentResourceFingerprint: categoryTranslationFingerprint(category),
        resolvePath: async (target) => {
          const localizedCategory = await cachedGetCategory(
            category!.id,
            undefined,
            { country: target.country, locale: target.locale },
          );
          if (!localizedCategory) {
            return {
              path: `/c/${category!.permalink}`,
              fingerprint: categoryTranslationFingerprint(category!),
            };
          }
          return {
            path: `/c/${localizedCategory.permalink}`,
            fingerprint: categoryTranslationFingerprint(localizedCategory),
          };
        },
      })
    : undefined;

  const imageUrl = category.image_url || SOCIAL_IMAGE_PATH;

  return {
    title,
    description,
    ...(category.meta_keywords ? { keywords: category.meta_keywords } : {}),
    ...(localizedAlternates
      ? {
          alternates: {
            canonical: localizedAlternates.canonical,
            languages: localizedAlternates.languages,
          },
        }
      : {}),
    openGraph: {
      siteName: getStoreName(),
      title,
      description,
      ...(localizedAlternates ? { url: localizedAlternates.canonical } : {}),
      type: "website",
      images: [{ url: imageUrl, alt: category.name }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}

function categoryTranslationFingerprint(category: {
  name: string;
  permalink: string;
  description: string | null;
  description_html: string | null;
  meta_title: string | null;
  meta_description: string | null;
  meta_keywords: string | null;
}): string {
  return translationFingerprint(
    category.name,
    category.permalink,
    category.description,
    category.description_html,
    category.meta_title,
    category.meta_description,
    category.meta_keywords,
  );
}
