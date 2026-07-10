# Nutrioland — Homepage

Static homepage build for Nutrioland, a fruit & vegetable delivery service in
Islamabad & Rawalpindi. Next.js (App Router) + TypeScript + Tailwind CSS. No
backend/database — everything is placeholder UI ready to be wired up later.

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## What's real vs. placeholder

**Placeholder — replace before launch:**
- All product/category/testimonial photos (`lib/data.ts`) are stock images
  from Unsplash, chosen only to preview the layout with real produce imagery.
- Prices, testimonial quotes, phone/WhatsApp numbers, email, and the
  Islamabad address in the footer are illustrative, not real Nutrioland data.
- Nav links, "Add to Cart" buttons, and policy page links point to routes
  that don't exist yet (`/shop`, `/about`, `/policies/*`, etc.) — they're
  UI stubs with no cart/checkout logic behind them.

**Structurally real:**
- Component structure, layout, responsive behavior, and copy tone are meant
  to be production-ready as-is.
- `Header` and `Footer` live in `app/layout.tsx` so they'll wrap future pages
  (Shop, About, Contact, etc.) automatically.

## Known limitation

`npm audit` still reports some moderate/high advisories on Next.js even at
the latest 14.x patch (14.2.35) — full resolution requires the Next 15/16
major upgrade, which wasn't done here to avoid an unreviewed breaking change
on a first-pass homepage. Worth revisiting before this goes to production.

## Not built in this pass

Checkout, cart logic, product detail pages, category pages, and the admin
panel are intentionally out of scope — homepage only.
