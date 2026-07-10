import Image from "next/image";
import { TESTIMONIALS } from "@/lib/data";
import Container from "./Container";
import SectionHeading from "./SectionHeading";
import { StarIcon } from "./icons";

export default function Testimonials() {
  return (
    <section className="py-14 sm:py-20">
      <Container>
        <SectionHeading
          eyebrow="Customer love"
          title="What our neighbours are saying"
          description="Placeholder reviews — swap in real customer quotes once Nutrioland collects them on the new site."
        />

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {TESTIMONIALS.map((testimonial) => (
            <figure
              key={testimonial.id}
              className="flex h-full flex-col rounded-2xl border border-slate-100 bg-white p-6 shadow-card"
            >
              <div
                className="flex gap-0.5 text-accent"
                aria-label={`${testimonial.rating} out of 5 stars`}
              >
                {Array.from({ length: 5 }).map((_, index) => (
                  <StarIcon key={index} className="h-4 w-4" filled={index < testimonial.rating} />
                ))}
              </div>
              <blockquote className="mt-3 flex-1 text-sm text-slate-700">
                &ldquo;{testimonial.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-4 flex items-center gap-3">
                <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full">
                  {/* Placeholder avatar (Unsplash) — replace with a real customer photo or remove. */}
                  <Image src={testimonial.avatar} alt="" fill sizes="40px" className="object-cover" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">{testimonial.name}</p>
                  <p className="text-xs text-slate-500">{testimonial.location}</p>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </Container>
    </section>
  );
}
