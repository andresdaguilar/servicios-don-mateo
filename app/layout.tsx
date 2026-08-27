import type { Metadata, Viewport } from "next";
import { Inter, Newsreader } from "next/font/google";
import { auth } from "@/auth";
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
      className={`${inter.variable} ${newsreader.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-paper font-sans text-carbon">
        <AuthSession session={session}>{children}</AuthSession>
      </body>
    </html>
  );
}
