"use client";

import React from "react";
import Link from "next/link";
import {
  ArrowRight,
  Bike,
  CheckCircle2,
  ChefHat,
  Clock,
  ExternalLink,
  Flame,
  PlusCircle,
  Store,
  UtensilsCrossed,
} from "lucide-react";
import { INITIAL_PRODUCTS } from "@/lib/menu-data";
import { Order, OrderStatus } from "@/lib/types";
import { useCartStore } from "@/store/useCartStore";

const COLUMNS: {
  status: OrderStatus;
  title: string;
  badgeColor: string;
  nextStatus?: OrderStatus;
  nextLabel?: string;
}[] = [
  {
    status: "Preparing",
    title: "1. Prep & Spice Station",
    badgeColor: "border-amber-400/40 bg-amber-400/15 text-amber-300",
    nextStatus: "In the Tandoor",
    nextLabel: "Fire in Tandoor",
  },
  {
    status: "In the Tandoor",
    title: "2. In the Tandoor (480°C)",
    badgeColor: "border-orange-500/40 bg-orange-500/15 text-orange-300",
    nextStatus: "Out for Delivery",
    nextLabel: "Pack & Dispatch",
  },
  {
    status: "Out for Delivery",
    title: "3. Out for Delivery / Counter",
    badgeColor: "border-sky-400/40 bg-sky-400/15 text-sky-300",
    nextStatus: "Delivered",
    nextLabel: "Complete Order",
  },
  {
    status: "Delivered",
    title: "4. Completed & Delivered",
    badgeColor: "border-emerald-400/40 bg-emerald-400/15 text-emerald-300",
  },
];

