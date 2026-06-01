import { MotionConfig } from 'motion/react';
import { Bodoni_Moda, Geist, Geist_Mono } from 'next/font/google';

import './globals.css';
import { ByokStoreProvider } from '@/components/providers/byok-store-provider';
import { ScanStoreProvider } from '@/components/providers/scan-store-provider';
import { XRayStoreProvider } from '@/components/providers/xray-store-provider';

import type { Metadata, Viewport } from 'next';

const bodoni = Bodoni_Moda({
  variable: '--font-bodoni',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  style: ['normal', 'italic'],
  display: 'swap',
});

const geist = Geist({
  variable: '--font-geist',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

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

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${bodoni.variable} ${geist.variable} ${geistMono.variable}`}>
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
