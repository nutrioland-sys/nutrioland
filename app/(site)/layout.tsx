import type { Metadata } from "next";
import { Inter } from "next/font/google";
import AnnouncementBar from "@/components/AnnouncementBar";
import { GtmBodyNoscript, GtmHeadScript, MetaPixelNoscript, MetaPixelScript } from "@/components/Analytics";
import CartBar from "@/components/CartBar";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { AccountProvider } from "@/lib/account-context";
import { CartProvider } from "@/lib/cart-context";
import { getAnalyticsSettings } from "@/lib/server/analytics-store";
import { getAnnouncement } from "@/lib/server/announcement-store";
import "../globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Nutrioland | Fresh Fruits & Vegetables Delivered in Islamabad & Rawalpindi",
  description:
    "Nutrioland delivers the largest variety of seasonal and exotic fruits & vegetables straight to your door in Islamabad & Rawalpindi, in 3 simple steps.",
};

// Reads data/announcement.json fresh on every request so admin changes to
// the ticker show up immediately instead of being frozen at build time.
export const dynamic = "force-dynamic";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [announcement, analytics] = await Promise.all([
    getAnnouncement(),
    getAnalyticsSettings(),
  ]);

  return (
    <html lang="en">
      <head>
        <GtmHeadScript gtmId={analytics.gtmId} />
      </head>
      <body className={`${inter.variable} bg-cream font-sans text-slate-800 antialiased`}>
        <GtmBodyNoscript gtmId={analytics.gtmId} />
        <MetaPixelScript metaPixelId={analytics.metaPixelId} />
        <MetaPixelNoscript metaPixelId={analytics.metaPixelId} />
        <AccountProvider>
          <CartProvider>
            <AnnouncementBar settings={announcement} />
            <Header />
            <main className="flex flex-col">{children}</main>
            <Footer />
            <CartBar />
          </CartProvider>
        </AccountProvider>
      </body>
    </html>
  );
}
