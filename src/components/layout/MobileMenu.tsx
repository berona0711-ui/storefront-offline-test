"use client";

import type { Category, Collection } from "@spree/sdk";
import { ArrowLeft, ChevronRight, X } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useRef, useState } from "react";
import { flushSync } from "react-dom";
import { RegionPreferences } from "@/components/layout/RegionPreferences";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetTitle,
} from "@/components/ui/sheet";

type PanelType = { kind: "main" } | { kind: "category"; category: Category };

interface MobileMenuProps {
  rootCategories: Category[];
  collections?: Collection[];
  basePath: string;
  /** Whether the wholesale addon is enabled — gates the trade portal link. */
  wholesaleEnabled: boolean;
}

export function MobileMenu({
  rootCategories,
  collections = [],
  basePath,
  wholesaleEnabled,
}: MobileMenuProps) {
  const t = useTranslations("header");
  const [open, setOpen] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [panelStack, setPanelStack] = useState<PanelType[]>([{ kind: "main" }]);
  // animatedIndex trails panelStack — new panels mount off-screen, then animate in
  const [animatedIndex, setAnimatedIndex] = useState(0);
  const rafRef = useRef<number | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const currentPanel = panelStack[panelStack.length - 1];

  const cancelPendingCallbacks = () => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  const pushPanel = (panel: PanelType) => {
    cancelPendingCallbacks();
    // Step 1: mount the new panel off-screen (translate-x-full) via flushSync
    flushSync(() => {
      setPanelStack((prev) => [...prev, panel]);
    });
    // Step 2: on next frame, update animatedIndex to trigger slide-in
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      setAnimatedIndex((prev) => prev + 1);
    });
  };

  const popPanel = () => {
    cancelPendingCallbacks();
    // Step 1: animate out by decrementing animatedIndex
    setAnimatedIndex((prev) => Math.max(0, prev - 1));
    // Step 2: after transition, remove the panel from the stack
    timeoutRef.current = setTimeout(() => {
      timeoutRef.current = null;
      setPanelStack((prev) => (prev.length > 1 ? prev.slice(0, -1) : prev));
    }, 300);
  };

  const handleOpenChange = (value: boolean) => {
    setOpen(value);
    if (!value) {
      cancelPendingCallbacks();
      setPanelStack([{ kind: "main" }]);
      setAnimatedIndex(0);
    }
  };

  // Shared link style
  const linkClass =
    "text-left text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg px-3 py-2.5 text-base transition-colors";

  // Shared button style for items with children (chevron)
  const categoryButtonClass =
    "flex items-center justify-between w-full text-left text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg px-3 py-2.5 text-base transition-colors";

  // Filter out internal 'startseite' collection
  const activeCollections = (collections || []).filter(
    (c) =>
      c.permalink !== "startseite" && c.name?.toLowerCase() !== "startseite",
  );

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      {/* Animated hamburger / X button — two-phase animation matching Lottie reference */}
      <Button
        variant="ghost"
        size="icon-lg"
        onClick={() => {
          setHasInteracted(true);
          setOpen((prev) => !prev);
        }}
        aria-label={t("menu")}
        aria-expanded={open}
        className="cursor-pointer"
      >
        <div className="relative w-5 h-4 flex flex-col justify-between">
          <span
            className={`block h-0.5 w-5 bg-current rounded-full origin-center ${
              hasInteracted
                ? open
                  ? "animate-hamburger-top-open"
                  : "animate-hamburger-top-close"
                : ""
            }`}
          />
          <span
            className={`block h-0.5 w-5 bg-current rounded-full ${
              hasInteracted
                ? open
                  ? "animate-hamburger-middle-open"
                  : "animate-hamburger-middle-close"
                : ""
            }`}
          />
          <span
            className={`block h-0.5 w-5 bg-current rounded-full origin-center ${
              hasInteracted
                ? open
                  ? "animate-hamburger-bottom-open"
                  : "animate-hamburger-bottom-close"
                : ""
            }`}
          />
        </div>
      </Button>

      <SheetContent
        side="left"
        className="flex flex-col !gap-0 !rounded-none overflow-hidden max-md:!top-16 max-md:!h-[calc(100%-4rem)] max-md:!w-full max-md:!max-w-none max-md:!border-r-0"
        showCloseButton={false}
        overlayClassName="max-md:!top-16 max-md:!bg-transparent"
      >
        <SheetTitle className="sr-only">{t("menu")}</SheetTitle>
        {/* Menu header — changes based on active panel */}
        <div className="hidden md:flex items-center justify-between px-4 h-16 border-b border-gray-200 relative overflow-hidden">
          {/* "Menu" title — visible when on main panel */}
          <span
            className={`text-base font-semibold transition-all duration-300 ease-in-out absolute left-4 ${
              currentPanel.kind === "main"
                ? "translate-x-0 opacity-100"
                : "-translate-x-8 opacity-0 pointer-events-none"
            }`}
          >
            {t("menu")}
          </span>
          {/* Back button + category name — visible on sub-panels */}
          <button
            type="button"
            onClick={popPanel}
            className={`flex items-center gap-2 text-gray-700 hover:text-gray-900 text-base font-semibold cursor-pointer transition-all duration-300 ease-in-out absolute left-4 ${
              currentPanel.kind !== "main"
                ? "translate-x-0 opacity-100"
                : "translate-x-8 opacity-0 pointer-events-none"
            }`}
          >
            <ArrowLeft className="w-5 h-5" />
            <span>
              {currentPanel.kind === "category"
                ? currentPanel.category.name
                : ""}
            </span>
          </button>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => setOpen(false)}
            className="cursor-pointer ml-auto"
          >
            <X className="size-4" />
          </Button>
        </div>

        {/* Sliding panels container */}
        <div className="relative flex-1 overflow-hidden">
          {/* Main menu panel */}
          <div
            className={`absolute inset-0 flex flex-col bg-white transition-transform duration-300 ease-in-out ${
              animatedIndex === 0 && currentPanel.kind === "main"
                ? "translate-x-0"
                : "-translate-x-full"
            }`}
          >
            <nav className="flex flex-col gap-1 px-4 flex-1 overflow-y-auto pt-2">
              {/* 1. Startseite */}
              <Link
                href={basePath || "/"}
                onClick={() => setOpen(false)}
                className={linkClass}
              >
                {t("home")}
              </Link>

              {/* 2. Button zwischen Startseite und Alle Produkte: Kollektionen aus Spree */}
              {activeCollections.map((col) => (
                <Link
                  key={col.id}
                  href={`${basePath}/collections/${col.permalink}`}
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-between text-left text-emerald-900 hover:text-emerald-950 hover:bg-emerald-50 rounded-lg px-3 py-2.5 text-base font-semibold transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <span>✨</span>
                    <span>{col.name} Kollektion</span>
                  </span>
                  <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-200 font-medium">
                    Kollektion
                  </span>
                </Link>
              ))}

              {/* 3. Alle Produkte */}
              <Link
                href={`${basePath}/products`}
                onClick={() => setOpen(false)}
                className={linkClass}
              >
                {t("allProducts")}
              </Link>

              {/* 4. Kategorien */}
              {rootCategories.map((category) =>
                category.children && category.children.length > 0 ? (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => pushPanel({ kind: "category", category })}
                    className={categoryButtonClass}
                  >
                    <span>{category.name}</span>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </button>
                ) : (
                  <Link
                    key={category.id}
                    href={`${basePath}/c/${category.permalink}`}
                    onClick={() => setOpen(false)}
                    className={linkClass}
                  >
                    {category.name}
                  </Link>
                ),
              )}

              <Link
                href={`${basePath}/#contact`}
                onClick={() => setOpen(false)}
                className={linkClass}
              >
                {t("contact")}
              </Link>

              {/* Secondary links */}
              <div className="mt-2 pt-2 border-t border-gray-200">
                {wholesaleEnabled && (
                  <Link
                    href={`${basePath}/wholesale`}
                    onClick={() => setOpen(false)}
                    className={`${linkClass} block`}
                  >
                    {t("wholesale")}
                  </Link>
                )}
                <a
                  href="https://blog.freefalastin.de"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${linkClass} flex items-center justify-between text-emerald-800 font-medium`}
                >
                  <span>🍉 FreeFalastin Blog</span>
                  <span className="text-xs text-neutral-500">freefalastin.de ↗</span>
                </a>
              </div>
            </nav>

            <SheetFooter className="p-4 border-t border-gray-200 mt-auto">
              <RegionPreferences variant="mobile" />
            </SheetFooter>
          </div>

          {/* Subcategory sliding panels */}
          {panelStack.map((panel, index) => {
            if (index === 0 || panel.kind !== "category") return null;
            const category = panel.category;
            const isVisible = index <= animatedIndex;
            return (
              <div
                key={category.id}
                className={`absolute inset-0 flex flex-col bg-white transition-transform duration-300 ease-in-out ${
                  isVisible ? "translate-x-0" : "translate-x-full"
                }`}
              >
                <nav className="flex flex-col gap-1 p-4 flex-1 overflow-y-auto">
                  <Link
                    href={`${basePath}/c/${category.permalink}`}
                    onClick={() => setOpen(false)}
                    className={`${linkClass} font-semibold`}
                  >
                    {t("viewAllInCategory", { name: category.name })}
                  </Link>
                  {category.children?.map((child) =>
                    child.children && child.children.length > 0 ? (
                      <button
                        key={child.id}
                        type="button"
                        onClick={() =>
                          pushPanel({ kind: "category", category: child })
                        }
                        className={categoryButtonClass}
                      >
                        <span>{child.name}</span>
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                      </button>
                    ) : (
                      <Link
                        key={child.id}
                        href={`${basePath}/c/${child.permalink}`}
                        onClick={() => setOpen(false)}
                        className={linkClass}
                      >
                        {child.name}
                      </Link>
                    ),
                  )}
                </nav>
              </div>
            );
          })}
        </div>
      </SheetContent>
    </Sheet>
  );
}
