import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Inter, Newsreader } from "next/font/google";
import { auth } from "@/auth";
import { AppShell } from "@/components/layout/AppShell";
import { AuthSession } from "@/components/providers/AuthSession";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const newsreader = Newsreader({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Servicios Don Mateo",
  description: "Contactos recomendados por vecinos",
};

const themeScript = `(function(){try{var t=localStorage.getItem("theme");var d=t==="dark"||(t!=="light"&&window.matchMedia("(prefers-color-scheme: dark)").matches);if(d)document.documentElement.classList.add("dark")}catch(e){}})();`;

export const dynamic = "force-dynamic";

export const viewport: Viewport = {
  themeColor: "#1E5E3A",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const session = await auth();

  return (
    <html
      lang="es"
      suppressHydrationWarning
      className={`${inter.variable} ${newsreader.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-paper font-sans text-carbon">
        <Script id="theme-init" strategy="beforeInteractive">
          {themeScript}
        </Script>
        <AuthSession session={session}>
          <AppShell>{children}</AppShell>
        </AuthSession>
      </body>
    </html>
  );
}
