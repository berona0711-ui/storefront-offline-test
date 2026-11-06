import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Heart, ShieldCheck, Sparkles, Truck } from "lucide-react";

interface StoreCategoriesSectionProps {
  basePath: string;
}

const CATEGORIES = [
  {
    title: "Kufiyas & Schals",
    subtitle: "Das traditionelle Symbol",
    description: "Klassische Keffiyeh-Webmuster in Schwarz-Weiß, Olivgrün und weiteren Farbvarianten.",
    tag: "Klassiker",
    href: "/products?category=kufiya",
    image: "/images/category_kufiya_scarves_1793933812919.jpg",
    alt: "Klassische Kufiya Schals in schwarz-weiß und olivgrün",
  },
  {
    title: "Solidarity Hoodies",
    subtitle: "Schwere Grammatur & Schnitt",
    description: "Bequeme Oversized-Hoodies und Sweater mit ausdrucksstarken Statement-Prints.",
    tag: "Streetwear",
    href: "/products?category=clothing",
    image: "/images/category_solidarity_hoodie_1793933812622.jpg",
    alt: "Palestine Solidarity Hoodie in schwarz und weiß",
  },
  {
    title: "T-Shirts & Tops",
    subtitle: "Alltagstaugliche Essentials",
    description: "Bequeme Baumwoll-Shirts mit klaren Botschaften für den täglichen Ausdruck von Haltung.",
    tag: "Essentials",
    href: "/products?category=clothing",
    image: "/images/category_streetwear_organic_1793933241428.jpg",
    alt: "FreeFalastin T-Shirts und Oberteile",
  },
  {
    title: "Accessoires & Pins",
    subtitle: "Dezente Zeichen setzen",
    description: "Wassermelonen-Pins, palästinensische Flaggen, Emaille-Anstecker und Schlüsselanhänger.",
    tag: "Details",
    href: "/products?category=accessories",
    image: "/images/category_pins_accessories_1793933813040.jpg",
    alt: "Wassermelonen-Pins und Palestine Flaggen-Anstecker",
  },
];

const VALUE_PROPS = [
  {
    icon: Sparkles,
    number: "01",
    title: "Klares Statement",
    description: "Kleidung und Accessoires, die im Alltag Haltung zeigen, verbinden und Bewusstsein schaffen.",
  },
  {
    icon: Heart,
    number: "02",
    title: "Direkte Unterstützung",
    description: "Jeder Kauf fließt verlässlich in konkrete und transparente Hilfsprojekte für Menschen in Palästina.",
  },
  {
    icon: ShieldCheck,
    number: "03",
    title: "Solide Qualität",
    description: "Angenehmer Tragekomfort, robuste Webungen und langlebige Prints für den dauerhaften Alltagseinsatz.",
  },
  {
    icon: Truck,
    number: "04",
    title: "Zuverlässiger Versand",
    description: "Sorgfältige Verpackung und zügige Zustellung mit Sendungsverfolgung direkt zu dir nach Hause.",
  },
];

export function StoreCategoriesSection({ basePath }: StoreCategoriesSectionProps) {
  return (
    <section className="py-20 md:py-24 bg-[#faf9f6] border-b border-stone-200/80">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-12 sm:mb-16">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-800 mb-2">
            <span>Kollektionen</span>
            <span aria-hidden="true" className="text-stone-300">·</span>
            <span>Entdecke dein Statement</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-stone-900 tracking-tight leading-tight">
            Kategorien &amp; Kollektionen
          </h2>
          <p className="mt-3 text-base sm:text-lg text-stone-600 leading-relaxed max-w-2xl">
            Vom traditionellen Kufiya-Schal über bequeme Streetwear bis hin zu kleinen Statement-Accessoires. Finde das Piece, das zu dir passt.
          </p>
        </div>

        {/* Category Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mb-16">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.title}
              href={`${basePath}${cat.href}`}
              className="group flex flex-col overflow-hidden rounded-3xl bg-white border border-stone-200 shadow-xs transition-all duration-500 hover:-translate-y-2 hover:shadow-xl hover:border-emerald-600/50"
            >
              {/* Product Category Visual */}
              <div className="relative aspect-[4/3] sm:aspect-[1/1] w-full overflow-hidden bg-stone-100">
                <Image
                  src={cat.image}
                  alt={cat.alt}
                  fill
                  className="object-cover object-center group-hover:scale-108 transition-transform duration-700 ease-out"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                
                {/* Clean unboxed tag */}
                <div className="absolute top-4 left-4 bg-black/65 backdrop-blur-md text-white text-[10px] font-semibold tracking-wider uppercase px-3 py-1 rounded-full border border-white/10">
                  {cat.tag}
                </div>
              </div>

              {/* Text Information */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="text-[11px] font-medium uppercase tracking-wider text-emerald-800">
                    {cat.subtitle}
                  </div>
                  <h3 className="mt-1 text-lg font-bold text-stone-900 group-hover:text-[#005c2e] transition-colors leading-snug">
                    {cat.title}
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm text-stone-600 line-clamp-2 leading-relaxed">
                    {cat.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-between text-xs font-semibold text-[#005c2e] group-hover:text-emerald-700 transition-colors">
                  <span>Kollektion ansehen</span>
                  <div className="size-7 rounded-full bg-stone-100 group-hover:bg-[#005c2e] group-hover:text-white flex items-center justify-center transition-colors">
                    <ArrowRight className="size-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Value Props Strip */}
        <div className="rounded-3xl bg-white border border-stone-200 p-8 sm:p-12 shadow-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
            {VALUE_PROPS.map((prop) => {
              const Icon = prop.icon;
              return (
                <div key={prop.title} className="flex flex-col items-start">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-50 text-[#005c2e] border border-emerald-100">
                      <Icon className="size-5" />
                    </div>
                    <span className="text-xs font-bold font-mono text-stone-400">
                      {prop.number}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-stone-900 tracking-tight">
                    {prop.title}
                  </h4>
                  <p className="mt-2 text-xs sm:text-sm text-stone-600 leading-relaxed">
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
