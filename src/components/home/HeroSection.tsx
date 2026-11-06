import Link from "next/link";
import { ArrowRight, ShieldCheck, Heart, Truck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HeroVideoPlayer } from "@/components/home/HeroVideoPlayer";

interface HeroSectionProps {
  basePath: string;
  locale: string;
}

export async function HeroSection({ basePath }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden bg-[#0c0d10] text-stone-100 border-b border-stone-800/80 pt-10 pb-16 lg:pt-16 lg:pb-20">
      {/* Ambient background glows */}
      <div className="absolute inset-0 pointer-events-none opacity-30">
        <div className="absolute -top-32 -left-32 w-[32rem] h-[32rem] rounded-full bg-emerald-700/20 blur-[120px]" />
        <div className="absolute top-1/2 -right-32 w-[28rem] h-[28rem] rounded-full bg-emerald-900/25 blur-[120px]" />
        <div className="absolute bottom-0 left-1/3 w-[24rem] h-[24rem] rounded-full bg-stone-700/10 blur-[100px]" />
      </div>

      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left Column: Mission & Statement (7 cols) */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            {/* Unboxed clean metadata kicker */}
            <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold tracking-wide text-emerald-400 uppercase mb-4">
              <span>🍉 FreeFalastin Community</span>
              <span aria-hidden="true" className="text-stone-700">·</span>
              <span>Kleidung mit Haltung</span>
              <span aria-hidden="true" className="text-stone-700">·</span>
              <span className="text-stone-300 font-medium">Reale Hilfe</span>
            </div>

            {/* Display Headline */}
            <h1
              className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-extrabold tracking-tight text-white leading-[1.12]"
              style={{ textWrap: "balance" }}
            >
              Solidarität tragen.{" "}
              <span className="block text-emerald-400 mt-1">
                Ein klares Zeichen setzen.
              </span>
            </h1>

            {/* Grounded Subheadline without marketing hype */}
            <p className="mt-5 text-base sm:text-lg text-stone-300 max-w-2xl leading-relaxed">
              Streetwear, traditionelle Kufiyas und Accessoires für alle, die im Alltag Haltung zeigen. Mit jedem Piece setzt du ein sichtbares Statement und unterstützt gleichzeitig ganz konkret Hilfsprojekte für Palästina – direkt, unkompliziert und als selbstverständlicher Teil unserer Community.
            </p>

            {/* CTAs */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Button
                size="lg"
                className="bg-[#005c2e] hover:bg-[#00783c] text-white px-8 py-6 text-base font-semibold shadow-lg shadow-emerald-950/60 hover:shadow-emerald-900/80 transition-all rounded-xl gap-2"
                asChild
              >
                <Link href={`${basePath}/products`}>
                  <span>Kollektion entdecken</span>
                  <ArrowRight className="size-4" />
                </Link>
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="border-white/20 bg-white/5 hover:bg-white/10 text-stone-100 hover:text-white px-6 py-6 text-sm font-medium rounded-xl transition-colors backdrop-blur-sm gap-1.5"
                asChild
              >
                <Link href={`${basePath}/products?category=kufiya`}>
                  <span>Kufiyas &amp; Schals</span>
                </Link>
              </Button>
            </div>

            {/* Grounded Authentic Pillars */}
            <div className="mt-10 pt-8 border-t border-stone-800/80 grid grid-cols-1 sm:grid-cols-3 gap-6 text-stone-300">
              <div className="flex items-start gap-3">
                <Sparkles className="size-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-white uppercase tracking-wider">
                    Sichtbares Zeichen
                  </div>
                  <div className="text-xs text-stone-400 mt-1 leading-snug">
                    Haltung &amp; Zusammenhalt im Alltag zeigen
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Heart className="size-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-white uppercase tracking-wider">
                    Direkte Hilfe
                  </div>
                  <div className="text-xs text-stone-400 mt-1 leading-snug">
                    Unterstützung für konkrete Hilfsprojekte
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Truck className="size-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-white uppercase tracking-wider">
                    Schneller Versand
                  </div>
                  <div className="text-xs text-stone-400 mt-1 leading-snug">
                    Zuverlässig direkt zu dir nach Hause
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Video Player Montage (5 cols) */}
          <div className="lg:col-span-5">
            <HeroVideoPlayer />
          </div>
        </div>
      </div>
    </section>
  );
}
