"use client";

import { ArrowLeft, ChevronDown, ShoppingBag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";
import {
  CheckoutProvider,
  CheckoutSummary,
  useCheckout,
} from "@/contexts/CheckoutContext";
import { POLICY_LINKS } from "@/lib/constants/policies";
import { getStoreName } from "@/lib/store";
import { extractBasePath } from "@/lib/utils/path";

const storeName = getStoreName();

function CheckoutHeader() {
  const pathname = usePathname();
  const basePath = extractBasePath(pathname);
  const t = useTranslations("checkoutLayout");

  return (
    <header className="flex items-center justify-between h-16">
      <Link href={basePath || "/"} className="flex items-center space-x-2">
        <Image
          src="/freefalastin-logo.svg"
          alt={storeName}
          width={150}
          height={36}
          fetchPriority="high"
          loading="eager"
          className="max-h-9 w-auto object-contain"
        />
      </Link>
      <Link
        href={basePath || "/"}
        className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1"
        aria-label={t("backToStore")}
      >
        <ArrowLeft className="w-4 h-4" aria-hidden="true" />
        {t("backToStore")}
      </Link>
    </header>
  );
}

function CheckoutFooter() {
  const pathname = usePathname();
  const basePath = extractBasePath(pathname);
  const t = useTranslations("checkoutLayout");

  return (
    <footer className="mt-auto border-t border-gray-200 pt-6 pb-8 text-xs text-gray-500">
      <div className="flex flex-wrap gap-x-6 gap-y-2">
        {POLICY_LINKS.map(({ key, path }) => (
          <Link
            key={key}
            href={`${basePath}${path}`}
            className="hover:text-gray-700"
          >
            {t(key)}
          </Link>
        ))}
      </div>
    </footer>
  );
}

function MobileSummaryToggle({
  isOpen,
  onToggle,
}: {
  isOpen: boolean;
  onToggle: () => void;
}) {
  const { lineItems, orderTotal } = useCheckout();
  const t = useTranslations("checkoutLayout");
  const totalQuantity = lineItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <button
      type="button"
      onClick={onToggle}
      className="flex w-full items-center justify-between border-y border-gray-200 bg-gray-50 px-4 py-3 text-sm"
      aria-expanded={isOpen}
      aria-controls="mobile-order-summary"
    >
      <span className="flex items-center gap-2 text-gray-700">
        <ShoppingBag className="w-4 h-4" />
        <span>
          {isOpen ? t("hideOrderSummary") : t("showOrderSummary")}{" "}
          {totalQuantity > 0 && `(${totalQuantity})`}
        </span>
        <ChevronDown
          className={`w-4 h-4 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </span>
      <span className="font-semibold text-gray-900">{orderTotal}</span>
    </button>
  );
}

function CheckoutContent({ children }: { children: React.ReactNode }) {
  const [mobileSummaryOpen, setMobileSummaryOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Mobile order summary toggle */}
      <div className="lg:hidden">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <CheckoutHeader />
        </div>
        <MobileSummaryToggle
          isOpen={mobileSummaryOpen}
          onToggle={() => setMobileSummaryOpen((prev) => !prev)}
        />
        <div
          id="mobile-order-summary"
          className={`bg-gray-50 border-b border-gray-200 px-4 sm:px-6 py-6 transition-all duration-300 ease-in-out ${
            mobileSummaryOpen
              ? "block"
              : "hidden"
          }`}
        >
          <div className="max-w-2xl mx-auto">
            <CheckoutSummary />
          </div>
        </div>
      </div>

      {/* Main layout */}
      <div className="flex-1 flex flex-col lg:flex-row">
        {/* Left column - checkout forms */}
        <div className="flex-1 lg:max-w-[55%] xl:max-w-[60%] flex flex-col">
          <div className="w-full max-w-xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-12 flex-1 flex flex-col">
            <div className="hidden lg:block mb-8">
              <CheckoutHeader />
            </div>
            <main className="flex-1">{children}</main>
            <CheckoutFooter />
          </div>
        </div>

        {/* Right column - order summary (desktop) */}
        <aside
          aria-label="Order summary"
          className="hidden lg:block flex-1 bg-gray-50 border-l border-gray-200"
        >
          <div className="w-full max-w-md px-8 py-12 sticky top-0">
            <CheckoutSummary />
          </div>
        </aside>
      </div>
    </div>
  );
}

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CheckoutProvider>
      <CheckoutContent>{children}</CheckoutContent>
    </CheckoutProvider>
  );
}
