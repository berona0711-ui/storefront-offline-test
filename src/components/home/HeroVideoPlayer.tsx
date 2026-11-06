"use client";

import { useEffect, useRef, useState } from "react";
import { Play, Pause, Volume2, VolumeX, Sparkles } from "lucide-react";

export function HeroVideoPlayer() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Autoplay check
    const promise = video.play();
    if (promise !== undefined) {
      promise
        .then(() => {
          setIsPlaying(true);
        })
        .catch(() => {
          // Autoplay policy prevented playback without interaction
          setIsPlaying(false);
        });
    }
  }, []);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
      setIsPlaying(false);
    } else {
      video.play();
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  return (
    <div className="relative group rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-[#14151a] backdrop-blur-md">
      {/* Aspect Ratio Container (9:16 portrait native format of the recorded footage) */}
      <div className="relative aspect-[9/14] sm:aspect-[9/13] lg:aspect-[4/5] w-full overflow-hidden">
        <video
          ref={videoRef}
          src="/videos/hero_montage_reel.mp4"
          poster="/videos/hero_poster.jpg"
          loop
          muted={isMuted}
          playsInline
          autoPlay
          onLoadedData={() => setIsLoaded(true)}
          className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.02]"
        />

        {/* Ambient measured gradient scrim for legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/30 pointer-events-none" />

        {/* Top Video Header Badges */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-auto">
          <div className="flex items-center gap-2 text-xs font-medium text-white/90 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
            <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Community Film</span>
            <span className="text-white/40">·</span>
            <span className="text-stone-300">Highlight Reel</span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={toggleMute}
              className="p-2 rounded-full bg-black/50 backdrop-blur-md text-white/90 hover:text-white hover:bg-black/70 border border-white/10 transition-colors"
              aria-label={isMuted ? "Ton einschalten" : "Ton stummschalten"}
            >
              {isMuted ? (
                <VolumeX className="size-4" />
              ) : (
                <Volume2 className="size-4 text-emerald-400" />
              )}
            </button>

            <button
              type="button"
              onClick={togglePlay}
              className="p-2 rounded-full bg-black/50 backdrop-blur-md text-white/90 hover:text-white hover:bg-black/70 border border-white/10 transition-colors"
              aria-label={isPlaying ? "Video pausieren" : "Video abspielen"}
            >
              {isPlaying ? (
                <Pause className="size-4" />
              ) : (
                <Play className="size-4 fill-white" />
              )}
            </button>
          </div>
        </div>

        {/* Bottom Editorial Caption */}
        <div className="absolute bottom-5 left-5 right-5 pointer-events-auto text-white">
          <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-emerald-400 mb-1">
            <Sparkles className="size-3.5" />
            <span>Authentische Impressionen</span>
          </div>
          <h3 className="text-base sm:text-lg font-bold text-white leading-snug">
            Kufiya, Streetwear &amp; Gemeinschaft
          </h3>
          <p className="mt-1 text-xs text-stone-300 leading-relaxed line-clamp-2">
            Zusammenschnitt aus unserer Community: Das sorgfältige Falten der Kufiya, gewebte Details, entspannte Flatlays und Momente des Zusammenhalts.
          </p>
        </div>
      </div>
    </div>
  );
}
