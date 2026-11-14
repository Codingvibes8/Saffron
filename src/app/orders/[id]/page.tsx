"use client";

import React, { use, useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Bike,
  CheckCircle2,
  ChefHat,
  Clock,
  Flame,
  MapPin,
  Phone,
  RefreshCw,
  Sparkles,
  UtensilsCrossed,
} from "lucide-react";
import { INITIAL_ORDERS } from "@/lib/db";
import { Order, OrderStatus } from "@/lib/types";
import { formatGBP } from "@/lib/utils";
import { useCartStore } from "@/store/useCartStore";

const STAGES: {
  status: OrderStatus;
  label: string;
  subtitle: string;
  eta: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  {
    status: "Preparing",
    label: "Preparing",
    subtitle:
      "Chef is hand-grinding whole spices & preparing your marinade to order.",
    eta: "25 mins remaining",
    icon: ChefHat,
  },
  {
    status: "In the Tandoor",
    label: "In the Tandoor",
    subtitle:
      "Skewers & artisanal naans are roaring inside our 480°C charcoal clay oven.",
    eta: "15 mins remaining",
    icon: Flame,
  },
  {
    status: "Out for Delivery",
    label: "Out for Delivery",
    subtitle:
      "Packed in thermal-sealed boxes and dispatched with our London courier.",
    eta: "7 mins remaining",
    icon: Bike,
  },
  {
    status: "Delivered",
    label: "Delivered",
    subtitle:
      "Arrived piping hot at your door. Enjoy your Saffron & Ember feast!",
    eta: "Completed",
    icon: CheckCircle2,
  },
];

