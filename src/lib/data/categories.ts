"use server";

import type { CategoryListParams, ProductListParams } from "@spree/sdk";
import { cacheLife, cacheTag } from "next/cache";
import { getAccessToken, getClient, getLocaleOptions } from "@/lib/spree";

async function cachedListCategories(
  params: CategoryListParams | undefined,
  options: { locale?: string; country?: string },
) {
  "use cache: remote";
  cacheLife("hours");
  cacheTag("categories");
  try {
    return await getClient().categories.list(params, options);
  } catch {
    return { data: [] };
  }
}

export async function getCategories(
  params?: CategoryListParams,
  options?: { locale?: string; country?: string },
) {
  try {
    const localeOptions = options ?? (await getLocaleOptions());
    return await cachedListCategories(params, localeOptions);
  } catch {
    return { data: [] };
  }
}

export async function cachedGetCategory(
  idOrPermalink: string,
  params: { expand?: string[] } | undefined,
  options: { locale?: string; country?: string },
) {
  "use cache: remote";
  cacheLife("tenMinutes");
  cacheTag("category");
  try {
    return await getClient().categories.get(idOrPermalink, params, options);
  } catch {
    return null;
  }
}

export async function getCategory(
  idOrPermalink: string,
  params?: { expand?: string[] },
) {
  try {
    const options = await getLocaleOptions();
    return await cachedGetCategory(idOrPermalink, params, options);
  } catch {
    return null;
  }
}

/**
 * Persistent cached category products fetch.
 */
export async function cachedListCategoryProducts(
  idOrPermalink: string,
  params: ProductListParams | undefined,
  options: { locale?: string; country?: string },
) {
  "use cache: remote";
  cacheLife("tenMinutes");
  cacheTag("category-products");
  try {
    // Use products list with category filter as categories.products may not exist
    const client = getClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const categoriesClient = client.categories as any;
    if (categoriesClient.products?.list) {
      return await categoriesClient.products.list(idOrPermalink, params, options);
    }
    // Fallback: list products filtered by category
    return await client.products.list(
      { ...params, filter: { ...((params as any)?.filter ?? {}), category_id: idOrPermalink } } as any,
      options,
    );
  } catch {
    return { data: [], meta: { count: 0, page: 1, pages: 1 } };
  }
}

export async function getCategoryProducts(
  idOrPermalink: string,
  params?: ProductListParams,
) {
  try {
    const options = await getLocaleOptions();
    return await cachedListCategoryProducts(idOrPermalink, params, options);
  } catch {
    return { data: [], meta: { count: 0, page: 1, pages: 1 } };
  }
}
