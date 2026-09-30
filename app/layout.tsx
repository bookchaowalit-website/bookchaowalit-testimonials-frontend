import type { Metadata } from "next";
import { SITE_URL } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  title: "Testimonials | Bookchaowalit",
  description: "Collect and feature quotes.",
  keywords: ["testimonials", "portfolio"],
  authors: [{ name: "Bookchaowalit", url: "https://bookchaowalit.com" }],
  creator: "Bookchaowalit",
  metadataBase: new URL(SITE_URL),
  openGraph: {
    type: "website",
    title: "Testimonials | Bookchaowalit",
    description: "Collect and feature quotes.",
    siteName: "Bookchaowalit",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
