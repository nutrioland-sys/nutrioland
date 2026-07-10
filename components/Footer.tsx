import Link from "next/link";
import Container from "./Container";
import {
  ClockIcon,
  FacebookIcon,
  InstagramIcon,
  MailIcon,
  MapPinIcon,
  PhoneIcon,
} from "./icons";

const QUICK_LINKS = [
  { href: "/shop", label: "Shop" },
  { href: "/about", label: "About" },
  { href: "/faq", label: "FAQ" },
  { href: "/account", label: "My Account" },
];

const POLICY_LINKS = [
  { href: "/policies/refund", label: "Refund Policy" },
  { href: "/policies/privacy", label: "Privacy Policy" },
];

export default function Footer() {
  return (
    <footer className="border-t border-brand-100 bg-white">
      <Container className="grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Link href="/" className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand text-lg font-bold text-white">
              N
            </span>
            <span className="text-xl font-extrabold tracking-tight text-brand-dark">
              Nutrioland
            </span>
          </Link>
          <p className="mt-3 max-w-xs text-sm text-slate-600">
            Fresh fruits &amp; vegetables delivered across Islamabad &amp; Rawalpindi —
            the largest variety of seasonal &amp; exotic edibles, in 3 simple steps.
          </p>
          <div className="mt-4 flex gap-3">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Nutrioland on Facebook"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-50 text-brand-dark transition hover:bg-brand hover:text-white"
            >
              <FacebookIcon className="h-4 w-4" />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Nutrioland on Instagram"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-50 text-brand-dark transition hover:bg-brand hover:text-white"
            >
              <InstagramIcon className="h-4 w-4" />
            </a>
          </div>
        </div>

        <nav aria-label="Quick links">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            Quick Links
          </h3>
          <ul className="mt-4 space-y-2.5">
            {QUICK_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-sm text-slate-600 hover:text-brand">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Policies">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            Policies
          </h3>
          <ul className="mt-4 space-y-2.5">
            {POLICY_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-sm text-slate-600 hover:text-brand">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            Contact
          </h3>
          <ul className="mt-4 space-y-3 text-sm text-slate-600">
            <li className="flex items-start gap-2">
              <MapPinIcon className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
              {/* Placeholder address — replace with Nutrioland's real address. */}
              <span>Street 5, F-8/3, Islamabad, Pakistan (placeholder)</span>
            </li>
            <li className="flex items-center gap-2">
              <PhoneIcon className="h-4 w-4 shrink-0 text-brand" />
              <a href="tel:+923000000000" className="hover:text-brand">
                +92 300 0000000
              </a>
            </li>
            <li className="flex items-center gap-2">
              <MailIcon className="h-4 w-4 shrink-0 text-brand" />
              <a href="mailto:hello@nutrioland.pk" className="hover:text-brand">
                hello@nutrioland.pk
              </a>
            </li>
            <li className="flex items-center gap-2">
              <ClockIcon className="h-4 w-4 shrink-0 text-brand" />
              <span>Daily, 9:00 AM – 9:00 PM</span>
            </li>
          </ul>
        </div>
      </Container>

      <div className="border-t border-brand-100 py-5">
        <Container className="flex flex-col items-center gap-2 text-center text-xs text-slate-500 sm:flex-row sm:justify-between sm:text-left">
          <p>© {new Date().getFullYear()} Nutrioland. All rights reserved.</p>
          <p>Made for the Islamabad &amp; Rawalpindi community.</p>
        </Container>
      </div>
    </footer>
  );
}
