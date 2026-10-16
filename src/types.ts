export interface ProductVariant {
  id: string;
  name: string;
  colorHex: string;
}

export interface ProductSpec {
  label: string;
  value: string;
}

export interface ProductReview {
  id: string;
  author: string;
  rating: number;
  date: string;
  comment: string;
  verified: boolean;
}

export interface Product {
  id: string;
  name: string;
  subtitle: string;
  price: number;
  category: 'Audio & Akustik' | 'Raum & Licht' | 'Living & Wohlbefinden';
  image: string;
  rating: number;
  reviewCount: number;
  stock: number;
  badge?: string;
  description: string;
  highlights: string[];
  specs: ProductSpec[];
  variants: ProductVariant[];
  careInstructions: string;
  shippingInfo: string;
  reviews: ProductReview[];
  isDeleted?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedVariant: ProductVariant;
}

export interface ShippingAddress {
  firstName: string;
  lastName: string;
  email: string;
  street: string;
  postalCode: string;
  city: string;
  country: string;
}

export interface Order {
  id: string;
  date: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  shippingCost: number;
  total: number;
  shippingMethod: 'standard' | 'express';
  shippingAddress: ShippingAddress;
  paymentMethod: 'paypal';
  paypalTransactionId: string;
  status: 'Bezahlt' | 'In Bearbeitung' | 'Versendet';
}

export type Currency = 'EUR' | 'CHF' | 'USD';

export interface PromoCode {
  code: string;
  discountPercent?: number;
  freeShipping?: boolean;
  minSpend?: number;
  description: string;
}

export interface PayPalConfig {
  mode: 'sandbox-simulation' | 'custom-client-id';
  clientId: string;
}

