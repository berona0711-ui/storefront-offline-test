import { GoogleTagManager } from "@next/third-parties/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Geist } from "next/font/google";
import { Suspense } from "react";
import { localeDirection } from "@/i18n/locales";

const gtmId = process.env.GTM_ID;
const spreeApiOrigin = (() => {
  try {
    return process.env.SPREE_API_URL
      ? new URL(process.env.SPREE_API_URL).origin
      : undefined;
  } catch {
    return undefined;
  }
})();

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
  display: "swap",
});

interface DocumentShellProps {
  children: React.ReactNode;
  locale: string;
}

/** Shared document markup for each root layout. */
export function DocumentShell({ children, locale }: DocumentShellProps) {
  return (
    <html lang={locale} dir={localeDirection(locale)} suppressHydrationWarning>
      {/* biome-ignore lint/style/noHeadElement: this shell is used only by Next.js root layouts */}
      <head>
        {/* 1. iOS Safari Browser Tab Favicons (Explicit standard sizes 32x32 & 16x16 PNG) */}
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png?v=20261106" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png?v=20261106" />
        <link rel="icon" type="image/svg+xml" sizes="any" href="/favicon.svg?v=20261106" />
        <link rel="icon" type="image/x-icon" sizes="any" href="/favicon.ico?v=20261106" />
        <link rel="shortcut icon" href="/favicon.ico?v=20261106" />

        {/* 2. Safari Pinned Tab Mask Icon (macOS) */}
        <link rel="mask-icon" href="/safari-pinned-tab.svg?v=20261106" color="#005c2e" />

        {/* 3. iOS Home Screen Tile Icons */}
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png?v=20261106" />
        <link rel="apple-touch-icon-precomposed" sizes="180x180" href="/apple-touch-icon-precomposed.png?v=20261106" />

        {/* Theme & PWA */}
        <meta name="theme-color" content="#064e3b" />
        <meta name="apple-mobile-web-app-title" content="FreeFalastin" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />

        {spreeApiOrigin && (
          <>
            <link rel="preconnect" href={spreeApiOrigin} />
            <link rel="dns-prefetch" href={spreeApiOrigin} />
          </>
        )}
      </head>
      {gtmId && <GoogleTagManager gtmId={gtmId} />}
      <body
        className={`${geist.variable} antialiased min-h-screen flex flex-col`}
      >
        <Suspense fallback={null}>{children}</Suspense>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
