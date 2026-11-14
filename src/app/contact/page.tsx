"use client";

import React, { useState } from "react";
import {
  MapPin,
  Phone,
  Clock,
  Mail,
  Train,
  Send,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setName("");
    setEmail("");
    setMessage("");
  };

  return (
    <main className="min-h-screen bg-[#120907] pt-28 pb-24 text-white">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 space-y-14">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-amber-300">
            <MapPin className="h-3.5 w-3.5" />
            <span>06 — Visit Us in London</span>
          </div>
          <h1 className="mt-4 text-4xl sm:text-6xl font-black tracking-tight">
            Come Find Us in{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-300 via-orange-400 to-red-500">
              Soho W1 &amp; NW2.
            </span>
          </h1>
          <p className="mt-3 text-base sm:text-lg text-stone-300">
            Dine in at our Soho Street flagship or collect piping-hot tandoori
            feasts from our Cricklewood NW2 kitchen.
          </p>
        </div>

        {/* Two Locations + Enquiry Form */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="lg:col-span-6 space-y-6">
            {/* Location 1: Soho */}
            <div className="rounded-3xl border border-amber-400/25 bg-[#1a0b07] p-7 space-y-4">
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-amber-400/15 px-3 py-1 text-xs font-bold text-amber-300">
                  Flagship Dining Room · W1
                </span>
                <span className="text-xs text-emerald-400 font-semibold">
                  Open Today · 11:30 – 23:00
                </span>
              </div>
              <h2 className="text-2xl font-black text-white">
                Saffron &amp; Ember — Soho Street
              </h2>
              <div className="space-y-2.5 text-sm text-stone-300">
                <div className="flex items-center gap-2.5">
                  <MapPin className="h-4 w-4 text-amber-400 shrink-0" />
                  <span>9-10 Soho Street, London W1D 3DL</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Train className="h-4 w-4 text-amber-400 shrink-0" />
                  <span>Nearest Tube: Tottenham Court Road (1 min walk)</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Phone className="h-4 w-4 text-amber-400 shrink-0" />
                  <a
                    href="tel:02084521234"
                    className="font-mono font-bold text-amber-400 hover:underline"
                  >
                    020 8452 1234
                  </a>
                </div>
              </div>
              <div className="pt-2">
                <a
                  href="https://www.google.com/maps/dir//9+Soho+St,+London+W1D+3DL"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-xs font-bold text-white hover:border-amber-400/40"
                >
                  <span>Get Google Maps Directions</span>
                  <ExternalLink className="h-3.5 w-3.5 text-amber-400" />
                </a>
              </div>
            </div>

            {/* Location 2: NW2 */}
            <div className="rounded-3xl border border-white/10 bg-[#1a0b07] p-7 space-y-4">
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-orange-400/15 px-3 py-1 text-xs font-bold text-orange-300">
                  North West London Tandoor &amp; Takeaway · NW2
                </span>
                <span className="text-xs text-emerald-400 font-semibold">
                  Avg. Delivery: 25 mins
                </span>
              </div>
              <h2 className="text-2xl font-black text-white">
                Saffron &amp; Ember — Cricklewood NW2
              </h2>
              <div className="space-y-2.5 text-sm text-stone-300">
                <div className="flex items-center gap-2.5">
                  <MapPin className="h-4 w-4 text-amber-400 shrink-0" />
                  <span>123 Cricklewood Street, London NW2 1AB</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Clock className="h-4 w-4 text-amber-400 shrink-0" />
                  <span>Mon–Sun: 12:00 – 23:30 (Dine-in, Collection &amp; Delivery)</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Mail className="h-4 w-4 text-amber-400 shrink-0" />
                  <span>concierge@saffronandember.london</span>
                </div>
              </div>
            </div>
          </div>

          {/* Contact & Private Dining Form */}
          <div className="lg:col-span-6">
            <div className="rounded-3xl border border-white/10 bg-[#1a0b07] p-7 sm:p-9 shadow-2xl">
              <h3 className="text-2xl font-black text-white">
                Private Dining, Bulk Catering &amp; Enquiries
              </h3>
              <p className="mt-1 text-sm text-stone-400">
                Planning a corporate feast for 8+ guests or have an allergen
                question? Send a note directly to our Soho &amp; NW2 managers.
              </p>

              {sent ? (
                <div className="mt-8 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-6 text-center space-y-3">
                  <CheckCircle2 className="mx-auto h-10 w-10 text-emerald-400" />
                  <h4 className="text-lg font-bold text-white">
                    Message Received!
                  </h4>
                  <p className="text-xs text-stone-300">
                    Our hospitality team will respond within 2 hours. For
                    immediate assistance call 020 8452 1234.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSent(false)}
                  >
                    Send Another Message
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                  <div>
                    <label className="mb-1 block text-xs font-medium text-stone-300">
                      Your Name
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Alex Mercer"
                      className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white focus:border-amber-400 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-stone-300">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="alex@company.co.uk"
                      className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white focus:border-amber-400 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-stone-300">
                      How can we help?
                    </label>
                    <textarea
                      rows={4}
                      required
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Tell us about your event, catering order, or dietary question..."
                      className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white focus:border-amber-400 focus:outline-none"
                    />
                  </div>
                  <Button type="submit" size="lg" className="w-full">
                    <Send className="h-4 w-4" />
                    Send Message to Concierge
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
