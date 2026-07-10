import Image from "next/image";
import Link from "next/link";
import type { Category } from "@/lib/types";
import Container from "./Container";
import SectionHeading from "./SectionHeading";

export default function CategoryShowcase({ categories }: { categories: Category[] }) {
  return (
    <section className="py-14 sm:py-20">
      <Container>
        <SectionHeading
          eyebrow="Shop by category"
          title="Everything fresh, all in one place"
          description="From everyday staples to exotic finds — explore our full range."
        />

        <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/shop?category=${category.slug}`}
              className="group relative flex aspect-[4/5] overflow-hidden rounded-2xl shadow-card"
            >
              {/* Placeholder image (Unsplash) — replace with real category photography. */}
              <Image
                src={category.image}
                alt={category.imageAlt}
                fill
                sizes="(min-width: 1024px) 20vw, 50vw"
                className="object-cover transition duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-slate-900/10 to-transparent" />
              <div className="relative mt-auto p-5">
                <h3 className="text-lg font-bold text-white">{category.name}</h3>
                <p className="mt-1 text-sm text-white/80">{category.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
