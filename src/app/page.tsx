import Link from "next/link";
import {
  Flame,
  Sparkles,
  Calendar,
  Award,
  MapPin,
  Clock,
  Star,
  ArrowRight,
  ShieldCheck,
  Utensils,
} from "lucide-react";
import { HeroSection } from "@/components/HeroSection";
import { FeaturedProducts } from "@/components/FeaturedProducts";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#120907] text-white">
      {/* B. Full-Viewport Cinematic Hero */}
      <HeroSection />

      {/* C. Featured Dishes Section */}
      <FeaturedProducts />

      {/* Theatrical Tandoor & Soho Heritage Section (Secondary Brand Accent: rose-950 / amber-950) */}
      <section className="relative overflow-hidden border-t border-white/10 bg-gradient-to-b from-rose-950/35 via-[#180a07] to-amber-950/30 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
            {/* Left Copy */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-amber-300">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Soho W1 &amp; NW2 Culinary Theatre</span>
              </div>

              <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-[1.1]">
                Glowing Charcoal Tandoors, Hand-Hammered Brass &amp; Single-Origin Saffron.
              </h2>

              <p className="text-base sm:text-lg text-stone-300 leading-relaxed">
                Nestled a minute from Tottenham Court Road in Soho (9-10 Soho
                Street, W1D 3DL) with our dedicated North West London delivery
                kitchen at 123 Cricklewood Street (NW2 1AB),{" "}
                <strong className="text-amber-300">Saffron &amp; Ember</strong>{" "}
                bridges centuries-old royal Awadhi and Old Delhi slow-cooking with
                contemporary London hospitality.
              </p>

              <blockquote className="rounded-2xl border-l-4 border-amber-400 bg-white/5 p-5 text-sm sm:text-base italic text-amber-100/90 backdrop-blur-xl">
                &ldquo;Our philosophy is simple: whole spices roasted and stone-ground
                every morning, 24-hour black dal simmered over dying birchwood
                embers, and pure vegetarian &amp; Jain-friendly temple thalis
                prepared with devotion.&rdquo;
              </blockquote>

              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 pt-2">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="text-2xl font-black text-amber-400">450°C</div>
                  <div className="mt-1 text-xs text-stone-300">
                    Clay Charcoal Tandoor Ovens
                  </div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="text-2xl font-black text-amber-400">24 Hrs</div>
                  <div className="mt-1 text-xs text-stone-300">
                    Slow-Simmered Dal Makhani
                  </div>
                </div>
                <div className="col-span-2 sm:col-span-1 rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="text-2xl font-black text-emerald-400">100%</div>
                  <div className="mt-1 text-xs text-stone-300">
                    Halal, Vegan &amp; Jain Options
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  href="/reservations"
                  className="inline-flex items-center gap-2.5 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 px-7 py-4 text-sm font-black text-stone-950 shadow-lg transition-transform hover:-translate-y-0.5"
                >
                  <Calendar className="h-4 w-4" />
                  Book a Table in Soho W1
                </Link>
                <Link
                  href="/orders/SE-8492"
                  className="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-6 py-4 text-sm font-bold text-white hover:border-amber-400/40 hover:bg-white/10"
                >
                  <Flame className="h-4 w-4 text-amber-400" />
                  Live Tandoor Order Tracker Demo
                </Link>
              </div>
            </div>

            {/* Right Visual Card Stack */}
            <div className="lg:col-span-5 space-y-5">
              <div className="relative overflow-hidden rounded-[2rem] border border-amber-400/25 bg-stone-950 shadow-2xl">
                <img
                  src="/hero-indian-feast.png"
                  alt="Saffron & Ember Royal Feast"
                  className="h-72 w-full object-cover"
                />
                <div className=" inset-0 bg-gradient-to-t from-stone-950 via-stone-950/30 to-transparent p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                        2026 Travellers&apos; Choice Winner
                      </span>
                      <h3 className="text-xl font-black text-white">
                        Soho Velvet Booths &amp; Chef&apos;s Counter
                      </h3>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-400 text-stone-950 font-black">
                      4.9★
                    </div>
                  </div>
                  <p className="mt-2 text-xs text-stone-300">
                    Walk-ins welcome daily or reserve our private Spice Vault for
                    groups of up to 16 guests.
                  </p>
                </div>
              </div>

              {/* Quick Info Strip */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400">
                    <MapPin className="h-4 w-4" />
                    Two London Hubs
                  </div>
                  <p className="mt-2 text-xs text-stone-300 leading-relaxed">
                    <strong>Soho W1:</strong> 9-10 Soho St (1 min Tottenham Ct Rd)
                    <br />
                    <strong>NW2 Hub:</strong> 123 Cricklewood St, NW2 1AB
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400">
                    <Award className="h-4 w-4" />
                    Loved by 30,000+
                  </div>
                  <p className="mt-2 text-xs text-stone-300 leading-relaxed">
                    Featured in Eater London, Evening Standard &amp; Time Out
                    London&apos;s Top Indian Kitchens.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
