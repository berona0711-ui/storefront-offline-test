import type { Metadata } from "next";
import { connection } from "next/server";
import { FeaturedProductsSection } from "@/components/home/FeaturedProductsSection";
import { HeroSection } from "@/components/home/HeroSection";
import { StoreCategoriesSection } from "@/components/home/StoreCategoriesSection";
import { VideoReelsSection } from "@/components/home/VideoReelsSection";
import { WholesaleSection } from "@/components/home/WholesaleSection";
import { resolveCurrency } from "@/lib/data/markets";
import { generateHomeMetadata } from "@/lib/metadata/home";

interface HomePageProps {
  params: Promise<{
    country: string;
    locale: string;
  }>;
}

export async function generateMetadata({
  params,
}: HomePageProps): Promise<Metadata> {
  const { country, locale } = await params;
  return generateHomeMetadata({ country, locale });
}

export default async function HomePage({ params }: HomePageProps) {
  await connection();
  const { country, locale } = await params;
  const basePath = `/${country}/${locale}`;
  const currency = await resolveCurrency(country);

  return (
    <div className="flex flex-col">
      {/* 1. Cinematic Streetwear Hero with Ambient Montage Video Loop */}
      <HeroSection basePath={basePath} locale={locale} />

      {/* 2. Interactive Video Reel / Stories Strip with the 6 authentic clips */}
      <VideoReelsSection basePath={basePath} />

      {/* 3. Editorial Categories & Collections Lookbook */}
      <StoreCategoriesSection basePath={basePath} />

      {/* 4. Curated Community Favorites & Products */}
      <FeaturedProductsSection
        basePath={basePath}
        locale={locale}
        country={country}
        currency={currency}
      />

      {/* 5. Wholesale Portal Pitch */}
      <WholesaleSection basePath={basePath} locale={locale} />
    </div>
  );
}
