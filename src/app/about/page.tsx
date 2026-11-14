import Link from "next/link";
import {
  Flame,
  Award,
  Sparkles,
  Heart,
  ShieldCheck,
  Utensils,
  Calendar,
  ArrowRight,
} from "lucide-react";

export const metadata = {
  title: "Our Story & Heritage | Saffron & Ember · London W1 & NW2",
  description:
    "Discover the story behind Saffron & Ember in London Soho W1 and NW2 — where ancient charcoal tandoor craft meets modern hospitality.",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#120907] pt-28 pb-24 text-white">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 space-y-20">
        {/* Hero Story */}
        <section className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-amber-300">
              <Flame className="h-3.5 w-3.5" />
              <span>01 — Welcome to Saffron &amp; Ember</span>
            </div>
            <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-[1.08]">
              A Theatrical Sanctuary from{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-300 via-orange-400 to-red-500">
                London&apos;s Bustle.
              </span>
            </h1>
            <p className="text-base sm:text-lg text-stone-300 leading-relaxed">
              Nestled between Oxford Street and Tottenham Court Road in Soho
              (9-10 Soho Street, W1D 3DL) alongside our North West London
              kitchen at 123 Cricklewood Street (NW2 1AB),{" "}
              <strong>Saffron &amp; Ember</strong> was born from a singular
              obsession: honouring the sacred fire of the Indian clay tandoor
              and the meditative patience of temple-style vegetarian cooking.
            </p>
            <p className="text-sm sm:text-base text-stone-300/90 leading-relaxed">
              Every morning at 6:00 AM, our spice masters roast whole green
              cardamom, Kashmiri saffron strands, Tellicherry peppercorns, and
              heirloom coriander seeds over warm iron tawas before stone-grinding
              them in small batches.
            </p>
            <blockquote className="rounded-2xl border-l-4 border-amber-400 bg-white/5 p-5 text-sm sm:text-base italic text-amber-200">
              &ldquo;Our philosophy is simple: real single-origin ingredients,
              balanced plates, traditional flavours. Warm, honest food that feeds
              body and soul.&rdquo;
            </blockquote>
          </div>

          <div className="lg:col-span-5">
            <div className="overflow-hidden rounded-[2rem] border border-amber-400/25 bg-[#1a0b07] shadow-2xl">
              <img
                src="/hero-indian-feast.png"
                alt="Saffron & Ember Kitchen Craft"
                className="h-80 w-full object-cover"
              />
              <div className="p-6 space-y-2">
                <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
                  Soho W1 · Cricklewood NW2
                </span>
                <h3 className="text-xl font-black text-white">
                  Dual Tandoor Kitchen Architecture
                </h3>
                <p className="text-xs text-stone-300 leading-relaxed">
                  We operate separate charcoal tandoors for our royal Awadhi grills
                  and our pure-vegetarian, vegan, and Jain-friendly thali kitchen.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Three Pillars */}
        <section className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="rounded-3xl border border-white/10 bg-[#1a0b07] p-7 space-y-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-400/15 text-amber-400">
              <Utensils className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-white">
              24-Hour Slow Simmer
            </h3>
            <p className="text-sm text-stone-300 leading-relaxed">
              Our signature Black Dal Makhani and Awadhi Lamb Dum Biryani cook
              gently overnight over dying birchwood embers for unmatched depth.
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-[#1a0b07] p-7 space-y-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-400/15 text-emerald-400">
              <Heart className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-white">
              Pure Vegan &amp; Jain Respect
            </h3>
            <p className="text-sm text-stone-300 leading-relaxed">
              Inspired by Soho&apos;s 1979 temple-kitchen heritage, we craft
              dedicated vegan thalis and Jain-friendly dishes without onion or
              garlic.
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-[#1a0b07] p-7 space-y-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-400/15 text-orange-400">
              <Award className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-white">
              Loved &amp; Awarded Across London
            </h3>
            <p className="text-sm text-stone-300 leading-relaxed">
              4.9★ rated by thousands of Londoners and recognized by Travellers&apos;
              Choice, Eater London, and the Evening Standard.
            </p>
          </div>
        </section>

        {/* CTA Banner */}
        <section className="rounded-[2.5rem] border border-amber-400/25 bg-gradient-to-r from-amber-950/50 via-rose-950/40 to-amber-950/50 p-8 sm:p-12 text-center space-y-6">
          <Sparkles className="mx-auto h-8 w-8 text-amber-400" />
          <h2 className="text-3xl sm:text-4xl font-black text-white">
            Come Once with Curiosity — Leave Feeling Like Family.
          </h2>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/menu"
              className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 px-8 py-4 text-sm font-black text-stone-950 shadow-lg"
            >
              <span>Order Online Now</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/reservations"
              className="inline-flex items-center gap-2 rounded-2xl border border-white/20 bg-white/5 px-8 py-4 text-sm font-bold text-white hover:bg-white/10"
            >
              <Calendar className="h-4 w-4 text-amber-400" />
              <span>Book a Table</span>
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
