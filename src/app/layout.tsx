import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import NeonCursor from "@/components/NeonCursor";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Bridgeloop | Turn Public Data Into Your Competitive Edge",
  description: "Track. Compare. Grow. Your SMART Assistant for Market Intelligence.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning className={`${inter.variable} font-sans antialiased text-black dark:text-white bg-gray-50 dark:bg-[#0A0A0A] transition-colors duration-500`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <NeonCursor />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
