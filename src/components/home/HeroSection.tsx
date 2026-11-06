import Link from "next/link";
import { ArrowRight, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeroSectionProps {
  basePath: string;
  locale: string;
}

export async function HeroSection({ basePath }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-emerald-950 via-neutral-900 to-neutral-950 text-white py-16 md:py-24 border-b border-neutral-800">
      {/* Decorative background glow & pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-[#005c2e] blur-3xl" />
        <div className="absolute top-1/2 -right-32 w-96 h-96 rounded-full bg-[#e01b33] blur-3xl opacity-30" />
      </div>

      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-emerald-300 text-xs md:text-sm font-semibold tracking-wide mb-6">
            <span className="text-base">🍉</span>
            <span>Offizieller FreeFalastin Shop</span>
            <span className="text-white/40">•</span>
            <span className="text-white/80 font-normal">freefalastin.de</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-tight text-white">
            Solidarität tragen.{" "}
            <span className="block mt-1 bg-gradient-to-r from-emerald-400 via-emerald-200 to-white bg-clip-text text-transparent">
              Hoffnung schenken.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-6 text-base sm:text-lg md:text-xl text-neutral-300 max-w-2xl mx-auto leading-relaxed font-normal">
            Traditionell gewebte Kufiyas, faire Bio-Mode, Accessoires und Kunsthandwerk.
            <span className="text-emerald-400 font-semibold block mt-1">
              Jeder Kauf unterstützt Hilfsprojekte für Palästina.
            </span>
          </p>

          {/* Call to action buttons */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Button
              size="lg"
              className="bg-[#005c2e] hover:bg-[#00733a] text-white px-8 py-6 text-base font-bold shadow-lg shadow-emerald-950/50 hover:shadow-emerald-900/40 transition-all rounded-xl gap-2"
              asChild
            >
              <Link href={`${basePath}/products`}>
                <span>Jetzt Kollektion entdecken</span>
                <ArrowRight className="size-5" />
              </Link>
            </Button>

            <Button
              variant="ghost"
              size="lg"
              className="text-neutral-300 hover:text-white hover:bg-white/5 px-4 py-6 text-sm font-medium gap-1.5"
              asChild
            >
              <a
                href="https://blog.freefalastin.de"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span>Zum Blog</span>
                <ExternalLink className="size-4 opacity-70" />
              </a>
            </Button>
          </div>

          {/* Quick stats / Highlights */}
          <div className="mt-12 pt-8 border-t border-white/10 grid grid-cols-2 md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-2xl sm:text-3xl font-black text-emerald-400">🍉</div>
              <div className="text-xs sm:text-sm text-neutral-400 mt-0.5">Mit Haltung</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black text-white">Hebron</div>
              <div className="text-xs sm:text-sm text-neutral-400 mt-0.5">Originale Kufiya-Webung</div>
            </div>
            <div className="col-span-2 md:col-span-1">
              <div className="text-2xl sm:text-3xl font-black text-emerald-400">DE & EU</div>
              <div className="text-xs sm:text-sm text-neutral-400 mt-0.5">Schneller Versand</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
