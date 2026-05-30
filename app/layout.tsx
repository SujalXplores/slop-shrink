import type { Metadata } from "next";
import { IBM_Plex_Mono, IBM_Plex_Sans, Spectral } from "next/font/google";
import { MotionConfig } from "motion/react";
import "./globals.css";
import { XRayStoreProvider } from "@/components/providers/xray-store-provider";
import { ByokStoreProvider } from "@/components/providers/byok-store-provider";

const plexSans = IBM_Plex_Sans({
  variable: "--font-plex-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const spectral = Spectral({
  variable: "--font-spectral",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "SlopShrink — X-ray your reading",
  description:
    "Paste a URL or text. SlopShrink scans every paragraph for information density, collapses AI filler, and spotlights the verifiable facts in an interactive X-Ray reading view.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`dark ${plexSans.variable} ${plexMono.variable} ${spectral.variable}`}
    >
      <body className="min-h-dvh font-sans antialiased">
        <div className="atmosphere" aria-hidden="true" />
        {/* reducedMotion="user" makes Motion honor the OS Reduced Motion
            setting — transform/layout animations are dropped while opacity
            fades remain. Pairs with the prefers-reduced-motion CSS block. */}
        <MotionConfig reducedMotion="user">
          <XRayStoreProvider>
            <ByokStoreProvider>{children}</ByokStoreProvider>
          </XRayStoreProvider>
        </MotionConfig>
      </body>
    </html>
  );
}
