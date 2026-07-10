import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import ProductCard from "@/components/ProductCard";
import { getCategories } from "@/lib/server/categories-store";
import { getProducts } from "@/lib/server/products-store";
import type { ProductCategory } from "@/lib/types";

export const metadata: Metadata = {
  title: "Shop | Nutrioland",
  description:
    "Browse Nutrioland's full catalogue of fresh fruits, vegetables, seasonal & exotic picks, and combo baskets.",
};

export default async function ShopPage({
  searchParams,
}: {
  searchParams: { category?: string };
}) {
  const categories = await getCategories();
  const validSlugs = categories.map((category) => category.slug);
  const requestedSlug = searchParams.category;
  const activeCategory = validSlugs.includes(requestedSlug ?? "")
    ? (requestedSlug as ProductCategory)
    : undefined;

  const allProducts = await getProducts();
  const visibleProducts = allProducts.filter((product) => product.isActive);
  const products = activeCategory
    ? visibleProducts.filter((product) => product.categories.includes(activeCategory))
    : visibleProducts;

  const activeCategoryName = categories.find((category) => category.slug === activeCategory)?.name;

  return (
    <section className="py-10 sm:py-14">
      <Container>
        <div className="text-center sm:text-left">
          <span className="inline-block rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand-dark">
            Full Catalogue
          </span>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            {activeCategoryName ?? "All Products"}
          </h1>
          <p className="mt-2 text-sm text-slate-600 sm:text-base">
            {products.length} item{products.length === 1 ? "" : "s"} available
          </p>
        </div>

        <div className="mt-6 -mx-4 flex gap-2 overflow-x-auto px-4 pb-2 sm:mx-0 sm:flex-wrap sm:px-0 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <Link
            href="/shop"
            className={`shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition ${
              !activeCategory
                ? "border-brand bg-brand text-white"
                : "border-slate-200 text-slate-600 hover:border-brand hover:text-brand"
            }`}
          >
            All
          </Link>
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/shop?category=${category.slug}`}
              className={`shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition ${
                activeCategory === category.slug
                  ? "border-brand bg-brand text-white"
                  : "border-slate-200 text-slate-600 hover:border-brand hover:text-brand"
              }`}
            >
              {category.name}
            </Link>
          ))}
        </div>

        <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {products.length === 0 && (
          <p className="mt-10 text-center text-sm text-slate-500">
            No products found in this category yet.
          </p>
        )}
      </Container>
    </section>
  );
}
