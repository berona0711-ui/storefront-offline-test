"use client";

import type { Product } from "@spree/sdk";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { memo } from "react";
import { HiddenPricePrompt } from "@/components/products/HiddenPricePrompt";
import { ProductImage } from "@/components/ui/product-image";
import { useFormatMoney } from "@/hooks/useFormatMoney";
import { trackSelectItem } from "@/lib/analytics/gtm";
import { strikethroughAmount } from "@/lib/utils/price";

interface ProductCardProps {
  product: Product;
  basePath?: string;
  categoryId?: string;
  index?: number;
  listId?: string;
  listName?: string;
  fetchPriority?: "high" | "low" | "auto";
  /** Optional currency used for analytics; omit to skip the select_item event. */
  currency?: string;
}

export const ProductCard = memo(function ProductCard({
  product,
  basePath = "",
  categoryId,
  index,
  listId,
  listName,
  fetchPriority,
  currency,
}: ProductCardProps) {
  const t = useTranslations("products");
  const imageUrl = product.thumbnail_url || null;

  const formatMoney = useFormatMoney();
  const price = product.price;
  const displayPrice = price
    ? formatMoney(price.amount, price.currency, { unitPrice: true })
    : null;
  const struckAmount = strikethroughAmount(price, product.original_price);
  const onSale = struckAmount !== null;
  const strikethroughPrice =
    price && struckAmount
      ? formatMoney(struckAmount, price.currency, { unitPrice: true })
      : null;

  const handleClick = () => {
    if (index != null && listId && listName && currency) {
      trackSelectItem(product, listId, listName, index, currency);
    }
  };

  return (
    <div className="group relative bg-white rounded-3xl border border-stone-200/90 shadow-xs hover:shadow-xl hover:border-emerald-600/50 transition-all duration-500 overflow-hidden flex flex-col h-full hover:-translate-y-1.5">
      {/* Image */}
      <div className="relative aspect-square bg-[#f5f2eb]/70 overflow-hidden">
        <ProductImage
          src={imageUrl}
          alt={product.name}
          fill
          className="object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 280px"
          iconClassName="w-16 h-16 opacity-40 text-stone-400"
          fetchPriority={fetchPriority}
        />
        {onSale && (
          <span className="absolute top-2.5 left-2.5 bg-[#0b2416] text-emerald-300 text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-xs shadow-xs">
            {t("sale")}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-sm font-semibold text-stone-900 group-hover:text-[#005c2e] transition-colors line-clamp-2 leading-snug">
            {/* Stretched link: the ::after overlay keeps the whole card clickable
                without wrapping the content in an <a> — HiddenPricePrompt renders
                its own link, and anchors can't nest. */}
            <Link
              href={`${basePath}/products/${product.slug}${categoryId ? `?category_id=${categoryId}` : ""}`}
              className="after:absolute after:inset-0"
              onClick={handleClick}
            >
              {product.name}
            </Link>
          </h3>
        </div>

        <div className="mt-3 pt-3 border-t border-stone-100 flex items-baseline justify-between gap-2 flex-wrap">
          <div className="flex items-baseline gap-2">
            {displayPrice ? (
              <span className="text-base font-bold text-stone-900 tabular-nums">
                {displayPrice}
              </span>
            ) : (
              <HiddenPricePrompt />
            )}
            {onSale && strikethroughPrice && (
              <span className="text-xs text-stone-400 line-through tabular-nums">
                {strikethroughPrice}
              </span>
            )}
          </div>

          {!product.purchasable && (
            <span className="text-xs text-stone-400">{t("outOfStock")}</span>
          )}
        </div>
      </div>
    </div>
  );
});
