"use client";

import React, { useEffect, useState } from "react";
import { Flame, Check, Plus, Minus, ShoppingBag, Utensils } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/useCartStore";
import {
  EXTRA_OPTIONS,
  SPICE_LEVELS,
  UPGRADE_OPTIONS,
} from "@/lib/menu-data";
import { ExtraOption, SpiceLevel, UpgradeOption } from "@/lib/types";
import { formatGBP } from "@/lib/utils";

export function ProductOptionsDialog() {
  const product = useCartStore((state) => state.activeProductForOptions);
  const setActiveProduct = useCartStore(
    (state) => state.setActiveProductForOptions
  );
  const addItem = useCartStore((state) => state.addItem);

  const [spiceLevel, setSpiceLevel] = useState<SpiceLevel>("Medium");
  const [selectedUpgrade, setSelectedUpgrade] = useState<UpgradeOption>(
    UPGRADE_OPTIONS[0]
  );
  const [selectedExtras, setSelectedExtras] = useState<ExtraOption[]>([]);
  const [notes, setNotes] = useState("");
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (product) {
      setSpiceLevel(product.defaultSpice || "Medium");
      setSelectedUpgrade(UPGRADE_OPTIONS[0]);
      setSelectedExtras([]);
      setNotes("");
      setQuantity(1);
    }
  }, [product]);

  if (!product) return null;

  const toggleExtra = (extra: ExtraOption) => {
    setSelectedExtras((prev) =>
      prev.some((e) => e.id === extra.id)
        ? prev.filter((e) => e.id !== extra.id)
        : [...prev, extra]
    );
  };

  const unitPrice =
    product.price +
    (selectedUpgrade?.price || 0) +
    selectedExtras.reduce((sum, e) => sum + e.price, 0);

  const totalPrice = unitPrice * quantity;

  const handleConfirm = () => {
    addItem({
      product,
      quantity,
      spiceLevel,
      upgrade: selectedUpgrade,
      extras: selectedExtras,
      specialInstructions: notes,
    });
    setActiveProduct(null);
  };

  return (
    <Dialog
      open={Boolean(product)}
      onOpenChange={(open) => {
        if (!open) setActiveProduct(null);
      }}
    >
      <DialogContent className="max-h-[90vh] max-w-xl overflow-y-auto border-amber-400/20 bg-[#170906] p-0">
        {/* Top Banner Image */}
        <div className="relative h-48 w-full overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#170906] via-[#170906]/50 to-transparent" />
          <div className="absolute bottom-4 left-6 right-6">
            <span className="inline-block rounded-full border border-amber-400/30 bg-amber-400/15 px-3 py-0.5 text-xs font-semibold text-amber-300">
              {product.badgeCategory}
            </span>
            <DialogHeader className="mt-1">
              <DialogTitle className="text-2xl font-black text-white">
                {product.name}
              </DialogTitle>
            </DialogHeader>
          </div>
        </div>

        <div className="space-y-6 p-6 pt-2">
          <DialogDescription className="text-sm text-stone-300">
            {product.description}
          </DialogDescription>

          {/* 1. Spice Level Selector */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-amber-400">
                <Flame className="h-4 w-4 text-orange-400" />
                1. Choose Your Spice Level
              </h4>
              <span className="rounded-full bg-amber-400/15 px-2.5 py-0.5 text-[11px] font-semibold text-amber-300">
                Required
              </span>
            </div>

            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              {SPICE_LEVELS.map((item) => {
                const active = spiceLevel === item.level;
                return (
                  <button
                    key={item.level}
                    type="button"
                    onClick={() => setSpiceLevel(item.level)}
                    className={`flex flex-col items-start rounded-2xl border p-3.5 text-left transition-all cursor-pointer ${
                      active
                        ? "border-amber-400 bg-amber-400/15 shadow-[0_0_20px_-5px_rgba(245,158,11,0.4)]"
                        : "border-white/10 bg-white/5 hover:border-white/25"
                    }`}
                  >
                    <div className="flex w-full items-center justify-between">
                      <span className="text-sm font-bold text-white">
                        {item.level}
                      </span>
                      <span className="flex items-center gap-0.5">
                        {Array.from({ length: item.chilliCount }).map((_, i) => (
                          <Flame
                            key={i}
                            className={`h-3.5 w-3.5 ${
                              active
                                ? "fill-amber-400 text-amber-400"
                                : "text-orange-400/70"
                            }`}
                          />
                        ))}
                      </span>
                    </div>
                    <span className="mt-1 text-xs text-stone-400">
                      {item.description}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Rice or Naan Upgrade */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-amber-400">
                <Utensils className="h-4 w-4 text-amber-400" />
                2. Rice or Artisanal Naan Upgrade
              </h4>
              <span className="text-xs text-stone-400">Optional</span>
            </div>

            <div className="space-y-2">
              {UPGRADE_OPTIONS.map((option) => {
                const active = selectedUpgrade.id === option.id;
                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setSelectedUpgrade(option)}
                    className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 text-sm transition-all cursor-pointer ${
                      active
                        ? "border-amber-400 bg-amber-400/15 text-white"
                        : "border-white/10 bg-white/5 text-stone-200 hover:border-white/20"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-5 w-5 items-center justify-center rounded-full border ${
                          active
                            ? "border-amber-400 bg-amber-400 text-stone-950"
                            : "border-white/30"
                        }`}
                      >
                        {active && <Check className="h-3.5 w-3.5 stroke-[3]" />}
                      </div>
                      <span className="font-medium">{option.name}</span>
                    </div>
                    <span className="font-mono text-xs font-bold text-amber-300">
                      {option.price > 0 ? `+${formatGBP(option.price)}` : "Included"}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Extras */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold uppercase tracking-wider text-amber-400">
                3. Add Table Extras &amp; Drinks
              </h4>
              <span className="text-xs text-stone-400">Select multiple</span>
            </div>

            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {EXTRA_OPTIONS.map((extra) => {
                const checked = selectedExtras.some((e) => e.id === extra.id);
                return (
                  <button
                    key={extra.id}
                    type="button"
                    onClick={() => toggleExtra(extra)}
                    className={`flex items-center justify-between rounded-xl border p-3 text-left text-xs transition-all cursor-pointer ${
                      checked
                        ? "border-amber-400 bg-amber-400/15 text-white"
                        : "border-white/10 bg-white/5 text-stone-300 hover:border-white/20"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 pr-2">
                      <div
                        className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border ${
                          checked
                            ? "border-amber-400 bg-amber-400 text-stone-950"
                            : "border-white/30"
                        }`}
                      >
                        {checked && <Check className="h-3 w-3 stroke-[3]" />}
                      </div>
                      <span className="font-medium leading-snug">
                        {extra.name}
                      </span>
                    </div>
                    <span className="font-mono font-bold text-amber-300">
                      +{formatGBP(extra.price)}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4. Special Dietary / Kitchen Notes */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-400">
              Dietary / Allergen Notes for the Chef (Optional)
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g., Jain preparation (no onion/garlic), nut allergy, extra coriander..."
              className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-stone-500 focus:border-amber-400 focus:outline-none"
            />
          </div>

          {/* Footer: Quantity + Confirm Button */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/10 pt-4">
            <div className="flex items-center gap-3 rounded-2xl border border-white/15 bg-white/5 px-3 py-1.5">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/10 text-white hover:bg-amber-400 hover:text-stone-950 transition-colors cursor-pointer"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-8 text-center font-mono text-base font-bold text-white">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/10 text-white hover:bg-amber-400 hover:text-stone-950 transition-colors cursor-pointer"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>

            <Button
              type="button"
              size="lg"
              onClick={handleConfirm}
              className="w-full sm:flex-1 justify-between px-6"
            >
              <span className="flex items-center gap-2 font-black">
                <ShoppingBag className="h-5 w-5" />
                Add to Order
              </span>
              <span className="font-mono text-base font-black">
                {formatGBP(totalPrice)}
              </span>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
