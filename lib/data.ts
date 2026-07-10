import type { DeliverySector, Product, Testimonial } from "./types";

/**
 * PLACEHOLDER CONTENT — replace before launch.
 *
 * - Product photos and testimonial avatars are stock images from Unsplash
 *   (images.unsplash.com), used only so the site previews with real produce
 *   photography. Swap every `image`/`avatar` URL for actual Nutrioland
 *   photos and customer photos before going live.
 * - Prices, testimonial quotes, and the WhatsApp/phone numbers below are
 *   illustrative placeholders, not real Nutrioland data.
 */

export function formatPKR(amount: number): string {
  return `Rs. ${amount.toLocaleString("en-PK")}`;
}

export const FREE_DELIVERY_THRESHOLD = 1500;
export const DELIVERY_FEE = 100;

export function calculateDeliveryFee(subtotal: number): number {
  return subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE;
}

export const DELIVERY_TIME_SLOTS = ["Morning (10AM - 2PM)", "Evening (4PM - 7PM)"];

/**
 * Catalog products, categories, homepage banners, and the announcement bar
 * all live in data/*.json (edited via the admin panel at /admin/content and
 * /admin/products) instead of being hardcoded here. See lib/server/*-store.ts
 * for reads/writes, and app/api/* for the admin-facing HTTP endpoints.
 */
export function getEffectivePrice(product: Pick<Product, "price" | "discountPercent">): number {
  const discount = product.discountPercent ?? 0;
  if (discount <= 0) return product.price;
  return Math.round(product.price * (1 - discount / 100));
}

export const TESTIMONIALS: Testimonial[] = [
  {
    id: "t1",
    name: "Ayesha R.",
    location: "F-8, Islamabad",
    quote:
      "Ordered on WhatsApp and had a full basket of fruit at my door by evening. Way fresher than what I was getting at the local store.",
    rating: 5,
    avatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop",
  },
  {
    id: "t2",
    name: "Hamza K.",
    location: "Bahria Town, Rawalpindi",
    quote:
      "The weekly basket saves me a trip to the mandi every week. Prices are fair and the vegetables actually last.",
    rating: 5,
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop",
  },
  {
    id: "t3",
    name: "Sana M.",
    location: "Satellite Town, Rawalpindi",
    quote:
      "Loved that they had exotic fruit like dragon fruit and avocado. Delivery was on time and packaging kept everything fresh.",
    rating: 4,
    avatar:
      "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?q=80&w=200&auto=format&fit=crop",
  },
];

export const DELIVERY_SECTORS: DeliverySector[] = [
  { city: "Islamabad", sector: "F-6" },
  { city: "Islamabad", sector: "F-7" },
  { city: "Islamabad", sector: "F-8" },
  { city: "Islamabad", sector: "F-10" },
  { city: "Islamabad", sector: "F-11" },
  { city: "Islamabad", sector: "G-6" },
  { city: "Islamabad", sector: "G-9" },
  { city: "Islamabad", sector: "G-10" },
  { city: "Islamabad", sector: "G-11" },
  { city: "Islamabad", sector: "Bahria Town Islamabad" },
  { city: "Islamabad", sector: "DHA Islamabad" },
  { city: "Rawalpindi", sector: "Saddar" },
  { city: "Rawalpindi", sector: "Satellite Town" },
  { city: "Rawalpindi", sector: "Bahria Town Phase 4-8" },
  { city: "Rawalpindi", sector: "Askari" },
  { city: "Rawalpindi", sector: "Chaklala Scheme 3" },
];
