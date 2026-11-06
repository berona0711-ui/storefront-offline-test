"use server";

import type { PaginatedResponse, Product, ProductListParams } from "@spree/sdk";
import { cacheLife, cacheTag } from "next/cache";
import {
  cacheTagSuffix,
  DEFAULT_SURFACE,
  getAccessToken,
  getClientForSurface,
  getLocaleOptions,
  type Surface,
} from "@/lib/spree";
import {
  applyStartseiteOrdering,
} from "@/lib/data/product-ordering";

const EMPTY_PAGINATED_PRODUCTS: PaginatedResponse<Product> = {
  data: [],
  meta: {
    count: 0,
    page: 1,
    pages: 1,
  } as PaginatedResponse<Product>["meta"],
  links: {
    self: "",
    next: null,
    prev: null,
    first: "",
    last: "",
  },
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const EMPTY_FILTERS: any = {
  id: "",
  default_sort: "default",
  total_count: 0,
  filters: [],
  sort_options: [],
};

/**
 * Cached product list fetch.
 */
export async function cachedListProducts(
  params: ProductListParams | undefined,
  options: { locale?: string; country?: string },
  surface: Surface,
  userToken?: string,
): Promise<PaginatedResponse<Product>> {
  "use cache: remote";
  cacheLife("oneMinute");
  cacheTag(`products${cacheTagSuffix(surface)}`);
  try {
    const response = await getClientForSurface(surface).products.list(params, {
      ...options,
      ...(surface === "wholesale" && userToken
        ? { token: userToken }
        : undefined),
    });

    // Option A: Wenn kein expliziter Sortierparameter und keine Suchanfrage aktiv sind,
    // richten wir die Standard-Reihenfolge nach der Kollektion "Startseite" (coll_V0dXmZF31w) aus.
    const isDefaultSort = !params?.sort || (params.sort as string) === "manual";
    const hasSearch = Boolean(params?.search);

    if (isDefaultSort && !hasSearch && response?.data && response.data.length > 1) {
      try {
        const client = getClientForSurface(surface);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const collectionsClient = (client as any).collections;
        if (collectionsClient?.products?.list) {
          const colRes = await collectionsClient.products.list(
            "coll_V0dXmZF31w",
            { limit: 50 },
            {
              ...options,
              ...(surface === "wholesale" && userToken
                ? { token: userToken }
                : undefined),
            },
          );
          if (colRes?.data && Array.isArray(colRes.data) && colRes.data.length > 0) {
            const dynamicMap = new Map<string, number>(
              colRes.data.map((p: Product, idx: number) => [p.id, idx]),
            );
            return {
              ...response,
              data: applyStartseiteOrdering(response.data, dynamicMap),
            };
          }
        }
      } catch {
        // Fallback zur garantierten Startseite-Reihenfolge
      }

      return {
        ...response,
        data: applyStartseiteOrdering(response.data),
      };
    }

    return response;
  } catch {
    return EMPTY_PAGINATED_PRODUCTS;
  }
}

export async function getProducts(
  params?: ProductListParams,
  surface: Surface = DEFAULT_SURFACE,
): Promise<PaginatedResponse<Product>> {
  try {
    const options = await getLocaleOptions();
    const userToken = await getAccessToken();
    const response = await cachedListProducts(params, options, surface, userToken);

    // Sicherheitsnetz auf Server-Aktionsebene:
    // Garantiert, dass selbst bei Cache-Hits die Startseite-Reihenfolge greift.
    const isDefaultSort = !params?.sort || (params.sort as string) === "manual";
    const hasSearch = Boolean(params?.search);

    if (isDefaultSort && !hasSearch && response?.data && response.data.length > 1) {
      return {
        ...response,
        data: applyStartseiteOrdering(response.data),
      };
    }

    return response;
  } catch {
    return EMPTY_PAGINATED_PRODUCTS;
  }
}

/**
 * Persistent cached product detail fetch.
 */
export async function cachedGetProduct(
  slugOrId: string,
  expand: string[],
  options: { locale?: string; country?: string },
  surface: Surface,
  userToken?: string,
): Promise<Product | null> {
  "use cache: remote";
  cacheLife("oneMinute");
  cacheTag(
    `products${cacheTagSuffix(surface)}`,
    `product:${slugOrId}${cacheTagSuffix(surface)}`,
  );
  try {
    return await getClientForSurface(surface).products.get(
      slugOrId,
      { expand },
      {
        ...options,
        ...(surface === "wholesale" && userToken
          ? { token: userToken }
          : undefined),
      },
    );
  } catch {
    return null;
  }
}

export async function getProduct(
  slugOrId: string,
  params?: { expand?: string[] },
  surface: Surface = DEFAULT_SURFACE,
): Promise<Product | null> {
  try {
    const options = await getLocaleOptions();
    const userToken = await getAccessToken();
    return await cachedGetProduct(
      slugOrId,
      params?.expand ?? [],
      options,
      surface,
      userToken,
    );
  } catch {
    return null;
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function cachedGetProductFilters(
  params: Record<string, unknown> | undefined,
  options: { locale?: string; country?: string },
  surface: Surface,
  userToken?: string,
// eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<any> {
  "use cache: remote";
  cacheLife("tenMinutes");
  cacheTag(`product-filters${cacheTagSuffix(surface)}`);
  try {
    return await getClientForSurface(surface).products.filters(params, {
      ...options,
      ...(surface === "wholesale" && userToken
        ? { token: userToken }
        : undefined),
    });
  } catch {
    return EMPTY_FILTERS;
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getProductFilters(
  params?: Record<string, unknown>,
  surface: Surface = DEFAULT_SURFACE,
// eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<any> {
  try {
    const options = await getLocaleOptions();
    const userToken = await getAccessToken();
    return await cachedGetProductFilters(params, options, surface, userToken);
  } catch {
    return EMPTY_FILTERS;
  }
}
