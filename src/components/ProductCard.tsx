"use client";

import React from "react";
import { Flame, Plus, SlidersHorizontal, Star, Clock } from "lucide-react";
import { Product } from "@/lib/types";
import { formatGBP } from "@/lib/utils";
import { useCartStore } from "@/store/useCartStore";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);
  const setActiveProductForOptions = useCartStore(
    (state) => state.setActiveProductForOptions
  );

  const savings =
    product.originalPrice && product.originalPrice > product.price
      ? product.originalPrice - product.price
      : 0;

  const isUnavailable = product.available === false;

  const handleAction = () => {
    if (isUnavailable) return;
    if (product.hasModifiers) {
      setActiveProductForOptions(product);
    } else {
      addItem({
        product,
        quantity: 1,
        spiceLevel: product.defaultSpice,
      });
    }
  };

  return (
    <div className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-[#170906]/90 shadow-xl transition-all duration-300 hover:-translate-y-1.5 hover:border-amber-400/35 hover:shadow-[0_20px_50px_-15px_rgba(245,158,11,0.2)]">
      {/* 4:3 Image Container with group-hover:scale-105 zoom */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-stone-900">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#170906] via-transparent to-black/30" />

        {/* Top-Left Discount Badge (Save £X.XX in destructive red) */}
        {savings > 0 && (
          <div className="absolute left-3.5 top-3.5 z-10">
            <Badge
              variant="destructive"
              className="px-3 py-1 text-xs font-extrabold tracking-wide"
            >
              Save {formatGBP(savings)}
            </Badge>
          </div>
        )}

        {/* Top-Right Category Badge */}
        <div className="absolute right-3.5 top-3.5 z-10">
          <Badge
            variant="secondary"
            className="border-amber-300/25 bg-stone-950/80 text-amber-300 backdrop-blur-xl"
          >
            {product.badgeCategory}
          </Badge>
        </div>

        {/* Bottom-left metadata overlay */}
        <div className="absolute bottom-3 left-3.5 right-3.5 flex items-center justify-between text-xs text-stone-200">
          <div className="flex items-center gap-2">
            {product.rating && (
              <span className="inline-flex items-center gap-1 rounded-full bg-stone-950/80 px-2.5 py-0.5 font-semibold text-amber-300 backdrop-blur-md">
                <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                {product.rating.toFixed(1)}
              </span>
            )}
            {product.prepTimeMins && (
              <span className="inline-flex items-center gap-1 rounded-full bg-stone-950/75 px-2.5 py-0.5 text-stone-300 backdrop-blur-md">
                <Clock className="h-3 w-3 text-emerald-400" />
                {product.prepTimeMins}m
              </span>
            )}
          </div>

          {product.defaultSpice && (
            <span className="inline-flex items-center gap-1 rounded-full bg-stone-950/80 px-2.5 py-0.5 text-[11px] font-medium text-orange-300 backdrop-blur-md">
              <Flame className="h-3 w-3 text-orange-400" />
              {product.defaultSpice}
            </span>
          )}
        </div>
      </div>

      {/* Card Body */}
      <div className="flex flex-1 flex-col justify-between p-6">
        <div>
          {/* Dietary Tags */}
          {product.dietary.length > 0 && (
            <div className="mb-2.5 flex flex-wrap gap-1.5">
              {product.dietary.map((tag) => (
                <span
                  key={tag}
                  className="rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-amber-200/80"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Dish Title */}
          <h3 className="text-lg sm:text-xl font-bold tracking-tight text-white group-hover:text-amber-300 transition-colors">
            {product.name}
          </h3>

          {/* 3-line Description */}
          <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-stone-300/85">
            {product.description}
          </p>
        </div>

        {/* Footer: GBP Price (£) + Choose Options / Add to Cart Button */}
        <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4">
          <div className="flex flex-col">
            <span className="text-[10px] font-medium uppercase tracking-wider text-stone-400">
              Price
            </span>
            <div className="flex items-baseline gap-2">
              <span className="font-mono text-2xl font-black text-amber-400">
                {formatGBP(product.price)}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="font-mono text-xs text-stone-500 line-through">
                  {formatGBP(product.originalPrice)}
                </span>
              )}
            </div>
          </div>

          <Button
            onClick={handleAction}
            disabled={isUnavailable}
            className="rounded-xl px-4 py-2.5 text-xs sm:text-sm font-bold"
          >
            {isUnavailable ? (
              <span>Sold Out Tonight</span>
            ) : product.hasModifiers ? (
              <>
                <SlidersHorizontal className="h-4 w-4" />
                <span>Choose Options</span>
              </>
            ) : (
              <>
                <Plus className="h-4 w-4" />
                <span>Add to Cart</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
