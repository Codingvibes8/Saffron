"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { INITIAL_ORDERS, INITIAL_RESERVATIONS } from "@/lib/db";
import { INITIAL_PRODUCTS, PROMO_CODES } from "@/lib/menu-data";
import {
  CartItem,
  ExtraOption,
  FulfilmentType,
  Order,
  OrderStatus,
  Product,
  Reservation,
  SpiceLevel,
  UpgradeOption,
} from "@/lib/types";

interface CartState {
  items: CartItem[];
  isCartOpen: boolean;
  fulfilment: FulfilmentType;
  promoCode: string | null;
  discountPercent: number;
  activeProductForOptions: Product | null;
  orders: Order[];
  reservations: Reservation[];
  products: Product[];

  // Cart actions
  setCartOpen: (open: boolean) => void;
  setActiveProductForOptions: (product: Product | null) => void;
  setFulfilment: (type: FulfilmentType) => void;
  addItem: (params: {
    product: Product;
    quantity?: number;
    spiceLevel?: SpiceLevel;
    upgrade?: UpgradeOption;
    extras?: ExtraOption[];
    specialInstructions?: string;
  }) => void;
  removeItem: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  applyPromoCode: (code: string) => { success: boolean; message: string };
  removePromoCode: () => void;

  // Computed helpers
  getItemCount: () => number;
  getSubtotal: () => number;
  getDiscountAmount: () => number;
  getDeliveryFee: () => number;
  getTotal: () => number;

  // Orders & Reservations state (synced with API + local persistence)
  addOrder: (order: Order) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  addReservation: (reservation: Reservation) => void;
  updateReservationStatus: (
    id: string,
    status: Reservation["status"]
  ) => void;
  toggleProductAvailability: (productId: string) => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isCartOpen: false,
      fulfilment: "delivery",
      promoCode: null,
      discountPercent: 0,
      activeProductForOptions: null,
      orders: INITIAL_ORDERS,
      reservations: INITIAL_RESERVATIONS,
      products: INITIAL_PRODUCTS,

      setCartOpen: (open) => set({ isCartOpen: open }),
      setActiveProductForOptions: (product) =>
        set({ activeProductForOptions: product }),
      setFulfilment: (fulfilment) => set({ fulfilment }),

      addItem: ({
        product,
        quantity = 1,
        spiceLevel,
        upgrade,
        extras = [],
        specialInstructions,
      }) => {
        const upgradeCost = upgrade?.price ?? 0;
        const extrasCost = extras.reduce((sum, e) => sum + e.price, 0);
        const unitTotal = Number(
          (product.price + upgradeCost + extrasCost).toFixed(2)
        );

        const modifierSignature = [
          product.id,
          spiceLevel || "default",
          upgrade?.id || "none",
          extras
            .map((e) => e.id)
            .sort()
            .join(","),
          (specialInstructions || "").trim().toLowerCase(),
        ].join("|");

        set((state) => {
          const existingIndex = state.items.findIndex(
            (item) => item.cartItemId === modifierSignature
          );

          if (existingIndex > -1) {
            const updated = [...state.items];
            updated[existingIndex] = {
              ...updated[existingIndex],
              quantity: updated[existingIndex].quantity + quantity,
            };
            return { items: updated, isCartOpen: true };
          }

          const newItem: CartItem = {
            cartItemId: modifierSignature,
            product,
            quantity,
            spiceLevel,
            upgrade: upgrade && upgrade.price > 0 ? upgrade : undefined,
            extras,
            specialInstructions: specialInstructions?.trim() || undefined,
            unitTotal,
          };

          return {
            items: [...state.items, newItem],
            isCartOpen: true,
          };
        });
      },

      removeItem: (cartItemId) =>
        set((state) => ({
          items: state.items.filter((i) => i.cartItemId !== cartItemId),
        })),

      updateQuantity: (cartItemId, quantity) =>
        set((state) => {
          if (quantity <= 0) {
            return {
              items: state.items.filter((i) => i.cartItemId !== cartItemId),
            };
          }
          return {
            items: state.items.map((item) =>
              item.cartItemId === cartItemId ? { ...item, quantity } : item
            ),
          };
        }),

      clearCart: () =>
        set({ items: [], promoCode: null, discountPercent: 0 }),

      applyPromoCode: (rawCode) => {
        const normalized = rawCode.trim().toUpperCase();
        const found = PROMO_CODES[normalized];
        if (!found) {
          return {
            success: false,
            message:
              "Invalid code. Try SAFFRON10, STUDENT10, SOHO15, or FEAST20.",
          };
        }
        set({
          promoCode: found.code,
          discountPercent: found.discountPercent,
        });
        return {
          success: true,
          message: `Applied ${found.code}: ${found.description}!`,
        };
      },

      removePromoCode: () => set({ promoCode: null, discountPercent: 0 }),

      getItemCount: () =>
        get().items.reduce((total, item) => total + item.quantity, 0),

      getSubtotal: () =>
        Number(
          get()
            .items.reduce(
              (total, item) => total + item.unitTotal * item.quantity,
              0
            )
            .toFixed(2)
        ),

      getDiscountAmount: () => {
        const subtotal = get().getSubtotal();
        const pct = get().discountPercent;
        if (!pct) return 0;
        return Number(((subtotal * pct) / 100).toFixed(2));
      },

      getDeliveryFee: () => {
        const { fulfilment } = get();
        const subtotal = get().getSubtotal();
        if (subtotal === 0 || fulfilment === "collection") return 0;
        return subtotal >= 45 ? 0 : 2.95;
      },

      getTotal: () => {
        const subtotal = get().getSubtotal();
        if (subtotal === 0) return 0;
        const discount = get().getDiscountAmount();
        const delivery = get().getDeliveryFee();
        return Number(Math.max(0, subtotal - discount + delivery).toFixed(2));
      },

      addOrder: (order) =>
        set((state) => ({
          orders: [
            order,
            ...state.orders.filter((o) => o.id !== order.id),
          ],
        })),

      updateOrderStatus: (orderId, status) =>
        set((state) => ({
          orders: state.orders.map((o) =>
            o.id === orderId ||
            o.orderNumber.replace("#", "") === orderId.replace("#", "")
              ? { ...o, status }
              : o
          ),
        })),

      addReservation: (reservation) =>
        set((state) => ({
          reservations: [reservation, ...state.reservations],
        })),

      updateReservationStatus: (id, status) =>
        set((state) => ({
          reservations: state.reservations.map((r) =>
            r.id === id ? { ...r, status } : r
          ),
        })),

      toggleProductAvailability: (productId) =>
        set((state) => ({
          products: state.products.map((p) =>
            p.id === productId
              ? { ...p, available: p.available === false ? true : false }
              : p
          ),
        })),
    }),
    {
      name: "saffron-ember-cart-v1",
      partialize: (state) => ({
        items: state.items,
        fulfilment: state.fulfilment,
        promoCode: state.promoCode,
        discountPercent: state.discountPercent,
        orders: state.orders,
        reservations: state.reservations,
        products: state.products,
      }),
    }
  )
);
