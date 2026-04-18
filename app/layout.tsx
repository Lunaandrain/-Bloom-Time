import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Bloom Time - 花园日历",
  description: "种下时间，收获花园",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh">
      <body className={`${inter.className} bg-stone-50 min-h-screen pt-16`}>
        <Navbar />
        {children}
      </body>
    </html>
  );
}