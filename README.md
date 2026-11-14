# Saffron & Ember — London's Premier Modern Indian Kitchen

Modern, luxury-yet-approachable Indian restaurant & takeaway web application in London (**Soho W1D 3DL** & **Cricklewood NW2 1AB**), crafted with the **"Cinematic Tandoor & Saffron"** dark-mode hospitality design system.

---

## 1. Tech Stack & Architecture

- **Framework:** Next.js 15 (App Router, TypeScript, Server & Client Components)
- **Styling:** Tailwind CSS v4 + `tw-animate-css`, shadcn/ui (Radix Dialog & Sheet primitives), Lucide React icons, Geist Sans & Geist Mono typography
- **State & Persistence:** Zustand (`useCartStore`) for persistent cart state (with item modifiers, spice levels, naan/rice upgrades, extras, promo codes, fulfilment toggle, orders, and reservations)
- **Authentication:** Clerk (`@clerk/nextjs`) with graceful interactive VIP auth modal fallback when local Clerk keys are not configured
- **Payments:** Stripe (`stripe` Checkout Sessions API `/api/checkout`) with instant 1-click checkout simulation fallback
- **Database:** Neon Serverless Postgres (`@neondatabase/serverless`) for `categories`, `products`, `reservations`, and `orders` with seeded fallback store

---

## 2. Visual Theme ("Cinematic Tandoor & Saffron")

- **Deep Charcoal / Obsidian Base:** `#120907` / `stone-950`
- **Primary Conversion Accent (Saffron Gold):** `amber-400` (`#f59e0b`) to `orange-500` gradient
- **Secondary Brand Accent (Tandoor Crimson / Copper):** `rose-950` / `amber-950`
- **Light Mode Surface:** Warm Ivory (`oklch(0.99 0.005 85)`) with deep espresso text
- **Glassmorphism:** `bg-white/5` to `bg-white/10` with `backdrop-blur-2xl` and `border-white/15`
- **Delivery Partner Badges:** Emerald Green (`green-500/10`) for Uber Eats and Teal (`teal-400/10`) for Deliveroo

---

## 3. Application Routes & Verifiable Stages

| Route | Description |
| :--- | :--- |
| `/` | Sticky Glass `Header`, Full-Viewport Cinematic `HeroSection` (`/tandoor-flames.mp4` + `/hero-indian-feast.png` Ken Burns fallback, 3-card Trust Dock, Uber Eats & Deliveroo badges), `FeaturedProducts` (`bg-[#1f0d09]`), Heritage Story, Soho Loyalty Banner |
| `/menu` | Interactive Menu with category filter pills (`All`, `Small Plates & Chaat`, `Tandoori Grill`, `Signature Curries`, `Biryani`, `Breads & Sides`, `Drinks & Desserts`, `Feast Deals`), dietary filters, search, and `ProductOptionsDialog` |
| `/reservations` | Table Reservations flow with Date, live Time slot availability check, Party Size, Seating Area (`Soho Velvet Booths`, `Chef's Counter`, `Private Spice Vault`), and Dietary/Jain notes |
| `/checkout` | Full Checkout flow with Delivery vs. Collection toggle, London postcode/address input, promo code validation (`SAFFRON10`, `STUDENT10`, `SOHO15`, `FEAST20`), and Stripe integration |
| `/order-confirmation` | Order Confirmation receipt with 7-Stamp Loyalty progress and direct link to live order tracking |
| `/orders/[id]` | Real-Time 4-Stage Order Status Tracker (`Preparing` → `In the Tandoor` → `Out for Delivery` → `Delivered`) with live stage simulator |
| `/kitchen` | Live Kitchen Display System (KDS) Kanban board with modifier callouts and 1-click stage progression |
| `/admin` | Executive Admin Command Portal for KPIs, Orders, Table Reservations, and Menu Stock availability |
| `/about` | Culinary Heritage, 480°C Charcoal Tandoor craft, and Pure Vegetarian / Jain kitchen dedication |
| `/contact` | Soho Flagship (`9-10 Soho Street, London W1D 3DL`) & North West Kitchen (`123 Cricklewood St, London NW2 1AB`) locations & concierge form |

---

## 4. Running Locally

```bash
npm install
npm run dev
```

Copy `.env.example` to `.env.local` to connect live Neon Postgres (`DATABASE_URL`), Clerk (`NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`), and Stripe (`STRIPE_SECRET_KEY`) credentials. All routes also work out-of-the-box in local preview mode.
