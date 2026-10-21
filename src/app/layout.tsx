import type { Metadata } from "next";
import { IBM_Plex_Mono, Newsreader, Source_Sans_3 } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { VisionProfileProvider } from "@/components/vision-profile-provider";
import { DeveloperTerminalProvider } from "@/components/developer-terminal/developer-terminal-context";
import { DeveloperTerminal } from "@/components/developer-terminal/developer-terminal";
import { Chatbot } from "@/components/chatbot";

const sourceSans = Source_Sans_3({
  variable: "--font-source-sans",
  subsets: ["latin"],
  display: "swap",
});

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  display: "swap",
  axes: ["opsz"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://davelims.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Dave Emanuel G. Lima | Senior Software Engineer",
    template: "%s | Dave Emanuel G. Lima",
  },
  description:
    "Senior Software Engineer (backend and full-stack) in Iloilo, Philippines.",
  openGraph: {
    title: "Dave Emanuel G. Lima | Senior Software Engineer",
    description:
      "Senior Software Engineer (backend and full-stack) in Iloilo, Philippines.",
    type: "website",
    url: "/",
    siteName: "Dave Emanuel G. Lima",
  },
  twitter: {
    card: "summary_large_image",
    title: "Dave Emanuel G. Lima | Senior Software Engineer",
    description:
      "Senior Software Engineer (backend and full-stack) in Iloilo, Philippines.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var p=localStorage.getItem("portfolio-vision-profile");if(p==="protanopia"||p==="deuteranopia"||p==="tritanopia"){document.documentElement.setAttribute("data-vision",p);}}catch(e){}})();`,
          }}
        />
      </head>
      <body
        className={`${sourceSans.variable} ${newsreader.variable} ${plexMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <VisionProfileProvider>
            <DeveloperTerminalProvider>
              <a
                href="#content"
                className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-[var(--ink)] focus:px-3 focus:py-2 focus:text-sm focus:text-[var(--paper)]"
              >
                Skip to content
              </a>
              {children}
              <DeveloperTerminal />
              <Chatbot />
            </DeveloperTerminalProvider>
          </VisionProfileProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
