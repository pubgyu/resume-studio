import type { Metadata } from "next";
import { Nanum_Myeongjo, Noto_Sans_KR } from "next/font/google";

import "./globals.css";

const bodyFont = Noto_Sans_KR({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "700"]
});

const displayFont = Nanum_Myeongjo({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "700", "800"]
});

export const metadata: Metadata = {
  title: "Resume Studio",
  description: "이력서를 작성하고 PDF로 저장할 수 있는 템플릿 앱"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={`${bodyFont.variable} ${displayFont.variable}`}>
        {children}
      </body>
    </html>
  );
}
