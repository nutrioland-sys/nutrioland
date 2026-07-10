import Container from "./Container";
import SectionHeading from "./SectionHeading";
import { BanknoteIcon, LeafIcon, ShieldCheckIcon, TruckIcon } from "./icons";

const VALUE_PROPS = [
  {
    icon: LeafIcon,
    title: "Fresh Daily Sourcing",
    description:
      "We source directly from local farms and mandis every morning — nothing sits in a warehouse.",
  },
  {
    icon: TruckIcon,
    title: "Same-Day Delivery",
    description:
      "Order before the daily cutoff and get your basket delivered the same day across Islamabad & Rawalpindi.",
  },
  {
    icon: BanknoteIcon,
    title: "Cash on Delivery",
    description:
      "Pay in cash when your order arrives — online payment options are on the way too.",
  },
  {
    icon: ShieldCheckIcon,
    title: "Quality Guarantee",
    description:
      "Not happy with an item's freshness? We'll replace or refund it, no questions asked.",
  },
];

export default function WhyUs() {
  return (
    <section className="bg-brand-50/50 py-14 sm:py-20">
      <Container>
        <SectionHeading eyebrow="Why Nutrioland" title="Fresh, fair, and reliable — every order" />

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {VALUE_PROPS.map((item) => (
            <div key={item.title} className="rounded-2xl bg-white p-6 text-center shadow-card">
              <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand-50 text-brand">
                <item.icon className="h-6 w-6" />
              </span>
              <h3 className="mt-4 text-base font-semibold text-slate-900">{item.title}</h3>
              <p className="mt-1.5 text-sm text-slate-600">{item.description}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
