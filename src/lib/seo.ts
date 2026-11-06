import type { Category, Media, Product } from "@spree/sdk";
import { ensureProtocol, getStoreName, getStoreUrl } from "@/lib/store";

/**
 * Default social image path (stored in public/).
 * Replace public/social-image.png with your own 1200x630 OG image.
 */
export const SOCIAL_IMAGE_PATH = "/social-image.png";

/**
 * Build a full canonical URL from a store URL and a relative path.
 */
export function buildCanonicalUrl(storeUrl: string, path: string): string {
  const base = ensureProtocol(storeUrl).replace(/\/$/, "");
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${base}${cleanPath}`;
}

/**
 * Strip HTML tags from a string.
 */
export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").trim();
}

/**
 * Build JSON-LD Product schema.
 * https://schema.org/Product
 */
export function buildProductJsonLd(
  product: Product,
  canonicalUrl: string,
): Record<string, unknown> {
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    url: canonicalUrl,
  };

  if (product.description) {
    schema.description = stripHtml(product.description);
  }

  if (product.default_variant?.sku) {
    schema.sku = product.default_variant.sku;
  }

  const imageUrls = (product.media || [])
    .map((img: Media) => img.original_url || img.large_url)
    .filter((url: string | undefined): url is string => Boolean(url));

  if (imageUrls.length > 0) {
    schema.image = imageUrls;
  }

  const defaultVariant = product.default_variant;
  if (defaultVariant?.price) {
    schema.offers = {
      "@type": "Offer",
      price: defaultVariant.price.amount,
      priceCurrency: defaultVariant.price.currency,
      availability:
        defaultVariant.in_stock !== false
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      url: canonicalUrl,
    };
  }

  return schema;
}

/**
 * Build JSON-LD BreadcrumbList schema for category hierarchy.
 * https://schema.org/BreadcrumbList
 */
export function buildBreadcrumbJsonLd(
  category: Category,
  basePath: string,
  storeUrl: string,
): Record<string, unknown> {
  const itemListElement: Array<{
    "@type": string;
    position: number;
    name: string;
    item: string;
  }> = [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: ensureProtocol(storeUrl) + (basePath || "/"),
    },
  ];

  let position = 2;

  if (category.ancestors && category.ancestors.length > 0) {
    for (const ancestor of category.ancestors) {
      itemListElement.push({
        "@type": "ListItem",
        position: position++,
        name: ancestor.name,
        item: buildCanonicalUrl(storeUrl, `${basePath}/c/${ancestor.permalink}`),
      });
    }
  }

  itemListElement.push({
    "@type": "ListItem",
    position,
    name: category.name,
    item: buildCanonicalUrl(storeUrl, `${basePath}/c/${category.permalink}`),
  });

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement,
  };
}

/**
 * Build JSON-LD Organization schema for the root layout.
 * https://schema.org/Organization
 */
export function buildOrganizationJsonLd(
  storeUrl: string,
): Record<string, unknown> {
  const org: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: getStoreName(),
    url: ensureProtocol(storeUrl),
  };

  const logoUrl = process.env.STORE_LOGO_URL;
  if (logoUrl) {
    org.logo = logoUrl;
  }

  const socials = [
    process.env.STORE_TWITTER &&
      (process.env.STORE_TWITTER.startsWith("http")
        ? process.env.STORE_TWITTER
        : `https://twitter.com/${process.env.STORE_TWITTER.replace(/^@/, "")}`),
    process.env.STORE_FACEBOOK,
    process.env.STORE_INSTAGRAM,
  ].filter((url): url is string => Boolean(url));

  if (socials.length > 0) {
    org.sameAs = socials;
  }

  const contactEmail = process.env.STORE_SUPPORT_EMAIL;
  if (contactEmail) {
    org.contactPoint = {
      "@type": "ContactPoint",
      email: contactEmail,
      contactType: "customer service",
    };
  }

  return org;
}
