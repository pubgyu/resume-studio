import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";

import { THEME_STORAGE_KEY } from "@/lib/resume-builder/constants";

import "./globals.scss";

const bodyFont = Noto_Sans_KR({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "700"]
});

export const metadata: Metadata = {
  title: "Resume Room",
  description: "이력서를 작성하고 PDF로 저장할 수 있는 템플릿 앱",
  icons: {
    icon: "/icon.svg"
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
