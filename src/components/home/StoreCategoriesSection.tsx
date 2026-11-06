import Link from "next/link";
import { ArrowRight, Sparkles, Heart, ShieldCheck, Truck } from "lucide-react";

interface StoreCategoriesSectionProps {
  basePath: string;
}

const CATEGORIES = [
  {
    title: "Kufiya & Schals",
    arabic: "الكوفية الفلسطينية",
    description: "Originale, traditionell gewebte Kufiyas aus Hebron in verschiedenen Farbvariationen.",
    badge: "Bestseller",
    badgeColor: "bg-emerald-100 text-emerald-800 border-emerald-200",
    href: "/products?category=kufiya",
    icon: "🧣",
    gradient: "from-emerald-900/90 to-neutral-900/95",
  },
  {
    title: "Solidaritäts-Kleidung",
    arabic: "الملابس",
    description: "Faire Bio-Baumwoll Hoodies, Sweater und T-Shirts mit bedeutungsvollen Motiven.",
    badge: "Bio & Fair",
    badgeColor: "bg-neutral-100 text-neutral-800 border-neutral-300",
    href: "/products?category=clothing",
    icon: "👕",
    gradient: "from-neutral-900/90 to-emerald-950/95",
  },
  {
    title: "Accessoires & Pins",
    arabic: "إكسسوارات",
    description: "Wassermelonen-Pins, palästinensische Flaggen, Patches und Emaille-Anstecker.",
    badge: "Beliebt",
    badgeColor: "bg-red-100 text-red-800 border-red-200",
    href: "/products?category=accessories",
    icon: "🍉",
    gradient: "from-red-950/80 to-neutral-900/95",
  },
  {
    title: "Kunst & Kalligrafie",
    arabic: "الفن والخط",
    description: "Hochwertige Kunstdrucke, Poster und Typografie von arabischen und internationalen Künstlern.",
    badge: "Exklusiv",
    badgeColor: "bg-amber-100 text-amber-800 border-amber-200",
    href: "/products?category=art",
    icon: "🎨",
    gradient: "from-emerald-950/90 to-neutral-900/95",
  },
];

const VALUE_PROPS = [
  {
    icon: Heart,
    title: "Für Palästina",
    description: "Alle Einnahmen fließen in verifizierte Hilfsprojekte für Palästina.",
  },
  {
    icon: ShieldCheck,
    title: "Echte Tradition",
    description: "Unterstützung historischer Manufakturen und lokaler Kunsthandwerker.",
  },
  {
    icon: Sparkles,
    title: "Nachhaltig & Fair",
    description: "Zertifizierte Materialien, langlebige Qualität und ethische Produktion.",
  },
  {
    icon: Truck,
    title: "Schneller Versand",
    description: "Zuverlässiger & klimafreundlicher Versand innerhalb Deutschlands und Europas.",
  },
];

export function StoreCategoriesSection({ basePath }: StoreCategoriesSectionProps) {
  return (
    <section className="py-16 bg-neutral-50/60 border-t border-neutral-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold uppercase tracking-wider mb-3">
            <span>🍉</span>
            <span>FreeFalastin Kollektionen</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-neutral-900 tracking-tight">
            Kategorien & Shop-Bereiche
          </h2>
          <p className="mt-3 text-base md:text-lg text-neutral-600">
            Jedes Stück erzählt eine Geschichte von Identität, Würde und Hoffnung. Finde deine Favoriten im offiziellen FreeFalastin Shop.
          </p>
        </div>

        {/* Category Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.title}
              href={`${basePath}${cat.href}`}
              className="group relative flex flex-col justify-between overflow-hidden rounded-2xl bg-white p-6 shadow-sm border border-neutral-200/80 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-emerald-300"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl">{cat.icon}</span>
                  <span
                    className={`inline-block px-2.5 py-0.5 text-xs font-semibold rounded-full border ${cat.badgeColor}`}
                  >
                    {cat.badge}
                  </span>
                </div>
                <div className="text-xs font-serif text-emerald-700/80 mb-1">{cat.arabic}</div>
                <h3 className="text-xl font-bold text-neutral-900 group-hover:text-[#005c2e] transition-colors">
                  {cat.title}
                </h3>
                <p className="mt-2 text-sm text-neutral-600 line-clamp-3">
                  {cat.description}
                </p>
              </div>

              <div className="mt-6 flex items-center gap-1.5 text-sm font-semibold text-[#005c2e] group-hover:gap-2.5 transition-all">
                <span>Bereich ansehen</span>
                <ArrowRight className="size-4" />
              </div>
            </Link>
          ))}
        </div>

        {/* Value Props / Trust Banner */}
        <div className="rounded-2xl bg-white p-8 md:p-10 shadow-sm border border-neutral-200">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {VALUE_PROPS.map((prop) => {
              const Icon = prop.icon;
              return (
                <div key={prop.title} className="flex flex-col items-center text-center">
                  <div className="flex size-12 items-center justify-center rounded-xl bg-emerald-50 text-[#005c2e] mb-4">
                    <Icon className="size-6" />
                  </div>
                  <h4 className="text-base font-bold text-neutral-900">{prop.title}</h4>
                  <p className="mt-1 text-xs text-neutral-600 leading-relaxed max-w-xs">
                    {prop.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
