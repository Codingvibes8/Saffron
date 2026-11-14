import { Flame, Sparkles, Clock, ShieldCheck } from "lucide-react";
import { MenuGrid } from "@/components/MenuGrid";

export const metadata = {
  title: "Interactive Menu | Saffron & Ember · London W1 & NW2",
  description:
    "Explore our charcoal tandoori grills, slow-simmered curries, Awadhi dum biryanis, artisanal truffle naans, and Soho pure-vegan royal thalis.",
};

export default function MenuPage() {
  return (
    <main className="min-h-screen bg-[#120907] pt-28 pb-24 text-white">
      {/* Header Banner */}
      <section className="relative overflow-hidden border-b border-white/10 bg-gradient-to-b from-amber-950/35 via-[#180a07] to-[#120907] py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-end">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-amber-300">
                <Flame className="h-3.5 w-3.5 fill-amber-400" />
                <span>02 — What&apos;s On The Menu</span>
              </div>
              <h1 className="mt-4 text-4xl sm:text-6xl font-black tracking-tight text-white">
                Fresh, Wholesome,{" "}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-300 via-orange-400 to-red-500">
                  Carefully Crafted.
                </span>
              </h1>
              <p className="mt-3 text-base sm:text-lg text-stone-300">
                Every curry, charcoal kebab, and royal thali is cooked fresh to
                order. Customise your spice level, add artisanal sourdough naans,
                or filter by Vegan &amp; Jain-friendly preparations.
              </p>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap gap-3 text-xs">
              <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-stone-200">
                <Clock className="h-4 w-4 text-emerald-400" />
                <span>25m Hot Delivery · 15m Click &amp; Collect</span>
              </div>
              <div className="flex items-center gap-2 rounded-2xl border border-amber-400/25 bg-amber-400/10 px-4 py-2.5 text-amber-300 font-semibold">
                <Sparkles className="h-4 w-4" />
                <span>Code SAFFRON10 for 10% Off</span>
              </div>
              <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-stone-200">
                <ShieldCheck className="h-4 w-4 text-amber-400" />
                <span>100% Halal Meats &amp; Separate Vegetarian Tandoor</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Interactive Menu Grid */}
      <section className="mx-auto max-w-7xl px-4 pt-10 sm:px-6 lg:px-8">
        <MenuGrid />
      </section>
    </main>
  );
}
