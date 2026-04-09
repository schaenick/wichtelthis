import type { Metadata } from "next";
import "./globals.css";

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
      <body className="bg-stone-50 min-h-screen text-stone-900 antialiased">
        {children}
      </body>
    </html>
  );
}