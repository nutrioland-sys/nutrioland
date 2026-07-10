import type { Metadata } from "next";
import Container from "@/components/Container";

export const metadata: Metadata = {
  title: "FAQ | Nutrioland",
  description: "Answers to common questions about delivery, payment, and orders at Nutrioland.",
};

const FAQS = [
  {
    question: "Which areas do you deliver to?",
    answer:
      "We currently deliver across Islamabad and Rawalpindi, including sectors like F-6, F-7, F-8, F-10, F-11, G-6, G-9, G-10, G-11, Bahria Town, DHA Islamabad, Saddar, and Satellite Town. Use the delivery checker on our homepage to confirm your sector.",
  },
  {
    question: "What are your delivery time slots?",
    answer:
      "We offer two delivery windows each day: Morning (10 AM to 2 PM) and Evening (4 PM to 7 PM). You can choose your preferred slot at checkout.",
  },
  {
    question: "What payment methods do you accept?",
    answer: "Cash on Delivery is available now. Online payment options are coming soon.",
  },
  {
    question: "Is there a minimum order amount?",
    answer:
      "There is no minimum order amount. Orders under Rs. 1,500 have a small delivery fee, and orders over Rs. 1,500 qualify for free delivery.",
  },
  {
    question: "How do I place an order?",
    answer:
      "Browse the shop, add items to your cart, and check out with your delivery address and preferred time slot. You can also message us on WhatsApp to place an order.",
  },
  {
    question: "What if I am not happy with the quality of my order?",
    answer:
      "We offer a quality guarantee. If something arrives in poor condition, contact us and we will replace it or refund that item. See our Refund Policy for details.",
  },
  {
    question: "Can I change or cancel my order after placing it?",
    answer:
      "Please contact us as soon as possible by phone or WhatsApp. If your order has not yet been packed, we can usually update or cancel it.",
  },
  {
    question: "Do you offer a first order discount?",
    answer: "Yes, new customers can use code FRESH20 for 20 percent off their first order.",
  },
];

export default function FaqPage() {
  return (
    <section className="py-10 sm:py-14">
      <Container className="max-w-3xl">
        <span className="inline-block rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand-dark">
          Support
        </span>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
          Frequently Asked Questions
        </h1>
        <p className="mt-3 text-base text-slate-600">
          Can&apos;t find what you&apos;re looking for? Reach out to us on WhatsApp or by phone,
          details are in the footer below.
        </p>

        <div className="mt-8 space-y-3">
          {FAQS.map((faq) => (
            <details
              key={faq.question}
              className="group rounded-2xl border border-slate-100 bg-white p-5 shadow-card open:shadow-md"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-sm font-semibold text-slate-900 marker:content-none">
                {faq.question}
                <span className="shrink-0 text-lg text-brand transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">{faq.answer}</p>
            </details>
          ))}
        </div>
      </Container>
    </section>
  );
}
