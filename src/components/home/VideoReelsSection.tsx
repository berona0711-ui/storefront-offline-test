"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Play, Pause, Volume2, VolumeX, X, ChevronLeft, ChevronRight, ArrowRight, Sparkles } from "lucide-react";

interface VideoStory {
  id: string;
  videoSrc: string;
  posterSrc: string;
  number: string;
  kicker: string;
  title: string;
  description: string;
  categoryLink: string;
  categoryLabel: string;
}

const STORIES: VideoStory[] = [
  {
    id: "clip-1",
    videoSrc: "/assets/aistudio/741944765_1793616342627410_d374dac5.MP4",
    posterSrc: "/videos/clip1_poster.jpg",
    number: "01",
    kicker: "Tradition & Faltung",
    title: "Das Kufiya-Original",
    description: "Achtsam gelegt auf Holz: Die traditionelle Kufiya als zeitloses Symbol von Zusammenhalt und Identität.",
    categoryLink: "/products?category=kufiya",
    categoryLabel: "Kufiyas entdecken",
  },
  {
    id: "clip-2",
    videoSrc: "/assets/aistudio/978953311_1793616341578520_6adb683c.MP4",
    posterSrc: "/videos/clip2_poster.jpg",
    number: "02",
    kicker: "Struktur & Webung",
    title: "Woven Heritage",
    description: "Nahaufnahme der klassischen Webstruktur: Fischernetz und Olivenzweig-Symbole mit fühlbarer Haptik.",
    categoryLink: "/products?category=kufiya",
    categoryLabel: "Schals ansehen",
  },
  {
    id: "clip-3",
    videoSrc: "/assets/aistudio/239716974_1793616847571029_ecebfb69.MP4",
    posterSrc: "/videos/clip3_poster.jpg",
    number: "03",
    kicker: "Streetwear & Alltag",
    title: "Community Flatlay",
    description: "Hoodie, Kufiya-Schal und dezente Accessoires im harmonischen Einklang für einen alltagstauglichen Look.",
    categoryLink: "/products?category=clothing",
    categoryLabel: "Streetwear entdecken",
  },
  {
    id: "clip-4",
    videoSrc: "/assets/aistudio/537976312_1793616343387182_34605464.MP4",
    posterSrc: "/videos/clip4_poster.jpg",
    number: "04",
    kicker: "Verbundenheit & Erde",
    title: "Reines Olivenöl",
    description: "Goldenes Olivenöl und traditionelles Gewebe – Sinnbild der tiefen Wurzeln und Verbundenheit mit dem Land.",
    categoryLink: "/products",
    categoryLabel: "Sortiment ansehen",
  },
  {
    id: "clip-5",
    videoSrc: "/assets/aistudio/829975589_1793616345430890_fe8a2536.MP4",
    posterSrc: "/videos/clip5_poster.jpg",
    number: "05",
    kicker: "Ruhe & Natur",
    title: "Sonne & Minztee",
    description: "Frischer Tee im warmen Sonnenlicht der Olivenbäume – ein Moment des Innehaltens und der Gemeinschaft.",
    categoryLink: "/products",
    categoryLabel: "Kollektion ansehen",
  },
  {
    id: "clip-6",
    videoSrc: "/assets/aistudio/597406853_1793616344170594_e2c48e9e.MP4",
    posterSrc: "/videos/clip6_poster.jpg",
    number: "06",
    kicker: "Stimme & Austausch",
    title: "Der FreeFalastin Blog",
    description: "Worte, Berichte über Hilfsaktionen und ehrlicher Austausch für eine engagierte und bewusste Community.",
    categoryLink: "https://blog.freefalastin.de",
    categoryLabel: "Zum Blog ↗",
  },
];

interface VideoReelsSectionProps {
  basePath: string;
}

