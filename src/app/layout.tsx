import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Alyned — The Curated Network for Builders",
  description:
    "Alyned is the vetted network for founders, investors, and operators. Curated matches, focused rooms, zero noise. Apply for access.",
  openGraph: {
    title: "Alyned — The Curated Network for Builders",
    description: "The vetted network for founders, investors, and operators. Apply for access.",
    siteName: "Alyned",
    type: "website",
    images: [{ url: "/api/og", width: 1200, height: 630, alt: "Alyned — Where ambitious builders connect" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Alyned — The Curated Network for Builders",
    description: "The vetted network for founders, investors, and operators.",
    images: ["/api/og"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`dark ${inter.variable} ${jetbrainsMono.variable}`}
    >
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body className="min-h-screen bg-background text-text-primary antialiased" style={{ fontFamily: "var(--font-display)" }}>
        {children}
      </body>
    </html>
  );
}
