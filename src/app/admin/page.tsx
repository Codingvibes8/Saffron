"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  BarChart3,
  Calendar,
  CheckCircle2,
  Database,
  ExternalLink,
  Flame,
  LayoutDashboard,
  Package,
  Search,
  ShoppingBag,
  Users,
  UtensilsCrossed,
} from "lucide-react";
import { OrderStatus } from "@/lib/types";
import { formatGBP } from "@/lib/utils";
import { useCartStore } from "@/store/useCartStore";

const ORDER_STATUSES: OrderStatus[] = [
  "Preparing",
  "In the Tandoor",
  "Out for Delivery",
  "Delivered",
];

export default function AdminDashboardPage() {
  const {
    orders,
    reservations,
    products,
    updateOrderStatus,
    updateReservationStatus,
    toggleProductAvailability,
  } = useCartStore();

  const [activeTab, setActiveTab] = useState<
    "orders" | "reservations" | "menu"
  >("orders");
  const [menuQuery, setMenuQuery] = useState("");

  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const activeOrdersCount = orders.filter(
    (o) => o.status !== "Delivered"
  ).length;
  const confirmedReservations = reservations.filter(
    (r) => r.status !== "cancelled"
  ).length;
  const availableProductsCount = products.filter(
    (p) => p.available !== false
  ).length;

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(menuQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(menuQuery.toLowerCase())
  );

  const handleStatusChange = async (orderId: string, status: OrderStatus) => {
    updateOrderStatus(orderId, status);
    try {
      await fetch("/api/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: orderId, status }),
      });
    } catch {
      // Synced with Zustand
    }
  };

  return (
    <main className="min-h-screen bg-[#120907] pt-28 pb-24 text-stone-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Top Executive Header */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-orange-600 text-stone-950 shadow-lg">
              <LayoutDashboard className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tight text-white">
                Saffron &amp; Ember — Admin Command
              </h1>
              <p className="text-sm text-stone-400">
                Soho W1D 3DL &amp; Cricklewood NW2 1AB • Neon Serverless
                Postgres + Stripe Telemetry
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/kitchen"
              className="inline-flex items-center gap-2 rounded-2xl border border-amber-400/30 bg-amber-500/15 px-4 py-2.5 text-xs font-bold text-amber-300 hover:bg-amber-500/25"
            >
              <UtensilsCrossed className="h-4 w-4" />
              <span>Open Live Kitchen KDS (/kitchen)</span>
            </Link>
            <span className="inline-flex items-center gap-2 rounded-2xl border border-emerald-500/25 bg-emerald-500/10 px-4 py-2.5 text-xs font-semibold text-emerald-300">
              <Database className="h-4 w-4" />
              <span>DB Schema Synced</span>
            </span>
          </div>
        </div>

        {/* 4 Executive KPI Cards */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-3xl border border-white/10 bg-stone-900/70 p-6 backdrop-blur-xl">
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-amber-400">
              <span>Gross Order Revenue</span>
              <BarChart3 className="h-4 w-4" />
            </div>
            <div className="mt-2 font-mono text-3xl font-black text-white">
              {formatGBP(totalRevenue)}
            </div>
            <div className="mt-1 text-xs text-emerald-400">
              +18.4% vs last London service
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-stone-900/70 p-6 backdrop-blur-xl">
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-orange-400">
              <span>Active Kitchen Orders</span>
              <Flame className="h-4 w-4" />
            </div>
            <div className="mt-2 font-mono text-3xl font-black text-white">
              {activeOrdersCount}{" "}
              <span className="text-base font-normal text-stone-400">
                / {orders.length} total
              </span>
            </div>
            <div className="mt-1 text-xs text-stone-400">
              Avg. Tandoor Dispatch: 22 mins
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-stone-900/70 p-6 backdrop-blur-xl">
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-emerald-400">
              <span>Table Bookings</span>
              <Users className="h-4 w-4" />
            </div>
            <div className="mt-2 font-mono text-3xl font-black text-white">
              {confirmedReservations}
            </div>
            <div className="mt-1 text-xs text-stone-400">
              Soho Velvet Booths &amp; Chef Counter
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-stone-900/70 p-6 backdrop-blur-xl">
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-sky-400">
              <span>Menu Catalog Live</span>
              <Package className="h-4 w-4" />
            </div>
            <div className="mt-2 font-mono text-3xl font-black text-white">
              {availableProductsCount}{" "}
              <span className="text-base font-normal text-stone-400">
                / {products.length} dishes
              </span>
            </div>
            <div className="mt-1 text-xs text-stone-400">
              7 categories • Modifiers active
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-6 flex flex-wrap gap-2 border-b border-white/10 pb-4">
          <button
            type="button"
            onClick={() => setActiveTab("orders")}
            className={`inline-flex items-center gap-2 rounded-2xl px-5 py-3 text-sm font-bold transition ${
              activeTab === "orders"
                ? "bg-gradient-to-r from-amber-400 to-orange-500 text-stone-950 shadow-lg"
                : "border border-white/10 bg-white/5 text-stone-300 hover:bg-white/10"
            }`}
          >
            <ShoppingBag className="h-4 w-4" />
            <span>Orders &amp; Fulfilment ({orders.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("reservations")}
            className={`inline-flex items-center gap-2 rounded-2xl px-5 py-3 text-sm font-bold transition ${
              activeTab === "reservations"
                ? "bg-gradient-to-r from-amber-400 to-orange-500 text-stone-950 shadow-lg"
                : "border border-white/10 bg-white/5 text-stone-300 hover:bg-white/10"
            }`}
          >
            <Calendar className="h-4 w-4" />
            <span>Table Reservations ({reservations.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("menu")}
            className={`inline-flex items-center gap-2 rounded-2xl px-5 py-3 text-sm font-bold transition ${
              activeTab === "menu"
                ? "bg-gradient-to-r from-amber-400 to-orange-500 text-stone-950 shadow-lg"
                : "border border-white/10 bg-white/5 text-stone-300 hover:bg-white/10"
            }`}
          >
            <Package className="h-4 w-4" />
            <span>Menu &amp; Stock Control ({products.length})</span>
          </button>
        </div>

        {/* TAB 1: ORDERS */}
        {activeTab === "orders" && (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="flex flex-col justify-between gap-4 rounded-3xl border border-white/10 bg-stone-900/70 p-6 backdrop-blur-xl lg:flex-row lg:items-center"
              >
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="font-mono text-lg font-black text-amber-400">
                      {order.orderNumber}
                    </span>
                    <span className="rounded-full border border-white/15 bg-white/5 px-3 py-0.5 text-xs font-bold uppercase text-stone-200">
                      {order.fulfilment}
                    </span>
                    <span className="text-sm font-bold text-white">
                      {order.customerName}
                    </span>
                    <span className="font-mono text-xs text-stone-400">
                      {order.customerPhone}
                    </span>
                  </div>

                  <div className="text-xs text-stone-400">
                    {order.deliveryAddress
                      ? `${order.deliveryAddress} (${order.postcode || ""})`
                      : "Collection at Soho Street / NW2"}
                  </div>

                  <div className="flex flex-wrap gap-2 pt-1">
                    {order.items.map((item) => (
                      <span
                        key={item.cartItemId}
                        className="rounded-xl border border-white/10 bg-stone-950 px-3 py-1.5 text-xs text-stone-200"
                      >
                        <strong className="text-amber-400">
                          {item.quantity}x
                        </strong>{" "}
                        {item.product.name}
                        {item.spiceLevel ? ` (${item.spiceLevel})` : ""}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <div className="mr-2 text-right">
                    <div className="text-xs text-stone-400">Total Paid</div>
                    <div className="font-mono text-lg font-black text-amber-400">
                      {formatGBP(order.total)}
                    </div>
                  </div>

                  <select
                    aria-label={`Order status for ${order.orderNumber}`}
                    value={order.status}
                    onChange={(e) =>
                      handleStatusChange(
                        order.id,
                        e.target.value as OrderStatus
                      )
                    }
                    className="rounded-xl border border-amber-400/40 bg-stone-950 px-3.5 py-2.5 text-xs font-bold text-amber-300 focus:border-amber-400 focus:outline-none"
                  >
                    {ORDER_STATUSES.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>

                  <Link
                    href={`/orders/${order.id}`}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/5 px-3.5 py-2.5 text-xs font-semibold text-white hover:bg-white/10"
                  >
                    <span>Live Tracker</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 2: RESERVATIONS */}
        {activeTab === "reservations" && (
          <div className="space-y-4">
            {reservations.map((res) => (
              <div
                key={res.id}
                className="flex flex-col justify-between gap-4 rounded-3xl border border-white/10 bg-stone-900/70 p-6 backdrop-blur-xl lg:flex-row lg:items-center"
              >
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="font-mono text-sm font-black text-amber-400">
                      {res.reference}
                    </span>
                    <span className="text-base font-bold text-white">
                      {res.guestName}
                    </span>
                    <span className="rounded-full bg-amber-500/15 px-3 py-0.5 text-xs font-bold text-amber-300">
                      {res.partySize} Guests
                    </span>
                    <span className="rounded-full border border-white/15 bg-stone-950 px-3 py-0.5 text-xs text-stone-300">
                      {res.seatingArea}
                    </span>
                  </div>
                  <div className="text-xs text-stone-400">
                    Date: <strong className="text-stone-200">{res.date}</strong>{" "}
                    at{" "}
                    <strong className="text-amber-300">{res.timeSlot}</strong> •{" "}
                    {res.guestPhone} • {res.guestEmail}
                  </div>
                  {(res.dietaryNotes || res.specialRequests) && (
                    <div className="text-xs text-amber-200/90">
                      {res.dietaryNotes && (
                        <span>Dietary: {res.dietaryNotes} </span>
                      )}
                      {res.specialRequests && (
                        <span>• Note: {res.specialRequests}</span>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {(["confirmed", "seated", "cancelled"] as const).map(
                    (statusOption) => (
                      <button
                        key={statusOption}
                        type="button"
                        onClick={() =>
                          updateReservationStatus(res.id, statusOption)
                        }
                        className={`rounded-xl px-3.5 py-2 text-xs font-bold uppercase transition ${
                          res.status === statusOption
                            ? statusOption === "cancelled"
                              ? "bg-red-500 text-white"
                              : "bg-amber-400 text-stone-950"
                            : "border border-white/10 bg-stone-950 text-stone-400 hover:text-white"
                        }`}
                      >
                        {statusOption}
                      </button>
                    )
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 3: MENU & STOCK */}
        {activeTab === "menu" && (
          <div>
            <div className="mb-5 flex items-center gap-3">
              <div className="relative max-w-md flex-1">
                <Search className="pointer-events-none absolute top-3.5 left-3.5 h-4 w-4 text-stone-400" />
                <input
                  type="text"
                  value={menuQuery}
                  onChange={(e) => setMenuQuery(e.target.value)}
                  placeholder="Search dishes or categories..."
                  className="w-full rounded-2xl border border-white/15 bg-stone-900 py-3 pr-4 pl-10 text-sm text-white placeholder:text-stone-500 focus:border-amber-400 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {filteredProducts.map((product) => {
                const isAvailable = product.available !== false;
                return (
                  <div
                    key={product.id}
                    className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-stone-900/70 p-4"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl">
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-white">
                          {product.name}
                        </div>
                        <div className="text-xs text-stone-400">
                          {product.category} •{" "}
                          <span className="font-mono font-bold text-amber-400">
                            {formatGBP(product.price)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => toggleProductAvailability(product.id)}
                      className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition ${
                        isAvailable
                          ? "border border-emerald-500/30 bg-emerald-500/15 text-emerald-300"
                          : "border border-red-500/30 bg-red-500/15 text-red-300"
                      }`}
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span>{isAvailable ? "In Stock" : "Sold Out"}</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
