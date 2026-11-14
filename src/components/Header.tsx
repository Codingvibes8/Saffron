"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Flame,
  Phone,
  ShoppingBag,
  Menu as MenuIcon,
  Calendar,
  ChefHat,
  LayoutDashboard,
  MapPin,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/store/useCartStore";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ClerkAuthControls } from "@/components/ClerkAuthControls";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/menu", label: "Menu" },
  { href: "/reservations", label: "Book a Table" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const items = useCartStore((state) => state.items);
  const setCartOpen = useCartStore((state) => state.setCartOpen);

  const itemCount = mounted
    ? items.reduce((sum, item) => sum + item.quantity, 0)
    : 0;

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setScrolled(window.scrollY > 60);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-stone-950/95 backdrop-blur-lg border-b border-white/10 shadow-xl py-3"
          : "bg-transparent py-5"
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left: Brand Icon + Brand Name */}
        <Link
          href="/"
          className="group flex items-center gap-3 focus:outline-none"
        >
          <div className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 via-amber-500 to-orange-600 text-stone-950 shadow-[0_0_25px_-3px_rgba(245,158,11,0.7)] transition-transform duration-300 group-hover:scale-105">
            <Flame className="h-6 w-6 fill-stone-950/20 stroke-[2.2]" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg sm:text-xl font-black tracking-tight text-white">
              Saffron <span className="text-amber-400">&amp;</span> Ember
            </span>
            <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-amber-300/80">
              London W1 · Soho &amp; NW2
            </span>
          </div>
        </Link>

        {/* Center (Desktop): Navigation Links with animated bottom underline */}
        <nav className="hidden lg:flex items-center gap-7">
          {NAV_LINKS.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative py-1.5 text-sm font-medium transition-colors duration-200 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:bg-amber-400 after:transition-all after:duration-300",
                  isActive
                    ? "text-amber-400 after:w-full"
                    : "text-stone-200 hover:text-white after:w-0 hover:after:w-full"
                )}
              >
                {link.label}
              </Link>
            );
          })}

          <div className="h-4 w-px bg-white/15" />

          <Link
            href="/kitchen"
            className={cn(
              "inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium transition-colors",
              pathname.startsWith("/kitchen")
                ? "bg-amber-400/20 text-amber-300"
                : "text-stone-400 hover:bg-white/5 hover:text-amber-300"
            )}
          >
            <ChefHat className="h-3.5 w-3.5 text-amber-400" />
            Kitchen
          </Link>
          <Link
            href="/admin"
            className={cn(
              "inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium transition-colors",
              pathname.startsWith("/admin")
                ? "bg-amber-400/20 text-amber-300"
                : "text-stone-400 hover:bg-white/5 hover:text-amber-300"
            )}
          >
            <LayoutDashboard className="h-3.5 w-3.5 text-amber-400" />
            Admin
          </Link>
        </nav>

        {/* Right: Phone, CartDrawer trigger, ThemeToggle, Clerk Auth, Mobile Sheet */}
        <div className="flex items-center gap-2.5">
          <a
            href="tel:02084521234"
            className="hidden xl:inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-3.5 py-2 text-xs font-semibold text-stone-200 backdrop-blur-md transition-all hover:border-amber-400/40 hover:bg-white/10 hover:text-amber-400"
          >
            <Phone className="h-3.5 w-3.5 text-amber-400" />
            <span className="font-mono">020 8452 1234</span>
          </a>

          <button
            onClick={() => setCartOpen(true)}
            aria-label="Open Cart Drawer"
            className="relative flex h-10 items-center gap-2 rounded-xl border border-amber-400/30 bg-amber-400/10 px-3.5 text-xs font-bold text-amber-300 backdrop-blur-md transition-all hover:bg-amber-400/20 hover:border-amber-400/60 cursor-pointer"
          >
            <ShoppingBag className="h-4 w-4 text-amber-400" />
            <span className="hidden sm:inline">Order Bag</span>
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-gradient-to-r from-amber-400 to-orange-500 px-1.5 text-[11px] font-black text-stone-950 shadow">
              {itemCount}
            </span>
          </button>

          <ThemeToggle />

          <ClerkAuthControls />

          {/* Mobile Drawer Trigger */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <button
                aria-label="Open Navigation Menu"
                className="flex lg:hidden h-10 w-10 items-center justify-center rounded-xl border border-white/15 bg-white/5 text-stone-200 backdrop-blur-md hover:bg-white/10 cursor-pointer"
              >
                <MenuIcon className="h-5 w-5" />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[310px] p-6">
              <SheetHeader className="border-b border-white/10 pb-4 text-left">
                <SheetTitle className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 text-stone-950">
                    <Flame className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-base font-black text-white">
                      Saffron &amp; Ember
                    </div>
                    <div className="text-[10px] uppercase tracking-widest text-amber-400">
                      Soho W1 &amp; London NW2
                    </div>
                  </div>
                </SheetTitle>
              </SheetHeader>

              <div className="mt-6 flex flex-col gap-2">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold transition-colors",
                      pathname === link.href
                        ? "bg-amber-400/15 text-amber-400 border border-amber-400/30"
                        : "text-stone-200 hover:bg-white/5"
                    )}
                  >
                    {link.label}
                  </Link>
                ))}

                <div className="my-3 border-t border-white/10" />

                <Link
                  href="/kitchen"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2.5 rounded-xl px-4 py-2.5 text-sm font-medium text-stone-300 hover:bg-white/5"
                >
                  <ChefHat className="h-4 w-4 text-amber-400" />
                  Live Tandoor Kitchen View
                </Link>
                <Link
                  href="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2.5 rounded-xl px-4 py-2.5 text-sm font-medium text-stone-300 hover:bg-white/5"
                >
                  <LayoutDashboard className="h-4 w-4 text-amber-400" />
                  Restaurant Admin Board
                </Link>
              </div>

              <div className="mt-auto space-y-3 border-t border-white/10 pt-5">
                <a
                  href="tel:02084521234"
                  className="flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 py-3 text-sm font-semibold text-white hover:border-amber-400/40"
                >
                  <Phone className="h-4 w-4 text-amber-400" />
                  020 8452 1234
                </a>
                <Link
                  href="/reservations"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 py-3 text-sm font-bold text-stone-950 shadow-lg"
                >
                  <Calendar className="h-4 w-4" />
                  Reserve a Soho Table
                </Link>
                <div className="flex items-center justify-center gap-1.5 text-[11px] text-stone-400">
                  <MapPin className="h-3.5 w-3.5 text-amber-400" />
                  9-10 Soho St W1D &amp; 123 Cricklewood St NW2
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
