import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Dave Emanuel G. Lima | Software Developer",
    template: "%s | Dave Emanuel G. Lima",
  },
  description:
    "Versatile Software Developer specializing in full-stack web and mobile application development from Iloilo City, Philippines.",
  openGraph: {
    title: "Dave Emanuel G. Lima | Software Developer",
    description:
      "Versatile Software Developer specializing in full-stack web and mobile application development from Iloilo City, Philippines.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <a
            href="#content"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-zinc-950 focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-white focus:ring-2 focus:ring-white/20"
          >
            Skip to content
          </a>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
