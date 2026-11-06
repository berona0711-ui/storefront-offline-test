import type { Collection } from "@spree/sdk";
import { ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface CollectionBannerProps {
  collection: Collection;
  basePath: string;
}

export function CollectionBanner({
  collection,
  basePath,
}: CollectionBannerProps) {
  const imageUrl = collection.image_url || collection.square_image_url;

  return (
    <div className="relative flex flex-col justify-end min-h-[320px] md:min-h-[420px] bg-neutral-900 overflow-hidden">
      {/* High-res background image via Next.js Image */}
      {imageUrl && (
        <Image
          src={imageUrl}
          alt={collection.name}
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
      )}

      {/* Dark gradient overlay for ideal text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/55 to-black/35" />

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 pb-10 pt-16">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-4">
          <ol className="flex items-center space-x-2 text-sm text-neutral-300">
            <li>
              <Link href={basePath} className="hover:text-white transition-colors">
                Startseite
              </Link>
            </li>
            <li>
              <ChevronRight className="size-3.5 text-neutral-400" />
            </li>
            <li className="font-semibold text-white truncate max-w-xs sm:max-w-md">
              {collection.name}
            </li>
          </ol>
        </nav>

        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold uppercase tracking-wider mb-3 border border-emerald-500/30">
            <span>🍉</span>
            <span>FreeFalastin Kollektion</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight drop-shadow-sm">
            {collection.name}
          </h1>

          {collection.description && (
            <p className="mt-3 text-base sm:text-lg text-neutral-200 line-clamp-3 leading-relaxed drop-shadow">
              {collection.description}
            </p>
          )}

          {typeof collection.products_count === "number" && (
            <p className="mt-2 text-xs text-neutral-400">
              {collection.products_count} {collection.products_count === 1 ? "Produkt" : "Produkte"}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
