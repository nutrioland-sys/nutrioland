import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Nutrioland Admin",
  description: "Internal admin panel — not part of the public site.",
  robots: { index: false, follow: false },
};

// This is a separate root layout from the customer-facing site's
// app/(site)/layout.tsx (Next.js "multiple root layouts" pattern) — the
// admin panel intentionally has no customer Header/Footer/cart/account
// context, since none of that applies here.
export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans text-slate-800 antialiased`}>{children}</body>
    </html>
  );
}
