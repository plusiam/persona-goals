import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { ServiceWorkerRegistration } from "@/components/ServiceWorkerRegistration";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Persona Goals - 페르소나 기반 목표 관리",
  description: "처음엔 간단하게, 필요하면 강력하게. 당신의 다양한 역할에 맞춘 목표 관리 플랫폼",
  keywords: "목표관리, 할일관리, 페르소나, 생산성, productivity, todo, goals",
  authors: [{ name: "Persona Goals Team" }],
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
  themeColor: "#4F46E5",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Persona Goals",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    title: "Persona Goals",
    description: "처음엔 간단하게, 필요하면 강력하게. 당신의 다양한 역할에 맞춘 목표 관리 플랫폼",
    type: "website",
    locale: "ko_KR",
    url: "https://persona-goals.com",
    siteName: "Persona Goals",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={inter.className}>
        <AuthProvider>
          {children}
          <ServiceWorkerRegistration />
        </AuthProvider>
      </body>
    </html>
  );
}