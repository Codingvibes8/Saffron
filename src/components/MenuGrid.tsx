"use client";

import React, { useMemo, useState } from "react";
import { Search, Flame, Sparkles, Filter, X } from "lucide-react";
import { MENU_CATEGORIES } from "@/lib/menu-data";
import { DietaryTag, MenuCategory } from "@/lib/types";
import { useCartStore } from "@/store/useCartStore";
import { AnimatedCard } from "@/components/AnimatedCard";
import { ProductCard } from "@/components/ProductCard";

const DIETARY_FILTERS: DietaryTag[] = [
  "Chef's Signature",
  "Vegan",
  "Vegetarian",
  "Jain-Friendly",
  "Gluten-Free",
];

export function MenuGrid() {
  const products = useCartStore((state) => state.products);
  const [selectedCategory, setSelectedCategory] = useState<MenuCategory>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDietary, setSelectedDietary] = useState<DietaryTag[]>([]);

  const toggleDietary = (tag: DietaryTag) => {
    setSelectedDietary((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory =
        selectedCategory === "All" || product.category === selectedCategory;

      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        product.name.toLowerCase().includes(q) ||
        product.description.toLowerCase().includes(q) ||
        product.badgeCategory.toLowerCase().includes(q);

      const matchesDietary =
        selectedDietary.length === 0 ||
        selectedDietary.every((tag) => product.dietary.includes(tag));

      return matchesCategory && matchesSearch && matchesDietary;
    });
  }, [products, selectedCategory, searchQuery, selectedDietary]);

  return (
    <div className="space-y-8">
      {/* Search + Dietary Filter Bar */}
      <div className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-white/5 p-4 sm:p-6 backdrop-blur-2xl lg:flex-row lg:items-center lg:justify-between">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-amber-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search butter chicken, lamb chops, biryani, vegan thali..."
            className="w-full rounded-2xl border border-white/15 bg-stone-950/70 pl-11 pr-10 py-3 text-sm text-white placeholder:text-stone-500 focus:border-amber-400 focus:outline-none"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-white cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Dietary Filter Pills */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-stone-400 mr-1">
            <Filter className="h-3.5 w-3.5 text-amber-400" />
            Dietary:
          </span>
          {DIETARY_FILTERS.map((tag) => {
            const active = selectedDietary.includes(tag);
            return (
              <button
                key={tag}
                type="button"
                onClick={() => toggleDietary(tag)}
                className={`rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                  active
                    ? "border-amber-400 bg-amber-400 text-stone-950 shadow"
                    : "border-white/15 bg-stone-950/60 text-stone-300 hover:border-amber-400/40 hover:text-white"
                }`}
              >
                {tag}
              </button>
            );
          })}
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2.5 overflow-x-auto pb-2 no-scrollbar">
        {MENU_CATEGORIES.map((category) => {
          const active = selectedCategory === category;
          const count =
            category === "All"
              ? products.length
              : products.filter((p) => p.category === category).length;

          return (
            <button
              key={category}
              type="button"
              onClick={() => setSelectedCategory(category)}
              className={`group flex shrink-0 items-center gap-2 rounded-2xl border px-5 py-3 text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer ${
                active
                  ? "border-transparent bg-gradient-to-r from-amber-400 to-orange-500 text-stone-950 shadow-[0_0_25px_-5px_rgba(245,158,11,0.6)]"
                  : "border-white/15 bg-white/5 text-stone-300 hover:border-amber-400/40 hover:bg-white/10 hover:text-white"
              }`}
            >
              <Flame
                className={`h-4 w-4 ${
                  active
                    ? "fill-stone-950 text-stone-950"
                    : "text-amber-400 group-hover:scale-110 transition-transform"
                }`}
              />
              <span>{category}</span>
              <span
                className={`rounded-full px-2 py-0.5 font-mono text-[11px] ${
                  active
                    ? "bg-stone-950/20 text-stone-950 font-black"
                    : "bg-white/10 text-stone-400"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Results Count & Active Reset */}
      <div className="flex items-center justify-between text-xs text-stone-400">
        <p>
          Showing{" "}
          <span className="font-bold text-amber-400">
            {filteredProducts.length}
          </span>{" "}
          {filteredProducts.length === 1 ? "dish" : "dishes"}
          {selectedCategory !== "All" && (
            <>
              {" "}
              in <span className="text-white font-semibold">{selectedCategory}</span>
            </>
          )}
        </p>

        {(selectedCategory !== "All" ||
          searchQuery ||
          selectedDietary.length > 0) && (
          <button
            type="button"
            onClick={() => {
              setSelectedCategory("All");
              setSearchQuery("");
              setSelectedDietary([]);
            }}
            className="text-amber-400 hover:underline font-semibold cursor-pointer"
          >
            Reset all filters
          </button>
        )}
      </div>

      {/* Responsive MenuGrid */}
      {filteredProducts.length === 0 ? (
        <div className="rounded-3xl border border-white/10 bg-white/5 p-12 text-center">
          <Sparkles className="mx-auto h-10 w-10 text-amber-400 mb-3" />
          <h3 className="text-xl font-bold text-white">
            No dishes match your current filter
          </h3>
          <p className="mt-1 text-sm text-stone-400">
            Try clearing your dietary filters or searching for another spice speciality.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filteredProducts.map((product, index) => (
            <AnimatedCard key={product.id} index={index}>
              <ProductCard product={product} />
            </AnimatedCard>
          ))}
        </div>
      )}
    </div>
  );
}
