import Link from "next/link";
import Container from "./Container";
import { SparklesIcon } from "./icons";

export default function PromoBanner() {
  return (
    <section className="py-4 sm:py-6">
      <Container>
        <div className="flex flex-col items-center gap-4 rounded-3xl bg-brand px-6 py-8 text-center sm:flex-row sm:justify-between sm:px-10 sm:text-left">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/15 text-white">
              <SparklesIcon className="h-6 w-6" />
            </span>
            <div>
              <p className="text-lg font-bold text-white sm:text-xl">
                20% off your first order
              </p>
              <p className="mt-0.5 text-sm text-brand-50">
                Use code <span className="font-semibold text-accent-light">FRESH20</span>{" "}
                at checkout. New customers only.
              </p>
            </div>
          </div>
          <Link
            href="/shop"
            className="w-full shrink-0 rounded-full bg-white px-6 py-3 text-center text-sm font-semibold text-brand-dark transition hover:bg-cream sm:w-auto"
          >
            Claim Offer
          </Link>
        </div>
      </Container>
    </section>
  );
}
