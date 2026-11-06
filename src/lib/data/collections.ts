"use server";

import type { Collection, PaginatedResponse, Product, ProductListParams } from "@spree/sdk";
import { cacheLife, cacheTag } from "next/cache";
import { getClient, getLocaleOptions } from "@/lib/spree";

async function cachedListCollections(
  options: { locale?: string; country?: string },
): Promise<PaginatedResponse<Collection>> {
  "use cache: remote";
  cacheLife("hours");
  cacheTag("collections");
  try {
    const client = getClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const collectionsClient = (client as any).collections;
    if (collectionsClient?.list) {
      return await collectionsClient.list({ per_page: 50 }, options);
    }
    return { data: [], meta: { count: 0, page: 1, pages: 1 } as any, links: {} as any };
  } catch (error) {
    console.error("Failed to list collections:", error);
    return { data: [], meta: { count: 0, page: 1, pages: 1 } as any, links: {} as any };
  }
}

export async function getCollections(
  options?: { locale?: string; country?: string },
): Promise<PaginatedResponse<Collection>> {
  try {
    const localeOptions = options ?? (await getLocaleOptions());
    return await cachedListCollections(localeOptions);
  } catch {
    return { data: [], meta: { count: 0, page: 1, pages: 1 } as any, links: {} as any };
  }
}

async function cachedGetCollection(
  idOrPermalink: string,
  options: { locale?: string; country?: string },
): Promise<Collection | null> {
  "use cache: remote";
  cacheLife("tenMinutes");
  cacheTag("collection");
  cacheTag(`collection-${idOrPermalink}`);
  try {
    const client = getClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const collectionsClient = (client as any).collections;
    if (collectionsClient?.get) {
      return await collectionsClient.get(idOrPermalink, undefined, options);
    }
    return null;
  } catch (error) {
    console.error(`Failed to get collection ${idOrPermalink}:`, error);
    return null;
  }
}

export async function getCollection(
  idOrPermalink: string,
): Promise<Collection | null> {
  try {
    const options = await getLocaleOptions();
    return await cachedGetCollection(idOrPermalink, options);
  } catch {
    return null;
  }
}

async function cachedListCollectionProducts(
  idOrPermalink: string,
  params: ProductListParams | undefined,
  options: { locale?: string; country?: string },
): Promise<PaginatedResponse<Product>> {
  "use cache: remote";
  cacheLife("tenMinutes");
  cacheTag("collection-products");
  cacheTag(`collection-products-${idOrPermalink}`);
  try {
    const client = getClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const collectionsClient = (client as any).collections;
    if (collectionsClient?.products?.list) {
      return await collectionsClient.products.list(idOrPermalink, params, options);
    }
    return { data: [], meta: { count: 0, page: 1, pages: 1 } as any, links: {} as any };
  } catch (error) {
    console.error(`Failed to list collection products for ${idOrPermalink}:`, error);
    return { data: [], meta: { count: 0, page: 1, pages: 1 } as any, links: {} as any };
  }
}

export async function getCollectionProducts(
  idOrPermalink: string,
  params?: ProductListParams,
): Promise<PaginatedResponse<Product>> {
  try {
    const options = await getLocaleOptions();
    return await cachedListCollectionProducts(idOrPermalink, params, options);
  } catch {
    return { data: [], meta: { count: 0, page: 1, pages: 1 } as any, links: {} as any };
  }
}
