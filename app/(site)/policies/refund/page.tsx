import type { Metadata } from "next";
import Container from "@/components/Container";

export const metadata: Metadata = {
  title: "Refund Policy | Nutrioland",
  description: "Read Nutrioland's refund and quality guarantee policy.",
};

export default function RefundPolicyPage() {
  return (
    <section className="py-10 sm:py-14">
      <Container className="max-w-3xl">
        <span className="inline-block rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand-dark">
          Policy
        </span>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
          Refund Policy
        </h1>
        <p className="mt-3 text-sm text-slate-500">
          This page describes how refunds and replacements work at Nutrioland. It is a general
          guide and may be updated from time to time.
        </p>

        <div className="mt-8 space-y-8">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Quality Guarantee</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              We handpick every order to make sure it meets our freshness standards. If any item
              in your order arrives bruised, spoiled, or otherwise not fresh, we want to make it
              right.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-900">How to Request a Refund</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              Contact us within 24 hours of delivery using the phone number or WhatsApp listed in
              the footer. Please share your order number and, if possible, a photo of the item.
              Our team will review your request and get back to you promptly.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-900">Refund Method</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              Since most orders are paid via Cash on Delivery, approved refunds are usually issued
              as a credit toward your next order or, in some cases, adjusted from your next
              delivery payment. If you paid online, the refund will be returned to the same
              payment method.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-900">What Is Not Covered</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              Refunds are not available for change of mind after an order has been packed, for
              items reported more than 24 hours after delivery, or for normal variation in size,
              shape, and color that is typical of fresh produce.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