export default function KitchenDisplayPage() {
  const { orders, updateOrderStatus, addOrder } = useCartStore();

  const handleAdvance = async (orderId: string, nextStatus: OrderStatus) => {
    updateOrderStatus(orderId, nextStatus);
    try {
      await fetch("/api/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: orderId, status: nextStatus }),
      });
    } catch {
      // Synced locally
    }
  };

  const handleCreateTestTicket = async () => {
    const num = Math.floor(8600 + Math.random() * 1200);
    const id = `SE-${num}`;
    const sampleOrder: Order = {
      id,
      orderNumber: `#${id}`,
      customerName: "Devika Patel (Soho VIP)",
      customerEmail: "devika@soholondon.co.uk",
      customerPhone: "07700 900555",
      fulfilment: Math.random() > 0.4 ? "delivery" : "collection",
      deliveryAddress: "14 Wardour Street, Soho, London",
      postcode: "W1F 8ZT",
      items: [
        {
          cartItemId: `kds-${Date.now()}-1`,
          product: INITIAL_PRODUCTS[0],
          quantity: 1,
          spiceLevel: "Madras Hot",
          upgrade: {
            id: "garlic-coriander-naan",
            name: "Garlic & Coriander Naan",
            price: 3.95,
          },
          extras: [
            {
              id: "mango-lassi",
              name: "Alphonso Mango & Cardamom Lassi",
              price: 4.95,
            },
          ],
          unitTotal: 25.85,
        },
        {
          cartItemId: `kds-${Date.now()}-2`,
          product: INITIAL_PRODUCTS[2],
          quantity: 1,
          spiceLevel: "Medium",
          extras: [],
          unitTotal: 19.95,
        },
      ],
      subtotal: 45.8,
      discount: 0,
      deliveryFee: 0,
      total: 45.8,
      status: "Preparing",
      createdAt: new Date().toISOString(),
      estimatedMinutes: 25,
      notes: "Jain-friendly raita on the side, extra charred edges on naan.",
      paymentStatus: "paid",
    };

    addOrder(sampleOrder);
    try {
      await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sampleOrder),
      });
    } catch {
      // Stored in Zustand
    }
  };

  return (
    <main className="min-h-screen bg-[#100806] pt-28 pb-20 text-stone-100">
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
        {/* Top KDS Header */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-white/10 bg-stone-900/80 p-6 backdrop-blur-2xl">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-orange-600 text-stone-950 shadow-lg">
              <UtensilsCrossed className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-2xl font-black tracking-tight text-white sm:text-3xl">
                  Tandoor Kitchen Display System (KDS)
                </h1>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/15 px-3 py-0.5 text-xs font-bold text-emerald-300">
                  <span className="h-2 w-2 animate-ping rounded-full bg-emerald-400" />
                  LIVE TELEMETRY
                </span>
              </div>
              <p className="text-xs text-stone-400 sm:text-sm">
                Saffron &amp; Ember • Soho W1D 3DL &amp; Cricklewood NW2 1AB •{" "}
                {orders.length} Total Tickets
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleCreateTestTicket}
              className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 px-5 py-3 text-xs font-black text-stone-950 shadow-lg transition hover:brightness-110"
            >
              <PlusCircle className="h-4 w-4" />
              <span>+ Simulate Incoming Soho Order</span>
            </button>
            <Link
              href="/admin"
              className="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-5 py-3 text-xs font-bold text-stone-200 hover:bg-white/10"
            >
              <span>Admin Portal (/admin)</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

        {/* 4-Column Kanban Board */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
          {COLUMNS.map((col) => {
            const colOrders = orders.filter((o) => o.status === col.status);

            return (
              <div
                key={col.status}
                className="flex flex-col rounded-3xl border border-white/10 bg-stone-950/80 p-4"
              >
                {/* Column Header */}
                <div className="mb-4 flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2">
                    <span
                      className={`rounded-xl border px-3 py-1 text-xs font-black ${col.badgeColor}`}
                    >
                      {col.title}
                    </span>
                  </div>
                  <span className="rounded-lg bg-white/10 px-2.5 py-1 font-mono text-xs font-bold text-white">
                    {colOrders.length}
                  </span>
                </div>

                {/* Tickets */}
                <div className="space-y-4">
                  {colOrders.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-white/10 p-8 text-center text-xs text-stone-500">
                      No active tickets in {col.status}
                    </div>
                  ) : (
                    colOrders.map((order) => (
                      <div
                        key={order.id}
                        className="rounded-2xl border border-white/15 bg-stone-900/95 p-4 shadow-xl transition hover:border-amber-400/40"
                      >
                        {/* Ticket Header */}
                        <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-base font-black text-amber-400">
                              {order.orderNumber}
                            </span>
                            <span
                              className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-bold uppercase ${
                                order.fulfilment === "delivery"
                                  ? "bg-amber-500/20 text-amber-300"
                                  : "bg-teal-500/20 text-teal-300"
                              }`}
                            >
                              {order.fulfilment === "delivery" ? (
                                <Bike className="h-3 w-3" />
                              ) : (
                                <Store className="h-3 w-3" />
                              )}
                              {order.fulfilment}
                            </span>
                          </div>
                          <Link
                            href={`/orders/${order.id}`}
                            className="inline-flex items-center gap-1 text-[11px] text-stone-400 hover:text-amber-300"
                          >
                            <span>Track</span>
                            <ExternalLink className="h-3 w-3" />
                          </Link>
                        </div>

                        {/* Customer & Time */}
                        <div className="mt-2 flex items-center justify-between text-xs text-stone-400">
                          <span className="font-semibold text-stone-200">
                            {order.customerName}
                          </span>
                          <span className="flex items-center gap-1 font-mono text-[11px] text-amber-300">
                            <Clock className="h-3 w-3" />
                            {order.estimatedMinutes}m target
                          </span>
                        </div>

                        {/* Dishes & Modifiers */}
                        <div className="mt-3 space-y-2 border-t border-white/10 pt-3">
                          {order.items.map((item) => (
                            <div
                              key={item.cartItemId}
                              className="rounded-xl bg-stone-950/90 p-2.5"
                            >
                              <div className="text-xs font-bold text-white">
                                <span className="mr-1.5 font-mono text-amber-400">
                                  {item.quantity}x
                                </span>
                                {item.product.name}
                              </div>
                              <div className="mt-1 flex flex-wrap gap-1">
                                {item.spiceLevel && (
                                  <span
                                    className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${
                                      item.spiceLevel === "Vindaloo" ||
                                      item.spiceLevel === "Madras Hot"
                                        ? "bg-red-500/25 text-red-300"
                                        : "bg-orange-500/20 text-orange-300"
                                    }`}
                                  >
                                    🔥 {item.spiceLevel}
                                  </span>
                                )}
                                {item.upgrade && (
                                  <span className="rounded bg-amber-500/20 px-1.5 py-0.5 text-[10px] font-semibold text-amber-300">
                                    + {item.upgrade.name}
                                  </span>
                                )}
                                {item.extras.map((ex) => (
                                  <span
                                    key={ex.id}
                                    className="rounded bg-white/10 px-1.5 py-0.5 text-[10px] text-stone-300"
                                  >
                                    + {ex.name}
                                  </span>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>

                        {order.notes && (
                          <div className="mt-2.5 rounded-lg border border-amber-400/30 bg-amber-500/10 p-2 text-[11px] text-amber-200">
                            <strong>Note:</strong> {order.notes}
                          </div>
                        )}

                        {/* Action Button */}
                        {col.nextStatus ? (
                          <button
                            type="button"
                            onClick={() =>
                              handleAdvance(order.id, col.nextStatus!)
                            }
                            className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 px-3 py-2.5 text-xs font-black text-stone-950 shadow transition hover:brightness-110"
                          >
                            <Flame className="h-3.5 w-3.5" />
                            <span>{col.nextLabel}</span>
                            <ArrowRight className="h-3.5 w-3.5" />
                          </button>
                        ) : (
                          <div className="mt-3 flex items-center justify-center gap-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 py-2 text-xs font-bold text-emerald-300">
                            <CheckCircle2 className="h-4 w-4" />
                            <span>Fulfilled &amp; Closed</span>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
