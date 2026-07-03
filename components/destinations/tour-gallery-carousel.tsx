"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, ImageIcon, PlayCircle } from "lucide-react";
import Image from "next/image";
import { useMemo, useState } from "react";

type TourGalleryCarouselProps = {
  images: string[];
  alt: string;
  videoUrl?: string;
};

type Slide =
  | {
      type: "image";
      src: string;
    }
  | {
      type: "video";
      src: string;
    };

export function TourGalleryCarousel({ images, alt, videoUrl }: TourGalleryCarouselProps) {
  const slides = useMemo<Slide[]>(() => {
    const uniqueImages = Array.from(new Set(images.filter(Boolean)));
    const imageSlides = uniqueImages.map((src) => ({ type: "image" as const, src }));
    return videoUrl ? [...imageSlides, { type: "video", src: videoUrl }] : imageSlides;
  }, [images, videoUrl]);
  const [activeIndex, setActiveIndex] = useState(0);
  const activeSlide = slides[activeIndex];
  const poster = images[0];
  const videoEmbedUrl = activeSlide?.type === "video" ? getYouTubeEmbedUrl(activeSlide.src) : null;

  if (slides.length === 0 || !activeSlide) return null;

  const goToPrevious = () => {
    setActiveIndex((current) => (current === 0 ? slides.length - 1 : current - 1));
  };

  const goToNext = () => {
    setActiveIndex((current) => (current === slides.length - 1 ? 0 : current + 1));
  };

  return (
    <div className="space-y-4">
      <div className="relative overflow-hidden rounded-lg border bg-card shadow-sm">
        <div className="relative aspect-[16/10]">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${activeSlide.type}-${activeSlide.src}`}
              initial={{ opacity: 0, scale: 1.02 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.28, ease: "easeOut" }}
              className="absolute inset-0"
            >
              {activeSlide.type === "image" ? (
                <Image
                  src={activeSlide.src}
                  alt={`${alt} - foto ${activeIndex + 1}`}
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 42vw, 100vw"
                />
              ) : videoEmbedUrl ? (
                <iframe
                  src={videoEmbedUrl}
                  title={`Video de ${alt}`}
                  className="h-full w-full bg-primary"
                  allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  referrerPolicy="strict-origin-when-cross-origin"
                />
              ) : (
                <video
                  className="h-full w-full bg-primary object-cover"
                  controls
                  poster={poster}
                  preload="metadata"
                  title={`Video de ${alt}`}
                >
                  <source src={activeSlide.src} />
                  Tu navegador no puede reproducir este video.
                </video>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {slides.length > 1 ? (
          <>
            <button
              type="button"
              aria-label="Foto anterior"
              onClick={goToPrevious}
              className="absolute left-3 top-1/2 grid size-10 -translate-y-1/2 place-items-center rounded-full border border-primary-foreground/30 bg-primary/72 text-primary-foreground shadow-lg backdrop-blur transition hover:bg-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary"
            >
              <ChevronLeft className="size-5" aria-hidden />
            </button>
            <button
              type="button"
              aria-label="Foto siguiente"
              onClick={goToNext}
              className="absolute right-3 top-1/2 grid size-10 -translate-y-1/2 place-items-center rounded-full border border-primary-foreground/30 bg-primary/72 text-primary-foreground shadow-lg backdrop-blur transition hover:bg-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary"
            >
              <ChevronRight className="size-5" aria-hidden />
            </button>
          </>
        ) : null}
      </div>

      {slides.length > 1 ? (
        <div className="flex justify-center gap-2" aria-label="Indicadores de galeria">
          {slides.map((slide, index) => (
            <button
              key={`${slide.type}-dot-${slide.src}`}
              type="button"
              aria-label={slide.type === "video" ? "Ir al video" : `Ir a la foto ${index + 1}`}
              aria-current={activeIndex === index}
              onClick={() => setActiveIndex(index)}
              className={`size-2.5 rounded-full transition ${
                activeIndex === index ? "bg-secondary" : "bg-muted-foreground/30 hover:bg-muted-foreground/60"
              }`}
            />
          ))}
        </div>
      ) : null}

      <div className="grid grid-cols-4 gap-2 sm:grid-cols-5">
        {slides.map((slide, index) => (
          <button
            key={`${slide.type}-thumb-${slide.src}`}
            type="button"
            aria-label={`Ver ${slide.type === "video" ? "video" : `foto ${index + 1}`}`}
            aria-current={activeIndex === index}
            onClick={() => setActiveIndex(index)}
            className={`relative aspect-[4/3] overflow-hidden rounded-md border transition ${
              activeIndex === index ? "border-secondary ring-2 ring-secondary/30" : "border-border hover:border-secondary/70"
            }`}
          >
            {slide.type === "image" ? (
              <Image src={slide.src} alt={`${alt} miniatura ${index + 1}`} fill className="object-cover" sizes="120px" />
            ) : (
              <span className="grid h-full w-full place-items-center bg-primary text-primary-foreground">
                <PlayCircle className="size-6" aria-hidden />
              </span>
            )}
            <span className="absolute left-2 top-2 rounded-full bg-primary/72 p-1 text-primary-foreground">
              {slide.type === "image" ? <ImageIcon className="size-3" aria-hidden /> : <PlayCircle className="size-3" aria-hidden />}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

function getYouTubeEmbedUrl(url: string) {
  try {
    const parsedUrl = new URL(url);
    const host = parsedUrl.hostname.replace(/^www\./, "");

    if (host === "youtu.be") {
      const videoId = parsedUrl.pathname.split("/").filter(Boolean)[0];
      return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
    }

    if (host !== "youtube.com" && host !== "m.youtube.com") return null;

    if (parsedUrl.pathname.startsWith("/embed/")) return url;

    if (parsedUrl.pathname === "/watch") {
      const videoId = parsedUrl.searchParams.get("v");
      return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
    }

    if (parsedUrl.pathname.startsWith("/shorts/")) {
      const videoId = parsedUrl.pathname.split("/").filter(Boolean)[1];
      return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
    }

    return null;
  } catch {
    return null;
  }
}
