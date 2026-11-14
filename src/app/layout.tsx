import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ClerkProviderWrapper } from "@/components/ClerkProviderWrapper";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CartDrawer } from "@/components/CartDrawer";
import { ProductOptionsDialog } from "@/components/ProductOptionsDialog";

export const metadata: Metadata = {
  title:
    "Saffron & Ember | Modern Luxury Indian Kitchen & Takeaway · London W1 & NW2",
  description:
    "Where Ancient Spice Meets Modern Craft. Slow-simmered curries, charcoal-fired tandoori grills, and artisanal biryanis made fresh to order in London Soho W1 & NW2.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${GeistSans.variable} ${GeistMono.variable} dark`}
    >
      <body className="min-h-screen bg-background font-sans text-foreground antialiased selection:bg-amber-400 selection:text-stone-950">
        <ClerkProviderWrapper>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem={false}
            disableTransitionOnChange
          >
            <Header />
            {children}
            <CartDrawer />
            <ProductOptionsDialog />
            <Footer />
          </ThemeProvider>
        </ClerkProviderWrapper>
      </body>
    </html>
  );
}
