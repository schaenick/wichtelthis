import type { Metadata } from "next";
import { Playfair_Display, DM_Sans } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
});

export const metadata: Metadata = {
  title: "WichtelThis",
  description: "Organisiere deine Wichtelrunde – ganz ohne Account.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de">
      <body className={`${playfair.variable} ${dmSans.variable} font-sans bg-stone-50 min-h-screen text-stone-900 antialiased`}>
        <header className="border-b border-stone-200 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
          <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
<a href="/" className="font-serif text-xl tracking-tight">
  Wichtel<span className="text-blue-600">This</span>
</a>
            <p className="text-xs text-stone-400 hidden sm:block">
              Wichteln ohne Account 🎁
            </p>
          </div>
        </header>
        <main className="max-w-2xl mx-auto px-4 py-10">
          {children}
        </main>
<footer className="border-t border-stone-100 mt-20">
  <div className="max-w-2xl mx-auto px-4 py-6 text-xs text-stone-400 text-center flex items-center justify-center gap-4">
    <span>WichtelThis · Alle Daten werden nach Ablauf automatisch gelöscht.</span>
    <a href="/impressum" className="hover:text-stone-600 transition-colors">Impressum</a>
    <a href="/datenschutz" className="hover:text-stone-600 transition-colors">Datenschutz</a>
  </div>
</footer>
      </body>
    </html>
  );
}