export function VideoReelsSection({ basePath }: VideoReelsSectionProps) {
  const [activeModalIndex, setActiveModalIndex] = useState<number | null>(null);
  const [hoveredCardId, setHoveredCardId] = useState<string | null>(null);
  const [modalMuted, setModalMuted] = useState(false);
  const [modalPlaying, setModalPlaying] = useState(true);
  const modalVideoRef = useRef<HTMLVideoElement>(null);

  // Keyboard navigation for modal
  useEffect(() => {
    if (activeModalIndex === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActiveModalIndex(null);
      } else if (e.key === "ArrowLeft") {
        setActiveModalIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : STORIES.length - 1));
      } else if (e.key === "ArrowRight") {
        setActiveModalIndex((prev) => (prev !== null && prev < STORIES.length - 1 ? prev + 1 : 0));
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeModalIndex]);

  // Restart playback when switching modal index
  useEffect(() => {
    if (activeModalIndex !== null && modalVideoRef.current) {
      modalVideoRef.current.currentTime = 0;
      modalVideoRef.current.play().catch(() => {});
      setModalPlaying(true);
    }
  }, [activeModalIndex]);

  const activeStory = activeModalIndex !== null ? STORIES[activeModalIndex] : null;

  return (
    <section className="py-16 md:py-24 bg-[#101216] text-stone-100 border-b border-stone-800/80">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 pb-6 border-b border-stone-800/80">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-emerald-400 uppercase mb-2">
              <Sparkles className="size-3.5" />
              <span>Authentische Einblicke</span>
              <span aria-hidden="true" className="text-stone-700">·</span>
              <span className="text-stone-400">Community Stories</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight">
              Momente &amp; Kollektions-Details
            </h2>
            <p className="mt-2 text-sm sm:text-base text-stone-400 max-w-2xl leading-relaxed">
              Erlebe die Haptik unserer Kufiyas, das Falten der Stoffe und die ruhigen Eindrücke, die unsere Bewegung begleiten.
            </p>
          </div>

          <div className="text-xs text-stone-400 hidden lg:block text-right">
            <span>Tippe auf eine Story, um das Video mit Sound abzuspielen</span>
          </div>
        </div>

        {/* Video Story Cards Grid (6 Columns on large screens, scrollable on mobile) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-5">
          {STORIES.map((story, index) => {
            const isHovered = hoveredCardId === story.id;
            return (
              <div
                key={story.id}
                onMouseEnter={() => setHoveredCardId(story.id)}
                onMouseLeave={() => setHoveredCardId(null)}
                onClick={() => setActiveModalIndex(index)}
                className="group relative cursor-pointer flex flex-col rounded-2xl overflow-hidden bg-[#171920] border border-white/10 hover:border-emerald-500/50 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-emerald-950/40"
              >
                {/* 9:16 Portrait Card Aspect */}
                <div className="relative aspect-[9/16] w-full overflow-hidden bg-black">
                  {/* Poster Image / Video Preview */}
                  <Image
                    src={story.posterSrc}
                    alt={story.title}
                    fill
                    className={`object-cover object-center transition-all duration-500 ${
                      isHovered ? "opacity-0 scale-105" : "opacity-100 scale-100"
                    }`}
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                    referrerPolicy="no-referrer"
                  />

                  {/* Video preview on hover */}
                  <video
                    src={story.videoSrc}
                    poster={story.posterSrc}
                    loop
                    muted
                    playsInline
                    autoPlay={isHovered}
                    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
                      isHovered ? "opacity-100" : "opacity-0 pointer-events-none"
                    }`}
                  />

                  {/* Gradient Scrim */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/20" />

                  {/* Top Index Badge */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5 text-[10px] font-bold text-white/90 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/10">
                    <span className="text-emerald-400">{story.number}</span>
                    <span>Story</span>
                  </div>

                  {/* Play Button Indicator in center */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="size-10 rounded-full bg-black/60 backdrop-blur-md border border-white/20 flex items-center justify-center text-white group-hover:scale-110 group-hover:bg-[#005c2e] group-hover:border-emerald-400 transition-all duration-300 shadow-md">
                      <Play className="size-4 fill-white ml-0.5" />
                    </div>
                  </div>

                  {/* Bottom Text Content */}
                  <div className="absolute bottom-3 left-3 right-3 text-left">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-400 block truncate">
                      {story.kicker}
                    </span>
                    <h3 className="text-xs sm:text-sm font-bold text-white leading-tight mt-0.5 truncate group-hover:text-emerald-300 transition-colors">
                      {story.title}
                    </h3>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Full-Screen Video Lightbox Modal */}
      {activeStory && activeModalIndex !== null && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-lg p-4 sm:p-6"
        >
          {/* Backdrop Click Close */}
          <div
            className="absolute inset-0"
            onClick={() => setActiveModalIndex(null)}
          />

          {/* Modal Container */}
          <div className="relative z-10 w-full max-w-4xl bg-[#14151a] border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row items-stretch max-h-[92vh]">
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setActiveModalIndex(null)}
              className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-black/60 text-white hover:bg-black/80 hover:text-emerald-400 border border-white/10 transition-colors"
              aria-label="Modal schließen"
            >
              <X className="size-5" />
            </button>

            {/* Left: Video Player */}
            <div className="relative flex-1 bg-black flex items-center justify-center min-h-[360px] md:min-h-[560px]">
              <video
                ref={modalVideoRef}
                key={activeStory.videoSrc}
                src={activeStory.videoSrc}
                poster={activeStory.posterSrc}
                loop
                playsInline
                autoPlay
                muted={modalMuted}
                className="max-h-[80vh] w-auto max-w-full object-contain"
              />

              {/* Video Controls Bar */}
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between bg-black/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      if (!modalVideoRef.current) return;
                      if (modalPlaying) {
                        modalVideoRef.current.pause();
                        setModalPlaying(false);
                      } else {
                        modalVideoRef.current.play();
                        setModalPlaying(true);
                      }
                    }}
                    className="p-1.5 text-white hover:text-emerald-400 transition-colors"
                    aria-label={modalPlaying ? "Pausieren" : "Abspielen"}
                  >
                    {modalPlaying ? <Pause className="size-4" /> : <Play className="size-4 fill-white" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (!modalVideoRef.current) return;
                      modalVideoRef.current.muted = !modalMuted;
                      setModalMuted(!modalMuted);
                    }}
                    className="p-1.5 text-white hover:text-emerald-400 transition-colors"
                    aria-label={modalMuted ? "Ton einschalten" : "Stummschalten"}
                  >
                    {modalMuted ? <VolumeX className="size-4" /> : <Volume2 className="size-4 text-emerald-400" />}
                  </button>
                </div>

                <div className="flex items-center gap-2 text-xs text-stone-300 font-medium">
                  <span>{activeStory.number}</span>
                  <span className="text-stone-600">/</span>
                  <span>06</span>
                </div>
              </div>
            </div>

            {/* Right: Story Details & Context */}
            <div className="w-full md:w-80 lg:w-96 p-6 sm:p-8 flex flex-col justify-between bg-[#14151a] border-t md:border-t-0 md:border-l border-white/10 overflow-y-auto">
              <div>
                <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-emerald-400 mb-3">
                  <span>{activeStory.kicker}</span>
                  <span className="text-stone-500">{activeStory.number} / 06</span>
                </div>

                <h3 className="text-xl sm:text-2xl font-bold text-white leading-tight">
                  {activeStory.title}
                </h3>

                <p className="mt-4 text-sm text-stone-300 leading-relaxed">
                  {activeStory.description}
                </p>

                <div className="mt-6 pt-6 border-t border-white/10 text-xs text-stone-400 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="size-1.5 rounded-full bg-emerald-400" />
                    <span>FreeFalastin Community Archiv</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="size-1.5 rounded-full bg-stone-500" />
                    <span>Unverfälschte Originalaufnahme</span>
                  </div>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="mt-8 pt-6 border-t border-white/10 flex flex-col gap-3">
                <Link
                  href={
                    activeStory.categoryLink.startsWith("http")
                      ? activeStory.categoryLink
                      : `${basePath}${activeStory.categoryLink}`
                  }
                  target={activeStory.categoryLink.startsWith("http") ? "_blank" : undefined}
                  rel={activeStory.categoryLink.startsWith("http") ? "noopener noreferrer" : undefined}
                  onClick={() => setActiveModalIndex(null)}
                  className="w-full py-3 px-4 rounded-xl bg-[#005c2e] hover:bg-[#00783c] text-white text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 shadow-md transition-colors"
                >
                  <span>{activeStory.categoryLabel}</span>
                  <ArrowRight className="size-4" />
                </Link>

                {/* Prev / Next navigation buttons */}
                <div className="flex items-center justify-between pt-2">
                  <button
                    type="button"
                    onClick={() =>
                      setActiveModalIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : STORIES.length - 1))
                    }
                    className="flex items-center gap-1.5 text-xs text-stone-400 hover:text-white transition-colors py-1.5 px-2 rounded-lg hover:bg-white/5"
                  >
                    <ChevronLeft className="size-4" />
                    <span>Vorherige</span>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setActiveModalIndex((prev) =>
                        prev !== null && prev < STORIES.length - 1 ? prev + 1 : 0
                      )
                    }
                    className="flex items-center gap-1.5 text-xs text-stone-400 hover:text-white transition-colors py-1.5 px-2 rounded-lg hover:bg-white/5"
                  >
                    <span>Nächste</span>
                    <ChevronRight className="size-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
