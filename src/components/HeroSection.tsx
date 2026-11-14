"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Star,
  Flame,
  Clock,
  Phone,
  ArrowRight,
  MapPin,
  ChevronDown,
  Sparkles,
} from "lucide-react";

export function HeroSection() {
  const [videoReady, setVideoReady] = useState(false);

  return (
    <section className="relative min-h-[100dvh] flex flex-col justify-center items-center overflow-hidden pt-24 pb-12 bg-[#120907] text-white">
      {/* Background Layer 2 (Ken Burns Fallback): High-res overhead shot of a Royal Tandoori Platter & Butter Chicken */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center animate-ken-burns"
        style={{
          backgroundImage: "url('/hero-indian-feast.png')",
        }}
        aria-hidden="true"
      />

      {/* Background Layer 1 (Video): HTML5 video fading in over 2000ms once canplay resolves */}
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        onCanPlay={() => setVideoReady(true)}
        onLoadedData={() => setVideoReady(true)}
        className={`absolute inset-0 z-[1] h-full w-full object-cover transition-opacity duration-[2000ms] ${
          videoReady ? "opacity-85" : "opacity-0"
        }`}
      >
        <source src="/tandoor-flames.mp4" type="video/mp4" />
      </video>

      {/* Cinematic Overlays: 3 layered gradients */}
      {/* Overlay 1: Multiply warm obsidian tint */}
      <div
        className="pointer-events-none absolute inset-0 z-[2] bg-stone-950/45 mix-blend-multiply"
        aria-hidden="true"
      />
      {/* Overlay 2: Radial vignette rgba(28,10,5,0.85) */}
      <div
        className="pointer-events-none absolute inset-0 z-[3]"
        style={{
          background:
            "radial-gradient(circle at center, rgba(18,9,7,0.25) 0%, rgba(28,10,5,0.85) 100%)",
        }}
        aria-hidden="true"
      />
      {/* Overlay 3: Vertical gradient from-stone-950/80 via-transparent to-stone-950/95 */}
      <div
        className="pointer-events-none absolute inset-0 z-[4] bg-gradient-to-b from-stone-950/80 via-transparent to-stone-950/95"
        aria-hidden="true"
      />

      {/* Main Content Container */}
      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col items-center px-4 text-center sm:px-6 lg:px-8">
        {/* 1. Glass Pill Badge (100ms delay) */}
        <div
          style={{ animationDelay: "100ms", animationFillMode: "both" }}
          className="animate-in fade-in slide-in-from-bottom-8 duration-700 mb-6"
        >
          <div className="group inline-flex items-center gap-2.5 rounded-full border border-white/15 bg-white/10 px-5 py-2 text-xs sm:text-sm font-semibold text-amber-200 backdrop-blur-2xl shadow-xl transition-all duration-300 hover:border-amber-400/50 hover:bg-white/15">
            <Star className="h-4 w-4 fill-amber-400 text-amber-400 transition-transform duration-300 group-hover:rotate-12" />
            <span>London&apos;s Premier Modern Indian Kitchen</span>
            <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-amber-400/20 px-2 py-0.5 text-[11px] font-bold text-amber-300">
              <Sparkles className="h-3 w-3" /> Soho W1 &amp; NW2
            </span>
          </div>
        </div>

        {/* 2. Display H1 (300ms delay) */}
        <h1
          style={{ animationDelay: "300ms", animationFillMode: "both" }}
          className="animate-in fade-in slide-in-from-bottom-8 duration-700 text-5xl sm:text-7xl lg:text-[5.5rem] font-black tracking-tighter leading-[1.05] max-w-5xl"
        >
          Where Ancient Spice{" "}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-300 via-orange-400 to-red-500">
            Meets Modern
          </span>{" "}
          Craft.
        </h1>

        {/* 3. Sub-headline (500ms delay) */}
        <p
          style={{ animationDelay: "500ms", animationFillMode: "both" }}
          className="animate-in fade-in slide-in-from-bottom-8 duration-700 mt-6 max-w-2xl text-base sm:text-lg lg:text-xl text-stone-200/90 leading-relaxed font-normal"
        >
          Slow-simmered curries, charcoal-fired tandoori grills, and artisanal
          biryanis made fresh to order. Dine in, collect, or get it delivered
          across London NW2 &amp; Soho W1.
        </p>

        {/* 4. Dual CTA Buttons (700ms delay) */}
        <div
          style={{ animationDelay: "700ms", animationFillMode: "both" }}
          className="animate-in fade-in slide-in-from-bottom-8 duration-700 mt-9 flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto"
        >
          <Link
            href="/menu"
            className="group inline-flex w-full sm:w-auto items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 px-8 py-4 text-base font-black text-stone-950 shadow-[0_0_40px_-10px_rgba(245,158,11,0.6)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_55px_-8px_rgba(245,158,11,0.85)]"
          >
            <span>Order Now</span>
            <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1.5" />
          </Link>

          <a
            href="tel:02084521234"
            className="inline-flex w-full sm:w-auto items-center justify-center gap-3 rounded-2xl border border-white/20 bg-white/5 px-8 py-4 text-base font-bold text-white backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-amber-400/50 hover:bg-white/10"
          >
            <Phone className="h-5 w-5 text-amber-400" />
            <span className="font-mono">020 8452 1234</span>
          </a>
        </div>

        {/* 5. Glassmorphic 3-Card Trust Dock (900ms delay) */}
        <div
          style={{ animationDelay: "900ms", animationFillMode: "both" }}
          className="animate-in fade-in slide-in-from-bottom-8 duration-700 mt-12 grid w-full max-w-6xl grid-cols-1 gap-6 md:grid-cols-3 text-left"
        >
          {/* Card 1 */}
          <div className="group rounded-[2rem] border border-amber-100/10 bg-amber-950/40 p-7 backdrop-blur-2xl transition-all duration-300 hover:-translate-y-2 hover:border-amber-400/30 hover:bg-amber-950/55 shadow-2xl">
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-400/15 border border-amber-400/30 text-amber-400">
              <Star className="h-6 w-6 fill-amber-400 text-amber-400" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-black text-white">
                4.9 ★
              </span>
              <span className="text-sm font-semibold text-amber-300">
                — Average Rating
              </span>
            </div>
            <p className="mt-1.5 text-sm text-stone-300">
              Thousands of happy London diners across Soho &amp; NW2
            </p>
          </div>

          {/* Card 2 */}
          <div className="group rounded-[2rem] border border-amber-100/10 bg-amber-950/40 p-7 backdrop-blur-2xl transition-all duration-300 hover:-translate-y-2 hover:border-orange-400/30 hover:bg-amber-950/55 shadow-2xl">
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-400/15 border border-orange-400/30 text-orange-400">
              <Flame className="h-6 w-6 text-orange-400" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-black text-white">
                Charcoal Tandoor
              </span>
              <span className="text-sm font-semibold text-orange-300">
                — Authentic Craft
              </span>
            </div>
            <p className="mt-1.5 text-sm text-stone-300">
              Freshly ground whole spices daily &amp; 450°C clay ovens
            </p>
          </div>

          {/* Card 3 */}
          <div className="group rounded-[2rem] border border-amber-100/10 bg-amber-950/40 p-7 backdrop-blur-2xl transition-all duration-300 hover:-translate-y-2 hover:border-emerald-400/30 hover:bg-amber-950/55 shadow-2xl">
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-400/15 border border-emerald-400/30 text-emerald-400">
              <Clock className="h-6 w-6 text-emerald-400" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-black text-white">
                25 min
              </span>
              <span className="text-sm font-semibold text-emerald-300">
                — Avg. Delivery
              </span>
            </div>
            <p className="mt-1.5 text-sm text-stone-300">
              Piping hot to your door in insulated copper-lined carriers
            </p>
          </div>
        </div>

        {/* 6. Bottom Trust Bar (1200ms delay) */}
        <div
          style={{ animationDelay: "1200ms", animationFillMode: "both" }}
          className="animate-in fade-in slide-in-from-bottom-8 duration-700 mt-10 flex flex-wrap items-center justify-center gap-3"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs sm:text-sm text-stone-200 backdrop-blur-2xl">
            <MapPin className="h-4 w-4 text-amber-400" />
            <span>123 Cricklewood St, London NW2 1AB · 9-10 Soho St, W1D 3DL</span>
          </div>

          <a
            href="#featured-dishes"
            className="inline-flex items-center gap-2 rounded-full border border-green-500/30 bg-green-500/10 px-4 py-2 text-xs font-bold text-green-300 backdrop-blur-xl transition-transform hover:scale-105"
          >
            <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
            Uber Eats Partner
          </a>

          <a
            href="#featured-dishes"
            className="inline-flex items-center gap-2 rounded-full border border-teal-400/30 bg-teal-400/10 px-4 py-2 text-xs font-bold text-teal-300 backdrop-blur-xl transition-transform hover:scale-105"
          >
            <span className="h-2 w-2 rounded-full bg-teal-400 animate-pulse" />
            Deliveroo Editions
          </a>
        </div>

        {/* 7. Scroll Indicator (1500ms delay) */}
        <div
          style={{ animationDelay: "1500ms", animationFillMode: "both" }}
          className="animate-in fade-in duration-700 mt-8"
        >
          <a
            href="#featured-dishes"
            aria-label="Scroll to Featured Dishes"
            className="inline-flex flex-col items-center gap-1 text-xs font-medium text-stone-400 hover:text-amber-400 transition-colors"
          >
            <span className=" uppercase tracking-widest text-[10px]">
              Explore Menu
            </span>
            <ChevronDown className="h-5 w-5 animate-bounce text-amber-400" />
          </a>
        </div>
      </div>
    </section>
  );
}
