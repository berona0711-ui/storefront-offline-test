"use server";

import type { Market } from "@spree/sdk";
import { cacheLife, cacheTag } from "next/cache";
import { DEFAULT_LOCALE, resolveSupportedLocale } from "@/i18n/locales";
import { getClient, getLocaleOptions } from "@/lib/spree";
import { getDefaultCountry, getDefaultLocale } from "@/lib/store";

const FALLBACK_MARKETS: { data: Market[] } = {
  data: [
    {
      id: "de",
      name: "Deutschland",
      currency: "EUR",
      default_locale: "de",
      supported_locales: ["de", "en"],
      countries: [
        {
          id: "de",
          iso: "de",
          name: "Deutschland",
          states: [],
        },
      ],
    } as unknown as Market,
  ],
};

async function cachedListMarkets(options: {
  locale?: string;
  country?: string;
}) {
  "use cache: remote";
  cacheLife("hours");
  cacheTag("markets");
  try {
    return await getClient().markets.list(options);
  } catch (error) {
    return FALLBACK_MARKETS;
  }
}

async function cachedResolveMarket(
  country: string,
  options: { locale?: string; country?: string },
) {
  "use cache: remote";
  cacheLife("hours");
  cacheTag("resolved-market");
  try {
    return await getClient().markets.resolve(country, options);
  } catch (error) {
    return {
      data: FALLBACK_MARKETS.data[0],
    };
  }
}

async function cachedListMarketCountries(
  marketId: string,
  options: { locale?: string; country?: string },
) {
  "use cache: remote";
  cacheLife("hours");
  cacheTag("market-countries");
  try {
    return await getClient().markets.countries.list(marketId, options);
  } catch (error) {
    return { data: FALLBACK_MARKETS.data[0].countries };
  }
}

/**
 * List Markets through the configured default country and locale rather than
 * the request's cookies. The URL's country/locale pair may not be valid yet,
 * and keeping request data out of the lookup lets the result stay in the
 * static shell instead of blocking every page that needs it.
 */
export async function getStorefrontMarkets(): Promise<{ data: Market[] }> {
  try {
    return await cachedListMarkets({
      country: getDefaultCountry(),
      locale: resolveSupportedLocale(getDefaultLocale()) ?? DEFAULT_LOCALE,
    });
  } catch (error) {
    return FALLBACK_MARKETS;
  }
}

export async function resolveMarket(country: string) {
  try {
    const options = await getLocaleOptions();
    return await cachedResolveMarket(country, options);
  } catch (error) {
    return {
      data: FALLBACK_MARKETS.data[0],
    };
  }
}

export async function getMarketCountries(marketId: string) {
  try {
    const options = await getLocaleOptions();
    return await cachedListMarketCountries(marketId, options);
  } catch (error) {
    return { data: FALLBACK_MARKETS.data[0].countries };
  }
}

/**
 * Resolve the currency for a given country on the server side, using the
 * cached markets list. Returns undefined if the country is not served by
 * any market.
 */
export async function resolveCurrency(
  country: string,
): Promise<string | undefined> {
  try {
    const { data: markets } = await getStorefrontMarkets();
    const iso = country.toLowerCase();
    for (const market of markets) {
      const match = market.countries?.some((c) => c.iso.toLowerCase() === iso);
      if (match) return market.currency;
    }
    return "EUR";
  } catch (e) {
    return "EUR";
  }
}
