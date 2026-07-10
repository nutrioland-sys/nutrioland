"use client";

import { useRef } from "react";
import type { Product } from "@/lib/types";
import Container from "./Container";
import FeaturedProductCard from "./FeaturedProductCard";
import SectionHeading from "./SectionHeading";
import { ArrowRightIcon } from "./icons";

export default function FeaturedProducts({ products }: { products: Product[] }) {
  const scrollerRef = useRef<HTMLDivElement>(null);

  function scrollByCard(direction: 1 | -1) {
    scrollerRef.current?.scrollBy({ left: direction * 190, behavior: "smooth" });
  }

  return (
    <section className="bg-white py-14 sm:py-20">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading
            align="left"
            eyebrow="Fresh picks"
            title="Best-selling this week"
            description="Hand-picked fruits, vegetables, and baskets our customers reorder most."
          />
          <div className="hidden gap-2 sm:flex">
            <button
              type="button"
              aria-label="Scroll to previous products"
              onClick={() => scrollByCard(-1)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-600 transition hover:border-brand hover:text-brand"
            >
              <ArrowRightIcon className="h-4 w-4 rotate-180" />
            </button>
            <button
              type="button"
              aria-label="Scroll to next products"
              onClick={() => scrollByCard(1)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-600 transition hover:border-brand hover:text-brand"
            >
              <ArrowRightIcon className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div
          ref={scrollerRef}
          className="mt-8 flex snap-x snap-mandatory gap-3 overflow-x-auto pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {products.map((product) => (
            <div key={product.id} className="w-44 shrink-0 snap-start sm:w-52">
              <FeaturedProductCard product={product} />
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
