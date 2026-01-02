import type { Metadata, Viewport } from "next";
import { Fredoka } from "next/font/google";
import "./globals.css";
import { Navigation } from "@/components/layout/Navigation";
import { SavouringProvider } from "@/contexts/SavouringContext";
import { PreferencesProvider } from "@/contexts/PreferencesContext";

const fredoka = Fredoka({
  variable: "--font-fredoka",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "JoyPop - Bite-sized Happiness",
  description: "A simple wellbeing app to track your joy, gratitude, and kindness.",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "JoyPop",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#1a1a1a",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${fredoka.variable} font-sans antialiased`}
        suppressHydrationWarning
      >
        <PreferencesProvider>
          <SavouringProvider>
            {children}
            <Navigation />
          </SavouringProvider>
        </PreferencesProvider>
      </body>
    </html>
  );
}
