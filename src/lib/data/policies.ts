"use server";

import { type Policy, SpreeError } from "@spree/sdk";
import { cacheLife, cacheTag } from "next/cache";
import { getClient, getLocaleOptions } from "@/lib/spree";

export async function cachedGetPolicy(
  slugOrId: string,
  options: { locale?: string; country?: string },
): Promise<Policy | null> {
  "use cache: remote";
  cacheLife("tenMinutes");
  cacheTag("policies", `policy:${slugOrId}`);
  try {
    return await getClient().policies.get(slugOrId, options);
  } catch (error) {
    return null;
  }
}

export async function getPolicy(
  slugOrId: string,
  options?: { locale?: string; country?: string },
): Promise<Policy | null> {
  try {
    return await cachedGetPolicy(slugOrId, options ?? (await getLocaleOptions()));
  } catch (error) {
    return null;
  }
}
