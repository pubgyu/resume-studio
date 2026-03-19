import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";

import { THEME_STORAGE_KEY } from "@/lib/resume-builder/constants";
import {
  absoluteUrl,
  getSiteUrl,
  SITE_DESCRIPTION,
  SITE_KEYWORDS,
  SITE_NAME
} from "@/lib/site-config";

import "./globals.scss";

const bodyFont = Noto_Sans_KR({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "700"]
});

export const metadata: Metadata = {
  alternates: {
    canonical: "/"
  },
  applicationName: SITE_NAME,
  category: "productivity",
  description: SITE_DESCRIPTION,
  icons: {
    apple: "/icon.svg",
    icon: "/icon.svg",
    shortcut: "/icon.svg"
  },
  keywords: SITE_KEYWORDS,
  manifest: "/manifest.webmanifest",
  metadataBase: getSiteUrl(),
  openGraph: {
    description: SITE_DESCRIPTION,
    images: [
      {
        alt: SITE_NAME,
        height: 630,
        url: absoluteUrl("/opengraph-image"),
        width: 1200
      }
    ],
    locale: "ko_KR",
    siteName: SITE_NAME,
    title: SITE_NAME,
    type: "website",
    url: "/login"
  },
  referrer: "origin-when-cross-origin",
  robots: {
    follow: true,
    googleBot: {
      follow: true,
      index: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1
    },
    index: true
  },
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`
  },
  twitter: {
    card: "summary_large_image",
    description: SITE_DESCRIPTION,
    images: [absoluteUrl("/twitter-image")],
    title: SITE_NAME
  }
};

const themeBootstrapScript = `(() => {
  let theme = "light";

  try {
    const savedTheme = window.localStorage.getItem(${JSON.stringify(THEME_STORAGE_KEY)});

    if (savedTheme === "light" || savedTheme === "dark") {
      theme = savedTheme;
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      theme = "dark";
    }
  } catch {}

  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme === "dark" ? "dark" : "light";

  if (document.body) {
    document.body.dataset.theme = theme;
  }
})();`;

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className={bodyFont.variable} suppressHydrationWarning>
        <script dangerouslySetInnerHTML={{ __html: themeBootstrapScript }} />
        {children}
      </body>
    </html>
  );
}
