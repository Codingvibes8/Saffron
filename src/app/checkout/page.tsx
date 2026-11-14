"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Bike,
  CheckCircle2,
  CreditCard,
  Flame,
  Lock,
  MapPin,
  Minus,
  Plus,
  ShieldCheck,
  Sparkles,
  Store,
  Tag,
  Trash2,
} from "lucide-react";
import { INITIAL_PRODUCTS } from "@/lib/menu-data";
import { formatGBP } from "@/lib/utils";
import { useCartStore } from "@/store/useCartStore";

export default function CheckoutPage() {
  const router = useRouter();
  const {
    items,
    fulfilment,
    setFulfilment,
    promoCode,
    discountPercent,
    applyPromoCode,
    removePromoCode,
    updateQuantity,
    removeItem,
    addItem,
    clearCart,
    getSubtotal,
    getDiscountAmount,
    getDeliveryFee,
    getTotal,
    addOrder,
  } = useCartStore();

  const [customerName, setCustomerName] = useState("Aarav Mehta");
  const [customerEmail, setCustomerEmail] = useState("aarav.mehta@london.co.uk");
  const [customerPhone, setCustomerPhone] = useState("07700 900412");
  const [deliveryAddress, setDeliveryAddress] = useState(
    "42 Dean Street, Soho, London"
  );
  const [postcode, setPostcode] = useState("W1D 4PZ");
  const [collectionBranch, setCollectionBranch] = useState<"soho" | "nw2">(
    "soho"
  );
  const [notes, setNotes] = useState("");
  const [promoInput, setPromoInput] = useState("");
  const [promoFeedback, setPromoFeedback] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<"card" | "stripe">("card");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const subtotal = getSubtotal();
  const discount = getDiscountAmount();
  const deliveryFee = getDeliveryFee();
  const total = getTotal();

  const handlePromoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    const res = applyPromoCode(promoInput);
    setPromoFeedback({
      type: res.success ? "success" : "error",
      text: res.message,
    });
    if (res.success) setPromoInput("");
  };

  const handlePopulateDemoCart = () => {
    addItem({
      product: INITIAL_PRODUCTS[0],
      quantity: 1,
      spiceLevel: "Medium",
      upgrade: {
        id: "garlic-coriander-naan",
        name: "Garlic & Coriander Naan",
        price: 3.95,
      },
      extras: [
        {
          id: "poppadoms-chutney",
          name: "Poppadoms & Artisanal Chutney Tray",
          price: 4.5,
        },
      ],
    });
    addItem({
      product: INITIAL_PRODUCTS[1],
      quantity: 1,
      spiceLevel: "Madras Hot",
      upgrade: {
        id: "pilau-rice",
        name: "Aged Saffron Pilau Rice",
        price: 3.75,
      },
      extras: [],
    });
    useCartStore.getState().setCartOpen(false);
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;
    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName,
          customerEmail,
          customerPhone,
          fulfilment,
          deliveryAddress:
            fulfilment === "delivery"
              ? deliveryAddress
              : collectionBranch === "soho"
              ? "Collection: 9-10 Soho Street, London W1D 3DL"
              : "Collection: 123 Cricklewood St, London NW2 1AB",
          postcode:
            fulfilment === "delivery"
              ? postcode
              : collectionBranch === "soho"
              ? "W1D 3DL"
              : "NW2 1AB",
          items,
          subtotal,
          discount,
          promoCode,
          deliveryFee,
          total,
          notes,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Checkout failed");
      }

      if (data.order) {
        addOrder(data.order);
      }
      clearCart();

      if (data.checkoutUrl) {
        router.push(data.checkoutUrl);
      } else {
        router.push(`/order-confirmation?orderId=${data.order.id}`);
      }
    } catch (err) {
      setErrorMsg(
        err instanceof Error ? err.message : "Unable to complete checkout"
      );
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#120907] pt-28 pb-24 text-stone-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Top Back Link & Header */}
        <div className="mb-8 flex flex-col justify-between gap-4 border-b border-white/10 pb-6 sm:flex-row sm:items-end">
          <div>
            <Link
              href="/menu"
              className="mb-3 inline-flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-amber-400 hover:text-amber-300"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to Menu
            </Link>
            <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
              Checkout &amp; Fulfilment
            </h1>
            <p className="mt-1 text-sm text-stone-400">
              Piping-hot charcoal tandoor craft prepared fresh to order in London
              W1 &amp; NW2.
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-xs font-medium text-emerald-300">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            <span>256-Bit Encrypted Stripe Checkout</span>
          </div>
        </div>

        {items.length === 0 ? (
          <div className="mx-auto max-w-xl rounded-3xl border border-white/10 bg-stone-900/60 p-10 text-center backdrop-blur-xl">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-400">
              <Flame className="h-8 w-8" />
            </div>
            <h2 className="text-2xl font-bold text-white">
              Your Feast Basket is Empty
            </h2>
            <p className="mt-2 text-sm text-stone-400">
              Explore our slow-simmered curries, charcoal tandoori platters, and
              artisanal biryanis, or load a sample feast to test checkout
              immediately.
            </p>
            <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                href="/menu"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 px-6 py-3.5 text-sm font-bold text-stone-950 shadow-lg hover:brightness-110"
              >
                Browse Full Menu
                <ArrowRight className="h-4 w-4" />
              </Link>
              <button
                type="button"
                onClick={handlePopulateDemoCart}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-amber-400/30 bg-amber-500/10 px-6 py-3.5 text-sm font-semibold text-amber-300 hover:bg-amber-500/20"
              >
                <Sparkles className="h-4 w-4" />
                Load Sample Royal Feast
              </button>
            </div>
          </div>
        ) : (
          <form
            onSubmit={handlePlaceOrder}
            className="grid grid-cols-1 gap-8 lg:grid-cols-12"
          >
            {/* Left Column: Fulfilment, Customer Info & Payment */}
            <div className="space-y-6 lg:col-span-7">
              {/* Step 1: Fulfilment Mode */}
              <section className="rounded-3xl border border-white/10 bg-stone-900/60 p-6 backdrop-blur-xl sm:p-8">
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
                    1. Select Fulfilment
                  </span>
                  <span className="text-xs text-stone-400">
                    {fulfilment === "delivery"
                      ? "Est. 25–35 mins across London"
                      : "Ready in 15–20 mins"}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setFulfilment("delivery")}
                    className={`flex items-center gap-3 rounded-2xl border p-4 text-left transition ${
                      fulfilment === "delivery"
                        ? "border-amber-400 bg-amber-500/15 text-white shadow-[0_0_25px_-8px_rgba(245,158,11,0.5)]"
                        : "border-white/10 bg-white/5 text-stone-400 hover:border-white/20"
                    }`}
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-400/20 text-amber-400">
                      <Bike className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="font-bold">Hot Delivery</div>
                      <div className="text-xs text-stone-400">
                        Free over £45 • 25 min avg
                      </div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFulfilment("collection")}
                    className={`flex items-center gap-3 rounded-2xl border p-4 text-left transition ${
                      fulfilment === "collection"
                        ? "border-amber-400 bg-amber-500/15 text-white shadow-[0_0_25px_-8px_rgba(245,158,11,0.5)]"
                        : "border-white/10 bg-white/5 text-stone-400 hover:border-white/20"
                    }`}
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-500/20 text-orange-400">
                      <Store className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="font-bold">Click &amp; Collect</div>
                      <div className="text-xs text-stone-400">
                        No fee • Priority counter
                      </div>
                    </div>
                  </button>
                </div>

                {fulfilment === "delivery" ? (
                  <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div className="sm:col-span-2">
                      <label className="mb-1.5 block text-xs font-medium text-stone-300">
                        London Street Address
                      </label>
                      <div className="relative">
                        <MapPin className="pointer-events-none absolute top-3.5 left-3.5 h-4 w-4 text-amber-400" />
                        <input
                          type="text"
                          required
                          value={deliveryAddress}
                          onChange={(e) => setDeliveryAddress(e.target.value)}
                          placeholder="Flat / House No. & Street"
                          className="w-full rounded-xl border border-white/15 bg-stone-950/80 py-3 pr-4 pl-10 text-sm text-white placeholder:text-stone-500 focus:border-amber-400 focus:outline-none"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-stone-300">
                        Postcode
                      </label>
                      <input
                        type="text"
                        required
                        value={postcode}
                        onChange={(e) =>
                          setPostcode(e.target.value.toUpperCase())
                        }
                        placeholder="W1D 3DL / NW2 1AB"
                        className="w-full rounded-xl border border-white/15 bg-stone-950/80 px-4 py-3 text-sm font-mono uppercase text-white placeholder:text-stone-500 focus:border-amber-400 focus:outline-none"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <button
                      type="button"
                      onClick={() => setCollectionBranch("soho")}
                      className={`rounded-2xl border p-4 text-left transition ${
                        collectionBranch === "soho"
                          ? "border-amber-400/60 bg-amber-500/10"
                          : "border-white/10 bg-stone-950/50"
                      }`}
                    >
                      <div className="text-xs font-bold uppercase text-amber-400">
                        Soho W1 Flagship
                      </div>
                      <div className="mt-1 text-sm font-semibold text-white">
                        9-10 Soho Street, London W1D 3DL
                      </div>
                      <div className="mt-0.5 text-xs text-stone-400">
                        2 mins from Tottenham Court Rd Station
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setCollectionBranch("nw2")}
                      className={`rounded-2xl border p-4 text-left transition ${
                        collectionBranch === "nw2"
                          ? "border-amber-400/60 bg-amber-500/10"
                          : "border-white/10 bg-stone-950/50"
                      }`}
                    >
                      <div className="text-xs font-bold uppercase text-orange-400">
                        North West Kitchen
                      </div>
                      <div className="mt-1 text-sm font-semibold text-white">
                        123 Cricklewood St, London NW2 1AB
                      </div>
                      <div className="mt-0.5 text-xs text-stone-400">
                        Express Tandoor Dispatch Counter
                      </div>
                    </button>
                  </div>
                )}
              </section>

              {/* Step 2: Diner Contact Details */}
              <section className="rounded-3xl border border-white/10 bg-stone-900/60 p-6 backdrop-blur-xl sm:p-8">
                <span className="mb-4 block text-xs font-bold uppercase tracking-widest text-amber-400">
                  2. Diner Details &amp; Kitchen Notes
                </span>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-stone-300">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full rounded-xl border border-white/15 bg-stone-950/80 px-4 py-3 text-sm text-white focus:border-amber-400 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-stone-300">
                      UK Mobile Number (for live SMS tracker)
                    </label>
                    <input
                      type="tel"
                      required
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full rounded-xl border border-white/15 bg-stone-950/80 px-4 py-3 text-sm text-white focus:border-amber-400 focus:outline-none"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="mb-1.5 block text-xs font-medium text-stone-300">
                      Email Address (for receipt &amp; loyalty stamps)
                    </label>
                    <input
                      type="email"
                      required
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      className="w-full rounded-xl border border-white/15 bg-stone-950/80 px-4 py-3 text-sm text-white focus:border-amber-400 focus:outline-none"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="mb-1.5 block text-xs font-medium text-stone-300">
                      Allergen, Dietary (Jain / Vegan / Nut-Free) or Delivery
                      Notes
                    </label>
                    <textarea
                      rows={2}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="e.g., Jain preparation (no onion/garlic), extra mint chutney, ring bell #3..."
                      className="w-full rounded-xl border border-white/15 bg-stone-950/80 px-4 py-2.5 text-sm text-white placeholder:text-stone-500 focus:border-amber-400 focus:outline-none"
                    />
                  </div>
                </div>
              </section>

              {/* Step 3: Stripe Payment */}
              <section className="rounded-3xl border border-white/10 bg-stone-900/60 p-6 backdrop-blur-xl sm:p-8">
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
                    3. Payment Method (Stripe)
                  </span>
                  <div className="flex items-center gap-1.5 text-xs text-stone-400">
                    <Lock className="h-3.5 w-3.5 text-amber-400" />
                    <span>PCI-DSS Level 1</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("card")}
                    className={`flex items-center gap-3 rounded-2xl border p-3.5 text-left transition ${
                      paymentMethod === "card"
                        ? "border-amber-400 bg-amber-500/15 text-white"
                        : "border-white/10 bg-white/5 text-stone-400"
                    }`}
                  >
                    <CreditCard className="h-5 w-5 text-amber-400" />
                    <div>
                      <div className="text-sm font-bold">
                        Instant Card / Apple Pay
                      </div>
                      <div className="text-[11px] text-stone-400">
                        Express 1-click checkout
                      </div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod("stripe")}
                    className={`flex items-center gap-3 rounded-2xl border p-3.5 text-left transition ${
                      paymentMethod === "stripe"
                        ? "border-amber-400 bg-amber-500/15 text-white"
                        : "border-white/10 bg-white/5 text-stone-400"
                    }`}
                  >
                    <ShieldCheck className="h-5 w-5 text-emerald-400" />
                    <div>
                      <div className="text-sm font-bold">
                        Stripe Hosted Portal
                      </div>
                      <div className="text-[11px] text-stone-400">
                        Redirects if live key set
                      </div>
                    </div>
                  </button>
                </div>

                <div className="mt-4 rounded-2xl border border-white/10 bg-stone-950/90 p-4">
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    <div className="sm:col-span-2">
                      <label className="mb-1 block text-[11px] uppercase tracking-wider text-stone-400">
                        Card Number
                      </label>
                      <input
                        type="text"
                        defaultValue="•••• •••• •••• 4242"
                        readOnly
                        className="w-full rounded-lg border border-white/10 bg-stone-900 px-3 py-2 font-mono text-sm text-amber-300"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="mb-1 block text-[11px] uppercase tracking-wider text-stone-400">
                          Expiry
                        </label>
                        <input
                          type="text"
                          defaultValue="08/29"
                          readOnly
                          className="w-full rounded-lg border border-white/10 bg-stone-900 px-3 py-2 font-mono text-sm text-stone-200"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-[11px] uppercase tracking-wider text-stone-400">
                          CVC
                        </label>
                        <input
                          type="text"
                          defaultValue="888"
                          readOnly
                          className="w-full rounded-lg border border-white/10 bg-stone-900 px-3 py-2 font-mono text-sm text-stone-200"
                        />
                      </div>
                    </div>
                  </div>
                  <p className="mt-2.5 text-[11px] text-stone-400">
                    Demo pre-filled with Stripe test card{" "}
                    <code className="text-amber-300">4242</code>. When{" "}
                    <code className="text-amber-300">STRIPE_SECRET_KEY</code> is
                    configured, this redirects to a hosted Stripe Checkout
                    Session.
                  </p>
                </div>

                {errorMsg && (
                  <div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-300">
                    {errorMsg}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="mt-6 flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 px-8 py-4 text-base font-black text-stone-950 shadow-[0_0_40px_-10px_rgba(245,158,11,0.7)] transition hover:-translate-y-0.5 hover:brightness-110 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Firing Up the Tandoor...</span>
                  ) : (
                    <>
                      <span>Pay {formatGBP(total)} &amp; Send to Kitchen</span>
                      <ArrowRight className="h-5 w-5" />
                    </>
                  )}
                </button>
              </section>
            </div>

            {/* Right Column: Order Summary & Promo Codes */}
            <div className="space-y-6 lg:col-span-5">
              <div className="sticky top-28 rounded-3xl border border-white/10 bg-stone-900/75 p-6 backdrop-blur-2xl sm:p-7">
                <div className="mb-4 flex items-center justify-between border-b border-white/10 pb-4">
                  <div>
                    <h2 className="text-lg font-bold text-white">
                      Your Order Summary
                    </h2>
                    <p className="text-xs text-stone-400">
                      {items.reduce((sum, i) => sum + i.quantity, 0)} items in
                      basket
                    </p>
                  </div>
                  <span className="rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-xs font-semibold text-amber-300">
                    +1 Loyalty Stamp
                  </span>
                </div>

                {/* Items List */}
                <div className="max-h-96 space-y-4 overflow-y-auto pr-1">
                  {items.map((item) => (
                    <div
                      key={item.cartItemId}
                      className="flex gap-3.5 rounded-2xl border border-white/10 bg-stone-950/60 p-3.5"
                    >
                      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl">
                        <Image
                          src={item.product.image}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="truncate text-sm font-bold text-white">
                            {item.product.name}
                          </h3>
                          <span className="shrink-0 font-mono text-sm font-bold text-amber-400">
                            {formatGBP(item.unitTotal * item.quantity)}
                          </span>
                        </div>

                        <div className="mt-1 flex flex-wrap gap-1">
                          {item.spiceLevel && (
                            <span className="rounded-md bg-orange-500/15 px-2 py-0.5 text-[10px] font-medium text-orange-300">
                              Spice: {item.spiceLevel}
                            </span>
                          )}
                          {item.upgrade && (
                            <span className="rounded-md bg-amber-500/15 px-2 py-0.5 text-[10px] font-medium text-amber-300">
                              + {item.upgrade.name}
                            </span>
                          )}
                          {item.extras.map((extra) => (
                            <span
                              key={extra.id}
                              className="rounded-md bg-white/10 px-2 py-0.5 text-[10px] text-stone-300"
                            >
                              + {extra.name}
                            </span>
                          ))}
                        </div>

                        <div className="mt-2.5 flex items-center justify-between">
                          <div className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-stone-900 px-2 py-1">
                            <button
                              type="button"
                              onClick={() =>
                                updateQuantity(
                                  item.cartItemId,
                                  item.quantity - 1
                                )
                              }
                              className="text-stone-400 hover:text-white"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="w-4 text-center font-mono text-xs font-bold">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                updateQuantity(
                                  item.cartItemId,
                                  item.quantity + 1
                                )
                              }
                              className="text-stone-400 hover:text-white"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeItem(item.cartItemId)}
                            className="text-xs text-stone-500 hover:text-red-400"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Promo Code Box */}
                <div className="mt-5 border-t border-white/10 pt-4">
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag className="pointer-events-none absolute top-3 left-3 h-4 w-4 text-amber-400" />
                      <input
                        type="text"
                        value={promoInput}
                        onChange={(e) => setPromoInput(e.target.value)}
                        placeholder="Promo (SAFFRON10, STUDENT10)"
                        className="w-full rounded-xl border border-white/15 bg-stone-950 py-2.5 pr-3 pl-9 text-xs uppercase text-white placeholder:normal-case placeholder:text-stone-500 focus:border-amber-400 focus:outline-none"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handlePromoSubmit}
                      className="rounded-xl border border-amber-400/40 bg-amber-400/15 px-4 py-2.5 text-xs font-bold text-amber-300 hover:bg-amber-400/25"
                    >
                      Apply
                    </button>
                  </div>

                  {promoCode && (
                    <div className="mt-2 flex items-center justify-between rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-xs text-emerald-300">
                      <span className="flex items-center gap-1.5 font-medium">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Code {promoCode} ({discountPercent}% off) active
                      </span>
                      <button
                        type="button"
                        onClick={removePromoCode}
                        className="underline hover:text-white"
                      >
                        Remove
                      </button>
                    </div>
                  )}

                  {promoFeedback && !promoCode && (
                    <p
                      className={`mt-1.5 text-xs ${
                        promoFeedback.type === "success"
                          ? "text-emerald-400"
                          : "text-amber-300"
                      }`}
                    >
                      {promoFeedback.text}
                    </p>
                  )}
                </div>

                {/* Totals Breakdown */}
                <div className="mt-5 space-y-2.5 border-t border-white/10 pt-4 text-sm">
                  <div className="flex justify-between text-stone-300">
                    <span>Subtotal</span>
                    <span className="font-mono">{formatGBP(subtotal)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-emerald-400">
                      <span>Discount ({promoCode})</span>
                      <span className="font-mono">-{formatGBP(discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-stone-300">
                    <span>
                      {fulfilment === "collection"
                        ? "Collection (Priority Counter)"
                        : "London Courier Delivery"}
                    </span>
                    <span className="font-mono">
                      {deliveryFee === 0 ? (
                        <span className="text-emerald-400">FREE</span>
                      ) : (
                        formatGBP(deliveryFee)
                      )}
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-t border-white/10 pt-3 text-lg font-black text-white">
                    <span>Total (GBP)</span>
                    <span className="font-mono text-amber-400">
                      {formatGBP(total)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </form>
        )}
      </div>
    </main>
  );
}