export default function OrderTrackingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const decodedId = decodeURIComponent(id).replace("#", "");
  const { orders, updateOrderStatus } = useCartStore();
  const [serverOrder, setServerOrder] = useState<Order | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const localOrder =
    orders.find(
      (o) =>
        o.id.toUpperCase() === decodedId.toUpperCase() ||
        o.orderNumber.replace("#", "").toUpperCase() === decodedId.toUpperCase()
    ) ||
    INITIAL_ORDERS.find(
      (o) =>
        o.id.toUpperCase() === decodedId.toUpperCase() ||
        o.orderNumber.replace("#", "").toUpperCase() === decodedId.toUpperCase()
    );

  useEffect(() => {
    let active = true;
    fetch(`/api/orders?id=${encodeURIComponent(decodedId)}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (active && data?.order) {
          setServerOrder(data.order);
        }
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [decodedId]);

  const order = localOrder || serverOrder || orders[0] || INITIAL_ORDERS[0];
  const currentStageIndex = Math.max(
    0,
    STAGES.findIndex((s) => s.status === order.status)
  );

  const handleStatusChange = async (nextStatus: OrderStatus) => {
    setIsUpdating(true);
    updateOrderStatus(order.id, nextStatus);
    if (serverOrder) {
      setServerOrder({ ...serverOrder, status: nextStatus });
    }
    try {
      await fetch("/api/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: order.id, status: nextStatus }),
      });
    } catch {
      // Handled via local Zustand state
    } finally {
      setIsUpdating(false);
    }
  };

  const handleAdvanceNextStage = () => {
    const nextIdx = (currentStageIndex + 1) % STAGES.length;
    handleStatusChange(STAGES[nextIdx].status);
  };

  return (
    <main className="min-h-screen bg-[#120907] pt-28 pb-24 text-stone-100">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Top Bar */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <Link
              href="/menu"
              className="mb-2 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-amber-400 hover:text-amber-300"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to Menu
            </Link>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
                Live Order Tracker
              </h1>
              <span className="rounded-xl border border-amber-400/30 bg-amber-400/15 px-3 py-1 font-mono text-sm font-bold text-amber-300">
                {order.orderNumber}
              </span>
            </div>
            <p className="mt-1 text-sm text-stone-400">
              Real-time telemetry from our Soho W1 &amp; NW2 Tandoor Kitchen
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleAdvanceNextStage}
              disabled={isUpdating}
              className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 px-4 py-2.5 text-xs font-black text-stone-950 shadow-lg transition hover:brightness-110"
            >
              <RefreshCw
                className={`h-3.5 w-3.5 ${isUpdating ? "animate-spin" : ""}`}
              />
              <span>Simulate Next Kitchen Stage</span>
            </button>
            <Link
              href="/kitchen"
              className="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-4 py-2.5 text-xs font-semibold text-stone-200 hover:bg-white/10"
            >
              <UtensilsCrossed className="h-3.5 w-3.5 text-amber-400" />
              <span>Kitchen Display (/kitchen)</span>
            </Link>
          </div>
        </div>

        {/* Quick Order Switcher Pills */}
        <div className="mb-6 flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium text-stone-400">
            Active Orders:
          </span>
          {orders.slice(0, 5).map((o) => (
            <Link
              key={o.id}
              href={`/orders/${o.id}`}
              className={`rounded-full border px-3 py-1 font-mono text-xs font-semibold transition ${
                o.id === order.id
                  ? "border-amber-400 bg-amber-400/20 text-amber-300"
                  : "border-white/10 bg-white/5 text-stone-400 hover:border-white/25 hover:text-white"
              }`}
            >
              {o.orderNumber} ({o.status})
            </Link>
          ))}
        </div>

        {/* Live 4-Stage Visual Tracker Card */}
        <section className="rounded-[2rem] border border-amber-400/20 bg-gradient-to-b from-amber-950/35 via-stone-900/90 to-stone-950 p-6 shadow-2xl backdrop-blur-2xl sm:p-10">
          <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-300">
                <span className="h-2 w-2 animate-ping rounded-full bg-emerald-400" />
                <span>LIVE STATUS: {order.status.toUpperCase()}</span>
              </div>
              <h2 className="mt-3 text-2xl font-black text-white sm:text-3xl">
                {STAGES[currentStageIndex].subtitle}
              </h2>
            </div>
            <div className="rounded-2xl border border-white/10 bg-stone-950/80 px-5 py-3 text-right">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-stone-400">
                Estimated Arrival
              </div>
              <div className="mt-0.5 flex items-center justify-end gap-1.5 font-mono text-lg font-black text-amber-400">
                <Clock className="h-4 w-4" />
                <span>{STAGES[currentStageIndex].eta}</span>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="relative mb-10">
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-stone-800">
              <div
                className="h-full rounded-full bg-gradient-to-r from-amber-400 via-orange-500 to-emerald-400 transition-all duration-700"
                style={{
                  width: `${((currentStageIndex + 1) / STAGES.length) * 100}%`,
                }}
              />
            </div>

            {/* 4 Stage Nodes */}
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-4">
              {STAGES.map((stage, index) => {
                const Icon = stage.icon;
                const isCompleted = index <= currentStageIndex;
                const isCurrent = index === currentStageIndex;

                return (
                  <button
                    key={stage.status}
                    type="button"
                    onClick={() => handleStatusChange(stage.status)}
                    className={`group flex flex-col rounded-2xl border p-4 text-left transition ${
                      isCurrent
                        ? "border-amber-400 bg-amber-500/15 shadow-[0_0_30px_-10px_rgba(245,158,11,0.6)]"
                        : isCompleted
                        ? "border-emerald-500/30 bg-emerald-500/10"
                        : "border-white/10 bg-stone-950/60 opacity-60 hover:opacity-100"
                    }`}
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                          isCurrent
                            ? "bg-amber-400 text-stone-950"
                            : isCompleted
                            ? "bg-emerald-500/20 text-emerald-400"
                            : "bg-white/5 text-stone-400"
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                      <span className="font-mono text-xs font-bold text-stone-400">
                        0{index + 1}
                      </span>
                    </div>
                    <div className="text-sm font-bold text-white">
                      {stage.label}
                    </div>
                    <div className="mt-1 text-xs text-stone-400 line-clamp-2">
                      {stage.subtitle}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-stone-950/70 px-4 py-3 text-xs text-stone-400">
            <span className="flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-amber-400" />
              Tip: Click any of the 4 stage cards above to preview that stage
              live.
            </span>
            <span className="font-mono text-stone-300">
              Customer: {order.customerName} • {order.customerPhone}
            </span>
          </div>
        </section>

        {/* Bottom Details Grid */}
        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Ordered Items */}
          <div className="rounded-3xl border border-white/10 bg-stone-900/60 p-6 backdrop-blur-xl lg:col-span-7">
            <h3 className="mb-4 text-lg font-bold text-white">
              Order Items &amp; Spice Modifiers
            </h3>
            <div className="space-y-3">
              {order.items.map((item) => (
                <div
                  key={item.cartItemId}
                  className="flex items-start justify-between gap-4 rounded-2xl border border-white/10 bg-stone-950/70 p-4"
                >
                  <div>
                    <div className="text-sm font-bold text-white">
                      <span className="mr-2 rounded-md bg-amber-400/20 px-2 py-0.5 font-mono text-amber-300">
                        {item.quantity}x
                      </span>
                      {item.product.name}
                    </div>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {item.spiceLevel && (
                        <span className="rounded-md bg-orange-500/15 px-2 py-0.5 text-[11px] font-semibold text-orange-300">
                          Spice: {item.spiceLevel}
                        </span>
                      )}
                      {item.upgrade && (
                        <span className="rounded-md bg-amber-500/15 px-2 py-0.5 text-[11px] font-semibold text-amber-300">
                          Side: {item.upgrade.name}
                        </span>
                      )}
                      {item.extras.map((extra) => (
                        <span
                          key={extra.id}
                          className="rounded-md bg-white/10 px-2 py-0.5 text-[11px] text-stone-300"
                        >
                          + {extra.name}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="font-mono text-sm font-bold text-amber-400">
                    {formatGBP(item.unitTotal * item.quantity)}
                  </div>
                </div>
              ))}
            </div>

            {order.notes && (
              <div className="mt-4 rounded-2xl border border-amber-400/20 bg-amber-500/10 p-3.5 text-xs text-amber-200">
                <strong className="font-bold">Kitchen / Rider Note:</strong>{" "}
                {order.notes}
              </div>
            )}
          </div>

          {/* Delivery & Payment Info */}
          <div className="space-y-6 lg:col-span-5">
            <div className="rounded-3xl border border-white/10 bg-stone-900/60 p-6 backdrop-blur-xl">
              <h3 className="mb-4 text-lg font-bold text-white">
                Dispatch &amp; Totals
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
                  <div>
                    <div className="text-xs uppercase text-stone-400">
                      {order.fulfilment === "collection"
                        ? "Collection Branch"
                        : "Delivery Destination"}
                    </div>
                    <div className="font-semibold text-white">
                      {order.deliveryAddress ||
                        "9-10 Soho Street, London W1D 3DL"}
                    </div>
                    <div className="font-mono text-xs text-stone-400">
                      {order.postcode || "W1D 3DL"}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                  <div>
                    <div className="text-xs uppercase text-stone-400">
                      Restaurant Concierge
                    </div>
                    <a
                      href="tel:02084521234"
                      className="font-mono font-semibold text-amber-300 hover:underline"
                    >
                      020 8452 1234
                    </a>
                  </div>
                </div>
              </div>

              <div className="mt-5 space-y-2 border-t border-white/10 pt-4 text-sm">
                <div className="flex justify-between text-stone-400">
                  <span>Subtotal</span>
                  <span className="font-mono">{formatGBP(order.subtotal)}</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Discount</span>
                    <span className="font-mono">
                      -{formatGBP(order.discount)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-stone-400">
                  <span>Delivery</span>
                  <span className="font-mono">
                    {order.deliveryFee === 0
                      ? "FREE"
                      : formatGBP(order.deliveryFee)}
                  </span>
                </div>
                <div className="flex justify-between border-t border-white/10 pt-2.5 text-base font-black text-white">
                  <span>Total Paid</span>
                  <span className="font-mono text-amber-400">
                    {formatGBP(order.total)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
