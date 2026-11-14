"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Flame,
  MapPin,
  Phone,
  Clock,
  Mail,
  Sparkles,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";

export function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
    setEmail("");
  };

  return (
    <footer className="border-t border-white/10 bg-[#0d0604] text-stone-300">
      {/* Top Loyalty & Student Perks Strip */}
      <div className="border-b border-white/10 bg-gradient-to-r from-amber-950/40 via-rose-950/35 to-amber-950/40 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="flex items-start gap-4 rounded-2xl border border-amber-400/20 bg-stone-950/50 p-5 backdrop-blur-xl">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-400/15 text-amber-400">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-base font-bold text-white">
                  Saffron Regulars Loyalty Card
                </h4>
                <p className="mt-1 text-xs leading-relaxed text-stone-300">
                  Our regulars are at the heart of Saffron &amp; Ember. Buy seven
                  signature thalis or curries and enjoy your eighth feast on us.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 rounded-2xl border border-amber-400/20 bg-stone-950/50 p-5 backdrop-blur-xl">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-400/15 text-orange-400">
                <Flame className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-base font-bold text-white">
                  10% London Student &amp; UNiDAYS Discount
                </h4>
                <p className="mt-1 text-xs leading-relaxed text-stone-300">
                  Good food shouldn&apos;t stretch a student budget. Use code{" "}
                  <span className="font-mono font-bold text-amber-400">
                    STUDENT10
                  </span>{" "}
                  at checkout or show your student ID in our Soho W1 or NW2 dining room.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Grid */}
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Column 1: Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 text-stone-950 shadow-lg">
                <Flame className="h-5 w-5" />
              </div>
              <div>
                <span className="text-lg font-black text-white">
                  Saffron <span className="text-amber-400">&amp;</span> Ember
                </span>
                <p className="text-[10px] uppercase tracking-widest text-amber-400">
                  Soho W1 · London NW2
                </p>
              </div>
            </Link>
            <p className="text-xs leading-relaxed text-stone-400">
              Where Ancient Spice Meets Modern Craft. Charcoal-fired tandoori
              grills, slow-simmered curries, and pure-vegetarian &amp; Jain-friendly
              temple-style thalis in the heart of London.
            </p>
            <div className="flex items-center gap-2 pt-1">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-green-500/30 bg-green-500/10 px-3 py-1 text-[11px] font-semibold text-green-300">
                Uber Eats
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-teal-400/30 bg-teal-400/10 px-3 py-1 text-[11px] font-semibold text-teal-300">
                Deliveroo
              </span>
            </div>
          </div>

          {/* Column 2: Soho W1 Flagship & NW2 Kitchen */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-amber-400">
              London Locations
            </h4>
            <div className="space-y-3 text-xs">
              <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                <div className="font-bold text-white">
                  Soho Flagship Dining Room
                </div>
                <div className="mt-1 flex items-center gap-1.5 text-stone-400">
                  <MapPin className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                  9-10 Soho Street, London W1D 3DL (1 min Tottenham Court Rd)
                </div>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                <div className="font-bold text-white">
                  NW2 Tandoor &amp; Delivery Hub
                </div>
                <div className="mt-1 flex items-center gap-1.5 text-stone-400">
                  <MapPin className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                  123 Cricklewood St, London NW2 1AB
                </div>
              </div>
              <div className="flex items-center gap-2 text-stone-300 pt-1">
                <Phone className="h-3.5 w-3.5 text-amber-400" />
                <a href="tel:02084521234" className="font-mono hover:text-amber-400">
                  020 8452 1234
                </a>
              </div>
            </div>
          </div>

          {/* Column 3: Opening Hours & Navigation */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-amber-400">
              Hours &amp; Quick Links
            </h4>
            <div className="space-y-1.5 text-xs text-stone-400">
              <div className="flex items-center gap-2 text-stone-200">
                <Clock className="h-3.5 w-3.5 text-amber-400" />
                <span>Mon – Sat: 11:30 – 23:00</span>
              </div>
              <div className="pl-5">Sunday: 12:00 – 22:00</div>
            </div>
            <ul className="grid grid-cols-2 gap-2 pt-2 text-xs font-medium">
              <li>
                <Link href="/menu" className="hover:text-amber-400">
                  Interactive Menu
                </Link>
              </li>
              <li>
                <Link href="/reservations" className="hover:text-amber-400">
                  Book a Table
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-amber-400">
                  Our Story
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-amber-400">
                  Visit &amp; Map
                </Link>
              </li>
              <li>
                <Link href="/orders/SE-8492" className="hover:text-amber-400">
                  Track Live Order
                </Link>
              </li>
              <li>
                <Link href="/kitchen" className="hover:text-amber-400">
                  Kitchen KDS
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-amber-400">
                  Admin Portal
                </Link>
              </li>
              <li>
                <a
                  href="https://maps.google.com/?q=9+Soho+St,+London+W1D+3DL"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 hover:text-amber-400"
                >
                  Directions <ExternalLink className="h-3 w-3" />
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Newsletter */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-amber-400">
              Join the Spice Vault
            </h4>
            <p className="text-xs text-stone-400">
              Receive private tasting invitations, seasonal truffle naan drops,
              and 15% off your next online takeaway.
            </p>
            {subscribed ? (
              <div className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs text-emerald-300">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                <span>Welcome! Check your inbox for code SOHO15.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-500" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="diner@london.co.uk"
                    className="w-full rounded-xl border border-white/15 bg-white/5 pl-9 pr-3 py-2.5 text-xs text-white placeholder:text-stone-500 focus:border-amber-400 focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 py-2.5 text-xs font-black text-stone-950 transition-transform hover:-translate-y-0.5 cursor-pointer"
                >
                  Unlock 15% Welcome Code
                </button>
              </form>
            )}
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-xs text-stone-500 sm:flex-row">
          <p>
            © {new Date().getFullYear()} Saffron &amp; Ember London Ltd. All
            rights reserved.
          </p>
          <p className="font-mono text-[11px] text-stone-400">
            Crafted with Next.js App Router · Tailwind v4 · Neon Postgres ·
            Stripe · Clerk
          </p>
        </div>
      </div>
    </footer>
  );
}
