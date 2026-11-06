"use server";

import { cacheLife, cacheTag } from "next/cache";
import { getClient, getLocaleOptions } from "@/lib/spree";

export async function getCountries() {
  try {
    const options = await getLocaleOptions();
    return await getClient().countries.list(options);
  } catch (error) {
    return { data: [{ id: "de", iso: "de", name: "Deutschland" }] };
  }
}

async function cachedGetCountry(
  iso: string,
  options: { locale?: string; country?: string },
) {
  "use cache: remote";
  cacheLife("hours");
  cacheTag("country", `country-${iso}`);
  try {
    return await getClient().countries.get(iso, { expand: ["states"] }, options);
  } catch (error) {
    return { id: iso, iso: iso, name: "Deutschland", states: [] };
  }
}

export async function getCountry(iso: string) {
  try {
    const options = await getLocaleOptions();
    return await cachedGetCountry(iso, options);
  } catch (error) {
    return { id: iso, iso: iso, name: "Deutschland", states: [] };
  }
}
