import CategoryShowcase from "@/components/CategoryShowcase";
import FeaturedProducts from "@/components/FeaturedProducts";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import NewsletterSignup from "@/components/NewsletterSignup";
import PromoBanner from "@/components/PromoBanner";
import Testimonials from "@/components/Testimonials";
import WhyUs from "@/components/WhyUs";
import { getCategories } from "@/lib/server/categories-store";
import { getHeroSettings } from "@/lib/server/hero-store";
import { getProducts } from "@/lib/server/products-store";

// Reads data/*.json fresh on every request so admin content changes show up
// immediately instead of being frozen at build time.
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [products, categories, hero] = await Promise.all([
    getProducts(),
    getCategories(),
    getHeroSettings(),
  ]);
  const featuredProducts = products.filter((product) => product.featured && product.isActive);

  return (
    <>
      <Hero hero={hero} />
      <FeaturedProducts products={featuredProducts} />
      <CategoryShowcase categories={categories} />
      <HowItWorks />
      <PromoBanner />
      <WhyUs />
      <Testimonials />
      <NewsletterSignup />
    </>
  );
}
