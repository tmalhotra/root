import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Dunes + Tides",
  description: "Mobile-first property manager for the 123 East Herbert St oceanfront duplex, backed by OwnerRez.",
  manifest: "/manifest.webmanifest",
  appleWebApp: { capable: true, statusBarStyle: "default", title: "Dunes + Tides" },
};

export const viewport: Viewport = {
  themeColor: "#F4F2ED",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Poppins for UI and display text — the design specifies Mafinest for
            display but falls back to Poppins (Mafinest isn't freely available),
            so the mockups themselves render Poppins. Italic 400 covers the KPI
            numbers, italic 900 the hero. Loaded via <link> (not next/font) so
            builds never depend on a font fetch; in the App Router this applies
            to every page, so no-page-custom-font is a false positive here. */}
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400;1,500;1,600;1,700;1,900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
