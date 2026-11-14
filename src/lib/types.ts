export type MenuCategory =
  | "All"
  | "Small Plates & Chaat"
  | "Tandoori Grill"
  | "Signature Curries"
  | "Biryani"
  | "Breads & Sides"
  | "Drinks & Desserts"
  | "Feast Deals";

export type SpiceLevel = "Mild" | "Medium" | "Madras Hot" | "Vindaloo";

export interface UpgradeOption {
  id: string;
  name: string;
  price: number;
}

export interface ExtraOption {
  id: string;
  name: string;
  price: number;
}

export type DietaryTag =
  | "Vegan"
  | "Vegetarian"
  | "Gluten-Free"
  | "Jain-Friendly"
  | "Halal"
  | "Chef's Signature";

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: Exclude<MenuCategory, "All">;
  badgeCategory: string;
  image: string;
  featured?: boolean;
  hasModifiers?: boolean;
  dietary: DietaryTag[];
  defaultSpice?: SpiceLevel;
  calories?: number;
  prepTimeMins?: number;
  rating?: number;
  reviewsCount?: number;
  available?: boolean;
}

export interface CartItem {
  cartItemId: string;
  product: Product;
  quantity: number;
  spiceLevel?: SpiceLevel;
  upgrade?: UpgradeOption;
  extras: ExtraOption[];
  specialInstructions?: string;
  unitTotal: number;
}

export type FulfilmentType = "delivery" | "collection";

export type OrderStatus =
  | "Preparing"
  | "In the Tandoor"
  | "Out for Delivery"
  | "Delivered";

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  fulfilment: FulfilmentType;
  deliveryAddress?: string;
  postcode?: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  promoCode?: string;
  deliveryFee: number;
  total: number;
  status: OrderStatus;
  createdAt: string;
  estimatedMinutes: number;
  notes?: string;
  paymentStatus: "paid" | "pending";
}

export interface Reservation {
  id: string;
  reference: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  date: string;
  timeSlot: string;
  partySize: number;
  seatingArea:
    | "Main Tandoor Dining Room"
    | "Soho Velvet Booths"
    | "Chef's Counter"
    | "Private Spice Vault";
  occasion?: string;
  dietaryNotes?: string;
  specialRequests?: string;
  status: "confirmed" | "seated" | "cancelled";
  createdAt: string;
}
