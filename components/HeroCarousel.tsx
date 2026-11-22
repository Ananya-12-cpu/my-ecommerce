"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

export interface HeroSlide {
  eyebrow: string;
  title: string;
  subtitle: string;
  cta: string;
  href: string;
  image: string;
  gradient: string;
}

export default function HeroCarousel({ slides }: { slides: HeroSlide[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = slides.length;

  const go = useCallback(
    (next: number) => setIndex(((next % count) + count) % count),
    [count]
  );

  useEffect(() => {
    if (paused || count < 2) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % count), 5000);
    return () => clearInterval(id);
  }, [paused, count]);

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Featured promotions"
      className="relative overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div
        className="flex transition-transform duration-700 ease-out motion-reduce:transition-none"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {slides.map((slide, i) => (
          <div
            key={slide.title}
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${count}`}
            aria-hidden={i !== index}
            className={`relative flex min-h-[280px] w-full shrink-0 items-center sm:min-h-[380px] lg:min-h-[440px] ${slide.gradient}`}
          >
            <div className="mx-auto flex w-full max-w-[1500px] items-center justify-between gap-6 px-6 pb-24 pt-10 sm:px-12">
              <div key={i === index ? "active" : "idle"} className={`max-w-xl text-white ${i === index ? "animate-slide-in-left" : ""}`}>
                <p className="text-xs font-semibold uppercase tracking-widest text-white/80">
                  {slide.eyebrow}
                </p>
                <h2 className="mt-2 text-3xl font-bold leading-tight sm:text-5xl">
                  {slide.title}
                </h2>
                <p className="mt-3 max-w-md text-sm text-white/85 sm:text-lg">
                  {slide.subtitle}
                </p>
                <Link
                  href={slide.href}
                  tabIndex={i === index ? 0 : -1}
                  className="mt-6 inline-block rounded-full bg-amber-400 px-6 py-2.5 text-sm font-semibold text-zinc-900 shadow transition-colors hover:bg-amber-300"
                >
                  {slide.cta}
                </Link>
              </div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={slide.image}
                alt=""
                className={`hidden h-56 w-56 rounded-2xl object-cover shadow-2xl ring-4 ring-white/20 transition-transform duration-700 sm:block lg:h-72 lg:w-72 ${i === index ? "scale-100" : "scale-90"}`}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Blend into the page background like Amazon's hero */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-zinc-100 to-transparent dark:from-zinc-950" />

      {count > 1 && (
        <>
          <button
            type="button"
            aria-label="Previous slide"
            onClick={() => go(index - 1)}
            className="absolute left-2 top-[40%] -translate-y-1/2 rounded-md bg-black/25 px-3 py-6 text-2xl leading-none text-white backdrop-blur transition-colors hover:bg-black/50"
          >
            ‹
          </button>
          <button
            type="button"
            aria-label="Next slide"
            onClick={() => go(index + 1)}
            className="absolute right-2 top-[40%] -translate-y-1/2 rounded-md bg-black/25 px-3 py-6 text-2xl leading-none text-white backdrop-blur transition-colors hover:bg-black/50"
          >
            ›
          </button>
          <div className="absolute bottom-24 left-1/2 flex -translate-x-1/2 gap-2">
            {slides.map((slide, i) => (
              <button
                key={slide.title}
                type="button"
                aria-label={`Go to slide ${i + 1}`}
                aria-current={i === index}
                onClick={() => go(i)}
                className={`h-2 rounded-full transition-all ${
                  i === index ? "w-6 bg-white" : "w-2 bg-white/50 hover:bg-white/80"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
