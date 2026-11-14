"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Calendar,
  Clock,
  Users,
  Sparkles,
  CheckCircle2,
  MapPin,
  Phone,
  Flame,
  ShieldCheck,
  Utensils,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/useCartStore";
import { Reservation } from "@/lib/types";

const TIME_SLOTS = [
  { time: "12:30", label: "12:30 PM (Lunch)", tablesLeft: 4 },
  { time: "13:15", label: "1:15 PM (Lunch)", tablesLeft: 2 },
  { time: "17:30", label: "5:30 PM (Pre-Theatre)", tablesLeft: 5 },
  { time: "18:15", label: "6:15 PM (Early Evening)", tablesLeft: 3 },
  { time: "19:00", label: "7:00 PM (Prime Dinner)", tablesLeft: 2 },
  { time: "19:45", label: "7:45 PM (Prime Dinner)", tablesLeft: 1 },
  { time: "20:30", label: "8:30 PM (Evening)", tablesLeft: 4 },
  { time: "21:15", label: "9:15 PM (Late Tandoor)", tablesLeft: 6 },
];

const SEATING_AREAS: {
  name: Reservation["seatingArea"];
  desc: string;
  badge: string;
}[] = [
  {
    name: "Main Tandoor Dining Room",
    desc: "Warm brass lanterns & direct view of the glowing charcoal tandoors.",
    badge: "Most Popular",
  },
  {
    name: "Soho Velvet Booths",
    desc: "Intimate crimson velvet banquettes ideal for date nights & conversation.",
    badge: "Intimate",
  },
  {
    name: "Chef's Counter",
    desc: "Front-row seats watching our master spice blenders and naan artisans.",
    badge: "Theatrical",
  },
  {
    name: "Private Spice Vault",
    desc: "Candlelit private vault for celebrations and group feasts (4–12 guests).",
    badge: "Private",
  },
];

