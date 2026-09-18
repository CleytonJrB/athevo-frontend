import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import "./globals.css";
import { Providers } from "@/components/providers/providers";
import { sessionPolicy } from "@/lib/auth/session-policy";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "Athevo | Gestão Precisa de Fitness",
  description: "Landing page da Athevo em Next.js, Tailwind CSS e componentes shadcn.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      data-scroll-behavior="smooth"
      className={`${geist.variable} ${geistMono.variable} h-full scroll-smooth antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Providers sessionRefetchInterval={sessionPolicy.refetchIntervalSeconds}>
          {children}
        </Providers>
      </body>
    </html>
  );
}
