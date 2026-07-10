import Container from "./Container";
import SectionHeading from "./SectionHeading";
import { BasketIcon, ClipboardCheckIcon, PackageIcon, TruckIcon } from "./icons";

const STEPS = [
  {
    icon: BasketIcon,
    title: "Choose Products",
    description: "Browse fresh fruits, vegetables, and seasonal picks in the shop.",
  },
  {
    icon: ClipboardCheckIcon,
    title: "Pick a Slot",
    description: "Confirm your sector, pick your slot — morning or evening — and check out.",
  },
  {
    icon: PackageIcon,
    title: "We Pack Fresh",
    description: "Our team hand-sorts and packs your order the same day.",
  },
  {
    icon: TruckIcon,
    title: "Delivered to Your Door",
    description: "Your basket arrives fresh, right on time — cash on delivery available.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="scroll-mt-24 py-14 sm:py-20">
      <Container>
        <SectionHeading
          eyebrow="Simple process"
          title="How Nutrioland works"
          description="From your basket to your doorstep in four easy steps."
        />

        <ol className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, index) => (
            <li
              key={step.title}
              className="relative rounded-2xl border border-brand-100 bg-white p-6 shadow-card"
            >
              <span className="absolute right-5 top-5 text-xs font-bold text-brand-100">
                0{index + 1}
              </span>
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-50 text-brand">
                <step.icon className="h-6 w-6" />
              </span>
              <h3 className="mt-4 text-lg font-semibold text-slate-900">{step.title}</h3>
              <p className="mt-1.5 text-sm text-slate-600">{step.description}</p>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
