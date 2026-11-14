"use client";

import React from "react";
import Link from "next/link";
import { Flame, ArrowRight } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { AnimatedCard } from "@/components/AnimatedCard";
import { ProductCard } from "@/components/ProductCard";

export function FeaturedProducts() {
  const products = useCartStore((state) => state.products);
  const featured = products.filter((p) => p.featured).slice(0, 6);

  return (
    <section
      id="featured-dishes"
      className="relative bg-[#1f0d09] py-24 text-white overflow-hidden"
    >
      {/* Subtle radial copper glow */}
      <div
        className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-96 w-[900px] rounded-full bg-amber-500/10 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center">
          {/* Pill Badge with Flame Icon ("Most Popular") */}
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-amber-300 shadow-sm">
            <Flame className="h-4 w-4 fill-amber-400 text-amber-400" />
            <span>Most Popular</span>
          </div>

          {/* Bold Featured Dishes H2 */}
          <h2 className="mt-4 text-4xl sm:text-5xl font-black tracking-tight text-white">
            Featured Dishes
          </h2>

          {/* Decorative Divider Bar with an amber-400 center pill */}
          <div className="my-5 flex items-center justify-center gap-2">
            <span className="h-px w-16 bg-gradient-to-r from-transparent to-amber-400/60" />
            <span className="h-2 w-10 rounded-full bg-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.8)]" />
            <span className="h-px w-16 bg-gradient-to-l from-transparent to-amber-400/60" />
          </div>

          <p className="text-base sm:text-lg text-stone-300/90 leading-relaxed">
            Handcrafted in our Soho &amp; NW2 clay tandoors using single-origin
            spices, 24-hour marinades, and heirloom recipes passed down through
            generations.
          </p>
        </div>

        {/* 3-Column Product Grid */}
        <div className="mt-14 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {featured.map((product, index) => (
            <AnimatedCard key={product.id} index={index}>
              <ProductCard product={product} />
            </AnimatedCard>
          ))}
        </div>

        {/* Bottom CTA to Full Interactive Menu */}
        <div className="mt-14 text-center">
          <Link
            href="/menu"
            className="group inline-flex items-center gap-3 rounded-2xl border border-amber-400/40 bg-amber-400/10 px-8 py-4 text-sm sm:text-base font-bold text-amber-300 backdrop-blur-md transition-all duration-300 hover:bg-gradient-to-r hover:from-amber-400 hover:to-orange-500 hover:text-stone-950 hover:border-transparent shadow-lg"
          >
            <span>Explore Full Interactive Menu (22+ Dishes)</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}
