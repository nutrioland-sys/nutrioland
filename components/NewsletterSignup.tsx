"use client";

import { useState, type FormEvent } from "react";
import Container from "./Container";
import { MailIcon, MessageCircleIcon } from "./icons";

// Placeholder WhatsApp number — replace with Nutrioland's real business number.
const WHATSAPP_LINK = "https://wa.me/923000000000";

export default function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    // Stub only — no backend wired up yet to actually store the signup.
    setSubmitted(true);
  }

  return (
    <section className="py-14 sm:py-20">
      <Container>
        <div className="grid gap-8 rounded-3xl bg-brand-dark px-6 py-10 text-center sm:px-10 lg:grid-cols-2 lg:items-center lg:text-left">
          <div>
            <h2 className="text-2xl font-extrabold text-white sm:text-3xl">
              Get weekly deals on your phone
            </h2>
            <p className="mt-2 text-sm text-brand-50 sm:text-base">
              Join our WhatsApp list or subscribe by email for fresh arrivals, seasonal
              specials, and first-order discounts.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <form onSubmit={handleSubmit} className="flex flex-col gap-2 sm:flex-row">
              <label htmlFor="newsletter-email" className="sr-only">
                Email address
              </label>
              <input
                id="newsletter-email"
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full rounded-full border-0 px-4 py-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-accent"
              />
              <button
                type="submit"
                className="flex shrink-0 items-center justify-center gap-1.5 rounded-full bg-accent px-5 py-3 text-sm font-semibold text-white transition hover:bg-accent-dark"
              >
                <MailIcon className="h-4 w-4" />
                Subscribe
              </button>
            </form>
            {submitted && (
              <p className="text-sm font-medium text-accent-light">
                Thanks! We&apos;ll be in touch at {email}.
              </p>
            )}

            <a
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-full border border-white/20 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              <MessageCircleIcon className="h-4 w-4" />
              Chat with us on WhatsApp
            </a>
          </div>
        </div>
      </Container>
    </section>
  );
}
