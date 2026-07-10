"use client";

import Image from "next/image";
import { useEffect, useState, type FormEvent } from "react";
import ToggleSwitch from "@/components/admin/ToggleSwitch";
import type {
  AnalyticsSettings,
  AnnouncementSettings,
  Category,
  HeroImage,
  HeroSettings,
} from "@/lib/types";

const TABS = [
  { id: "hero", label: "Hero Image" },
  { id: "categories", label: "Categories" },
  { id: "announcement", label: "Announcement" },
  { id: "analytics", label: "Analytics" },
] as const;

type TabId = (typeof TABS)[number]["id"];

export default function AdminContentPage() {
  const [activeTab, setActiveTab] = useState<TabId>("hero");

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-slate-900">Site Content</h1>
      <p className="mt-1 text-sm text-slate-500">
        Manage the homepage hero image, category tiles, the announcement ticker, and analytics
        integrations.
      </p>

      <div className="mt-6 -mx-4 flex gap-2 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition ${
              activeTab === tab.id
                ? "border-brand bg-brand text-white"
                : "border-slate-200 text-slate-600 hover:border-brand hover:text-brand"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {activeTab === "hero" && <HeroTab />}
        {activeTab === "categories" && <CategoriesTab />}
        {activeTab === "announcement" && <AnnouncementTab />}
        {activeTab === "analytics" && <AnalyticsTab />}
      </div>
    </div>
  );
}

const MAX_HERO_IMAGES = 3;

function HeroTab() {
  const [images, setImages] = useState<HeroImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingIndex, setEditingIndex] = useState<number | "new" | null>(null);

  useEffect(() => {
    loadImages();
  }, []);

  async function loadImages() {
    setIsLoading(true);
    const response = await fetch("/api/hero");
    const data = (await response.json()) as HeroSettings;
    setImages(data.images);
    setIsLoading(false);
  }

  async function persist(nextImages: HeroImage[]) {
    setImages(nextImages);
    await fetch("/api/hero", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ images: nextImages }),
    });
  }

  async function handleSave(index: number | "new", value: HeroImage) {
    const nextImages =
      index === "new" ? [...images, value] : images.map((img, i) => (i === index ? value : img));
    setEditingIndex(null);
    await persist(nextImages);
  }

  async function handleDelete(index: number) {
    if (!window.confirm("Remove this hero image?")) return;
    await persist(images.filter((_, i) => i !== index));
  }

  if (isLoading) {
    return <p className="text-sm text-slate-500">Loading hero images…</p>;
  }

  return (
    <div className="max-w-xl space-y-4">
      <p className="text-sm text-slate-500">
        Up to {MAX_HERO_IMAGES} photos shown on the right side of the homepage hero, next to the
        &quot;Largest variety of seasonal &amp; exotic edibles&quot; heading. When more than one
        is added, they rotate automatically like the old banner did.
      </p>

      {images.map((heroImage, index) =>
        editingIndex === index ? (
          <HeroImageForm
            key={index}
            initialValue={heroImage}
            onSave={(value) => handleSave(index, value)}
            onCancel={() => setEditingIndex(null)}
          />
        ) : (
          <div
            key={index}
            className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm"
          >
            <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-brand-50">
              <Image
                src={heroImage.image}
                alt={heroImage.imageAlt}
                fill
                sizes="56px"
                className="object-cover"
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-slate-800">
                {heroImage.imageAlt || "No description"}
              </p>
              <p className="text-xs text-slate-500">Slide {index + 1}</p>
            </div>
            <div className="flex shrink-0 gap-3">
              <button
                type="button"
                onClick={() => setEditingIndex(index)}
                className="text-sm font-semibold text-brand-dark hover:underline"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={() => handleDelete(index)}
                className="text-sm font-semibold text-red-600 hover:underline"
              >
                Delete
              </button>
            </div>
          </div>
        )
      )}

      {editingIndex === "new" ? (
        <HeroImageForm onSave={(value) => handleSave("new", value)} onCancel={() => setEditingIndex(null)} />
      ) : (
        images.length < MAX_HERO_IMAGES && (
          <button
            type="button"
            onClick={() => setEditingIndex("new")}
            className="flex w-full items-center justify-center gap-1.5 rounded-full border border-dashed border-brand/40 py-3 text-sm font-semibold text-brand-dark transition hover:bg-brand-50"
          >
            + Add Hero Image
          </button>
        )
      )}
    </div>
  );
}

