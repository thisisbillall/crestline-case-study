import type { Metadata } from "next";
import { Inter, Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";

import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-jakarta",
  display: "swap",
});

/** The client wordmark is set in a high contrast serif, matching their brand file. */
const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-playfair",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Grey Infra Working Capital",
  description:
    "How we found 12.2 crore trapped inside an EPC contractor's own ERP, where it was going, and what changed.",
  openGraph: {
    title: "Grey Infra Working Capital",
    description:
      "427 crore of contract value, 6,837 ERP events, 398 cases rebuilt. Where an EPC contractor's money was trapped, for how long, and who could release it.",
    type: "article",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${jakarta.variable} ${inter.variable} ${playfair.variable}`}>
      <body className="bg-ground text-ink antialiased">
        <div className="aura" aria-hidden="true" />
        <div className="relative z-10">{children}</div>
      </body>
    </html>
  );
}
