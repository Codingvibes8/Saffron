"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  ArrowRight,
  Award,
  CheckCircle2,
  Clock,
  Flame,
  MapPin,
  Phone,
  Receipt,
  Sparkles,
} from "lucide-react";
import { INITIAL_ORDERS } from "@/lib/db";
import { formatGBP } from "@/lib/utils";
import { useCartStore } from "@/store/useCartStore";

function OrderConfirmationContent() {
  const searchParams = useSearchParams();
  const orderIdParam = searchParams.get("orderId") || "SE-8492";
  const orders = useCartStore((state) => state.orders);

  const order =
    orders.find(
      (o) =>
        o.id.toUpperCase() === orderIdParam.replace("#", "").toUpperCase() ||
        o.orderNumber.replace("#", "").toUpperCase() ===
          orderIdParam.replace("#", "").toUpperCase()
    ) ||
    INITIAL_ORDERS.find((o) => o.id === orderIdParam) ||
    orders[0] ||
    INITIAL_ORDERS[0];

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
      {/* Celebration Card */}
      <div className="overflow-hidden rounded-[2.25rem] border border-amber-400/25 bg-gradient-to-b from-amber-950/40 via-stone-900/90 to-stone-950 p-8 shadow-2xl backdrop-blur-2xl sm:p-12">
        <div className="flex flex-col items-center text-center">
          <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-3xl border border-emerald-400/30 bg-emerald-500/15 text-emerald-400 shadow-[0_0_40px_-5px_rgba(16,185,129,0.5)]">
            <CheckCircle2 className="h-10 w-10" />
          </div>

          <span className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-4 py-1 text-xs font-bold uppercase tracking-widest text-amber-300">
            <Flame className="h-3.5 w-3.5 text-orange-400" />
            Order Sent to the Charcoal Tandoor
          </span>

          <h1 className="mt-4 text-3xl font-black tracking-tight text-white sm:text-5xl">
            Thank You, {order.customerName.split(" ")[0]}!
          </h1>
          <p className="mt-2 max-w-xl text-sm text-stone-300 sm:text-base">
            Your order{" "}
            <span className="font-mono font-bold text-amber-400">
              {order.orderNumber}
            </span>{" "}
            is confirmed and our spice masters are firing up your dishes fresh to
            order.
          </p>

          {/* Primary Live Tracker CTA */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href={`/orders/${order.id}`}
              className="inline-flex items-center gap-3 rounded-2xl bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 px-8 py-4 text-base font-black text-stone-950 shadow-[0_0_40px_-10px_rgba(245,158,11,0.7)] transition hover:-translate-y-0.5 hover:brightness-110"
            >
              <span>Track Live Order Status</span>
              <ArrowRight className="h-5 w-5" />
            </Link>

            <Link
              href="/kitchen"
              className="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-6 py-4 text-sm font-semibold text-stone-200 transition hover:bg-white/10"
            >
              <Flame className="h-4 w-4 text-orange-400" />
              <span>View Live Kitchen Display (/kitchen)</span>
            </Link>
          </div>
        </div>

        {/* Key Status Metrics */}
        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-stone-950/70 p-5">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400">
              <Clock className="h-4 w-4" />
              <span>Estimated Time</span>
            </div>
            <div className="mt-2 text-2xl font-black text-white">
              ~{order.estimatedMinutes} mins
            </div>
            <div className="mt-0.5 text-xs text-stone-400">
              Current Stage:{" "}
              <span className="font-semibold text-emerald-400">
                {order.status}
              </span>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-stone-950/70 p-5">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-orange-400">
              <MapPin className="h-4 w-4" />
              <span>
                {order.fulfilment === "collection"
                  ? "Collection Point"
                  : "Delivery Address"}
              </span>
            </div>
            <div className="mt-2 truncate text-sm font-bold text-white">
              {order.deliveryAddress || "9-10 Soho Street, London W1D 3DL"}
            </div>
            <div className="mt-0.5 font-mono text-xs text-stone-400">
              {order.postcode || "London W1 / NW2"}
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-stone-950/70 p-5">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-400">
              <Phone className="h-4 w-4" />
              <span>Direct Kitchen Line</span>
            </div>
            <div className="mt-2 font-mono text-base font-bold text-white">
              020 8452 1234
            </div>
            <div className="mt-0.5 text-xs text-stone-400">
              Soho W1 &amp; NW2 Concierge
            </div>
          </div>
        </div>

        {/* 7-Stamp Loyalty Card Progress */}
        <div className="mt-8 rounded-2xl border border-amber-400/25 bg-amber-500/10 p-5">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-400 text-stone-950">
                <Award className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">
                  Saffron &amp; Soho 7-Stamp Loyalty Reward
                </h3>
                <p className="text-xs text-amber-200/80">
                  You earned +1 stamp! Free Lassi/Dessert on your 4th visit •
                  Complimentary Royal Thali on your 7th.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              {[1, 2, 3, 4, 5, 6, 7].map((stamp) => (
                <div
                  key={stamp}
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-black ${
                    stamp <= 5
                      ? "bg-amber-400 text-stone-950 shadow-[0_0_12px_rgba(245,158,11,0.6)]"
                      : "border border-white/20 bg-stone-950 text-stone-500"
                  }`}
                >
                  {stamp <= 5 ? "★" : stamp}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Itemized Receipt */}
        <div className="mt-8 rounded-2xl border border-white/10 bg-stone-950/80 p-6">
          <div className="mb-4 flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2 text-sm font-bold text-white">
              <Receipt className="h-4 w-4 text-amber-400" />
              <span>Itemized Kitchen Receipt ({order.orderNumber})</span>
            </div>
            <span className="rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-[11px] font-bold uppercase text-emerald-400">
              Paid via Stripe
            </span>
          </div>

          <div className="space-y-3">
            {order.items.map((item) => (
              <div
                key={item.cartItemId}
                className="flex items-start justify-between gap-4 border-b border-white/5 pb-3 last:border-none"
              >
                <div>
                  <div className="text-sm font-bold text-white">
                    {item.quantity}x {item.product.name}
                  </div>
                  <div className="mt-1 flex flex-wrap gap-1.5 text-xs text-stone-400">
                    {item.spiceLevel && (
                      <span className="text-orange-300">
                        Spice: {item.spiceLevel}
                      </span>
                    )}
                    {item.upgrade && (
                      <span className="text-amber-300">
                        • Side: {item.upgrade.name}
                      </span>
                    )}
                    {item.extras.length > 0 && (
                      <span>
                        • Extras: {item.extras.map((e) => e.name).join(", ")}
                      </span>
                    )}
                  </div>
                </div>
                <div className="font-mono text-sm font-semibold text-stone-200">
                  {formatGBP(item.unitTotal * item.quantity)}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 space-y-1.5 border-t border-white/10 pt-4 text-sm">
            <div className="flex justify-between text-stone-400">
              <span>Subtotal</span>
              <span className="font-mono">{formatGBP(order.subtotal)}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-emerald-400">
                <span>Promo Discount ({order.promoCode})</span>
                <span className="font-mono">-{formatGBP(order.discount)}</span>
              </div>
            )}
            <div className="flex justify-between text-stone-400">
              <span>Delivery Fee</span>
              <span className="font-mono">
                {order.deliveryFee === 0
                  ? "FREE"
                  : formatGBP(order.deliveryFee)}
              </span>
            </div>
            <div className="flex justify-between pt-2 text-base font-black text-white">
              <span>Total Paid</span>
              <span className="font-mono text-amber-400">
                {formatGBP(order.total)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OrderConfirmationPage() {
  return (
    <main className="min-h-screen bg-[#120907] pt-28 pb-24 text-stone-100">
      <Suspense
        fallback={
          <div className="mx-auto max-w-2xl p-12 text-center text-amber-300">
            <Sparkles className="mx-auto mb-3 h-8 w-8 animate-spin" />
            Loading your Saffron &amp; Ember receipt...
          </div>
        }
      >
        <OrderConfirmationContent />
      </Suspense>
    </main>
  );
}
