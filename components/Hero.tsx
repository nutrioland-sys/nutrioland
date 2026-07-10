"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { HeroSettings } from "@/lib/types";
import DeliveryChecker from "./DeliveryChecker";

export default function Hero({ hero }: { hero: HeroSettings }) {
  const images = hero.images;
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;
    const timer = setInterval(() => {
      setActiveIndex((current) => (current + 1) % images.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [images.length]);

  return (
    <section className="relative overflow-hidden bg-brand-50/60">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-2 lg:items-center lg:gap-12 lg:px-8 lg:py-20">
        <div className="order-2 lg:order-1">
          <span className="inline-block rounded-full bg-accent-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-accent-dark">
            Now delivering across Islamabad &amp; Rawalpindi
          </span>
          <h1 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
            Largest variety of seasonal &amp; exotic edibles,{" "}
            <span className="text-brand">in 3 simple steps.</span>
          </h1>
          <p className="mt-4 max-w-lg text-base text-slate-600 sm:text-lg">
            Farm-fresh fruits and vegetables handpicked daily and delivered to your
            doorstep — at prices that make sense. No middlemen, no stale stock.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Link
              href="/shop"
              className="rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white shadow-card transition hover:bg-brand-dark sm:text-base"
            >
              Shop Fresh Now
            </Link>
            <Link
              href="#how-it-works"
              className="rounded-full border border-brand/30 px-6 py-3 text-sm font-semibold text-brand-dark transition hover:bg-brand-50 sm:text-base"
            >
              How it works
            </Link>
          </div>

          <div className="mt-8">
            <DeliveryChecker />
          </div>
        </div>

        <div className="relative order-1 aspect-[4/3] w-full overflow-hidden rounded-3xl shadow-card lg:order-2 lg:aspect-square">
          {images.map((heroImage, index) => (
            <Image
              key={`${heroImage.image}-${index}`}
              src={heroImage.image}
              alt={heroImage.imageAlt}
              fill
              priority={index === 0}
              sizes="(min-width: 1024px) 50vw, 100vw"
              className={`object-cover transition-opacity duration-700 ${
                index === activeIndex ? "opacity-100" : "opacity-0"
              }`}
            />
          ))}

          {images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-1.5">
              {images.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  aria-label={`Show hero image ${index + 1}`}
                  onClick={() => setActiveIndex(index)}
                  className={`h-1.5 rounded-full transition-all ${
                    index === activeIndex ? "w-5 bg-white" : "w-1.5 bg-white/60"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
