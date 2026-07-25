import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { GuestTimerWrapper } from "@/components/auth/GuestTimerWrapper";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "AURELIA | Luxury Botanical Art & Resin Jewellery Atelier",
  description:
    "Handcrafted luxury botanical jewellery, preserved wildflower pendants, bridal bouquet keepsakes, and resin home decor in 24K gold foil and optical resin. Prices in INR (₹).",
  keywords: [
    "Botanical Jewellery India",
    "Resin Pendant",
    "Pressed Flower Necklace",
    "Bridal Bouquet Preservation",
    "Custom Resin Art",
    "Luxury Resin Jewellery",
    "Gold Foil Resin Pendant",
  ],
  authors: [{ name: "Aurelia Botanical Team" }],
  openGraph: {
    title: "AURELIA | Luxury Botanical Art & Resin Jewellery Atelier",
    description:
      "Eternity captured in crystal resin and gold. Explore handcrafted botanical jewellery and personalized floral heirlooms.",
    url: "https://aureliabotanical.in",
    siteName: "Aurelia Botanical Art",
    locale: "en_IN",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${playfair.variable} ${inter.variable}`}>
      <body className="font-sans antialiased min-h-screen bg-background text-foreground transition-colors duration-300">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange={false}>
          {children}
          <GuestTimerWrapper />
        </ThemeProvider>
      </body>
    </html>
  );
}
