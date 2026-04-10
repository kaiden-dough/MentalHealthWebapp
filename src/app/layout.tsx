import type { Metadata } from "next";
import { DM_Sans, Fraunces } from "next/font/google";

import { Providers } from "@/components/providers";

import "./globals.css";

const sans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700"],
});

const display = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "HokieHealth — Micro check-ins for VT students",
    template: "%s · HokieHealth",
  },
  description:
    "Log mood and stress in under a minute, see trends, and find Virginia Tech mental health resources.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${sans.variable} ${display.variable} min-h-screen font-sans antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