function HeroImageForm({
  initialValue,
  onSave,
  onCancel,
}: {
  initialValue?: HeroImage;
  onSave: (value: HeroImage) => void;
  onCancel: () => void;
}) {
  const [image, setImage] = useState(initialValue?.image ?? "");
  const [imageAlt, setImageAlt] = useState(initialValue?.imageAlt ?? "");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSave({ image, imageAlt });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
    >
      {image && (
        <div className="relative aspect-square w-full max-w-xs overflow-hidden rounded-2xl bg-brand-50">
          <Image src={image} alt={imageAlt || "Hero preview"} fill sizes="320px" className="object-cover" />
        </div>
      )}

      <div>
        <label htmlFor="hero-image" className="text-sm font-semibold text-slate-800">
          Image URL
        </label>
        <input
          id="hero-image"
          type="url"
          required
          value={image}
          onChange={(event) => setImage(event.target.value)}
          placeholder="https://images.unsplash.com/…"
          className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30"
        />
        <p className="mt-1 text-xs text-slate-500">A square-ish photo works best, roughly 1200×1200px.</p>
      </div>

      <div>
        <label htmlFor="hero-alt" className="text-sm font-semibold text-slate-800">
          Description <span className="font-normal text-slate-400">(for accessibility)</span>
        </label>
        <input
          id="hero-alt"
          value={imageAlt}
          onChange={(event) => setImageAlt(event.target.value)}
          placeholder="e.g. Fresh fruits and vegetables in a basket"
          className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30"
        />
      </div>

      <div className="flex gap-2 pt-1">
        <button
          type="submit"
          className="rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white shadow-card transition hover:bg-brand-dark"
        >
          Save Image
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-full border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600 transition hover:border-brand hover:text-brand"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

function CategoriesTab() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingSlug, setEditingSlug] = useState<string | null>(null);

  useEffect(() => {
    loadCategories();
  }, []);

  async function loadCategories() {
    setIsLoading(true);
    const response = await fetch("/api/categories");
    setCategories(await response.json());
    setIsLoading(false);
  }

  async function handleSave(
    slug: string,
    values: { name: string; description: string; image: string }
  ) {
    await fetch(`/api/categories/${slug}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    setEditingSlug(null);
    await loadCategories();
  }

  if (isLoading) {
    return <p className="text-sm text-slate-500">Loading categories…</p>;
  }

  return (
    <div className="max-w-xl space-y-4">
      <p className="text-sm text-slate-500">
        These 4 tiles appear on the homepage and as filters on the Shop page. You can change
        each one&apos;s name, description, and photo — the category itself can&apos;t be
        renamed at the URL level, since products are already linked to it.
      </p>

      {categories.map((category) =>
        editingSlug === category.slug ? (
          <CategoryForm
            key={category.slug}
            initialValue={category}
            onSave={(values) => handleSave(category.slug, values)}
            onCancel={() => setEditingSlug(null)}
          />
        ) : (
          <div
            key={category.slug}
            className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm"
          >
            <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-brand-50">
              <Image
                src={category.image}
                alt={category.imageAlt}
                fill
                sizes="56px"
                className="object-cover"
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-slate-900">{category.name}</p>
              <p className="truncate text-xs text-slate-500">{category.description}</p>
            </div>
            <button
              type="button"
              onClick={() => setEditingSlug(category.slug)}
              className="shrink-0 text-sm font-semibold text-brand-dark hover:underline"
            >
              Edit
            </button>
          </div>
        )
      )}
    </div>
  );
}

function CategoryForm({
  initialValue,
  onSave,
  onCancel,
}: {
  initialValue: Category;
  onSave: (values: { name: string; description: string; image: string }) => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState(initialValue.name);
  const [description, setDescription] = useState(initialValue.description);
  const [image, setImage] = useState(initialValue.image);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSave({ name, description, image });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
    >
      <div>
        <label htmlFor={`cat-name-${initialValue.slug}`} className="text-sm font-semibold text-slate-800">
          Name
        </label>
        <input
          id={`cat-name-${initialValue.slug}`}
          required
          value={name}
          onChange={(event) => setName(event.target.value)}
          className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30"
        />
      </div>
      <div>
        <label htmlFor={`cat-desc-${initialValue.slug}`} className="text-sm font-semibold text-slate-800">
          Description
        </label>
        <input
          id={`cat-desc-${initialValue.slug}`}
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30"
        />
      </div>
      <div>
        <label htmlFor={`cat-image-${initialValue.slug}`} className="text-sm font-semibold text-slate-800">
          Image URL
        </label>
        <input
          id={`cat-image-${initialValue.slug}`}
          type="url"
          required
          value={image}
          onChange={(event) => setImage(event.target.value)}
          className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30"
        />
      </div>
      <div className="flex gap-2 pt-1">
        <button
          type="submit"
          className="rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white shadow-card transition hover:bg-brand-dark"
        >
          Save Category
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-full border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600 transition hover:border-brand hover:text-brand"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

function AnnouncementTab() {
  const [settings, setSettings] = useState<AnnouncementSettings | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [savedMessage, setSavedMessage] = useState(false);

  useEffect(() => {
    loadAnnouncement();
  }, []);

  async function loadAnnouncement() {
    const response = await fetch("/api/announcement");
    setSettings(await response.json());
  }

  async function persist(next: AnnouncementSettings) {
    setSettings(next);
    await fetch("/api/announcement", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(next),
    });
    setSavedMessage(true);
    window.setTimeout(() => setSavedMessage(false), 1500);
  }

  if (!settings) {
    return <p className="text-sm text-slate-500">Loading announcement settings…</p>;
  }

  function handleAddMessage() {
    if (!newMessage.trim() || !settings) return;
    persist({ ...settings, messages: [...settings.messages, newMessage.trim()] });
    setNewMessage("");
  }

  function handleRemoveMessage(index: number) {
    if (!settings) return;
    persist({ ...settings, messages: settings.messages.filter((_, i) => i !== index) });
  }

  return (
    <div className="max-w-xl space-y-4">
      <p className="text-sm text-slate-500">
        A scrolling ticker shown at the very top of every page for special offers and
        announcements.
      </p>

      <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <ToggleSwitch
          checked={settings.enabled}
          onChange={() => persist({ ...settings, enabled: !settings.enabled })}
          label="Enable announcement ticker"
        />
        <span className="text-sm font-semibold text-slate-800">
          {settings.enabled ? "Ticker is live" : "Ticker is hidden"}
        </span>
        {savedMessage && <span className="ml-auto text-xs font-medium text-brand-dark">Saved</span>}
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <span className="text-sm font-semibold text-slate-800">Messages</span>
        <ul className="mt-3 space-y-2">
          {settings.messages.length === 0 && (
            <li className="text-sm text-slate-400">No messages yet.</li>
          )}
          {settings.messages.map((message, index) => (
            <li
              key={`${message}-${index}`}
              className="flex items-center justify-between gap-2 rounded-xl bg-slate-50 px-3 py-2 text-sm text-slate-700"
            >
              <span>{message}</span>
              <button
                type="button"
                aria-label={`Remove message: ${message}`}
                onClick={() => handleRemoveMessage(index)}
                className="shrink-0 font-semibold text-red-600 hover:underline"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>

        <div className="mt-3 flex gap-2">
          <input
            value={newMessage}
            onChange={(event) => setNewMessage(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                handleAddMessage();
              }
            }}
            placeholder="e.g. Rs. 100 off orders over Rs. 2,000 this week"
            className="flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30"
          />
          <button
            type="button"
            onClick={handleAddMessage}
            className="shrink-0 rounded-full bg-brand px-4 py-2.5 text-sm font-semibold text-white shadow-card transition hover:bg-brand-dark"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}

function AnalyticsTab() {
  const [settings, setSettings] = useState<AnalyticsSettings | null>(null);
  const [gtmId, setGtmId] = useState("");
  const [metaPixelId, setMetaPixelId] = useState("");
  const [savedMessage, setSavedMessage] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  async function loadSettings() {
    const response = await fetch("/api/analytics");
    const data = (await response.json()) as AnalyticsSettings;
    setSettings(data);
    setGtmId(data.gtmId);
    setMetaPixelId(data.metaPixelId);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const next = { gtmId: gtmId.trim(), metaPixelId: metaPixelId.trim() };
    setSettings(next);
    await fetch("/api/analytics", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(next),
    });
    setSavedMessage(true);
    window.setTimeout(() => setSavedMessage(false), 1500);
  }

  if (!settings) {
    return <p className="text-sm text-slate-500">Loading analytics settings…</p>;
  }

  return (
    <div className="max-w-xl space-y-4">
      <p className="text-sm text-slate-500">
        Paste your Google Tag Manager container ID and Meta (Facebook) Pixel ID below. Leave a
        field blank to keep that integration turned off. Changes go live for visitors right
        away, no redeploy needed.
      </p>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
      >
        <div>
          <label htmlFor="gtm-id" className="text-sm font-semibold text-slate-800">
            Google Tag Manager Container ID
          </label>
          <input
            id="gtm-id"
            value={gtmId}
            onChange={(event) => setGtmId(event.target.value)}
            placeholder="GTM-XXXXXXX"
            className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30"
          />
          <p className="mt-1 text-xs text-slate-500">
            Found in GTM under Admin &rarr; Container Settings.
          </p>
        </div>

        <div>
          <label htmlFor="meta-pixel-id" className="text-sm font-semibold text-slate-800">
            Meta Pixel ID
          </label>
          <input
            id="meta-pixel-id"
            value={metaPixelId}
            onChange={(event) => setMetaPixelId(event.target.value)}
            placeholder="123456789012345"
            className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30"
          />
          <p className="mt-1 text-xs text-slate-500">
            Found in Meta Events Manager under Data Sources &rarr; your pixel.
          </p>
        </div>

        <div className="flex items-center gap-3 pt-1">
          <button
            type="submit"
            className="rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white shadow-card transition hover:bg-brand-dark"
          >
            Save
          </button>
          {savedMessage && <span className="text-xs font-medium text-brand-dark">Saved</span>}
        </div>
      </form>
    </div>
  );
}
