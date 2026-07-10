export type ProductCategory = "fruits" | "vegetables" | "seasonal-exotic" | "combos-baskets";

export interface Product {
  id: string;
  sku: string;
  name: string;
  category: ProductCategory;
  price: number;
  unit: string;
  image: string;
  imageAlt: string;
  badge?: string;
  featured?: boolean;
  discountPercent?: number;
  isActive: boolean;
}

export interface Category {
  slug: string;
  name: string;
  description: string;
  image: string;
  imageAlt: string;
}

export interface AnnouncementSettings {
  enabled: boolean;
  messages: string[];
}

export interface AnalyticsSettings {
  gtmId: string;
  metaPixelId: string;
}

export interface HeroImage {
  image: string;
  imageAlt: string;
}

export interface HeroSettings {
  images: HeroImage[];
}

export interface Testimonial {
  id: string;
  name: string;
  location: string;
  quote: string;
  rating: number;
  avatar: string;
}

export interface DeliverySector {
  city: "Islamabad" | "Rawalpindi";
  sector: string;
}

export interface GeoPin {
  lat: number;
  lng: number;
}

export interface SavedAddress {
  id: string;
  label: string;
  sector: string;
  addressLine: string;
  pin?: GeoPin;
  isDefault?: boolean;
}

export interface CustomerProfile {
  name: string;
  phone: string;
  email: string;
}

export type OrderStatus = "Confirmed" | "On Road" | "Delivered" | "Cancelled";

export interface OrderItem {
  productId: string;
  name: string;
  unit: string;
  price: number;
  quantity: number;
}

export interface OrderRecord {
  id: string;
  createdAt: string;
  customerName: string;
  customerPhone: string;
  items: OrderItem[];
  subtotal: number;
  discountPercent: number;
  deliveryFee: number;
  total: number;
  sector: string;
  addressLine: string;
  deliverySlot: string;
  status: OrderStatus;
}
