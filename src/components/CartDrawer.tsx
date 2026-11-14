"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  Bike,
  Store,
  Tag,
  ArrowRight,
  Flame,
  Sparkles,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/useCartStore";
import { formatGBP } from "@/lib/utils";

export function CartDrawer() {
  const {
    items,
    isCartOpen,
    setCartOpen,
    fulfilment,
    setFulfilment,
    updateQuantity,
    removeItem,
    promoCode,
    discountPercent,
    applyPromoCode,
    removePromoCode,
    getSubtotal,
    getDiscountAmount,
    getDeliveryFee,
    getTotal,
  } = useCartStore();

  const [couponInput, setCouponInput] = useState("");
  const [couponFeedback, setCouponFeedback] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const subtotal = getSubtotal();
  const discount = getDiscountAmount();
  const deliveryFee = getDeliveryFee();
  const total = getTotal();

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const res = applyPromoCode(couponInput);
    setCouponFeedback({
      type: res.success ? "success" : "error",
      text: res.message,
    });
    if (res.success) setCouponInput("");
  };

  return (
    <Sheet open={isCartOpen} onOpenChange={setCartOpen}>
      <SheetContent
        side="right"
        className="flex h-full w-full flex-col justify-between bg-[#140906] p-0 sm:max-w-md border-l border-amber-400/20"
      >
        {/* Top Header + Fulfilment Toggle */}
        <div className="border-b border-white/10 p-6">
          <SheetHeader className="text-left">
            <SheetTitle className="flex items-center gap-2.5 text-xl font-black text-white">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-400/15 text-amber-400 border border-amber-400/30">
                <ShoppingBag className="h-5 w-5" />
              </div>
              Your Saffron Order
            </SheetTitle>
            <SheetDescription className="text-xs text-stone-400">
              Freshly prepared to order in our Soho W1 &amp; NW2 charcoal tandoor.
            </SheetDescription>
          </SheetHeader>

          {/* Fulfilment Toggle: Delivery vs. Collection */}
          <div className="mt-4 grid grid-cols-2 gap-2 rounded-2xl border border-white/10 bg-white/5 p-1.5">
            <button
              type="button"
              onClick={() => setFulfilment("delivery")}
              className={`flex items-center justify-center gap-2 rounded-xl py-2 text-xs font-bold transition-all cursor-pointer ${
                fulfilment === "delivery"
                  ? "bg-gradient-to-r from-amber-400 to-orange-500 text-stone-950 shadow"
                  : "text-stone-300 hover:text-white"
              }`}
            >
              <Bike className="h-4 w-4" />
              <span>Delivery (25m)</span>
            </button>
            <button
              type="button"
              onClick={() => setFulfilment("collection")}
              className={`flex items-center justify-center gap-2 rounded-xl py-2 text-xs font-bold transition-all cursor-pointer ${
                fulfilment === "collection"
                  ? "bg-gradient-to-r from-amber-400 to-orange-500 text-stone-950 shadow"
                  : "text-stone-300 hover:text-white"
              }`}
            >
              <Store className="h-4 w-4" />
              <span>Collection (15m)</span>
            </button>
          </div>
        </div>

        {/* Cart Items Scroll Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {items.length === 0 ? (
            <div className="flex h-72 flex-col items-center justify-center text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-3xl border border-amber-400/20 bg-amber-400/10 text-amber-400">
                <Flame className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-bold text-white">
                Your feast bag is empty
              </h3>
              <p className="mt-1 max-w-xs text-xs text-stone-400">
                Add slow-simmered curries, charcoal tandoori grills, or saffron biryanis to begin.
              </p>
              <Link
                href="/menu"
                onClick={() => setCartOpen(false)}
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 px-5 py-2.5 text-xs font-black text-stone-950"
              >
                Browse Menu
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.cartItemId}
                className="rounded-2xl border border-white/10 bg-white/5 p-4 transition-colors hover:border-amber-400/30"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="h-14 w-14 shrink-0 rounded-xl object-cover border border-white/10"
                    />
                    <div>
                      <h4 className="text-sm font-bold text-white leading-snug">
                        {item.product.name}
                      </h4>
                      <span className="font-mono text-xs font-semibold text-amber-400">
                        {formatGBP(item.unitTotal)} each
                      </span>

                      {/* Modifiers List */}
                      <div className="mt-1.5 flex flex-wrap gap-1">
                        {item.spiceLevel && (
                          <span className="rounded bg-orange-500/15 px-2 py-0.5 text-[10px] font-medium text-orange-300 border border-orange-500/20">
                            Spice: {item.spiceLevel}
                          </span>
                        )}
                        {item.upgrade && (
                          <span className="rounded bg-amber-400/15 px-2 py-0.5 text-[10px] font-medium text-amber-300 border border-amber-400/20">
                            + {item.upgrade.name}
                          </span>
                        )}
                        {item.extras.map((extra) => (
                          <span
                            key={extra.id}
                            className="rounded bg-white/10 px-2 py-0.5 text-[10px] text-stone-300"
                          >
                            + {extra.name}
                          </span>
                        ))}
                      </div>

                      {item.specialInstructions && (
                        <p className="mt-1 text-[11px] italic text-stone-400">
                          &ldquo;{item.specialInstructions}&rdquo;
                        </p>
                      )}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeItem(item.cartItemId)}
                    aria-label="Remove item"
                    className="text-stone-500 hover:text-red-400 transition-colors cursor-pointer"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                {/* Quantity & Line Total */}
                <div className="mt-3 flex items-center justify-between border-t border-white/10 pt-3">
                  <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-stone-950/60 px-2 py-1">
                    <button
                      type="button"
                      onClick={() =>
                        updateQuantity(item.cartItemId, item.quantity - 1)
                      }
                      className="flex h-6 w-6 items-center justify-center rounded-lg bg-white/5 text-stone-300 hover:bg-amber-400 hover:text-stone-950 cursor-pointer"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="w-6 text-center font-mono text-xs font-bold text-white">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        updateQuantity(item.cartItemId, item.quantity + 1)
                      }
                      className="flex h-6 w-6 items-center justify-center rounded-lg bg-white/5 text-stone-300 hover:bg-amber-400 hover:text-stone-950 cursor-pointer"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>

                  <span className="font-mono text-sm font-black text-white">
                    {formatGBP(item.unitTotal * item.quantity)}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer: Promo Code + Totals + Checkout Button */}
        {items.length > 0 && (
          <div className="border-t border-white/10 bg-stone-950/90 p-6 space-y-4">
            {/* Promo Code Input */}
            <div>
              {promoCode ? (
                <div className="flex items-center justify-between rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-2 text-xs text-emerald-300">
                  <span className="flex items-center gap-1.5 font-semibold">
                    <Sparkles className="h-3.5 w-3.5" />
                    Code {promoCode} ({discountPercent}% OFF) applied
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      removePromoCode();
                      setCouponFeedback(null);
                    }}
                    className="text-xs font-bold underline hover:text-white cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-stone-400" />
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      placeholder="Promo (SAFFRON10 / STUDENT10)"
                      className="w-full rounded-xl border border-white/15 bg-white/5 pl-9 pr-3 py-2 text-xs text-white placeholder:text-stone-500 focus:border-amber-400 focus:outline-none"
                    />
                  </div>
                  <Button
                    type="submit"
                    variant="secondary"
                    size="sm"
                    className="rounded-xl px-4"
                  >
                    Apply
                  </Button>
                </form>
              )}
              {couponFeedback && !promoCode && (
                <p
                  className={`mt-1.5 text-[11px] ${
                    couponFeedback.type === "success"
                      ? "text-emerald-400"
                      : "text-red-400"
                  }`}
                >
                  {couponFeedback.text}
                </p>
              )}
            </div>

            {/* Cost Breakdown */}
            <div className="space-y-1.5 text-xs text-stone-300">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-mono">{formatGBP(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>Discount ({promoCode})</span>
                  <span className="font-mono">-{formatGBP(discount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>
                  {fulfilment === "collection"
                    ? "Collection (Soho W1 / NW2)"
                    : "Insulated Hot Delivery"}
                </span>
                <span className="font-mono">
                  {deliveryFee === 0 ? "FREE" : formatGBP(deliveryFee)}
                </span>
              </div>
              <div className="flex justify-between border-t border-white/10 pt-2.5 text-base font-black text-white">
                <span>Total</span>
                <span className="font-mono text-amber-400">
                  {formatGBP(total)}
                </span>
              </div>
            </div>

            <Link
              href="/checkout"
              onClick={() => setCartOpen(false)}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 py-4 text-sm font-black text-stone-950 shadow-[0_0_30px_-5px_rgba(245,158,11,0.6)] transition-all hover:from-amber-300 hover:to-orange-400"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