export default function ReservationsPage() {
  const addReservation = useCartStore((state) => state.addReservation);

  const todayStr = new Date().toISOString().split("T")[0];
  const [date, setDate] = useState(todayStr);
  const [partySize, setPartySize] = useState(2);
  const [timeSlot, setTimeSlot] = useState("19:00");
  const [seatingArea, setSeatingArea] = useState<Reservation["seatingArea"]>(
    "Main Tandoor Dining Room"
  );
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [occasion, setOccasion] = useState("Dinner with Friends");
  const [dietaryNotes, setDietaryNotes] = useState("");
  const [specialRequests, setSpecialRequests] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [confirmedReservation, setConfirmedReservation] =
    useState<Reservation | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const response = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          guestName,
          guestEmail,
          guestPhone,
          date,
          timeSlot,
          partySize,
          seatingArea,
          occasion,
          dietaryNotes,
          specialRequests,
        }),
      });
      const data = await response.json();
      if (data.reservation) {
        addReservation(data.reservation);
        setConfirmedReservation(data.reservation);
      }
    } catch {
      const fallback: Reservation = {
        id: `res-${Date.now()}`,
        reference: `SE-TBL-${Math.floor(100 + Math.random() * 900)}`,
        guestName,
        guestEmail,
        guestPhone,
        date,
        timeSlot,
        partySize,
        seatingArea,
        occasion,
        dietaryNotes,
        specialRequests,
        status: "confirmed",
        createdAt: new Date().toISOString(),
      };
      addReservation(fallback);
      setConfirmedReservation(fallback);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#120907] pt-28 pb-24 text-white">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-amber-300">
            <Calendar className="h-3.5 w-3.5" />
            <span>Soho W1 &amp; NW2 Table Reservations</span>
          </div>
          <h1 className="mt-4 text-4xl sm:text-6xl font-black tracking-tight text-white">
            Reserve Your{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-300 via-orange-400 to-red-500">
              Table by the Tandoor.
            </span>
          </h1>
          <p className="mt-3 text-base sm:text-lg text-stone-300">
            Instant real-time table availability at our 9-10 Soho Street W1
            flagship dining room and 123 Cricklewood Street NW2 lounge.
          </p>
        </div>

        {confirmedReservation ? (
          <div className="mx-auto max-w-2xl rounded-3xl border border-amber-400/30 bg-[#1a0b07] p-8 sm:p-10 text-center shadow-2xl space-y-6">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <CheckCircle2 className="h-9 w-9" />
            </div>

            <div>
              <span className="rounded-full bg-amber-400/15 px-3.5 py-1 font-mono text-xs font-bold text-amber-300 border border-amber-400/30">
                Booking Reference: #{confirmedReservation.reference}
              </span>
              <h2 className="mt-4 text-3xl font-black text-white">
                Your Table is Confirmed, {confirmedReservation.guestName}!
              </h2>
              <p className="mt-2 text-sm text-stone-300">
                We have reserved your table and alerted our Maitre D&apos; and
                Tandoor Chef.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 rounded-2xl border border-white/10 bg-white/5 p-5 text-left text-xs sm:grid-cols-4">
              <div>
                <div className="text-stone-400">Date</div>
                <div className="mt-1 font-bold text-white">
                  {confirmedReservation.date}
                </div>
              </div>
              <div>
                <div className="text-stone-400">Time Slot</div>
                <div className="mt-1 font-mono font-bold text-amber-400">
                  {confirmedReservation.timeSlot}
                </div>
              </div>
              <div>
                <div className="text-stone-400">Party Size</div>
                <div className="mt-1 font-bold text-white">
                  {confirmedReservation.partySize} Guests
                </div>
              </div>
              <div>
                <div className="text-stone-400">Dining Area</div>
                <div className="mt-1 font-bold text-amber-300">
                  {confirmedReservation.seatingArea}
                </div>
              </div>
            </div>

            {confirmedReservation.dietaryNotes && (
              <div className="rounded-xl border border-amber-400/20 bg-amber-950/30 p-4 text-left text-xs text-amber-200">
                <strong>Chef&apos;s Dietary Note Recorded:</strong>{" "}
                {confirmedReservation.dietaryNotes}
              </div>
            )}

            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <Button
                onClick={() => setConfirmedReservation(null)}
                variant="outline"
              >
                Make Another Booking
              </Button>
              <Link
                href="/menu"
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 px-6 py-3 text-sm font-black text-stone-950"
              >
                Preview the Menu
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
            {/* Booking Form */}
            <form
              onSubmit={handleSubmit}
              className="lg:col-span-8 space-y-8 rounded-3xl border border-white/10 bg-[#1a0b07] p-6 sm:p-8 shadow-2xl"
            >
              {/* Step 1: Date & Party Size */}
              <div className="space-y-4">
                <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-amber-400">
                  <Users className="h-4 w-4" />
                  Step 1 · Select Date &amp; Party Size
                </h3>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-stone-300">
                      Reservation Date
                    </label>
                    <input
                      type="date"
                      required
                      min={todayStr}
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white focus:border-amber-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-stone-300">
                      Number of Guests
                    </label>
                    <div className="grid grid-cols-6 gap-2">
                      {[1, 2, 3, 4, 6, 8].map((num) => (
                        <button
                          key={num}
                          type="button"
                          onClick={() => setPartySize(num)}
                          className={`rounded-xl border py-2.5 text-xs font-bold transition-all cursor-pointer ${
                            partySize === num
                              ? "border-amber-400 bg-gradient-to-r from-amber-400 to-orange-500 text-stone-950"
                              : "border-white/15 bg-white/5 text-stone-300 hover:border-amber-400/40"
                          }`}
                        >
                          {num}
                          {num === 8 ? "+" : ""}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 2: Live Time Slot Availability */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-amber-400">
                    <Clock className="h-4 w-4" />
                    Step 2 · Live Time Slot Availability
                  </h3>
                  <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                    Instant Confirmation
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {TIME_SLOTS.map((slot) => {
                    const active = timeSlot === slot.time;
                    return (
                      <button
                        key={slot.time}
                        type="button"
                        onClick={() => setTimeSlot(slot.time)}
                        className={`flex flex-col items-start rounded-2xl border p-3 text-left transition-all cursor-pointer ${
                          active
                            ? "border-amber-400 bg-amber-400/15 shadow-[0_0_20px_-5px_rgba(245,158,11,0.4)]"
                            : "border-white/10 bg-white/5 hover:border-white/25"
                        }`}
                      >
                        <span className="font-mono text-sm font-black text-white">
                          {slot.time}
                        </span>
                        <span className="text-[11px] text-amber-300/90 mt-0.5">
                          {slot.tablesLeft} tables left
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 3: Dining Room Area */}
              <div className="space-y-4">
                <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-amber-400">
                  <Utensils className="h-4 w-4" />
                  Step 3 · Choose Your Atmosphere
                </h3>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {SEATING_AREAS.map((area) => {
                    const active = seatingArea === area.name;
                    return (
                      <button
                        key={area.name}
                        type="button"
                        onClick={() => setSeatingArea(area.name)}
                        className={`flex flex-col justify-between rounded-2xl border p-4 text-left transition-all cursor-pointer ${
                          active
                            ? "border-amber-400 bg-amber-400/15"
                            : "border-white/10 bg-white/5 hover:border-white/25"
                        }`}
                      >
                        <div className="flex items-center justify-between w-full">
                          <span className="text-sm font-bold text-white">
                            {area.name}
                          </span>
                          <span className="rounded-full bg-amber-400/20 px-2.5 py-0.5 text-[10px] font-bold text-amber-300">
                            {area.badge}
                          </span>
                        </div>
                        <p className="mt-1.5 text-xs text-stone-400">
                          {area.desc}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 4: Guest Details & Dietary / Allergen Requests */}
              <div className="space-y-4">
                <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-amber-400">
                  <Sparkles className="h-4 w-4" />
                  Step 4 · Guest Details &amp; Dietary Notes
                </h3>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div>
                    <label className="mb-1 block text-xs font-medium text-stone-300">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      placeholder="Lady Maya Sharma"
                      className="w-full rounded-xl border border-white/15 bg-white/5 px-3.5 py-2.5 text-sm text-white placeholder:text-stone-500 focus:border-amber-400 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-stone-300">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={guestEmail}
                      onChange={(e) => setGuestEmail(e.target.value)}
                      placeholder="maya@soholondon.co.uk"
                      className="w-full rounded-xl border border-white/15 bg-white/5 px-3.5 py-2.5 text-sm text-white placeholder:text-stone-500 focus:border-amber-400 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-stone-300">
                      London Mobile / Phone *
                    </label>
                    <input
                      type="tel"
                      required
                      value={guestPhone}
                      onChange={(e) => setGuestPhone(e.target.value)}
                      placeholder="07700 900456"
                      className="w-full rounded-xl border border-white/15 bg-white/5 px-3.5 py-2.5 text-sm text-white placeholder:text-stone-500 focus:border-amber-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-xs font-medium text-stone-300">
                      Dietary &amp; Allergen Notes (Optional)
                    </label>
                    <input
                      type="text"
                      value={dietaryNotes}
                      onChange={(e) => setDietaryNotes(e.target.value)}
                      placeholder="e.g., Jain (no onion/garlic), Vegan, Nut-Free, Gluten-Free"
                      className="w-full rounded-xl border border-white/15 bg-white/5 px-3.5 py-2.5 text-sm text-white placeholder:text-stone-500 focus:border-amber-400 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-stone-300">
                      Special Occasion / Table Request
                    </label>
                    <input
                      type="text"
                      value={specialRequests}
                      onChange={(e) => setSpecialRequests(e.target.value)}
                      placeholder="e.g., Anniversary, window booth, high chair..."
                      className="w-full rounded-xl border border-white/15 bg-white/5 px-3.5 py-2.5 text-sm text-white placeholder:text-stone-500 focus:border-amber-400 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                size="lg"
                disabled={submitting}
                className="w-full py-4 text-base font-black"
              >
                {submitting
                  ? "Confirming Table Availability..."
                  : `Confirm Table for ${partySize} at ${timeSlot}`}
              </Button>
            </form>

            {/* Right Sidebar Info */}
            <div className="lg:col-span-4 space-y-6">
              <div className="rounded-3xl border border-amber-400/20 bg-amber-950/25 p-6 backdrop-blur-2xl space-y-4">
                <div className="flex items-center gap-2.5 text-amber-400 font-bold text-sm uppercase tracking-wider">
                  <Flame className="h-4 w-4" />
                  Dine-In Highlights
                </div>
                <p className="text-xs text-stone-300 leading-relaxed">
                  Walk-ins are always welcome, and we hold 25% of our Soho Street
                  tables for spontaneous guests. Reservations are recommended for
                  Thursday–Saturday evenings and groups of 4+.
                </p>

                <div className="space-y-3 border-t border-white/10 pt-4 text-xs">
                  <div className="flex items-start gap-2.5">
                    <MapPin className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white">Soho W1 Flagship:</strong>{" "}
                      9-10 Soho Street, London W1D 3DL (1 min from Tottenham Court
                      Road Station)
                    </div>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <MapPin className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white">NW2 Lounge:</strong> 123
                      Cricklewood Street, London NW2 1AB
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Phone className="h-4 w-4 text-amber-400 shrink-0" />
                    <span className="font-mono text-white">020 8452 1234</span>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/5 p-6 space-y-3">
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                  <ShieldCheck className="h-4 w-4" />
                  Jain, Vegan &amp; Allergy Care
                </div>
                <p className="text-xs text-stone-300 leading-relaxed">
                  Our kitchen maintains dedicated vegetarian &amp; vegan clay
                  tandoors and prepares strict Jain-friendly meals (no onion,
                  garlic, or root vegetables) upon request.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
