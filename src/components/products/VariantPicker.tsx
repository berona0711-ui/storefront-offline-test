"use client";

import type { OptionType, Variant } from "@spree/sdk";
import { useTranslations } from "next-intl";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";

interface VariantPickerProps {
  variants: Variant[];
  optionTypes: OptionType[];
  selectedVariant: Variant | null;
  onVariantChange: (variant: Variant | null) => void;
}

// Bekannte Kleidungsgrößen-Reihenfolge als Fallback
const SIZE_ORDER = ["XXS", "XS", "S", "M", "L", "XL", "XXL", "XXXL", "3XL", "4XL"];

export function VariantPicker({
  variants,
  optionTypes,
  selectedVariant,
  onVariantChange,
}: VariantPickerProps) {
  const t = useTranslations("products");

  // Fix 1: Sortierte Liste statt unsortiertem Set
  // Spree gibt für jeden option_value eine `position` mit – danach sortieren.
  // Fallback: bekannte Größenreihenfolge, dann alphabetisch.
  const optionValuesMap = useMemo(() => {
    const map: Record<string, Array<{ name: string; position: number }>> = {};

    optionTypes.forEach((optionType) => {
      map[optionType.id] = [];
    });

    variants.forEach((variant) => {
      variant.option_values.forEach((optionValue) => {
        if (map[optionValue.option_type_id]) {
          const existing = map[optionValue.option_type_id];
          if (!existing.some((e) => e.name === optionValue.name)) {
            existing.push({
              name: optionValue.name,
              // position kommt von Spree, Fallback 9999 damit unbekannte ans Ende
              position: (optionValue as { position?: number }).position ?? 9999,
            });
          }
        }
      });
    });

    // Sortieren: zuerst nach position aus Spree, dann SIZE_ORDER, dann alphabetisch
    for (const id of Object.keys(map)) {
      map[id].sort((a, b) => {
        if (a.position !== b.position) return a.position - b.position;
        const ai = SIZE_ORDER.indexOf(a.name.toUpperCase());
        const bi = SIZE_ORDER.indexOf(b.name.toUpperCase());
        if (ai !== -1 && bi !== -1) return ai - bi;
        if (ai !== -1) return -1;
        if (bi !== -1) return 1;
        return a.name.localeCompare(b.name);
      });
    }

    return map;
  }, [variants, optionTypes]);

  const selectedOptions = useMemo(() => {
    const options: Record<string, string> = {};
    if (selectedVariant) {
      selectedVariant.option_values.forEach((ov) => {
        options[ov.option_type_id] = ov.name;
      });
    }
    return options;
  }, [selectedVariant]);

  const { variantOptionMaps, optionValueDetailsMap } = useMemo(() => {
    const maps = variants.map((variant) => {
      const optionsMap: Record<string, string> = {};
      variant.option_values.forEach((ov) => {
        optionsMap[ov.option_type_id] = ov.name;
      });
      return { variant, optionsMap };
    });

    const detailsMap: Record<string, (typeof variants)[0]["option_values"][0]> =
      {};
    for (const variant of variants) {
      for (const ov of variant.option_values) {
        const key = `${ov.option_type_id}:${ov.name}`;
        if (!detailsMap[key]) {
          detailsMap[key] = ov;
        }
      }
    }

    return { variantOptionMaps: maps, optionValueDetailsMap: detailsMap };
  }, [variants]);

  const findVariant = (newOptions: Record<string, string>): Variant | null => {
    const optionCount = Object.keys(newOptions).length;
    return (
      variantOptionMaps.find(
        ({ variant, optionsMap }) =>
          variant.option_values.length === optionCount &&
          Object.entries(newOptions).every(
            ([typeId, value]) => optionsMap[typeId] === value,
          ),
      )?.variant || null
    );
  };

  // Fix 2: isOptionAvailable ignoriert andere bereits gewählte Optionen des
  // GLEICHEN Typs – prüft nur ob irgendeine Variante den Testwert enthält,
  // UND zu den anderen bereits gewählten Optionen passt (ohne den eigenen Typ).
  // Dadurch werden alle Größen einer Farbe als "verfügbar" angezeigt, selbst
  // wenn z.B. nur Schwarz/M und Schwarz/L existieren und Schwarz/S fehlt.
  const isOptionAvailable = (
    optionTypeId: string,
    optionValue: string,
  ): boolean => {
    // Andere bereits gewählte Optionen (ohne den aktuellen Typ)
    const otherSelected = Object.entries(selectedOptions).filter(
      ([typeId]) => typeId !== optionTypeId,
    );

    return variantOptionMaps.some(({ optionsMap }) => {
      // Diese Variante muss den gesuchten Wert haben
      if (optionsMap[optionTypeId] !== optionValue) return false;
      // UND zu allen anderen gewählten Optionen passen
      return otherSelected.every(([typeId, value]) => optionsMap[typeId] === value);
    });
  };

  const isOptionPurchasable = (
    optionTypeId: string,
    optionValue: string,
  ): boolean => {
    const otherSelected = Object.entries(selectedOptions).filter(
      ([typeId]) => typeId !== optionTypeId,
    );

    return variantOptionMaps.some(({ variant, optionsMap }) => {
      if (!variant.purchasable) return false;
      if (optionsMap[optionTypeId] !== optionValue) return false;
      return otherSelected.every(([typeId, value]) => optionsMap[typeId] === value);
    });
  };

  const handleOptionSelect = (optionTypeId: string, optionValue: string) => {
    const newOptions = { ...selectedOptions, [optionTypeId]: optionValue };
    const newVariant = findVariant(newOptions);
    onVariantChange(newVariant);
  };

  const getOptionValueDetails = (
    optionTypeId: string,
    optionValueName: string,
  ): Variant["option_values"][0] | null => {
    return optionValueDetailsMap[`${optionTypeId}:${optionValueName}`] || null;
  };

  if (optionTypes.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      {optionTypes.map((optionType) => {
        // Fix 1: Namen aus sortierter Liste extrahieren
        const values = (optionValuesMap[optionType.id] || []).map((v) => v.name);
        const selectedValue = selectedOptions[optionType.id];
        const isColor = optionType.kind === "color_swatch";

        return (
          <div key={optionType.id}>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-sm font-medium text-gray-900">
                {optionType.label}
              </span>
              {selectedValue && (
                <span className="text-sm text-gray-500">
                  {getOptionValueDetails(optionType.id, selectedValue)?.label ||
                    selectedValue}
                </span>
              )}
            </div>

            {isColor ? (
              <div className="flex flex-wrap gap-2">
                {values.map((value) => {
                  const optionValue = getOptionValueDetails(
                    optionType.id,
                    value,
                  );
                  const isSelected = selectedValue === value;
                  const isAvailable = isOptionAvailable(optionType.id, value);
                  const isPurchasable = isOptionPurchasable(
                    optionType.id,
                    value,
                  );

                  return (
                    <button
                      type="button"
                      key={value}
                      onClick={() => handleOptionSelect(optionType.id, value)}
                      disabled={!isAvailable}
                      title={optionValue?.label || value}
                      className={`
                        w-10 h-10 rounded-lg border transition-all relative overflow-hidden
                        ${isSelected ? "border-gray-900 ring-2 ring-primary ring-offset-2" : "border-gray-200"}
                        ${!isAvailable ? "opacity-30 cursor-not-allowed" : "cursor-pointer"}
                        ${!isPurchasable && isAvailable ? "opacity-50" : ""}
                      `}
                      style={
                        optionValue?.image_url
                          ? {
                              backgroundImage: `url(${optionValue.image_url})`,
                              backgroundSize: "cover",
                            }
                          : optionValue?.color_code
                            ? { backgroundColor: optionValue.color_code }
                            : { backgroundColor: "#e5e7eb" }
                      }
                    >
                      {!isPurchasable && isAvailable && (
                        <span className="absolute inset-0 flex items-center justify-center">
                          <span className="w-full h-0.5 bg-gray-400 rotate-45 absolute" />
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {values.map((value) => {
                  const optionValue = getOptionValueDetails(
                    optionType.id,
                    value,
                  );
                  const isSelected = selectedValue === value;
                  const isAvailable = isOptionAvailable(optionType.id, value);
                  const isPurchasable = isOptionPurchasable(
                    optionType.id,
                    value,
                  );

                  return (
                    <Button
                      type="button"
                      key={value}
                      variant="outline"
                      onClick={() => handleOptionSelect(optionType.id, value)}
                      disabled={!isAvailable}
                      className={
                        isSelected
                          ? "ring-2 ring-primary ring-offset-2 border-primary"
                          : ""
                      }
                    >
                      {optionValue?.label || value}
                      {!isPurchasable && isAvailable && (
                        <span className="ml-1 text-xs text-gray-400">
                          {t("outOfStockVariant")}
                        </span>
                      )}
                    </Button>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
