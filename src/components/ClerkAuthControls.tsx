"use client";

import React, { useState, useEffect } from "react";
import { User, LogOut, Sparkles, Award, ShieldCheck } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function ClerkAuthControls() {
  const [user, setUser] = useState<{
    name: string;
    email: string;
    points: number;
    thaliStamps: number;
  } | null>(null);
  const [open, setOpen] = useState(false);
  const [nameInput, setNameInput] = useState("Vikram Singh");
  const [emailInput, setEmailInput] = useState("vikram@soholondon.co.uk");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("saffron-vip-user");
      if (saved) setUser(JSON.parse(saved));
    } catch {
      // ignore
    }
  }, []);

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    const u = {
      name: nameInput.trim() || "Saffron Guest",
      email: emailInput.trim() || "guest@saffronember.co.uk",
      points: 450,
      thaliStamps: 6,
    };
    setUser(u);
    try {
      localStorage.setItem("saffron-vip-user", JSON.stringify(u));
    } catch {
      // ignore
    }
    setOpen(false);
  };

  const handleSignOut = () => {
    setUser(null);
    try {
      localStorage.removeItem("saffron-vip-user");
    } catch {
      // ignore
    }
    setOpen(false);
  };

  return (
    <>
      {user ? (
        <button
          onClick={() => setOpen(true)}
          title={`${user.name} (Saffron Royalty Club)`}
          className="flex items-center gap-2 rounded-xl border border-amber-400/30 bg-amber-400/10 px-3 py-2 text-xs font-semibold text-amber-300 transition-all hover:bg-amber-400/20 cursor-pointer"
        >
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-orange-500 text-[11px] font-black text-stone-950">
            {user.name.charAt(0).toUpperCase()}
          </span>
          <span className="hidden xl:inline">{user.name.split(" ")[0]}</span>
        </button>
      ) : (
        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-3.5 py-2 text-xs font-semibold text-stone-200 backdrop-blur-md transition-all hover:border-amber-400/40 hover:bg-white/10 hover:text-amber-400 cursor-pointer"
        >
          <User className="h-4 w-4 text-amber-400" />
          <span>Sign In</span>
        </button>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md border-amber-500/20 bg-[#170b08]">
          {user ? (
            <div className="space-y-5">
              <DialogHeader>
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-lg font-black text-stone-950 shadow-lg">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <DialogTitle className="text-lg text-white">
                      {user.name}
                    </DialogTitle>
                    <DialogDescription>{user.email}</DialogDescription>
                  </div>
                </div>
              </DialogHeader>

              <div className="rounded-2xl border border-amber-400/20 bg-amber-950/30 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-amber-400">
                    <Award className="h-4 w-4" />
                    Saffron Loyalty Card
                  </span>
                  <span className="text-xs font-mono text-amber-200">
                    {user.thaliStamps} / 7 Feasts
                  </span>
                </div>
                <p className="text-xs text-stone-300">
                  Order 1 more signature curry or thali to unlock your 8th meal complimentary on the house!
                </p>
                <div className="grid grid-cols-7 gap-1.5 pt-1">
                  {Array.from({ length: 7 }).map((_, i) => (
                    <div
                      key={i}
                      className={`h-2 rounded-full ${
                        i < user.thaliStamps
                          ? "bg-gradient-to-r from-amber-400 to-orange-500"
                          : "bg-white/10"
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-xs text-stone-300">
                <span>Active Member Code</span>
                <span className="font-mono font-bold text-amber-400">
                  SAFFRON10 (10% OFF)
                </span>
              </div>

              <Button
                variant="outline"
                className="w-full justify-center gap-2 text-red-300 hover:text-red-200"
                onClick={handleSignOut}
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSignIn} className="space-y-4">
              <DialogHeader>
                <div className="mb-2 inline-flex w-fit items-center gap-1.5 rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-xs font-semibold text-amber-300">
                  <Sparkles className="h-3.5 w-3.5" />
                  Clerk Auth · Saffron VIP Club
                </div>
                <DialogTitle className="text-2xl text-white">
                  Welcome to Saffron &amp; Ember
                </DialogTitle>
                <DialogDescription>
                  Sign in to track live tandoor orders, save modifiers, and collect complimentary Loyalty Thali stamps.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-3 pt-2">
                <div>
                  <label className="mb-1 block text-xs font-medium text-stone-300">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    className="w-full rounded-xl border border-white/15 bg-white/5 px-3.5 py-2.5 text-sm text-white focus:border-amber-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-stone-300">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    className="w-full rounded-xl border border-white/15 bg-white/5 px-3.5 py-2.5 text-sm text-white focus:border-amber-400 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3 text-xs text-emerald-300">
                <ShieldCheck className="h-4 w-4 shrink-0" />
                <span>
                  Instant 1-click sign-in unlocks your 7-stamp Loyalty Card &amp; 10% Student/Member perks.
                </span>
              </div>

              <Button type="submit" className="w-full">
                Sign In to Saffron &amp; Ember
              </Button>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
