import type { Metadata } from "next";
import Container from "@/components/Container";

export const metadata: Metadata = {
  title: "Privacy Policy | Nutrioland",
  description: "Read Nutrioland's privacy policy and how we handle your information.",
};

export default function PrivacyPolicyPage() {
  return (
    <section className="py-10 sm:py-14">
      <Container className="max-w-3xl">
        <span className="inline-block rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand-dark">
          Policy
        </span>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
          Privacy Policy
        </h1>
        <p className="mt-3 text-sm text-slate-500">
          This page explains what information we collect and how we use it. It is a general
          guide and may be updated from time to time.
        </p>

        <div className="mt-8 space-y-8">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Information We Collect</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              When you place an order or create an account, we collect information such as your
              name, phone number, delivery address, and order details. This information is used
              only to process and deliver your order.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-900">How We Use Your Information</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              We use your information to confirm orders, coordinate delivery, respond to support
              requests, and improve our service. We do not sell your personal information to
              third parties.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-900">Cookies and Local Storage</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              Our website stores your cart and account details in your browser&apos;s local
              storage so your session is remembered between visits. This data stays on your
              device and helps us provide a smoother shopping experience.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-900">Data Security</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              We take reasonable steps to protect your information from unauthorized access,
              loss, or misuse. However, no method of storage or transmission is completely
              secure.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-900">Changes to This Policy</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              We may update this policy from time to time. Any changes will be posted on this
              page.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-900">Contact</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              If you have questions about this policy or your information, please reach out using
              the contact details in the footer.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
