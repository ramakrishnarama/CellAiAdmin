import { Outfit } from "next/font/google";
import "./globals.css";
import { SidebarProvider } from "@/context/SidebarContext";
import { ThemeProvider } from "@/context/ThemeContext";
import type { Metadata } from "next";
import Script from "next/script";

const outfit = Outfit({
  subsets: ["latin"],
});

// ✅ Global SEO metadata
export const metadata: Metadata = {
  title: "Cell AI | Battery Intelligence & Digital Twin for EVs & IoT",
  description:
    "Cell AI powers battery intelligence with SOC/SOH estimation, digital twins, and scalable BMS for EVs, energy storage, and IoT solutions.",
  keywords: [
    "battery intelligence",
    "BMS",
    "SOC estimation",
    "SOH estimation",
    "digital twin",
    "EV battery management",
    "IoT battery monitoring",
    "energy storage",
  ],
  openGraph: {
    title: "Cell AI | Battery Intelligence & Digital Twin Solutions",
    description:
      "Revolutionizing EV and IoT batteries with SOC/SOH estimation, digital twins, and model-based BMS.",
    url: "https://www.cellai.in",
    siteName: "Cell AI",
    images: [
      {
        url: "https://www.cellai.in/images/logo/cellAi_transparent.svg", // ✅ your deployed logo
        width: 800,
        height: 800,
        alt: "Cell AI Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cell AI | Battery Intelligence & Digital Twin Solutions",
    description:
      "Scalable BMS, SOC/SOH estimation, and digital twin technologies for EVs and IoT.",
    images: ["https://www.cellai.in/images/logo/cellAi_transparent.svg"], // ✅ your deployed logo
  },
  icons: {
    icon: "/images/logo/cellAi_transparent.svg", // ✅ favicon/logo reference
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* ✅ Schema.org JSON-LD for Google Rich Snippets */}
        <Script
          id="schema-org"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Cell AI",
              url: "https://www.cellai.in",
              logo: "https://www.cellai.in/images/logo/cellAi_transparent.svg",
              contactPoint: {
                "@type": "ContactPoint",
                email: "cellaiinnovations@gmail.com",
                contactType: "Customer Support",
              },
              sameAs: [],
            }),
          }}
        />
      </head>
      <body className={`${outfit.className} dark:bg-gray-900`}>
        <ThemeProvider>
          <SidebarProvider>{children}</SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
