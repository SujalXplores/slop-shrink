import type { Metadata, Viewport } from 'next';
import { Bodoni_Moda, Geist, Geist_Mono } from 'next/font/google';
import { MotionConfig } from 'motion/react';
import './globals.css';
import { XRayStoreProvider } from '@/components/providers/xray-store-provider';
import { ByokStoreProvider } from '@/components/providers/byok-store-provider';
import { ScanStoreProvider } from '@/components/providers/scan-store-provider';

// Bodoni Moda — a dramatic high-contrast Didone for the masthead, headlines,
// figures, and short italic editorial accents.
const bodoni = Bodoni_Moda({
  variable: '--font-bodoni',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  style: ['normal', 'italic'],
  display: 'swap',
});

// Geist — the single text face: body copy and all small UI text.
const geist = Geist({
  variable: '--font-geist',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

// Geist Mono — Geist's matching monospace for labels, stamps, and stats.
const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://slop-shrink.vercel.app'),
  title: {
    default: 'SlopShrink: X-ray your reading',
    template: '%s | SlopShrink',
  },
  description:
    'Paste a URL or text. SlopShrink scans every paragraph for information density, collapses AI filler, and spotlights the verifiable facts in an interactive X-Ray reading view.',
  keywords: [
    'AI slop detector',
    'information density',
    'reading tool',
    'text analysis',
    'AI writing',
    'content quality',
    'article scanner',
  ],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'SlopShrink',
    title: 'SlopShrink: X-ray your reading',
    description:
      'Scan any article for information density. Collapse the AI filler, spotlight the facts.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SlopShrink: X-ray your reading',
    description:
      'Scan any article for information density. Collapse the AI filler, spotlight the facts.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: '#f1e9d8',
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${bodoni.variable} ${geist.variable} ${geistMono.variable}`}
    >
      <body className="min-h-dvh font-sans antialiased">
        <div className="atmosphere" aria-hidden="true" />
        <MotionConfig reducedMotion="user">
          <XRayStoreProvider>
            <ByokStoreProvider>
              <ScanStoreProvider>{children}</ScanStoreProvider>
            </ByokStoreProvider>
          </XRayStoreProvider>
        </MotionConfig>
      </body>
    </html>
  );
}
