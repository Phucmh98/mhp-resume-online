import type { Metadata } from "next";
import { Geist, Geist_Mono, Caveat } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { ConvexClientProvider } from "@/components/convex-client-provider";
import PullCordSection from "@/components/pull-cord";
import { VerticalLines } from "@/components/vertical-lines";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Phuc's Blog",
  description: "Phuc's resume online",
  keywords: ["Phuc", "resume", "online", "blog"],
  authors: [{ name: "Phuc" }],
  creator: "Phuc",
  publisher: "Phuc",
  icons: {
    icon: "/asset/images/logo/logo_mhp.ico",
    shortcut: "/asset/images/logo/logo_mhp.ico",
    apple: "/asset/images/logo/logo_mhp.ico",
  },


};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${caveat.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white dark:bg-black transition-colors duration-300">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ConvexClientProvider>
            <div className="min-h-screen w-full relative overflow-x-hidden">
              <PullCordSection />
              <VerticalLines>{children}</VerticalLines>
            </div>
            <Toaster position="bottom-right" />
          </ConvexClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
