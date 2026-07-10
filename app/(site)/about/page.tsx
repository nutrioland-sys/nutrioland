import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import { BanknoteIcon, LeafIcon, ShieldCheckIcon, TruckIcon } from "@/components/icons";

export const metadata: Metadata = {
  title: "About | Nutrioland",
  description:
    "Nutrioland delivers fresh fruits and vegetables across Islamabad and Rawalpindi. Learn our story and what we stand for.",
};

const VALUES = [
  {
    icon: LeafIcon,
    title: "Fresh Daily Sourcing",
    description: "We source directly from local farms and mandis every morning.",
  },
  {
    icon: TruckIcon,
    title: "Reliable Delivery",
    description: "Same day delivery across Islamabad and Rawalpindi, on time.",
  },
  {
    icon: BanknoteIcon,
    title: "Fair, Transparent Pricing",
    description: "No hidden markups. You see exactly what you pay for.",
  },
  {
    icon: ShieldCheckIcon,
    title: "Quality You Can Trust",
    description: "Not happy with an item? We will replace or refund it.",
  },
];

export default function AboutPage() {
  return (
    <section className="py-10 sm:py-14">
      <Container className="max-w-3xl">
        <span className="inline-block rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand-dark">
          Our Story
        </span>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
          About Nutrioland
        </h1>

        <div className="mt-6 space-y-4 text-base leading-relaxed text-slate-600">
          <p>
            Nutrioland started with a simple goal. Bring the freshest fruits and vegetables
            from local farms and mandis straight to homes in Islamabad and Rawalpindi, at
            fair prices, without the stale stock you often find at the corner store.
          </p>
          <p>
            We handpick our produce every morning, pack it the same day, and get it to your
            door quickly so it stays as fresh as possible. No long storage, no guesswork.
          </p>
          <p>
            From everyday staples like apples and potatoes to seasonal and exotic finds like
            dragon fruit and avocados, we aim to be the one stop for fresh produce across the
            twin cities.
          </p>
        </div>

        <h2 className="mt-10 text-xl font-bold text-slate-900">What We Stand For</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {VALUES.map((value) => (
            <div
              key={value.title}
              className="rounded-2xl border border-slate-100 bg-white p-5 shadow-card"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-50 text-brand">
                <value.icon className="h-5 w-5" />
              </span>
              <h3 className="mt-3 text-sm font-semibold text-slate-900">{value.title}</h3>
              <p className="mt-1 text-sm text-slate-600">{value.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 rounded-2xl bg-brand px-6 py-8 text-center">
          <p className="text-lg font-bold text-white">
            Ready to taste the difference?
          </p>
          <p className="mt-1 text-sm text-brand-50">
            Browse our shop and get fresh produce delivered today.
          </p>
          <Link
            href="/shop"
            className="mt-4 inline-block rounded-full bg-white px-6 py-3 text-sm font-semibold text-brand-dark transition hover:bg-cream"
          >
            Shop Now
          </Link>
        </div>
      </Container>
    </section>
  );
}
