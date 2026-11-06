import type { Product } from "@spree/sdk";

/**
 * Feste manuelle Reihenfolge der Kollektion "Startseite" (coll_V0dXmZF31w / Option A)
 * Diese Konstante und Hilfsfunktion sind NICHT async und daher in einer eigenen
 * Datei ohne "use server" Direktive, damit Next.js keinen Fehler wirft.
 */
export const STARTSEITE_COLLECTION_ORDER: readonly string[] = [
  "prod_p5ClklVeMg", // freefalastin Oversized Tee "LIBERTA"
  "prod_voe3mzDoNU", // freefalastin Jogginghose "STATEMENT"
  "prod_xigWoCpeNM", // freefalastin Hoodie "STATEMENT"
  "prod_2hgTY5XM6f", // Palästina Armband
  "prod_eHrc6l8wVq", // Palästina Kette
  "prod_HbI2VtlDrO", // "Free Palestine" Cap
  "prod_seaN8jaGon", // Kufiya "FREE FALASTIN"
  "prod_GpWvUcnUYI", // Palästina Pins
  "prod_Rgy2eNhrwy", // Palästina Schlüsselanhänger
];

export function applyStartseiteOrdering(
  products: Product[],
  dynamicOrder?: Map<string, number>,
): Product[] {
  const orderMap =
    dynamicOrder ??
    new Map<string, number>(
      STARTSEITE_COLLECTION_ORDER.map((id, idx) => [id, idx]),
    );

  return [...products].sort((a, b) => {
    const posA = orderMap.has(a.id) ? orderMap.get(a.id)! : 999;
    const posB = orderMap.has(b.id) ? orderMap.get(b.id)! : 999;
    return posA - posB;
  });
}
